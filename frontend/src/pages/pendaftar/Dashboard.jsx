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
  RefreshCw,
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
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col items-center justify-center p-6 font-sans">
        <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-600 rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-slate-500">
          Menghubungkan ke Portal PMB...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 md:p-8">
      {/* Tampilan Layar Utama */}
      <div className="max-w-5xl mx-auto space-y-8 screen-only">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-center justify-center text-amber-600 font-bold text-xl">
              <User size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Selamat Datang, {user?.name || "Calon Mahasiswa"}
              </h2>
              <p className="text-slate-500 text-sm mt-0.5">
                Pantau proses verifikasi dan jadwal ujian Anda secara berkala.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-2xl border border-rose-200/60 transition font-semibold text-sm"
          >
            <LogOut size={16} /> Logout
          </button>
        </header>

        {/* Notifikasi Khusus Jika Berkas Ditolak / Perlu Perbaikan */}
        {regData?.status_verifikasi === "ditolak" && (
          <div className="bg-rose-50 border border-rose-200 p-6 rounded-3xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center shrink-0">
                <AlertCircle size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold text-rose-900">
                  Berkas Pendaftaran Ditolak / Perlu Perbaikan
                </h3>
                <p className="text-rose-700 text-sm mt-1">
                  Dokumen atau pasfoto Anda tidak memenuhi syarat atau kurang
                  jelas. Silakan unggah ulang berkas Anda melalui tombol di
                  samping.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/pendaftar/form")}
              className="px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-bold text-xs shadow-md flex items-center gap-2 shrink-0 transition"
            >
              <RefreshCw size={14} /> Unggah Ulang Berkas
            </button>
          </div>
        )}

        {/* Status Stepper */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div
            className={`p-6 rounded-2xl border bg-white shadow-sm transition ${
              regData ? "border-emerald-200" : "border-slate-200 opacity-60"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <FileCheck2 size={20} />
            </div>
            <h3 className="font-semibold text-slate-900">1. Formulir Berkas</h3>
            <p className="text-xs text-slate-500 mt-1">
              {regData ? "Sudah Diunggah" : "Belum Mengisi"}
            </p>
          </div>

          <div
            className={`p-6 rounded-2xl border bg-white shadow-sm transition ${
              regData?.status_verifikasi === "disetujui"
                ? "border-emerald-200"
                : regData?.status_verifikasi === "ditolak"
                  ? "border-rose-200"
                  : "border-amber-200"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <Clock size={20} />
            </div>
            <h3 className="font-semibold text-slate-900">
              2. Verifikasi Berkas
            </h3>
            <p className="text-xs mt-1 capitalize font-medium text-amber-700">
              {regData?.status_verifikasi || "Menunggu"}
            </p>
          </div>

          <div
            className={`p-6 rounded-2xl border bg-white shadow-sm transition ${
              regData?.jadwal
                ? "border-emerald-200"
                : "border-slate-200 opacity-60"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <CalendarDays size={20} />
            </div>
            <h3 className="font-semibold text-slate-900">3. Jadwal Ujian</h3>
            <p className="text-xs text-slate-500 mt-1">
              {regData?.jadwal
                ? `${regData.jadwal.ruangan}`
                : "Belum Ditentukan"}
            </p>
          </div>

          <div
            className={`p-6 rounded-2xl border bg-white shadow-sm transition ${
              regData?.status_verifikasi === "disetujui" && regData?.jadwal
                ? "border-emerald-200"
                : "border-slate-200 opacity-60"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <Printer size={20} />
            </div>
            <h3 className="font-semibold text-slate-900">4. Cetak Kartu</h3>
            <p className="text-xs text-slate-500 mt-1">
              {regData?.status_verifikasi === "disetujui" && regData?.jadwal
                ? "Siap Dicetak"
                : "Belum Tersedia"}
            </p>
          </div>
        </div>

        {/* Card Detail Jadwal & Cetak */}
        {regData?.status_verifikasi === "disetujui" && regData?.jadwal && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 p-8 rounded-3xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100/80 text-amber-900 rounded-full text-xs font-semibold">
                <Sparkles size={12} className="text-amber-600" /> Seleksi
                Ditetapkan
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Kartu Ujian Seleksi Siap
              </h3>
              <p className="text-slate-600 text-sm">
                Pelaksanaan ujian pada tanggal{" "}
                <span className="text-amber-800 font-semibold">
                  {new Date(regData.jadwal.tanggal_ujian).toLocaleString(
                    "id-ID",
                    { dateStyle: "full", timeStyle: "short" },
                  )}
                </span>{" "}
                di{" "}
                <span className="text-slate-900 font-semibold">
                  {regData.jadwal.ruangan}
                </span>
                .
              </p>
            </div>
            <button
              onClick={handlePrint}
              className="px-6 py-3.5 bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 text-white rounded-2xl font-bold text-sm shadow-md shadow-orange-500/20 flex items-center gap-2 transition"
            >
              <Printer size={18} /> Cetak Kartu Peserta
            </button>
          </div>
        )}
      </div>

      {/* Area Cetak Resmi (Print Only) */}
      <div
        id="print-area"
        className="hidden print:block bg-white text-slate-900 p-8 w-[750px] mx-auto border-2 border-slate-900 font-serif"
      >
        <div className="border-b-4 border-double border-slate-900 pb-4 mb-6 flex items-center gap-4 text-center">
          <div className="flex-1">
            <h1 className="text-xl font-bold tracking-wider uppercase">
              PANITIA PENERIMAAN MAHASISWA BARU
            </h1>
            <h2 className="text-2xl font-black uppercase tracking-tight text-amber-900">
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
                {regData?.jenjang} - {regData?.prodi}
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
          <div className="text-slate-500">
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
