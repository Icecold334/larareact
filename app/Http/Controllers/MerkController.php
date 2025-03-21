<?php

namespace App\Http\Controllers;

use App\Models\Merk;
use Inertia\Inertia;
use App\Models\Barang;
use App\Http\Requests\StoreMerkRequest;
use App\Http\Requests\UpdateMerkRequest;

class MerkController extends Controller
{

    public function fetch($id = 0)
    {
        return $id > 0 ? Merk::find($id) :
            Merk::with('barang')
            ->orderBy(
                Barang::select('nama')
                    ->whereColumn('barangs.id', 'merks.barang_id')
            )
            ->get();
    }
    public function index()
    {
        return Inertia::render('merk/index');
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
    public function store(StoreMerkRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Merk $merk)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Merk $merk)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMerkRequest $request, Merk $merk)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Merk $merk)
    {
        //
    }
}
