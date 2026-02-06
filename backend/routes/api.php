<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PendaftaranController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Group route yang butuh login
Route::middleware('auth:api')->group(function () {

    // --- AKUN PENDAFTAR ---
    Route::get('/my-pendaftaran', [PendaftaranController::class, 'myRegistration']);
    Route::get('/check-pendaftaran', [PendaftaranController::class, 'checkStatus']);
    Route::post('/pendaftaran', [PendaftaranController::class, 'store']); // Mengirim Form

    // --- AKUN ADMIN PUSAT ---
    // (Pengecekan role 'admin' sebaiknya ada di dalam Controller PendaftaranController@updateStatus dll)
    Route::get('/pendaftaran', [PendaftaranController::class, 'index']);
    Route::patch('/pendaftaran/{id}/status', [PendaftaranController::class, 'updateStatus']);
    Route::post('/pendaftaran/set-jadwal', [PendaftaranController::class, 'setJadwal']);

    // --- AKUN PRODI ---
    Route::get('/pendaftaran-prodi', [PendaftaranController::class, 'indexProdi']);
    Route::patch('/pendaftaran/{id}/nilai', [PendaftaranController::class, 'inputNilai']);

    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);
});
