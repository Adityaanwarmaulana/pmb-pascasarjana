import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  LogOut,
  Eye,
  FileText,
  Search,
  Calendar,
  Sparkles,
  Filter,
  Check,
  X,
  GraduationCap,
} from "lucide-react";

import * as XLSX from "xlsx";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
const BASE_URL = API_URL.replace("/api", "");

const AdminDashboard = () => {
  const [pendaftar, setPendaftar] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedJadwalItem, setSelectedJadwalItem] = useState(null);
  const [jadwalForm, setJadwalForm] = useState({ tanggal: "", ruangan: "" });
  const [isSubmittingJadwal, setIsSubmittingJadwal] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/pendaftaran`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendaftar(res.data);
    } catch (err) {
      console.error("Error fetching data", err);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    if (
      !window.confirm(
        `Konfirmasi perubahan status pendaftaran menjadi "${newStatus.toUpperCase()}"?`,
      )
    )
      return;
    try {
      await axios.patch(
        `${API_URL}/pendaftaran/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchData();
    } catch (err) {
      alert("Gagal memperbarui status pendaftaran.");
    }
  };

  const handleOpenJadwalModal = (item) => {
    setSelectedJadwalItem(item);
    setJadwalForm({
      tanggal: item.jadwal?.tanggal_ujian
        ? item.jadwal.tanggal_ujian.replace(" ", "T")
        : "",
      ruangan: item.jadwal?.ruangan || "",
    });
  };

  const handleSaveJadwal = async (e) => {
    e.preventDefault();
    if (!jadwalForm.tanggal || !jadwalForm.ruangan) {
      alert("Mohon lengkapi tanggal dan ruangan ujian.");
      return;
    }
    setIsSubmittingJadwal(true);
    try {
      const formattedDate = jadwalForm.tanggal.replace("T", " ");
      await axios.post(
        `${API_URL}/pendaftaran/set-jadwal`,
        {
          pendaftaran_id: selectedJadwalItem.id,
          tanggal_ujian: formattedDate,
          ruangan: jadwalForm.ruangan,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setSelectedJadwalItem(null);
      fetchData();
    } catch (err) {
      alert("Gagal menyimpan jadwal ujian.");
    } finally {
      setIsSubmittingJadwal(false);
    }
  };

  const filteredData = pendaftar.filter((item) => {
    const matchesSearch =
      item.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.prodi?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || item.status_verifikasi === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: pendaftar.length,
    pending: pendaftar.filter((i) => i.status_verifikasi === "pending").length,
    disetujui: pendaftar.filter((i) => i.status_verifikasi === "disetujui")
      .length,
    ditolak: pendaftar.filter((i) => i.status_verifikasi === "ditolak").length,
  };

  const handleExportExcel = () => {
    if (pendaftar.length === 0) {
      alert("Tidak ada data untuk diekspor.");
      return;
    }

    // Format data agar bersih saat dibuka di Excel
    const dataToExport = pendaftar.map((item, index) => ({
      No: index + 1,
      "Nama Lengkap": item.user?.name || "-",
      Jenjang: item.jenjang || "-",
      "Program Studi": item.prodi || "-",
      "Pendidikan Terakhir": item.pendidikan_terakhir || "-",
      "Status Verifikasi": item.status_verifikasi || "-",
      "Nilai Ujian": item.nilai_ujian !== null ? item.nilai_ujian : "-",
      "Status Kelulusan": item.status_kelulusan
        ? item.status_kelulusan.toUpperCase()
        : "-",
      "Tanggal Daftar": new Date(item.created_at).toLocaleDateString("id-ID"),
    }));

    // Create a new worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Pendaftar PMB");

    // Export the workbook to an Excel file
    XLSX.writeFile(workbook, "Rekap_Pendaftar_PMB_Pascasarjana.xlsx");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col md:flex-row font-sans">
      {/* Sidebar - Clean Slate White */}
      <aside className="w-full md:w-72 bg-white border-r border-slate-200/80 p-6 flex flex-col justify-between shadow-sm">
        <div>
          <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-white font-bold shadow-md shadow-orange-500/20">
              <GraduationCap size={22} />
            </div>
            <div>
              <h1 className="font-bold text-base text-slate-900 leading-tight">
                PMB Pasca
              </h1>
              <p className="text-xs text-slate-500">Portal Administrasi</p>
            </div>
          </div>

          <nav className="mt-6 space-y-1.5">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-amber-50 text-amber-900 font-semibold rounded-xl border border-amber-200/60 transition text-sm">
              <Users size={18} className="text-amber-600" />
              <span>Manajemen Pendaftar</span>
            </button>
            <button
              onClick={() => window.print()}
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition text-sm"
            >
              <FileText size={18} className="text-slate-400" />
              <span>Cetak Laporan</span>
            </button>
            <button
              onClick={handleExportExcel}
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition text-sm font-medium"
            >
              <FileText size={18} className="text-amber-600" />
              <span>Ekspor ke Excel</span>
            </button>
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-100">
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl border border-rose-200/60 transition font-semibold text-sm"
          >
            <LogOut size={16} /> Logout Sistem
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Dashboard Verifikasi & Seleksi
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Kelola data pendaftaran mahasiswa baru pascasarjana secara
              real-time.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200/60 text-amber-800 px-4 py-2 rounded-xl text-xs font-semibold">
            <Sparkles size={14} className="text-amber-600" /> Sistem Aktif
          </div>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm">
            <p className="text-xs text-slate-500 font-medium">
              Total Pendaftar
            </p>
            <p className="text-2xl font-black text-slate-900 mt-1">
              {stats.total}
            </p>
          </div>
          <div className="bg-white border border-amber-200/80 p-5 rounded-2xl shadow-sm">
            <p className="text-xs text-amber-700 font-medium">
              Perlu Verifikasi
            </p>
            <p className="text-2xl font-black text-amber-600 mt-1">
              {stats.pending}
            </p>
          </div>
          <div className="bg-white border border-emerald-200/80 p-5 rounded-2xl shadow-sm">
            <p className="text-xs text-emerald-700 font-medium">Disetujui</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">
              {stats.disetujui}
            </p>
          </div>
          <div className="bg-white border border-rose-200/80 p-5 rounded-2xl shadow-sm">
            <p className="text-xs text-rose-700 font-medium">Ditolak</p>
            <p className="text-2xl font-black text-rose-600 mt-1">
              {stats.ditolak}
            </p>
          </div>
        </div>

        {/* Filters & Table Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative flex-1">
              <Search
                className="absolute left-3.5 top-3 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Cari berdasarkan nama atau program studi..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-slate-400" />
              <select
                className="bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 focus:bg-white"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Semua Status</option>
                <option value="pending">Pending</option>
                <option value="disetujui">Disetujui</option>
                <option value="ditolak">Ditolak</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="p-4">Calon Mahasiswa</th>
                  <th className="p-4">Program Studi</th>
                  <th className="p-4 text-center">Dokumen Berkas</th>
                  <th className="p-4 text-center">Status Verifikasi</th>
                  <th className="p-4 text-center">Jadwal Ujian</th>
                  <th className="p-4 text-center">Aksi Verifikasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                      Tidak ada data pendaftar yang sesuai.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/80 transition"
                    >
                      <td className="p-4 font-semibold text-slate-900">
                        {item.user?.name || "N/A"}
                      </td>
                      <td className="p-4 text-slate-600">
                        <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-mono font-medium">
                          {item.prodi || "-"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          {item.dokumen_pdf && (
                            <button
                              onClick={() =>
                                window.open(
                                  `${BASE_URL}/storage/${item.dokumen_pdf}`,
                                  "_blank",
                                )
                              }
                              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
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
                              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                              title="Lihat Pasfoto"
                            >
                              <Eye size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                            item.status_verifikasi === "disetujui"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : item.status_verifikasi === "ditolak"
                                ? "bg-rose-50 text-rose-700 border-rose-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              item.status_verifikasi === "disetujui"
                                ? "bg-emerald-500"
                                : item.status_verifikasi === "ditolak"
                                  ? "bg-rose-500"
                                  : "bg-amber-500"
                            }`}
                          />
                          {item.status_verifikasi.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {item.status_verifikasi === "disetujui" ? (
                          <button
                            onClick={() => handleOpenJadwalModal(item)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs rounded-xl transition font-medium"
                          >
                            <Calendar size={14} className="text-amber-600" />
                            {item.jadwal ? "Edit Jadwal" : "Atur Jadwal"}
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">-</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {item.status_verifikasi === "pending" ? (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() =>
                                handleUpdateStatus(item.id, "disetujui")
                              }
                              className="p-2 bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white rounded-lg border border-emerald-200 transition"
                              title="Setujui Pendaftaran"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateStatus(item.id, "ditolak")
                              }
                              className="p-2 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white rounded-lg border border-rose-200 transition"
                              title="Tolak Pendaftaran"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">
                            Selesai
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal Custom Atur Jadwal */}
      {selectedJadwalItem && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900">
                Atur Jadwal Ujian Seleksi
              </h3>
              <button
                onClick={() => setSelectedJadwalItem(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveJadwal} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  Nama Pendaftar
                </label>
                <input
                  type="text"
                  disabled
                  value={selectedJadwalItem.user?.name || ""}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-600 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  Tanggal & Waktu Ujian
                </label>
                <input
                  type="datetime-local"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-amber-500 focus:bg-white focus:outline-none"
                  value={jadwalForm.tanggal}
                  onChange={(e) =>
                    setJadwalForm({ ...jadwalForm, tanggal: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  Ruangan / Link Ujian Online
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Ruang Pasca 302 / Zoom Link"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-amber-500 focus:bg-white focus:outline-none"
                  value={jadwalForm.ruangan}
                  onChange={(e) =>
                    setJadwalForm({ ...jadwalForm, ruangan: e.target.value })
                  }
                  required
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedJadwalItem(null)}
                  className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-200 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingJadwal}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-600 to-orange-500 text-white rounded-xl text-sm font-semibold hover:from-amber-700 hover:to-orange-600 transition shadow-md shadow-orange-500/20"
                >
                  {isSubmittingJadwal ? "Menyimpan..." : "Simpan Jadwal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
