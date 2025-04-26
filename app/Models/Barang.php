<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Barang extends Model
{
    /** @use HasFactory<\Database\Factories\BarangFactory> */
    use HasFactory;
    protected $guarded = [
        'id',
    ];

    public function merk(): HasMany
    {
        return $this->hasMany(Merk::class, 'barang_id');
    }

    // public function supplier(): BelongsTo
    // {
    //     return $this->belongsTo(Supplier::class, 'supplier_id');
    // }

    public function suppliers()
    {
        return $this->morphToMany(Supplier::class, 'supplyable', 'supplierables')
            ->withPivot('harga_beli')
            ->withTimestamps();
    }
}
