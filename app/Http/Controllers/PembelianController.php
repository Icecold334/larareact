<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Barang;
use App\Models\Pembelian;
use App\Models\Transaksi;
use Illuminate\Support\Str;
use Illuminate\Http\Request;

class PembelianController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('pembelian/index');
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
        $supplier_id = $request->supplier_id;
        $kode = 'IN' . fake()->numerify('-###-###-###');
        $jenis = true;

        try {
            foreach ($request->rows as $val) {
                $item = collect($val);

                // Cari atau buat barang berdasarkan slug (tanpa supplier_id)
                $barang = Barang::firstOrCreate(
                    [
                        'slug' => Str::slug($item['nama']),
                        'slug_tipe' => Str::slug($item['tipe']),
                        'slug_warna' => Str::slug($item['warna']),
                    ],
                    [
                        'uuid' => 'BJ' . fake()->numerify('-###-###-###'),
                        'nama' => $item['nama'],
                        'tipe' => $item['tipe'],
                        'warna' => $item['warna'],
                        'harga_jual' => 0, // Harga jual belum ditentukan, bisa dari UI nanti
                    ]
                );

                // Tambahkan relasi barang <-> supplier di pivot
                $barang->suppliers()->syncWithoutDetaching([
                    $supplier_id => ['harga_beli' => $item['hargaBeli']],
                ]);

                // Buat transaksi masuk
                Transaksi::create([
                    'kode' => $kode,
                    'jenis' => $jenis,
                    'barang_id' => $barang->id,
                    'supplier_id' => $supplier_id,
                    'jumlah' => $item['jumlah'],
                ]);
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
    public function show(Pembelian $pembelian)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Pembelian $pembelian)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Pembelian $pembelian)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pembelian $pembelian)
    {
        //
    }
}
