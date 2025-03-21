<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Barang extends Model
{
    /** @use HasFactory<\Database\Factories\BarangFactory> */
    use HasFactory;
    protected $fillable = [
        'nama',
        'harga',
    ];

    public function merk(): HasMany
    {
        return $this->hasMany(Merk::class, 'barang_id');
    }
}
