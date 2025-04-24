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
                $barang = Barang::find($item['id']);

                Transaksi::create(
                    [
                        'kode' => $kode,
                        'jenis' => $jenis,
                        'barang_id' => $barang->id,
                        'jumlah' => $item['jumlah'],
                    ]
                );
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
