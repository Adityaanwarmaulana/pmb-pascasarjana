import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  GraduationCap,
  ArrowRight,
  Lock,
  User,
  AlertCircle,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/login`, {
        username,
        password,
      });

      const { access_token, user } = response.data;

      localStorage.setItem("token", access_token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user.role === "prodi") {
        navigate("/prodi/dashboard");
      } else {
        try {
          const check = await axios.get(`${API_URL}/check-pendaftaran`, {
            headers: { Authorization: `Bearer ${access_token}` },
          });

          if (check.data.registered) {
            navigate("/pendaftar/dashboard");
          } else {
            navigate("/pendaftar/form");
          }
        } catch (checkErr) {
          navigate("/pendaftar/form");
        }
      }
    } catch (err) {
      const message =
        err.response?.data?.error || "Kombinasi ID dan Password salah!";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 font-sans text-slate-800">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200/80 p-8 md:p-10 space-y-8">
        {/* Header Brand */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 bg-gradient-to-tr from-amber-600 to-orange-500 rounded-2xl mx-auto flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
            <GraduationCap size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              PMB Pascasarjana
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Silakan masuk ke akun portal seleksi Anda
            </p>
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleLogin}>
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-2xl flex items-center gap-3 text-sm">
              <AlertCircle size={18} className="text-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Nomor Seri / Username
            </label>
            <div className="relative">
              <User
                className="absolute left-3.5 top-3.5 text-slate-400"
                size={18}
              />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                placeholder="Masukkan ID Anda"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Kode Akses / Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3.5 top-3.5 text-slate-400"
                size={18}
              />
              <input
                type="password"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-orange-500/20 transition-all transform active:scale-95 flex items-center justify-center gap-2 text-sm"
          >
            {isLoading ? "Memproses..." : "MASUK PORTAL"}{" "}
            <ArrowRight size={16} />
          </button>

          <div className="text-center pt-2">
            <p className="text-sm text-slate-500">
              Belum punya akun?{" "}
              <Link
                to="/register"
                className="text-amber-700 font-bold hover:underline"
              >
                Daftar di sini
              </Link>
            </p>
          </div>
        </form>

        <div className="text-center text-xs text-slate-400 pt-4 border-t border-slate-100">
          <p>&copy; 2026 - Sistem Penerimaan Mahasiswa Baru Pascasarjana</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
