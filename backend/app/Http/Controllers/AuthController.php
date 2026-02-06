<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users',
            'password' => 'required|string|min:6',
            'whatsapp' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $user = User::create([
            'name' => $request->name,
            'username' => $request->username,
            'password' => Hash::make($request->password),
            'role' => 'pendaftar', // Default saat daftar adalah pendaftar
            'whatsapp' => $request->whatsapp,
        ]);

        return response()->json(['message' => 'User berhasil didaftarkan', 'user' => $user], 201);
    }

    /**
     * Handle login and return JWT Token
     */
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->only('username', 'password');

        // Menggunakan Auth::guard('api') agar terdefinisi jelas untuk JWT
        if (!$token = Auth::guard('api')->attempt($credentials)) {
            return response()->json([
                'error' => 'Login Gagal. Cek kembali ID dan Password Anda.'
            ], 401);
        }

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'user' => Auth::guard('api')->user()
        ]);
    }

    /**
     * Handle Logout
     */
    public function logout(): JsonResponse
    {
        Auth::guard('api')->logout();

        return response()->json([
            'message' => 'Successfully logged out'
        ]);
    }
}
