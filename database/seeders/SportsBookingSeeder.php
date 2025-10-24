<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SportsBookingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $sports = [
            'Basketball',
            'Volleyball',
            'Taekwondo',
            'Lawn Tennis',
            'Football',
            'Badminton',
            'Swimming',
            'Sepak Takraw',
            'Baseball',
            'Table Tennis',
        ];

        foreach ($sports as $sport) {
            DB::table('sports_list')->insert([
                'name' => $sport,
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
