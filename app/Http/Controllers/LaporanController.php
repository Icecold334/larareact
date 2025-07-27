<?php

namespace App\Http\Controllers;

use App\Models\Transaksi;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

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
                        'total_kotor' => $group->sum(fn($trx) => $trx->jumlah * ($trx->harga_jual ?? 0)),
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



    public function exportPenjualan($kode)
    {
        $transaksiList = Transaksi::with(['barang', 'supplier', 'barang.suppliers'])
            ->where('kode', $kode)
            ->where('jenis', false)
            ->get();

        if ($transaksiList->isEmpty()) {
            abort(404, 'Transaksi tidak ditemukan');
        }

        $subtotal = $transaksiList->sum(function ($trx) {
            return $trx->harga_jual * $trx->jumlah;
        });

        $pdf = Pdf::loadView('pdf.penjualan', [
            'transaksiList' => $transaksiList,
            'subtotal' => $subtotal,
            'kode' => $kode,
        ])->setPaper('A4', 'portrait');

        return $pdf->download("Penjualan-{$kode}.pdf");
    }
}
