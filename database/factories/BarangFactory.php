<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Barang>
 */
class BarangFactory extends Factory
{
    protected $barangs = [
        'Sarung Atlas',
        'Sarung Wadimor',
        'Sarung Gajah Duduk',
        'Sarung BHS',
        'Sarung Mangga',
        'Sarung Samarinda',
        'Sarung Al-Madinah',
        'Sarung Batik',
        'Sarung Kotak-Kotak',
        'Sarung Polos',
        'Sarung Tenun',
        'Sarung Rajut',
        'Sarung Lurik',
        'Sarung Ikat',
        'Sarung Motif Bali',
        'Sarung Kain Songket',
        'Sarung Motif Batik',
        'Sarung Hitam Putih',
        'Sarung Motif Etnik',
        'Sarung Kombinasi',
        'Sarung Pelangi',
        'Sarung Mega Mendung',
        'Sarung Tenun Ikat',
        'Sarung Katun Jepang',
        'Sarung Premium',
        'Sarung Murah',
        'Sarung Elegan',
        'Sarung Halus',
        'Sarung Lembut',
        'Sarung Super',
        'Sarung Hijau Tua',
        'Sarung Cokelat',
        'Sarung Biru Laut',
        'Sarung Merah Marun',
        'Sarung Putih Polos',
        'Sarung Hitam Elegan',
        'Sarung Batik Jawa',
        'Sarung Songket Asli',
        'Sarung Edisi Spesial',
        'Sarung Lebaran',
        'Sarung Kekinian',
        'Sarung Klasik',
        'Sarung Simple',
        'Sarung Nyaman',
        'Sarung Adem',
        'Sarung Tahan Lama',
        'Sarung Eksklusif',
        'Sarung Tenun Asli',
        'Sarung Handmade',
        'Sarung Modern',
        'Sarung Tradisional',
        'Sarung Kombinasi Motif',
        'Sarung Warna Pastel',
        'Sarung Bordir',
        'Sarung Keluarga',
        'Sarung Sutra',
        'Sarung Kain Halus',
        'Sarung Serat Alami',
        'Sarung Batik Tulis',
        'Sarung Berwarna Cerah',
        'Sarung Kotak Besar',
        'Sarung Kotak Kecil',
        'Sarung Salur',
        'Sarung Polkadot',
        'Sarung Bergaris',
        'Sarung Abu-Abu',
        'Sarung Biru Dongker',
        'Sarung Hijau Tosca',
        'Sarung Kuning Cerah',
        'Sarung Merah Marun',
        'Sarung Putih Bersih',
        'Sarung Batik Kombinasi',
        'Sarung Motif Bunga',
        'Sarung Etnik Modern',
        'Sarung Kain Katun',
        'Sarung Elegan Premium',
        'Sarung Polos Tebal',
        'Sarung Lembut Adem',
        'Sarung Tenun Kombinasi',
        'Sarung Hitam Kombinasi',
        'Sarung Silver',
        'Sarung Emas',
        'Sarung Bronze',
        'Sarung Batik Sogan',
        'Sarung Jawa Barat',
        'Sarung Jawa Timur',
        'Sarung Bali',
        'Sarung Kalimantan',
        'Sarung Sumatera',
        'Sarung Sulawesi',
        'Sarung Papua',
        'Sarung Tradisional Indonesia',
        'Sarung Mewah',
        'Sarung Luks',
        'Sarung Elegan Kombinasi',
        'Sarung Warna Alam',
        'Sarung Warna Terang',
        'Sarung Gradient',
        'Sarung Warna Gelap',
        'Sarung Premium Eksklusif'
    ];

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nama' => $this->faker->randomElement($this->barangs),
            'harga' => $this->faker->numberBetween(10, 100) * 1000
        ];
    }
}
