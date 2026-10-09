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

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-slate-950/80 border-r border-slate-800 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 pb-8 border-b border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-900/40">
              <GraduationCap size={22} />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white leading-tight">
                PMB Pasca
              </h1>
              <p className="text-xs text-slate-400">Portal Administrasi</p>
            </div>
          </div>

          <nav className="mt-8 space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-emerald-600/20 text-emerald-400 font-medium rounded-xl border border-emerald-500/30 transition">
              <Users size={18} />
              <span>Manajemen Pendaftar</span>
            </button>
            <button
              onClick={() => window.print()}
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl transition"
            >
              <FileText size={18} />
              <span>Cetak Laporan</span>
            </button>
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800">
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/20 transition font-medium text-sm"
          >
            <LogOut size={16} /> Logout Sistem
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950/40 p-6 rounded-2xl border border-slate-800 backdrop-blur-md">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Dashboard Verifikasi & Seleksi
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Kelola data pendaftaran mahasiswa baru pascasarjana secara
              real-time.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl text-xs font-semibold">
            <Sparkles size={14} /> Sistem Aktif
          </div>
        </header>

        {/* Stats Summary Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-950/40 border border-slate-800 p-5 rounded-2xl">
            <p className="text-xs text-slate-400 font-medium">
              Total Pendaftar
            </p>
            <p className="text-2xl font-black text-white mt-2">{stats.total}</p>
          </div>
          <div className="bg-slate-950/40 border border-slate-800 p-5 rounded-2xl">
            <p className="text-xs text-amber-400 font-medium">
              Perlu Verifikasi
            </p>
            <p className="text-2xl font-black text-amber-400 mt-2">
              {stats.pending}
            </p>
          </div>
          <div className="bg-slate-950/40 border border-slate-800 p-5 rounded-2xl">
            <p className="text-xs text-emerald-400 font-medium">Disetujui</p>
            <p className="text-2xl font-black text-emerald-400 mt-2">
              {stats.disetujui}
            </p>
          </div>
          <div className="bg-slate-950/40 border border-slate-800 p-5 rounded-2xl">
            <p className="text-xs text-rose-400 font-medium">Ditolak</p>
            <p className="text-2xl font-black text-rose-400 mt-2">
              {stats.ditolak}
            </p>
          </div>
        </div>

        {/* Filters & Table */}
        <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative flex-1">
              <Search
                className="absolute left-3.5 top-3 text-slate-500"
                size={18}
              />
              <input
                type="text"
                placeholder="Cari berdasarkan nama atau program studi..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-slate-400" />
              <select
                className="bg-slate-900 border border-slate-800 text-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
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

          <div className="overflow-x-auto rounded-xl border border-slate-800/80">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-4">Calon Mahasiswa</th>
                  <th className="p-4">Program Studi</th>
                  <th className="p-4 text-center">Dokumen Berkas</th>
                  <th className="p-4 text-center">Status Verifikasi</th>
                  <th className="p-4 text-center">Jadwal Ujian</th>
                  <th className="p-4 text-center">Aksi Verifikasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-950/20">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      Tidak ada data pendaftar yang sesuai.
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
                      <td className="p-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                            item.status_verifikasi === "disetujui"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : item.status_verifikasi === "ditolak"
                                ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              item.status_verifikasi === "disetujui"
                                ? "bg-emerald-400"
                                : item.status_verifikasi === "ditolak"
                                  ? "bg-rose-400"
                                  : "bg-amber-400"
                            }`}
                          />
                          {item.status_verifikasi.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {item.status_verifikasi === "disetujui" ? (
                          <button
                            onClick={() => handleOpenJadwalModal(item)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs rounded-xl transition font-medium"
                          >
                            <Calendar size={14} className="text-emerald-400" />
                            {item.jadwal ? "Edit Jadwal" : "Atur Jadwal"}
                          </button>
                        ) : (
                          <span className="text-xs text-slate-600">-</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {item.status_verifikasi === "pending" ? (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() =>
                                handleUpdateStatus(item.id, "disetujui")
                              }
                              className="p-2 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded-lg border border-emerald-500/30 transition"
                              title="Setujui Pendaftaran"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateStatus(item.id, "ditolak")
                              }
                              className="p-2 bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white rounded-lg border border-rose-500/30 transition"
                              title="Tolak Pendaftaran"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-500">
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
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white">
                Atur Jadwal Ujian Seleksi
              </h3>
              <button
                onClick={() => setSelectedJadwalItem(null)}
                className="text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveJadwal} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Nama Pendaftar
                </label>
                <input
                  type="text"
                  disabled
                  value={selectedJadwalItem.user?.name || ""}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Tanggal & Waktu Ujian
                </label>
                <input
                  type="datetime-local"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
                  value={jadwalForm.tanggal}
                  onChange={(e) =>
                    setJadwalForm({ ...jadwalForm, tanggal: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Ruangan / Link Ujian Online
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Ruang Pasca 302 / Zoom Link"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
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
                  className="flex-1 px-4 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-sm font-semibold hover:bg-slate-700 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingJadwal}
                  className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-500 transition shadow-lg shadow-emerald-900/40"
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
