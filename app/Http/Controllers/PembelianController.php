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
                // Hitung harga jual (harga beli + 2%)
                $hargaBeli = (int) $item['hargaBeli'];
                $hargaJualBaru = $hargaBeli + ($val['pajakPersen'] == 0 ? 0 : ($hargaBeli * 0.02));

                // Cari atau buat barang berdasarkan kombinasi nama + tipe + warna
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
                        'harga_jual' => $hargaJualBaru, // harga jual awal
                    ]
                );

                // Jika harga jual baru lebih tinggi dari harga lama, update
                if ($hargaJualBaru > (int) $barang->harga_jual) {
                    $barang->update([
                        'harga_jual' => $hargaJualBaru,
                    ]);
                }

                // Tambahkan ke pivot supplierables
                $barang->suppliers()->syncWithoutDetaching([
                    $supplier_id => [
                        'harga_beli' => $hargaBeli,
                        'harga_jual' => $hargaJualBaru, // ← Tambahkan ini
                    ],
                ]);

                // Simpan transaksi pembelian
                Transaksi::create([
                    'kode' => $kode,
                    'jenis' => $jenis,
                    'barang_id' => $barang->id,
                    'supplier_id' => $supplier_id,
                    'jumlah' => $item['jumlah'],
                    'pajak_persen' => $item['pajakPersen'] ?? 0,
                ]);
            }

            return Inertia::clearHistory(); // redirect atau response sukses
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
