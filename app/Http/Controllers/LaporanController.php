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
        return Transaksi::where('jenis', $type == 'beli')->with('barang', 'supplier')->orderBy('id', 'desc')->get()->unique('kode');
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
