<?php

use App\Http\Controllers\BarangController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\KasController;
use App\Http\Controllers\Laporan;
use App\Http\Controllers\LaporanController;
use App\Http\Controllers\MerkController;
use App\Http\Controllers\PembelianController;
use App\Http\Controllers\PenjualanController;
use App\Http\Controllers\SupplierController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    // return Inertia::render('welcome');
    return redirect()->to('dashboard');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/kas', [KasController::class, 'arus']);
    Route::post('/kas', [KasController::class, 'saveKas']);
    Route::get('/laporan/history/{barang}/{supplier}', [LaporanController::class, 'supplierHistory'])->name('laporan.fetch');
    Route::get('/laporan/detail/{uuid}', [LaporanController::class, 'show'])->name('laporan.show.uuid');
    Route::get('/laporan/fetch/{type}', [LaporanController::class, 'fetch'])->name('laporan.fetch');
    Route::get('/laporan/{type}', [LaporanController::class, 'index'])->name('laporan');
    Route::get('/suppliers/{true}', [SupplierController::class, 'fetch']);
    Route::resource('supplier', SupplierController::class);
    Route::get('/barang/supp/{id}', [BarangController::class, 'fetchSupp']);
    Route::get('/barangs', [BarangController::class, 'fetch']);
    Route::get('/barangs/kasir', [BarangController::class, 'kasir']);
    Route::resource('barang', BarangController::class);
    Route::get('/merks', [MerkController::class, 'fetch']);
    Route::resource('merk', MerkController::class);
    Route::resource('kasir', PenjualanController::class);
    Route::resource('beli', PembelianController::class);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
