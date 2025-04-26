<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Barang;
use App\Models\Transaksi;
use Illuminate\Support\Str;
use App\Http\Requests\StoreBarangRequest;
use App\Http\Requests\UpdateBarangRequest;

class BarangController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function fetch($id = 0)
    {

        return $id > 0 ? Barang::find($id) : Barang::whereHas('suppliers')->with('suppliers')->get()->map(function ($barang) {
            $in = Transaksi::where('barang_id', $barang->id)->where('jenis', true)->sum('jumlah');
            $out = Transaksi::where('barang_id', $barang->id)->where('jenis', false)->sum('jumlah');

            $barang->stok = max(0, $in - $out);
            return $barang;
        });
    }
    public function kasir()
    {

        return  Barang::whereHas('suppliers')->with('suppliers')->get()->map(function ($barang) {
            $in = Transaksi::where('barang_id', $barang->id)->where('jenis', true)->sum('jumlah');
            $out = Transaksi::where('barang_id', $barang->id)->where('jenis', false)->sum('jumlah');
            $barang->stok = max(0, $in - $out);
            return $barang;
        })->filter(fn($barang) => $barang->stok > 0 && $barang->harga_jual > 0)->values();
    }
    public function fetchSupp($id = 0)
    {
        // dd($id);
        return  Barang::with('merk', 'supplier')->where('supplier_id', $id)->get();
    }
    public function index()
    {
        return Inertia::render('barang/index');
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
    public function store(StoreBarangRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Barang $barang)
    {
        $barang->load('suppliers');

        foreach ($barang->suppliers as $supplier) {
            $in = Transaksi::where('barang_id', $barang->id)
                ->where('supplier_id', $supplier->id)
                ->where('jenis', true)
                ->sum('jumlah');

            $out = Transaksi::where('barang_id', $barang->id)
                ->where('supplier_id', $supplier->id)
                ->where('jenis', false)
                ->sum('jumlah');

            $supplier->stok = max(0, $in - $out);
        }

        return Inertia::render('barang/show', compact('barang'));
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Barang $barang)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBarangRequest $request, Barang $barang)
    {
        $nama = $request->nama;
        $tipe = $request->tipe;
        $warna = $request->warna;
        $harga = $request->harga_jual; // pastikan input harga_jual

        try {
            $barang->update([
                'nama' => $nama,
                'slug' => Str::slug($nama),
                'tipe' => $tipe,
                'slug_tipe' => Str::slug($tipe),
                'warna' => $warna,
                'slug_warna' => Str::slug($warna),
                'harga_jual' => $harga,
            ]);

            return Inertia::clearHistory();
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Barang $barang)
    {
        try {
            $barang->delete();
            return Inertia::clearHistory();
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => $e->getMessage(),
            ]);
        }
    }
}
