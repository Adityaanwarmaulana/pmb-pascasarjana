import React, { useEffect, useState } from "react";
import axios from "axios";
import { LogOut, ClipboardCheck, GraduationCap } from "lucide-react";

const DashboardProdi = () => {
  const [pendaftar, setPendaftar] = useState([]);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/pendaftaran-prodi",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setPendaftar(res.data);
    } catch (err) {
      console.error("Gagal mengambil data prodi");
    }
  };

  const handleInputNilai = async (id) => {
    const nilai = prompt("Masukkan Nilai Ujian (0-100):");
    if (nilai === null) return; // Batal jika klik cancel

    const status = prompt("Hasil Akhir (lulus / tidak lulus):");
    if (status === null) return;

    if (nilai && status) {
      try {
        await axios.patch(
          `http://127.0.0.1:8000/api/pendaftaran/${id}/nilai`,
          { nilai_ujian: nilai, status_kelulusan: status.toLowerCase() },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        alert("Nilai Berhasil Disimpan!");
        fetchData();
      } catch (err) {
        alert("Gagal menyimpan. Pastikan input nilai berupa angka.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-blue-900 text-white p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2 font-bold text-lg">
          <GraduationCap size={24} />
          <span>PANEL PRODI - PMB PASCA</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm italic">Halo, {user?.name}</span>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            className="bg-red-500 hover:bg-red-600 p-2 rounded-full transition"
          >
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      <div className="p-8 flex-1">
        <div className="mb-6">
          <h2 className="text-2xl font-black text-gray-800 uppercase italic">
            Penilaian Seleksi
          </h2>
          <p className="text-gray-500 text-sm">
            Input hasil ujian untuk menentukan kelulusan mahasiswa.
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-100 text-gray-600 text-xs uppercase font-bold">
              <tr>
                <th className="p-5 text-left">Nama Pendaftar</th>
                <th className="p-5">Prodi</th>
                <th className="p-5 text-center">Nilai</th>
                <th className="p-5 text-center">Hasil Akhir</th>
                <th className="p-5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pendaftar.length > 0 ? (
                pendaftar.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50 transition">
                    <td className="p-5 font-bold text-gray-700">
                      {item.user?.name}
                    </td>
                    <td className="p-5">
                      <span className="text-xs font-semibold">
                        {item.prodi}
                      </span>
                    </td>
                    <td className="p-5 text-center font-mono font-bold text-blue-600">
                      {item.nilai_ujian || "-"}
                    </td>
                    <td className="p-5 text-center uppercase text-[10px] font-black">
                      {item.status_kelulusan === "lulus" ? (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                          Lulus
                        </span>
                      ) : item.status_kelulusan === "tidak lulus" ? (
                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">
                          Tidak Lulus
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">Proses</span>
                      )}
                    </td>
                    <td className="p-5 text-center">
                      <button
                        onClick={() => handleInputNilai(item.id)}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 mx-auto"
                      >
                        <ClipboardCheck size={14} /> NILAI
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="p-10 text-center text-gray-400 italic"
                  >
                    Belum ada data pendaftar yang diverifikasi Admin.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardProdi;
