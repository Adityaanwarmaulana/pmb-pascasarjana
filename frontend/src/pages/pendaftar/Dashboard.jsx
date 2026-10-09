import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FileCheck2,
  CalendarDays,
  Printer,
  Clock,
  LogOut,
  User,
  Sparkles,
  AlertCircle,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
const BASE_URL = API_URL.replace("/api", "");

const PendaftarDashboard = () => {
  const navigate = useNavigate();
  const [regData, setRegData] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchMyStatus = async () => {
      try {
        const res = await axios.get(`${API_URL}/my-pendaftaran`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRegData(res.data);
      } catch (err) {
        console.error("Belum ada data pendaftaran.");
      } finally {
        setLoading(false);
      }
    };
    fetchMyStatus();
  }, [token]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col items-center justify-center p-6 font-sans">
        <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-slate-400">
          Menghubungkan ke Portal PMB...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-4 md:p-8">
      {/* Tampilan Layar Utama */}
      <div className="max-w-5xl mx-auto space-y-8 screen-only">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950/60 p-6 md:p-8 rounded-3xl border border-slate-800 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-emerald-600/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400 font-bold text-xl">
              <User size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Selamat Datang, {user?.name || "Calon Mahasiswa"}
              </h2>
              <p className="text-slate-400 text-sm mt-0.5">
                Pantau proses verifikasi dan jadwal ujian Anda secara berkala.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-2xl border border-rose-500/20 transition font-medium text-sm"
          >
            <LogOut size={16} /> Logout
          </button>
        </header>

        {/* Stepper Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div
            className={`p-6 rounded-2xl border transition ${
              regData
                ? "bg-slate-950/60 border-emerald-500/40"
                : "bg-slate-950/20 border-slate-800 opacity-50"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
              <FileCheck2 size={20} />
            </div>
            <h3 className="font-semibold text-white">1. Formulir Berkas</h3>
            <p className="text-xs text-slate-400 mt-1">
              {regData ? "Sudah Diunggah" : "Belum Mengisi"}
            </p>
          </div>

          <div
            className={`p-6 rounded-2xl border transition ${
              regData?.status_verifikasi === "disetujui"
                ? "bg-slate-950/60 border-emerald-500/40 text-emerald-400"
                : regData?.status_verifikasi === "ditolak"
                  ? "bg-slate-950/60 border-rose-500/40 text-rose-400"
                  : "bg-slate-950/60 border-amber-500/40 text-amber-400"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
              <Clock size={20} />
            </div>
            <h3 className="font-semibold text-white">2. Verifikasi Berkas</h3>
            <p className="text-xs mt-1 capitalize">
              {regData?.status_verifikasi || "Menunggu"}
            </p>
          </div>

          <div
            className={`p-6 rounded-2xl border transition ${
              regData?.jadwal
                ? "bg-slate-950/60 border-emerald-500/40"
                : "bg-slate-950/20 border-slate-800 opacity-50"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
              <CalendarDays size={20} />
            </div>
            <h3 className="font-semibold text-white">3. Jadwal Ujian</h3>
            <p className="text-xs text-slate-400 mt-1">
              {regData?.jadwal
                ? `${regData.jadwal.ruangan}`
                : "Belum Ditentukan"}
            </p>
          </div>

          <div
            className={`p-6 rounded-2xl border transition ${
              regData?.status_verifikasi === "disetujui" && regData?.jadwal
                ? "bg-slate-950/60 border-emerald-500/40"
                : "bg-slate-950/20 border-slate-800 opacity-50"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
              <Printer size={20} />
            </div>
            <h3 className="font-semibold text-white">4. Cetak Kartu</h3>
            <p className="text-xs text-slate-400 mt-1">
              {regData?.status_verifikasi === "disetujui" && regData?.jadwal
                ? "Siap Dicetak"
                : "Belum Tersedia"}
            </p>
          </div>
        </div>

        {/* Tampilkan Notifikasi & Form Upload Ulang jika Status Ditolak */}
        {regData?.status_verifikasi === "ditolak" && (
          <div className="bg-rose-950/40 border border-rose-500/30 p-6 rounded-3xl backdrop-blur-md space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertCircle size={24} />
              <h3 className="text-lg font-bold">
                Berkas Pendaftaran Memerlukan Perbaikan
              </h3>
            </div>
            <p className="text-sm text-slate-300">
              Mohon periksa kembali dokumen dan pasfoto Anda. Pastikan dokumen
              dapat dibaca dengan jelas sebelum mengunggah ulang.
            </p>
            <button
              onClick={() => navigate("/pendaftar/form")}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition"
            >
              Unggah Ulang Berkas Pendaftaran
            </button>
          </div>
        )}

        {/* Card Detail & Cetak */}
        {regData?.status_verifikasi === "disetujui" && regData?.jadwal && (
          <div className="bg-gradient-to-r from-emerald-950/40 to-slate-950/60 border border-emerald-500/30 p-8 rounded-3xl backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-semibold">
                <Sparkles size={12} /> Seleksi Ditetapkan
              </div>
              <h3 className="text-xl font-bold text-white">
                Kartu Ujian Seleksi Siap
              </h3>
              <p className="text-slate-400 text-sm">
                Pelaksanaan ujian pada tanggal{" "}
                <span className="text-emerald-400 font-semibold">
                  {new Date(regData.jadwal.tanggal_ujian).toLocaleString(
                    "id-ID",
                    { dateStyle: "full", timeStyle: "short" },
                  )}
                </span>{" "}
                di{" "}
                <span className="text-white font-medium">
                  {regData.jadwal.ruangan}
                </span>
                .
              </p>
            </div>
            <button
              onClick={handlePrint}
              className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-sm shadow-xl shadow-emerald-900/50 flex items-center gap-2 transition"
            >
              <Printer size={18} /> Cetak Kartu Peserta
            </button>
          </div>
        )}
      </div>

      {/* Area Cetak Resmi */}
      <div
        id="print-area"
        className="hidden print:block bg-white text-slate-900 p-8 w-[750px] mx-auto border-2 border-slate-900 font-serif"
      >
        <div className="border-b-4 border-double border-slate-900 pb-4 mb-6 flex items-center gap-4 text-center">
          <div className="flex-1">
            <h1 className="text-xl font-bold tracking-wider uppercase">
              PANITIA PENERIMAAN MAHASISWA BARU
            </h1>
            <h2 className="text-2xl font-black uppercase tracking-tight text-emerald-900">
              PROGRAM PASCASARJANA 2026/2027
            </h2>
            <p className="text-xs text-slate-600 font-sans mt-1">
              Kartu Tanda Peserta Ujian Seleksi Masuk Pascasarjana
            </p>
          </div>
        </div>

        <div className="flex gap-6 font-sans">
          <div className="w-40 h-52 bg-slate-100 border-2 border-slate-900 flex items-center justify-center overflow-hidden relative">
            {regData?.foto_jpg ? (
              <img
                src={`${BASE_URL}/storage/${regData.foto_jpg}`}
                alt="Foto Peserta"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs text-slate-400">Pasfoto 3x4</span>
            )}
          </div>

          <div className="flex-1 space-y-3 text-sm">
            <div className="border-b border-slate-200 pb-1">
              <span className="text-xs uppercase font-bold text-slate-500">
                Nama Lengkap
              </span>
              <p className="font-bold text-lg text-slate-900">
                {user?.name || "-"}
              </p>
            </div>
            <div className="border-b border-slate-200 pb-1">
              <span className="text-xs uppercase font-bold text-slate-500">
                Program Studi Pilihan
              </span>
              <p className="font-bold text-slate-900">
                {regData?.jenjang
                  ? `${regData.jenjang} - ${regData.prodi}`
                  : regData?.prodi || "-"}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 border border-slate-200 rounded-lg">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500">
                  Waktu Ujian
                </span>
                <p className="font-bold text-slate-900 text-xs">
                  {regData?.jadwal
                    ? new Date(regData.jadwal.tanggal_ujian).toLocaleString(
                        "id-ID",
                      )
                    : "-"}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500">
                  Lokasi / Ruangan
                </span>
                <p className="font-bold text-slate-900 text-xs">
                  {regData?.jadwal?.ruangan || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-300 flex justify-between items-end text-xs font-sans">
          <div className="text-slate-400">
            * Harap membawa kartu ini dan Tanda Pengenal Resmi saat ujian.
          </div>
          <div className="text-center">
            <p className="mb-8">Panitia Pelaksana,</p>
            <p className="font-bold underline">Sistem PMB Pascasarjana</p>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          .screen-only { display: none !important; }
          #print-area { display: block !important; visibility: visible !important; }
          @page { size: portrait; margin: 10mm; }
          body { background: white !important; color: black !important; }
        }
      `}</style>
    </div>
  );
};

export default PendaftarDashboard;
