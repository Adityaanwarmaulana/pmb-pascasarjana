import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  LogOut,
  CheckCircle,
  XCircle,
  Eye,
  FileText,
  Search,
  Calendar,
} from "lucide-react";

const AdminDashboard = () => {
  const [pendaftar, setPendaftar] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/pendaftaran", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendaftar(res.data);
    } catch (err) {
      console.error("Error fetch data");
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    if (!window.confirm(`Ubah status pendaftaran menjadi ${newStatus}?`))
      return;
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/pendaftaran/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchData();
    } catch (err) {
      alert("Gagal update status");
    }
  };

  const handleSetJadwal = async (id) => {
    const tanggal = prompt(
      "Masukkan Tanggal (YYYY-MM-DD HH:mm):",
      "2026-03-10 09:00",
    );
    const ruang = prompt("Masukkan Ruangan / Link:");
    if (tanggal && ruang) {
      try {
        await axios.post(
          `http://127.0.0.1:8000/api/pendaftaran/set-jadwal`,
          { pendaftaran_id: id, tanggal_ujian: tanggal, ruangan: ruang },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        alert("Jadwal disimpan!");
        fetchData();
      } catch (err) {
        alert("Gagal simpan jadwal");
      }
    }
  };

  const filteredData = pendaftar.filter((item) => {
    const matchesSearch = item.user?.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || item.status_verifikasi === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-100 flex text-sm">
      <div className="w-64 bg-green-900 text-white p-6 hidden md:block">
        <h1 className="text-xl font-black mb-10 italic border-b border-green-700 pb-4">
          PMB ADMIN
        </h1>
        <nav className="space-y-4">
          <div
            onClick={() => window.scrollTo({ top: 300, behavior: "smooth" })}
            className="p-3 bg-green-700 rounded-lg flex items-center gap-3 shadow-inner cursor-pointer"
          >
            <Users size={20} /> Data Pendaftar
          </div>

          {/* Laporan PDF */}
          <div
            onClick={() => window.print()} // Fungsi cetak cepat untuk laporan tabel
            className="p-3 hover:bg-green-800 rounded-lg flex items-center gap-3 transition cursor-pointer text-gray-300"
          >
            <FileText size={20} /> Laporan PDF
          </div>
        </nav>
      </div>

      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold text-gray-800">
            Managemen Pendaftaran
          </h2>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Cari pendaftar..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="p-2 border rounded-lg bg-white outline-none"
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="disetujui">Disetujui</option>
            <option value="ditolak">Ditolak</option>
          </select>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
          <table className="w-full">
            <thead className="bg-gray-50 border-b text-gray-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-4 text-left">Pendaftar</th>
                <th className="p-4 text-center">Berkas</th>
                <th className="p-4 text-center">Verifikasi</th>
                <th className="p-4 text-center">Jadwal</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-bold">{item.user?.name}</div>
                    <div className="text-[10px] text-gray-400 uppercase">
                      {item.prodi}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() =>
                          window.open(
                            `http://127.0.0.1:8000/storage/${item.dokumen_pdf}`,
                          )
                        }
                        className="p-1.5 bg-blue-50 text-blue-600 rounded"
                      >
                        <FileText size={16} />
                      </button>
                      <button
                        onClick={() =>
                          window.open(
                            `http://127.0.0.1:8000/storage/${item.foto_jpg}`,
                          )
                        }
                        className="p-1.5 bg-purple-50 text-purple-600 rounded"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${item.status_verifikasi === "pending" ? "bg-amber-100 text-amber-600" : item.status_verifikasi === "disetujui" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                    >
                      {item.status_verifikasi}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    {item.status_verifikasi === "disetujui" && (
                      <button
                        onClick={() => handleSetJadwal(item.id)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-[10px] font-bold flex items-center gap-1 mx-auto hover:bg-blue-700"
                      >
                        <Calendar size={12} />{" "}
                        {item.jadwal ? "EDIT" : "SET JADWAL"}
                      </button>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      {item.status_verifikasi === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              handleUpdateStatus(item.id, "disetujui")
                            }
                            className="p-2 bg-green-600 text-white rounded-lg"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateStatus(item.id, "ditolak")
                            }
                            className="p-2 bg-red-600 text-white rounded-lg"
                          >
                            <XCircle size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
