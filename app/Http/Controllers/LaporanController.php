<?php

namespace App\Http\Controllers;

use App\Models\Transaksi;
use Inertia\Inertia;
use Illuminate\Http\Request;

class LaporanController extends Controller
{
    public function index($type)
    {
        $view = 'laporan/' . $type;
        return Inertia::render($view);
    }
    public function fetch($type)
    {
        $isBeli = $type === 'beli';

        $transaksis = Transaksi::where('jenis', $isBeli ? 1 : 0)
            ->with(['barang', 'supplier'])
            ->get();

        if ($isBeli) {
            // Untuk pembelian: cukup ambil transaksi pertama per kode, dan tampilkan supplier
            return $transaksis
                ->unique('kode')
                ->values();
        } else {
            // Untuk penjualan: grup per kode, hitung total kotor dan info pajak
            return $transaksis
                ->groupBy('kode')
                ->map(function ($group) {
                    return [
                        'kode' => $group->first()->kode,
                        'created_at' => $group->first()->created_at,
                        'menggunakan_pajak' => $group->contains(fn($trx) => $trx->pajak_persen > 0),
                        'total_kotor' => $group->sum(fn($trx) => $trx->jumlah * ($trx->barang->harga_jual ?? 0)),
                    ];
                })
                ->values();
        }
    }



    public function supplierHistory($barangId, $supplierId)
    {
        $transactions = Transaksi::where('barang_id', $barangId)
            ->where('supplier_id', $supplierId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($transactions);
    }


    public function show($kode)
    {
        $transaksi = Transaksi::with('barang', 'supplier', 'barang.suppliers', 'supplier.barangs')->where('kode', $kode)->get();
        // dd($transaksi);
        return Inertia::render('laporan/show', compact('transaksi'));
    }
}
