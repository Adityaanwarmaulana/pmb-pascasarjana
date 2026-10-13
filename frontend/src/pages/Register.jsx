import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  GraduationCap,
  ArrowRight,
  User,
  Lock,
  Phone,
  UserPlus,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    whatsapp: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post(`${API_URL}/register`, formData);
      alert("Registrasi Berhasil! Silakan Login.");
      navigate("/login");
    } catch (err) {
      alert("Gagal registrasi. Username mungkin sudah digunakan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 font-sans text-slate-800 py-10">
      <div className="max-w-md w-full bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-200/80 space-y-8">
        {/* Header Brand */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 bg-gradient-to-tr from-amber-600 to-orange-500 rounded-2xl mx-auto flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
            <GraduationCap size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Pendaftaran Akun Baru
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Lengkapi data untuk mulai mendaftar seleksi
            </p>
          </div>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Nama Lengkap
            </label>
            <div className="relative">
              <User
                className="absolute left-3.5 top-3.5 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Masukkan nama sesuai ijazah"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Username / ID Unik
            </label>
            <div className="relative">
              <UserPlus
                className="absolute left-3.5 top-3.5 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Buat ID unik untuk login"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3.5 top-3.5 text-slate-400"
                size={18}
              />
              <input
                type="password"
                placeholder="Minimal 6 karakter"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Nomor WhatsApp
            </label>
            <div className="relative">
              <Phone
                className="absolute left-3.5 top-3.5 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Contoh: 08123456789"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                onChange={(e) =>
                  setFormData({ ...formData, whatsapp: e.target.value })
                }
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-orange-500/20 transition-all transform active:scale-95 flex items-center justify-center gap-2 text-sm mt-2"
          >
            {isLoading ? "Memproses..." : "DAFTAR SEKARANG"}{" "}
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="text-center text-sm pt-2">
          <span className="text-slate-500">Sudah memiliki akun? </span>
          <Link
            to="/login"
            className="text-amber-700 font-bold hover:underline"
          >
            Login di sini
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
