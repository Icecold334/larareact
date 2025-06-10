<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Kas;
use Inertia\Inertia;
use App\Models\Transaksi;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        // $data = $this->getDashboardData();
        // dd($data);
        return Inertia::render('dashboard');
    }

    // public function getDashboardData()
    // {
    //     $today = Carbon::today();
    //     $startOfMonth = Carbon::now()->startOfMonth();

    //     $penjualanHariIni = Transaksi::whereDate('transaksis.created_at', $today)
    //         ->where('jenis', 0)
    //         ->join('barangs', 'barangs.id', '=', 'transaksis.barang_id')
    //         ->selectRaw('SUM(jumlah * barangs.harga_jual) as total')
    //         ->value('total') ?? 0;

    //     $penjualanBulanIni = Transaksi::where('created_at', '>=', $startOfMonth)
    //         ->where('jenis', 0)
    //         ->join('barangs', 'barangs.id', '=', 'transaksis.barang_id')
    //         ->selectRaw('SUM(jumlah * barangs.harga_jual) as total')
    //         ->value('total') ?? 0;

    //     $pembelianHariIni = Transaksi::whereDate('created_at', $today)
    //         ->where('jenis', 1)
    //         ->join('supplierables', function ($join) {
    //             $join->on('transaksis.barang_id', '=', 'supplierables.supplyable_id')
    //                 ->where('supplyable_type', '=', 'App\\Models\\Barang');
    //         })
    //         ->selectRaw('SUM(jumlah * harga_beli) as total')
    //         ->value('total') ?? 0;

    //     $pembelianBulanIni = Transaksi::where('created_at', '>=', $startOfMonth)
    //         ->where('jenis', 1)
    //         ->join('supplierables', function ($join) {
    //             $join->on('transaksis.barang_id', '=', 'supplierables.supplyable_id')
    //                 ->where('supplyable_type', '=', 'App\\Models\\Barang');
    //         })
    //         ->selectRaw('SUM(jumlah * harga_beli) as total')
    //         ->value('total') ?? 0;

    //     $kasMasuk = Kas::where('jenis', 1)->sum('nominal');
    //     $kasKeluar = Kas::where('jenis', 0)->sum('nominal');

    //     $totalPenjualan = Transaksi::where('jenis', 0)
    //         ->join('barangs', 'barangs.id', '=', 'transaksis.barang_id')
    //         ->selectRaw('SUM(jumlah * barangs.harga_jual) as total')
    //         ->value('total') ?? 0;

    //     $totalPembelian = Transaksi::where('jenis', 1)
    //         ->join('supplierables', function ($join) {
    //             $join->on('transaksis.barang_id', '=', 'supplierables.supplyable_id')
    //                 ->where('supplyable_type', '=', 'App\\Models\\Barang');
    //         })
    //         ->selectRaw('SUM(jumlah * harga_beli) as total')
    //         ->value('total') ?? 0;

    //     $saldoKas = ($totalPenjualan - $totalPembelian) + $kasMasuk - $kasKeluar;

    //     return response()->json([
    //         'penjualanHariIni' => $penjualanHariIni,
    //         'penjualanBulanIni' => $penjualanBulanIni,
    //         'pembelianHariIni' => $pembelianHariIni,
    //         'pembelianBulanIni' => $pembelianBulanIni,
    //         'kasMasuk' => $kasMasuk,
    //         'kasKeluar' => $kasKeluar,
    //         'saldoKas' => $saldoKas,
    //     ]);
    // }
}
