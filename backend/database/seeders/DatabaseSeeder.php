<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Hapus user lama jika ada (agar tidak error duplicate saat seed ulang)
        User::whereIn('username', ['admin', 'prodi'])->delete();

        // 1. Buat Akun Admin Pusat
        User::create([
            'name' => 'Administrator Pusat',
            'username' => 'admin',
            'role' => 'admin', // Tugas: Verifikasi Berkas & Set Jadwal
            'password' => Hash::make('password'),
            'whatsapp' => '08123456789', // Tambahkan kolom ini jika ada di migrasi Anda
        ]);

        // 2. Buat Akun Kaprodi
        User::create([
            'name' => 'Kaprodi Pascasarjana',
            'username' => 'prodi',
            'role' => 'prodi', // Tugas: Input Nilai & Kelulusan
            'password' => Hash::make('password'),
            'whatsapp' => '08999999999',
        ]);

        echo "Seeding Berhasil: Akun admin & prodi siap digunakan.\n";
    }
}
