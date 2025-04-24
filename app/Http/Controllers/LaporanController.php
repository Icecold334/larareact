<?php

namespace App\Http\Controllers;

use App\Models\Transaksi;
use Inertia\Inertia;
use Illuminate\Http\Request;

class LaporanController extends Controller
{
    public function index($type)
    {
        $view = 'laporan/' . $type;
        return Inertia::render($view);
    }
    public function fetch($type)
    {
        return Transaksi::where('jenis', $type == 'beli')->with('barangs', 'barangs.supplier')->get()->unique('kode');
    }
}
