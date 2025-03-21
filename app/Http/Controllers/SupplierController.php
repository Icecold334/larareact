<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use App\Http\Requests\StoreSupplierRequest;
use App\Http\Requests\UpdateSupplierRequest;
use Inertia\Inertia;

class SupplierController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function fetch($id = 0)
    {
        return $id > 0 ? Supplier::find($id) : Supplier::all();
    }
    public function index()
    {
        return Inertia::render('supplier/index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('supplier/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSupplierRequest $request)
    {
        $nama = $request->nama;
        $alamat = $request->alamat;
        $telepon = $request->telepon;

        try {
            Supplier::create([
                'nama' => $nama,
                'alamat' => $alamat,
                'telepon' => $telepon
            ]);
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
    public function show(Supplier $supplier)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Supplier $supplier)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSupplierRequest $request, Supplier $supplier)
    {
        $nama = $request->nama;
        $alamat = $request->alamat;
        $telepon = $request->telepon;
        try {
            $supplier->update([
                'nama' => $nama,
                'alamat' => $alamat,
                'telepon' => $telepon
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
    public function destroy(Supplier $supplier)
    {
        try {
            $supplier->delete();
            return Inertia::clearHistory();
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => $e->getMessage(),
            ]);
        }
    }
}
