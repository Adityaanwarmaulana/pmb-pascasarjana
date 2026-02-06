<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pendaftaran;
use App\Models\JadwalUjian;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class PendaftaranController extends Controller
{
    // Akses ADMIN: Melihat semua data
    public function index()
    {
        try {
            $data = Pendaftaran::with(['user', 'jadwal'])->get();
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Akses PRODI: Hanya melihat yang sudah disetujui berkasnya oleh Admin
    public function indexProdi()
    {
        try {
            $data = Pendaftaran::with(['user', 'jadwal'])
                ->where('status_verifikasi', 'disetujui')
                ->get();
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'jenjang' => 'required|in:S2,S3',
            'prodi' => 'required|string',
            'pendidikan_terakhir' => 'required|string',
            'dokumen_pdf' => 'required|mimes:pdf|max:2048',
            'foto_jpg' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        // Simpan File
        $pathPdf = $request->file('dokumen_pdf')->store('pendaftaran/dokumen', 'public');
        $pathFoto = $request->file('foto_jpg')->store('pendaftaran/foto', 'public');

        $pendaftaran = Pendaftaran::create([
            'user_id' => Auth::id(),
            'jenjang' => $request->jenjang,
            'prodi' => $request->prodi,
            'pendidikan_terakhir' => $request->pendidikan_terakhir,
            'dokumen_pdf' => $pathPdf,
            'foto_jpg' => $pathFoto,
            'status_verifikasi' => 'pending',
        ]);

        return response()->json(['message' => 'Pendaftaran berhasil dikirim!', 'data' => $pendaftaran]);
    }

    public function updateStatus(Request $request, $id)
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Hanya Admin yang bisa verifikasi'], 403);
        }

        $request->validate(['status' => 'required|in:disetujui,ditolak,pending']);
        $pendaftaran = Pendaftaran::findOrFail($id);
        $pendaftaran->status_verifikasi = $request->status;
        $pendaftaran->save();

        return response()->json(['message' => 'Status berhasil diperbarui', 'data' => $pendaftaran]);
    }

    public function myRegistration()
    {
        // Menyertakan relasi 'jadwal' agar pendaftar bisa melihat jadwal ujian di dashboard mereka
        $data = Pendaftaran::with('jadwal')->where('user_id', Auth::id())->first();
        return response()->json($data);
    }

    public function checkStatus()
    {
        $pendaftaran = Pendaftaran::where('user_id', Auth::id())->first();
        return response()->json([
            'registered' => $pendaftaran ? true : false,
            'data' => $pendaftaran
        ]);
    }

    public function setJadwal(Request $request)
    {
        // Hanya Admin yang mengatur jadwal
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Hanya Admin yang bisa mengatur jadwal'], 403);
        }

        $request->validate([
            'pendaftaran_id' => 'required|exists:pendaftarans,id',
            'tanggal_ujian' => 'required',
            'ruangan' => 'required|string',
        ]);

        $jadwal = JadwalUjian::updateOrCreate(
            ['pendaftaran_id' => $request->pendaftaran_id],
            [
                'tanggal_ujian' => $request->tanggal_ujian,
                'ruangan' => $request->ruangan,
                'keterangan' => $request->keterangan ?? 'Ujian Seleksi Pascasarjana'
            ]
        );

        return response()->json(['message' => 'Jadwal berhasil dikonfirmasi!', 'data' => $jadwal]);
    }

    public function inputNilai(Request $request, $id)
    {
        if (Auth::user()->role !== 'prodi') {
            return response()->json(['message' => 'Hanya Prodi yang bisa input nilai'], 403);
        }

        $request->validate([
            'nilai_ujian' => 'required|numeric|min:0|max:100',
            'status_kelulusan' => 'required|in:lulus,tidak lulus'
        ]);

        $pendaftaran = Pendaftaran::findOrFail($id);
        $pendaftaran->nilai_ujian = $request->nilai_ujian;
        $pendaftaran->status_kelulusan = $request->status_kelulusan;
        $pendaftaran->save();

        return response()->json(['message' => 'Nilai berhasil disimpan!']);
    }
}
