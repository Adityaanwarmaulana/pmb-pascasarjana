<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pendaftaran extends Model
{
    use HasFactory;

    // Tambahkan baris ini untuk mengizinkan kolom diisi secara massal
    protected $fillable = [
        'user_id',
        'jadwal_ujian_id',
        'jenjang',
        'prodi',
        'pendidikan_terakhir',
        'dokumen_pdf',
        'foto_jpg',
        'status_verifikasi',
        'status_kelulusan',
        'nilai_ujian'
    ];

    public function user()
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    public function jadwal()
    {
        return $this->hasOne(JadwalUjian::class, 'pendaftaran_id');
    }
}
