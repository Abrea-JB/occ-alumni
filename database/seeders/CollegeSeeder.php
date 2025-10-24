<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CollegeSeeder extends Seeder
{
    public function run()
    {
        for ($i = 1; $i <= 30; $i++) {
            DB::table('college')->insert([
                'college_name' => 'College ' . $i,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
