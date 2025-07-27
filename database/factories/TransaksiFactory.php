<?php

namespace Database\Factories;

use App\Models\Barang;
use App\Models\Supplier;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Transaksi>
 */
class TransaksiFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $jenis = fake()->boolean;
        $kode = ($jenis ? 'IN' : 'OUT') . fake()->numerify('-###-###-###');
        $barang = Barang::inRandomOrder()->first();
        return [
            'kode' => $kode,
            'jenis' => $jenis,
            'barang_id' => $barang->id,
            'supplier_id' => Supplier::inRandomOrder()->value('id') ?? Supplier::factory(),
            'jumlah' => fake()->numberBetween(50, 500),
            'harga_jual' => !$jenis ? $barang->harga_jual : null,
            'pajak_persen' => fake()->randomElement([0, 5, 10, 11]),
        ];
    }
}
