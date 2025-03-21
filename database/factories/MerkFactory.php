<?php

namespace Database\Factories;

use App\Models\Barang;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Merk>
 */
class MerkFactory extends Factory
{
    protected $merks = [
        'Atlas',
        'Wadimor',
        'Gajah Duduk',
        'BHS',
        'Mangga',
        'Samarinda',
        'Al-Madinah',
        'Batik',
        'Kotak-Kotak',
        'Polos',
        'Tenun',
        'Rajut',
        'Lurik',
        'Ikat',
        'Motif Bali',
        'Kain Songket',
        'Motif Batik',
        'Hitam Putih',
        'Motif Etnik',
        'Kombinasi',
        'Pelangi',
        'Mega Mendung',
        'Tenun Ikat',
        'Katun Jepang',
        'Premium',
        'Murah',
        'Elegan',
        'Halus',
        'Lembut',
        'Super',
        'Hijau Tua',
        'Cokelat',
        'Biru Laut',
        'Merah Marun',
        'Putih Polos',
        'Hitam Elegan',
        'Batik Jawa',
        'Songket Asli',
        'Edisi Spesial',
        'Lebaran',
        'Kekinian',
        'Klasik',
        'Simple',
        'Nyaman',
        'Adem',
        'Tahan Lama',
        'Eksklusif',
        'Tenun Asli',
        'Handmade',
        'Modern',
        'Tradisional',
        'Kombinasi Motif',
        'Warna Pastel',
        'Bordir',
        'Keluarga',
        'Sutra',
        'Kain Halus',
        'Serat Alami',
        'Batik Tulis',
        'Berwarna Cerah',
        'Kotak Besar',
        'Kotak Kecil',
        'Salur',
        'Polkadot',
        'Bergaris',
        'Abu-Abu',
        'Biru Dongker',
        'Hijau Tosca',
        'Kuning Cerah',
        'Merah Marun',
        'Putih Bersih',
        'Batik Kombinasi',
        'Motif Bunga',
        'Etnik Modern',
        'Kain Katun',
        'Elegan Premium',
        'Polos Tebal',
        'Lembut Adem',
        'Tenun Kombinasi',
        'Hitam Kombinasi',
        'Silver',
        'Emas',
        'Bronze',
        'Batik Sogan',
        'Jawa Barat',
        'Jawa Timur',
        'Bali',
        'Kalimantan',
        'Sumatera',
        'Sulawesi',
        'Papua',
        'Tradisional Indonesia',
        'Mewah',
        'Luks',
        'Elegan Kombinasi',
        'Warna Alam',
        'Warna Terang',
        'Gradient',
        'Warna Gelap',
        'Premium Eksklusif'
    ];
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'barang_id' => Barang::inRandomOrder()->value('id') ?? Barang::factory(), // Ambil barang yang sudah ada, kalau nggak ada buat baru
            'tipe' => $this->faker->randomElement($this->merks),
            'warna' => $this->faker->safeColorName,
        ];
    }
}
