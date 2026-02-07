import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "https://127.0.0.1:8000/api";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post(`${API_URL}/login`, {
        username,
        password,
      });

      const { access_token, user } = response.data;

      // 1. Simpan data ke localStorage
      localStorage.setItem("token", access_token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("user", JSON.stringify(user));

      // 2. Logika Redirect sesuai Role
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user.role === "prodi") {
        navigate("/prodi/dashboard");
      } else {
        // KHUSUS PENDAFTAR: Cek apakah sudah mengisi form pendaftaran
        try {
          const check = await axios.get(
            "http://127.0.0.1:8000/api/check-pendaftaran",
            {
              headers: { Authorization: `Bearer ${access_token}` },
            },
          );

          if (check.data.registered) {
            // Jika sudah daftar, arahkan ke Dashboard Status
            navigate("/pendaftar/dashboard");
          } else {
            // Jika belum daftar, arahkan ke Form Input
            navigate("/pendaftar/form");
          }
        } catch (checkErr) {
          // Jika gagal cek (misal API error), default ke form agar aman
          navigate("/pendaftar/form");
        }
      }
    } catch (err) {
      const message =
        err.response?.data?.error || "Kombinasi ID dan Password salah!";
      setError(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border-t-8 border-green-800">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-green-900">
            PMB Pascasarjana
          </h2>
          <p className="text-gray-500 mt-2">Silakan masuk ke akun Anda</p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nomor Seri / Username
            </label>
            <input
              type="text"
              className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-200 outline-none"
              placeholder="Masukkan ID Anda"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Kode Akses / Password
            </label>
            <input
              type="password"
              className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-200 outline-none"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-800 hover:bg-green-900 text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform active:scale-95"
          >
            MASUK
          </button>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Belum punya akun?{" "}
              <Link
                to="/register"
                className="text-green-800 font-bold hover:underline"
              >
                Daftar di sini
              </Link>
            </p>
          </div>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>&copy; 2026 - Sistem Penerimaan Mahasiswa Baru</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
