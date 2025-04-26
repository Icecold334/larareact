<?php

namespace Database\Factories;

use App\Models\Barang;
use App\Models\Supplier;
use App\Models\Supplierables;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Supplierables>
 */
class SupplierablesFactory extends Factory
{
    protected $model = Supplierables::class;

    public function definition(): array
    {
        // Ambil barang random
        $barang = Barang::inRandomOrder()->first();

        // Cari supplier yang belum terhubung dengan barang ini
        $supplier = Supplier::whereDoesntHave('barangs', function ($query) use ($barang) {
            $query->where('barangs.id', $barang->id);
        })->inRandomOrder()->first();

        if (!$supplier) {
            $supplier = Supplier::factory()->create();
        }

        // Harga jual ada di barang
        $hargaJualBarang = (int) $barang->harga_jual;

        // Pastikan harga beli lebih kecil dari harga jual
        $hargaBeli = $this->faker->numberBetween(1000, $hargaJualBarang - 1000); // kasih margin 1000 supaya logis

        return [
            'supplier_id' => $supplier->id,
            'supplyable_id' => $barang->id,
            'supplyable_type' => Barang::class,
            'harga_beli' => $hargaBeli,
            // 'harga_jual' sudah tidak di sini, karena sekarang pindah ke tabel barang
        ];
    }
}
