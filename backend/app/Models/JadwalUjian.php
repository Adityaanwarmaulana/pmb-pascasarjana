<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JadwalUjian extends Model
{
    use HasFactory;

    // Menentukan nama tabel (opsional jika nama tabel sesuai jamak)
    protected $table = 'jadwal_ujians';

    protected $fillable = [
        'pendaftaran_id',
        'tanggal_ujian',
        'ruangan',
        'keterangan'
    ];

    // Relasi balik ke Pendaftaran
    public function pendaftaran()
    {
        return $this->belongsTo(Pendaftaran::class);
    }
}
