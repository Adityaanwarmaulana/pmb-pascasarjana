import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LogOut,
  ClipboardCheck,
  GraduationCap,
  Search,
  Eye,
  FileText,
  X,
  Award,
  CheckCircle2,
  XCircle,
  Sparkles,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
const BASE_URL = API_URL.replace("/api", "");

const DashboardProdi = () => {
  const [pendaftar, setPendaftar] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [nilaiForm, setNilaiForm] = useState({
    nilai_ujian: "",
    status_kelulusan: "lulus",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/pendaftaran-prodi`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendaftar(res.data);
    } catch (err) {
      console.error("Gagal mengambil data pendaftaran prodi", err);
    }
  };

  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setNilaiForm({
      nilai_ujian: item.nilai_ujian !== null ? item.nilai_ujian : "",
      status_kelulusan: item.status_kelulusan || "lulus",
    });
  };

  const handleSaveNilai = async (e) => {
    e.preventDefault();
    if (!nilaiForm.nilai_ujian || isNaN(nilaiForm.nilai_ujian)) {
      alert("Masukkan nilai ujian berupa angka yang valid (0-100).");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.patch(
        `${API_URL}/pendaftaran/${selectedItem.id}/nilai`,
        {
          nilai_ujian: parseFloat(nilaiForm.nilai_ujian),
          status_kelulusan: nilaiForm.status_kelulusan.toLowerCase(),
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setSelectedItem(null);
      fetchData();
    } catch (err) {
      alert(
        "Gagal menyimpan nilai. Pastikan koneksi dan input data sudah benar.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredData = pendaftar.filter(
    (item) =>
      item.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.prodi?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const stats = {
    total: pendaftar.length,
    dinilai: pendaftar.filter((i) => i.nilai_ujian !== null).length,
    lulus: pendaftar.filter((i) => i.status_kelulusan === "lulus").length,
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Topbar Navigation */}
      <nav className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex justify-between items-center backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-900/40">
            <GraduationCap size={22} />
          </div>
          <div>
            <h1 className="font-bold text-base text-white leading-tight">
              Panel Program Studi
            </h1>
            <p className="text-xs text-slate-400">PMB Pascasarjana</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-white">
              {user?.name || "Dosen Penguji"}
            </p>
            <p className="text-xs text-emerald-400 font-mono">
              Tim Seleksi Prodi
            </p>
          </div>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            className="p-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/20 transition"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      {/* Content Container */}
      <div className="p-6 md:p-10 flex-1 max-w-7xl w-full mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950/40 p-6 rounded-2xl border border-slate-800 backdrop-blur-md">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Penilaian & Kelulusan Seleksi
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Input nilai hasil ujian masuk dan tentukan status akhir pendaftar
              prodi Anda.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl text-xs font-semibold">
            <Sparkles size={14} /> Akses Penilaian Aktif
          </div>
        </header>

        {/* Ringkasan Status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-950/40 border border-slate-800 p-5 rounded-2xl">
            <p className="text-xs text-slate-400 font-medium">
              Total Pendaftar Prodi
            </p>
            <p className="text-2xl font-black text-white mt-2">{stats.total}</p>
          </div>
          <div className="bg-slate-950/40 border border-slate-800 p-5 rounded-2xl">
            <p className="text-xs text-emerald-400 font-medium">
              Sudah Dinilai
            </p>
            <p className="text-2xl font-black text-emerald-400 mt-2">
              {stats.dinilai}
            </p>
          </div>
          <div className="bg-slate-950/40 border border-slate-800 p-5 rounded-2xl">
            <p className="text-xs text-blue-400 font-medium">
              Direkomendasikan Lulus
            </p>
            <p className="text-2xl font-black text-blue-400 mt-2">
              {stats.lulus}
            </p>
          </div>
        </div>

        {/* Tabel Penilaian */}
        <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="relative max-w-md">
            <Search
              className="absolute left-3.5 top-3 text-slate-500"
              size={18}
            />
            <input
              type="text"
              placeholder="Cari nama pendaftar..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800/80">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-4">Nama Pendaftar</th>
                  <th className="p-4">Program Studi</th>
                  <th className="p-4 text-center">Berkas</th>
                  <th className="p-4 text-center">Nilai Ujian</th>
                  <th className="p-4 text-center">Status Kelulusan</th>
                  <th className="p-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-950/20">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      Belum ada data pendaftar yang diverifikasi oleh Admin.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-900/40 transition"
                    >
                      <td className="p-4 font-semibold text-white">
                        {item.user?.name || "N/A"}
                      </td>
                      <td className="p-4 text-slate-400">
                        <span className="px-2.5 py-1 bg-slate-800 rounded-lg text-xs font-mono">
                          {item.prodi || "-"}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {item.dokumen_pdf && (
                            <button
                              onClick={() =>
                                window.open(
                                  `${BASE_URL}/storage/${item.dokumen_pdf}`,
                                  "_blank",
                                )
                              }
                              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                              title="Lihat Berkas PDF"
                            >
                              <FileText size={16} />
                            </button>
                          )}
                          {item.foto_jpg && (
                            <button
                              onClick={() =>
                                window.open(
                                  `${BASE_URL}/storage/${item.foto_jpg}`,
                                  "_blank",
                                )
                              }
                              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                              title="Lihat Pasfoto"
                            >
                              <Eye size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-center font-mono font-bold text-emerald-400 text-base">
                        {item.nilai_ujian !== null ? item.nilai_ujian : "-"}
                      </td>
                      <td className="p-4 text-center">
                        {item.status_kelulusan === "lulus" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 size={12} /> Lulus
                          </span>
                        ) : item.status_kelulusan === "tidak lulus" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            <XCircle size={12} /> Tidak Lulus
                          </span>
                        ) : (
                          <span className="text-xs text-slate-500 italic">
                            Belum Dinilai
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleOpenModal(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded-xl border border-emerald-500/30 transition text-xs font-semibold"
                        >
                          <ClipboardCheck size={14} /> Input Nilai
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Custom Input Nilai */}
      {selectedItem && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Award className="text-emerald-400" size={20} /> Input Hasil
                Seleksi
              </h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveNilai} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Nama Pendaftar
                </label>
                <input
                  type="text"
                  disabled
                  value={selectedItem.user?.name || ""}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Nilai Ujian Seleksi (0 - 100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  placeholder="Contoh: 85.5"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
                  value={nilaiForm.nilai_ujian}
                  onChange={(e) =>
                    setNilaiForm({ ...nilaiForm, nilai_ujian: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Keputusan Akhir
                </label>
                <select
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
                  value={nilaiForm.status_kelulusan}
                  onChange={(e) =>
                    setNilaiForm({
                      ...nilaiForm,
                      status_kelulusan: e.target.value,
                    })
                  }
                >
                  <option value="lulus">LULUS</option>
                  <option value="tidak lulus">TIDAK LULUS</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="flex-1 px-4 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-sm font-semibold hover:bg-slate-700 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-500 transition shadow-lg shadow-emerald-900/40"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Hasil"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardProdi;
