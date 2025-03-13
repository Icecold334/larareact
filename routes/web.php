<?php

use App\Http\Controllers\BarangController;
use App\Http\Controllers\SupplierController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::get('kasir', function () {
        return Inertia::render('kasir');
    })->name('kasir');
    Route::get('/suppliers', [SupplierController::class, 'fetch']);
    Route::resource('supplier', SupplierController::class);
    Route::get('/barangs', [BarangController::class, 'fetch']);
    Route::resource('barang', BarangController::class);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
