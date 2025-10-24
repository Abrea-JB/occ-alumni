<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;

class UserTableDataSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();

        foreach (range(1, 15) as $i) {
            DB::table('users')->insert([
                'image' => null,
                'name' => $faker->name,
                'email' => $faker->unique()->safeEmail,
                'role' => 'student', 
                'email_verified_at' => now(),
                'password' => Hash::make('password'), // default password
                'status' => 'active',
                'remember_token' => \Str::random(10),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
