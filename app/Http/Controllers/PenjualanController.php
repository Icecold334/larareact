<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Barang;
use Inertia\Controller;
use App\Models\Transaksi;
use Illuminate\Support\Str;
use Illuminate\Http\Request;

class PenjualanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('kasir/index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            foreach ($request->lists as $val) {
                $item = collect($val);
                $barang = Barang::findOrFail($item['id']);
                $jumlahPenjualan = $item['jumlah'];
                $hargaJual = $item['harga']; // ambil harga jual dari frontend

                // Ambil semua transaksi masuk (pembelian)
                $stokMasuk = Transaksi::where('barang_id', $barang->id)
                    ->where('jenis', true)
                    ->orderBy('created_at') // FIFO
                    ->get();

                // Hitung sisa stok per transaksi masuk
                $stokDetail = $stokMasuk->map(function ($trx) use ($barang) {
                    $jumlahKeluar = Transaksi::where('barang_id', $barang->id)
                        ->where('supplier_id', $trx->supplier_id)
                        ->where('pajak_persen', $trx->pajak_persen)
                        ->where('jenis', false)
                        ->sum('jumlah');

                    return [
                        'id' => $trx->id,
                        'supplier_id' => $trx->supplier_id,
                        'pajak' => $trx->pajak_persen,
                        'tanggal' => $trx->created_at,
                        'tersedia' => max(0, $trx->jumlah - $jumlahKeluar),
                    ];
                })->filter(fn($data) => $data['tersedia'] > 0);

                // Bagi dua: berpajak & non-pajak
                $stokPajak = $stokDetail->where('pajak', '>', 0)->sortBy('tanggal')->values();
                $stokTanpaPajak = $stokDetail->where('pajak', '=', 0)->sortBy('tanggal')->values();

                $kodeBerpajak = 'OUT' . fake()->numerify('-###-TAX');
                $kodeNonPajak = 'OUT' . fake()->numerify('-###-NTX');

                // Proses stok berpajak dulu
                foreach ($stokPajak as $stok) {
                    if ($jumlahPenjualan <= 0) break;

                    $ambil = min($jumlahPenjualan, $stok['tersedia']);

                    Transaksi::create([
                        'kode' => $kodeBerpajak,
                        'jenis' => false,
                        'barang_id' => $barang->id,
                        'supplier_id' => $stok['supplier_id'],
                        'jumlah' => $ambil,
                        'pajak_persen' => $stok['pajak'],
                        'harga_jual' => $hargaJual, // harga jual disimpan
                    ]);

                    $jumlahPenjualan -= $ambil;
                }

                // Lanjutkan ke stok tanpa pajak jika masih kurang
                foreach ($stokTanpaPajak as $stok) {
                    if ($jumlahPenjualan <= 0) break;

                    $ambil = min($jumlahPenjualan, $stok['tersedia']);

                    Transaksi::create([
                        'kode' => $kodeNonPajak,
                        'jenis' => false,
                        'barang_id' => $barang->id,
                        'supplier_id' => $stok['supplier_id'],
                        'jumlah' => $ambil,
                        'pajak_persen' => 0,
                        'harga_jual' => $hargaJual, // harga jual disimpan
                    ]);

                    $jumlahPenjualan -= $ambil;
                }

                if ($jumlahPenjualan > 0) {
                    return back()->withErrors([
                        'error' => "Stok tidak cukup untuk barang {$barang->nama}. Kurang {$jumlahPenjualan} pcs.",
                    ]);
                }
            }

            return Inertia::clearHistory();
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => $e->getMessage(),
            ]);
        }
    }






    /**
     * Display the specified resource.
     */
    public function show(Transaksi $transaksi)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Transaksi $transaksi)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Transaksi $transaksi)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Transaksi $transaksi)
    {
        //
    }
}
