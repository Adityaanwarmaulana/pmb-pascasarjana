<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Data Admin
        User::create([
            'name' => 'Administrator',
            'username' => 'admin',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Data Prodi
        User::create([
            'name' => 'Staff Prodi',
            'username' => 'prodi',
            'password' => Hash::make('password'),
            'role' => 'prodi',
        ]);
    }
}
