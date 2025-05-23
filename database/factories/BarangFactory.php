<?php

namespace Database\Factories;

use App\Models\Supplier;
use Illuminate\Support\Str;
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
        $nama = $this->faker->randomElement($this->barangs);
        $tipe = $this->faker->randomElement($this->merks);
        $warna = $this->faker->safeColorName;

        $hargaBeli = $this->faker->numberBetween(50000, 100000);

        // Tambah margin minimal 10% dari harga beli
        $hargaJualDasar = $hargaBeli * 1.1;

        // Bulatkan ke atas ke kelipatan 10000 terdekat
        $hargaJual = ceil($hargaJualDasar / 10000) * 10000;


        return [
            'uuid' => $this->faker->numerify('BJ-###-###-###'),
            'nama' => $nama,
            'slug' => Str::slug($nama),
            'tipe' => $tipe,
            'slug_tipe' => Str::slug($tipe),
            'warna' => $warna,
            'slug_warna' => Str::slug($warna),
            // 'supplier_id' => Supplier::inRandomOrder()->value('id') ?? Supplier::factory(),
            // 'harga_beli' => $hargaBeli,
            'harga_jual' => $hargaJual,
        ];
    }
}
