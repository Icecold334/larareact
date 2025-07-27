<?php

namespace App\Http\Controllers;

use App\Models\Kas;
use Inertia\Inertia;
use App\Models\Transaksi;
use Illuminate\Http\Request;
use App\Models\Supplierables;

class KasController extends Controller
{
    public function arus()
    {
        // Ambil semua transaksi
        $transaksis = Transaksi::with(['barang', 'supplier'])->get();

        $total_penjualan = 0;
        $total_pembelian = 0;

        foreach ($transaksis as $trx) {
            if (!$trx->jenis) {
                // Penjualan: harga_jual dari barang
                $total_penjualan += $trx->jumlah * $trx->harga_jual;
            } else {
                // Pembelian: harga_beli dari supplierables (by supplier_id & barang_id)
                $harga_beli = Supplierables::where('supplyable_type', 'App\Models\Barang')
                    ->where('supplyable_id', $trx->barang_id)
                    ->where('supplier_id', $trx->supplier_id)
                    ->value('harga_beli');

                $total_pembelian += $trx->jumlah * ($harga_beli ?? 0);
            }
        }

        // Kas Manual
        $kasMasuk = Kas::where('jenis', true)->sum('nominal');
        $kasKeluar = Kas::where('jenis', false)->sum('nominal');

        $saldoTransaksi = $total_penjualan - $total_pembelian;
        $saldoKas = $kasMasuk - $kasKeluar;

        $totalSaldo = $saldoTransaksi + $saldoKas;

        $kas = Kas::orderByDesc('tanggal')->get();

        return Inertia::render('laporan/arus', [
            'kas' => $kas,
            'saldo' => $totalSaldo,
        ]);
    }

    public function saveKas(Request $request)
    {
        $request->validate([
            'jenis' => 'required|in:masuk,keluar',
            'nominal' => 'required|integer|min:1',
            'tanggal' => 'required|date',
            'keterangan' => 'nullable|string|max:255',
        ]);

        // Hitung saldo transaksi (penjualan - pembelian)
        $transaksis = Transaksi::with(['barang'])->get();

        $totalPenjualan = 0;
        $totalPembelian = 0;

        foreach ($transaksis as $trx) {
            if ($trx->jenis) {
                // Penjualan → harga dari barang
                $totalPenjualan += $trx->jumlah * (int)$trx->harga_jual;
            } else {
                // Pembelian → harga dari supplierables
                $hargaBeli = Supplierables::where('supplyable_type', 'App\Models\Barang')
                    ->where('supplyable_id', $trx->barang_id)
                    ->where('supplier_id', $trx->supplier_id)
                    ->value('harga_beli');

                $totalPembelian += $trx->jumlah * (int)($hargaBeli ?? 0);
            }
        }

        $saldoTransaksi = $totalPenjualan - $totalPembelian;

        // Hitung saldo kas manual
        $kasMasuk = Kas::where('jenis', true)->sum('nominal');
        $kasKeluar = Kas::where('jenis', false)->sum('nominal');
        $saldoKas = $kasMasuk - $kasKeluar;

        $saldoTotal = $saldoTransaksi + $saldoKas;

        // Cek jika pengeluaran melebihi saldo
        if ($request->jenis === 'keluar' && $request->nominal > $saldoTotal) {
            return back()->withErrors([
                'nominal' => 'Pengeluaran melebihi saldo tersedia (' . number_format($saldoTotal, 0, ',', '.') . ').'
            ]);
        }

        // Simpan data
        Kas::create([
            'jenis' => $request->jenis === 'masuk',
            'nominal' => $request->nominal,
            'tanggal' => $request->tanggal,
            'keterangan' => $request->keterangan,
        ]);

        return redirect()->back()->with('success', 'Transaksi kas berhasil disimpan.');
    }
}
