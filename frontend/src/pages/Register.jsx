import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "https://127.0.0.1:8000/api";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    whatsapp: "",
  });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/register`, formData);
      alert("Registrasi Berhasil! Silakan Login.");
      navigate("/login");
    } catch (err) {
      alert("Gagal registrasi. Username mungkin sudah digunakan.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-bg px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border-t-8 border-primary-dark">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary-dark">Daftar Akun</h2>
          <p className="text-gray-500 mt-2">
            Lengkapi data untuk mulai mendaftar
          </p>
        </div>

        {/* space-y-5 memberikan jarak konsisten antar baris input */}
        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              placeholder="Masukkan nama sesuai ijazah"
              className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light transition-all"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              placeholder="Buat ID unik untuk login"
              className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light transition-all"
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Minimal 6 karakter"
              className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light transition-all"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nomor WhatsApp
            </label>
            <input
              type="text"
              placeholder="Contoh: 08123456789"
              className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light transition-all"
              onChange={(e) =>
                setFormData({ ...formData, whatsapp: e.target.value })
              }
              required
            />
          </div>

          <button className="w-full bg-primary-dark text-white font-bold py-3 mt-4 rounded-xl hover:bg-green-900 transition-all shadow-md transform active:scale-95">
            DAFTAR SEKARANG
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">Sudah memiliki akun? </span>
          <Link
            to="/login"
            className="text-primary-dark font-bold hover:underline"
          >
            Login di sini
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
