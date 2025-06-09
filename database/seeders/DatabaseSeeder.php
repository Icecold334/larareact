<?php

namespace Database\Seeders;

use App\Models\Kas;
use App\Models\Merk;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Barang;
use App\Models\Supplier;
use App\Models\Transaksi;
use App\Models\Supplierables;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        Supplier::create(['nama' => 'PT. Faiz Ambajaya', 'alamat' => 'Gg. Hitam Legam No. 99, Jomokerto, Jatim', 'telepon' => '086478953157']);
        Supplier::factory(2)->create();
        Barang::factory(10)->create();
        Supplierables::factory(20)->create();
        Transaksi::factory(5)->create();
        Kas::factory(5)->create();
        User::factory()->create([
            'name' => 'Berkah Jaya',
            'email' => 'berkah@email.com',
        ]);
    }
}
