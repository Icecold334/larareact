<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Merk extends Model
{
    /** @use HasFactory<\Database\Factories\MerkFactory> */
    use HasFactory;
    protected $fillable = [
        'barang_id',
        'tipe',
        'warna',
    ];

    public function barang(): BelongsTo
    {
        return $this->belongsTo(Barang::class, 'barang_id');
    }
}
