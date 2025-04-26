<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Supplier extends Model
{
    /** @use HasFactory<\Database\Factories\SupplierFactory> */
    use HasFactory;
    protected $fillable = [
        'nama',
        'alamat',
        'telepon',
    ];


    // public function barangs(): HasMany
    // {
    //     return $this->hasMany(Barang::class, 'supplier_id');
    // }

    public function barangs()
    {
        return $this->morphedByMany(Barang::class, 'supplyable', 'supplierables')
            ->withPivot('harga_beli')
            ->withTimestamps();
    }
}
