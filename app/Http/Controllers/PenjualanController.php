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
        $kode = 'OUT' . fake()->numerify('-###-###-###');

        $jenis = false;

        try {
            foreach ($request->lists as $key => $val) {
                $item = collect($val);
                $barang = Barang::findOrFail($item['id']);
                $jumlahPenjualan = $item['jumlah']; // jumlah yang mau dijual

                // Ambil semua supplier untuk barang ini
                $suppliers = $barang->suppliers()->get()->map(function ($supplier) use ($barang) {
                    $in = Transaksi::where('barang_id', $barang->id)
                        ->where('supplier_id', $supplier->id)
                        ->where('jenis', true)
                        ->sum('jumlah');

                    $out = Transaksi::where('barang_id', $barang->id)
                        ->where('supplier_id', $supplier->id)
                        ->where('jenis', false)
                        ->sum('jumlah');

                    $supplier->stok = max(0, $in - $out);
                    return $supplier;
                })->filter(fn($supplier) => $supplier->stok > 0)->sortByDesc('stok')->values();
                // dd($suppliers);
                foreach ($suppliers as $supplier) {
                    if ($jumlahPenjualan <= 0) {
                        break; // Kalau sudah cukup, stop
                    }

                    $ambil = min($jumlahPenjualan, $supplier->stok);

                    if ($ambil > 0) {
                        // Buat transaksi keluarnya
                        Transaksi::create([
                            'kode' => $kode,
                            'jenis' => $jenis,
                            'barang_id' => $barang->id,
                            'supplier_id' => $supplier->id,
                            'jumlah' => $ambil,
                        ]);

                        $jumlahPenjualan -= $ambil;
                    }
                }

                // Kalau semua supplier ga cukup stok, boleh kasih error/optional
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
