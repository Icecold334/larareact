<?php

namespace Database\Factories;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Kas>
 */
class KasFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'jenis' => fake()->boolean,
            'nominal' => fake()->numberBetween(1, 10) * 1000,
            'tanggal' => Carbon::now()
                ->subDays(rand(0, 30))
                ->setHour(rand(0, 23))
                ->setMinute(rand(0, 59))
                ->setSecond(0),
            'keterangan' => fake()->boolean ? fake()->sentence() : null,
        ];
    }
}
