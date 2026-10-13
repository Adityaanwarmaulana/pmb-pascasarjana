import React from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Award,
  BookOpen,
} from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      {/* Navbar Publik */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-white font-bold shadow-md shadow-orange-500/20">
              <GraduationCap size={22} />
            </div>
            <div>
              <h1 className="font-bold text-base text-slate-900 leading-tight">
                PMB Pascasarjana
              </h1>
              <p className="text-xs text-slate-500">
                Portal Penerimaan Mahasiswa Baru
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition"
            >
              Masuk Portal
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 text-white rounded-xl font-bold text-xs shadow-md shadow-orange-500/20 transition flex items-center gap-2"
            >
              Daftar Sekarang <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-28 px-6 max-w-5xl mx-auto text-center space-y-8 flex-1 flex flex-col justify-center items-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200/80 text-amber-800 rounded-full text-xs font-bold">
          <Award size={14} className="text-amber-600" /> Penerimaan Mahasiswa
          Baru T.A. 2026/2027
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
          Langkah Awal Menuju Jenjang Akademis{" "}
          <span className="bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
            Magister & Doktor
          </span>
        </h1>

        <p className="text-slate-600 text-base md:text-lg max-w-2xl leading-relaxed">
          Sistem pendaftaran terpadu Program Pascasarjana dengan alur verifikasi
          berkas terintegrasi, seleksi transparan, dan hasil berbasis real-time.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            to="/register"
            className="px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 text-white font-bold rounded-2xl shadow-xl shadow-orange-500/20 text-sm flex items-center justify-center gap-2 transition transform active:scale-95"
          >
            Buat Akun Pendaftaran <ArrowRight size={16} />
          </Link>
          <Link
            to="/login"
            className="px-8 py-4 bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 font-bold rounded-2xl text-sm transition"
          >
            Cek Status Pendaftaran
          </Link>
        </div>

        {/* Keunggulan System */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left pt-12 w-full">
          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-2">
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center font-bold mb-3">
              <ShieldCheck size={20} />
            </div>
            <h3 className="font-bold text-slate-900">
              Verifikasi Terintegrasi
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Tim administrasi memeriksa kelengkapan dokumen dan memberikan
              konfirmasi hasil secara berkala.
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-2">
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center font-bold mb-3">
              <BookOpen size={20} />
            </div>
            <h3 className="font-bold text-slate-900">
              Penilaian Prodi Transparan
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Seleksi dan penilaian ujian dikelola langsung oleh tim penguji
              masing-masing program studi pilihan.
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-2">
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center font-bold mb-3">
              <CheckCircle2 size={20} />
            </div>
            <h3 className="font-bold text-slate-900">Kartu Ujian Digital</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Cetak kartu peserta ujian berstandar KOP resmi secara langsung
              dari portal Anda setelah disetujui.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-8 text-center text-xs text-slate-400">
        <p>
          &copy; 2026 - Panitia Penerimaan Mahasiswa Baru Pascasarjana. Hak
          Cipta Dilindungi.
        </p>
      </footer>
    </div>
  );
};

export default Home;
