import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FileText, Calendar, CheckCircle, Clock, Printer } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
const BASE_URL = API_URL.replace("/api", "");

const PendaftarDashboard = () => {
  const navigate = useNavigate();
  const [regData, setRegData] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchMyStatus = async () => {
      try {
        const res = await axios.get(`${API_URL}/my-pendaftaran`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRegData(res.data);
      } catch (err) {
        console.error("Belum ada data pendaftaran");
      } finally {
        setLoading(false);
      }
    };
    fetchMyStatus();
  }, [token]);

  const handlePrint = () => {
    window.print();
  };

  if (loading)
    return (
      <div className="p-10 text-center font-bold text-green-800">
        Menghubungkan ke Server...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto screen-only">
        <header className="mb-8 flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 uppercase tracking-tighter">
              Halo, {user?.name || "Pendaftar"}!
            </h2>
            <p className="text-gray-600">
              Status akun Anda terpantau di bawah ini.
            </p>
          </div>
          <div className="flex items-center gap-4">
            {regData && (
              <div
                className={`px-4 py-2 rounded-lg font-black text-sm uppercase shadow-sm ${regData.status_verifikasi === "pending" ? "bg-amber-100 text-amber-700" : regData.status_verifikasi === "disetujui" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
              >
                {regData.status_verifikasi}
              </div>
            )}
            <button
              onClick={() => {
                localStorage.clear();
                navigate("/login");
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-600 transition"
            >
              LOGOUT
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div
            className={`p-6 rounded-xl shadow-sm border-t-4 bg-white ${regData ? "border-green-500" : "border-gray-300"}`}
          >
            <div className={regData ? "text-green-500" : "text-gray-300"}>
              <CheckCircle size={32} />
            </div>
            <h3 className="font-bold text-lg mt-2">1. Formulir</h3>
            <p className="text-sm text-gray-500">
              {regData ? "Data Terkirim" : "Belum Mengisi"}
            </p>
          </div>
          <div
            className={`p-6 rounded-xl shadow-sm bg-white border-t-4 ${regData?.status_verifikasi === "disetujui" ? "border-green-500" : "border-amber-500"} ${!regData && "opacity-40"}`}
          >
            <Clock
              className={
                regData?.status_verifikasi === "disetujui"
                  ? "text-green-500"
                  : "text-amber-500"
              }
              size={32}
            />
            <h3 className="font-bold text-lg mt-2">2. Verifikasi</h3>
            <p className="text-sm text-gray-500">
              {regData?.status_verifikasi === "disetujui"
                ? "Berhasil"
                : "Proses"}
            </p>
          </div>
          <div
            className={`p-6 rounded-xl shadow-sm bg-white border-t-4 border-blue-500 ${!regData?.jadwal && "opacity-40"}`}
          >
            <Calendar className="text-blue-500" size={32} />
            <h3 className="font-bold text-lg mt-2">3. Jadwal Ujian</h3>
            {regData?.jadwal && (
              <div className="mt-2 text-[11px] bg-blue-50 p-2 rounded">
                <p>
                  <strong>Waktu:</strong>{" "}
                  {new Date(regData.jadwal.tanggal_ujian).toLocaleString(
                    "id-ID",
                  )}
                </p>
                <p>
                  <strong>Ruang:</strong> {regData.jadwal.ruangan}
                </p>
              </div>
            )}
          </div>
          <div
            className={`p-6 rounded-xl shadow-sm bg-white border-t-4 border-green-600 ${(!regData?.jadwal || regData?.status_verifikasi !== "disetujui") && "opacity-40"}`}
          >
            <Printer className="text-green-600" size={32} />
            <h3 className="font-bold text-lg mt-2">4. Kartu Ujian</h3>
            {regData?.status_verifikasi === "disetujui" && regData?.jadwal && (
              <button
                onClick={handlePrint}
                className="w-full mt-2 py-2 bg-green-700 text-white text-xs font-bold rounded"
              >
                CETAK KARTU
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KARTU PRINT */}
      <div
        id="print-area"
        className="hidden print:block bg-white p-10 border-[10px] border-double border-green-900 w-[800px] mx-auto"
      >
        <div className="text-center border-b-4 border-black pb-4 mb-6">
          <h1 className="text-3xl font-black uppercase">
            Kartu Peserta Seleksi
          </h1>
          <p className="text-xl">PMB PASCASARJANA 2026/2027</p>
        </div>
        <div className="flex gap-10">
          <div className="w-48 h-64 bg-gray-200 border-2 border-black flex items-center justify-center relative overflow-hidden">
            {regData?.foto_jpg && (
              <img
                src={`${BASE_URL}/storage/${regData.foto_jpg}`}
                alt="Foto"
                className="w-full h-full object-cover"
                onError={(e) => (e.target.src = "https://placehold.co/150")}
              />
            )}
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <p className="text-gray-500 text-xs uppercase font-bold">
                Nama Lengkap
              </p>
              <p className="text-xl font-bold border-b border-gray-300">
                {user?.name}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase font-bold">
                Program Studi
              </p>
              <p className="text-xl font-bold border-b border-gray-300">
                {regData?.jenjang} - {regData?.prodi}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 bg-gray-100 p-4 rounded-lg">
              <div>
                <p className="text-xs font-bold">TANGGAL UJIAN</p>
                <p className="text-lg">
                  {regData?.jadwal
                    ? new Date(regData.jadwal.tanggal_ujian).toLocaleDateString(
                        "id-ID",
                        { dateStyle: "long" },
                      )
                    : "-"}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold">RUANGAN</p>
                <p className="text-lg">{regData?.jadwal?.ruangan || "-"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`@media print { .screen-only { display: none !important; } #print-area { display: block !important; } @page { size: landscape; margin: 0; } }`}</style>
    </div>
  );
};

export default PendaftarDashboard;
