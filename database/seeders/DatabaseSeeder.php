<?php

namespace Database\Seeders;

use App\Models\Barang;
use App\Models\Merk;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Supplier;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        Supplier::factory(1)->create();
        Supplier::create(['nama' => 'PT. Faiz Ambajaya', 'alamat' => 'Gg. Hitam Legam No. 99, Jomokerto, Jatim', 'telepon' => '086478953157']);
        Barang::factory(5)->create();
        Merk::factory(60)->create();
        User::factory()->create([
            'name' => 'Uchiha Azril',
            'email' => 'test@email.com',
        ]);
    }
}
