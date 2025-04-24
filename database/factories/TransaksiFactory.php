<?php

namespace Database\Factories;

use App\Models\Barang;
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
        return [
            'kode' => $kode,
            'jenis' => $jenis,
            'barang_id' => Barang::inRandomOrder()->value('id') ?? Barang::factory(),
            'jumlah' => fake()->numberBetween(50, 500),
        ];
    }
}
