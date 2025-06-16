<?php

namespace Database\Factories;

use App\Models\Barang;
use App\Models\Supplier;
use App\Models\Supplierables;
use Illuminate\Database\Eloquent\Factories\Factory;

class SupplierablesFactory extends Factory
{
    protected $model = Supplierables::class;

    public function definition(): array
    {
        $barang = Barang::inRandomOrder()->first() ?? Barang::factory()->create();

        // Pastikan harga jual barang logis
        $minJual = 3000;
        $hargaJualBarang = max((int) $barang->harga_jual, $minJual);

        // Supplier belum punya relasi dengan barang ini
        $supplier = Supplier::whereDoesntHave('barangs', function ($query) use ($barang) {
            $query->where('barangs.id', $barang->id);
        })->inRandomOrder()->first() ?? Supplier::factory()->create();

        // Hitung harga beli logis
        $hargaBeli = fake()->numberBetween(1000, $hargaJualBarang - 1000);

        // Harga jual untuk relasi ini (boleh sama, boleh beda dari barang utama)
        $hargaJual = $hargaBeli + fake()->numberBetween(1000, 3000);

        return [
            'supplier_id' => $supplier->id,
            'supplyable_id' => $barang->id,
            'supplyable_type' => Barang::class,
            'harga_beli' => $hargaBeli,
            'harga_jual' => $hargaJual,
        ];
    }
}
