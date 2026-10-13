import React from "react";
import { Printer, GraduationCap } from "lucide-react";

const CetakKartu = ({ data }) => {
  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center font-sans">
      {/* Tombol Cetak (Hilang saat Print) */}
      <div className="mb-6 no-print">
        <button
          onClick={handlePrint}
          className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-orange-500/20 flex items-center gap-2 transition"
        >
          <Printer size={18} /> CETAK KARTU PESERTA SELEKSI
        </button>
      </div>

      {/* Kartu Ujian Resmi */}
      <div className="bg-white text-slate-900 p-8 w-[750px] mx-auto border-2 border-slate-900 font-serif shadow-xl rounded-xl">
        {/* KOP Resmi */}
        <div className="border-b-4 border-double border-slate-900 pb-4 mb-6 flex items-center gap-4 text-center">
          <div className="flex-1">
            <h1 className="text-lg font-bold tracking-wider uppercase">
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

        {/* Konten Utama */}
        <div className="flex gap-6 font-sans">
          <div className="w-40 h-52 bg-slate-100 border-2 border-slate-900 flex items-center justify-center overflow-hidden relative">
            {data?.foto_jpg ? (
              <img
                src={
                  data.foto_jpg.startsWith("http")
                    ? data.foto_jpg
                    : `http://127.0.0.1:8000/storage/${data.foto_jpg}`
                }
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
                {data?.user?.name || "-"}
              </p>
            </div>
            <div className="border-b border-slate-200 pb-1">
              <span className="text-xs uppercase font-bold text-slate-500">
                Program Studi Pilihan
              </span>
              <p className="font-bold text-slate-900">
                {data?.jenjang} - {data?.prodi}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 border border-slate-200 rounded-lg">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500">
                  Waktu Ujian
                </span>
                <p className="font-bold text-slate-900 text-xs">
                  {data?.jadwal
                    ? new Date(data.jadwal.tanggal_ujian).toLocaleString(
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
                  {data?.jadwal?.ruangan || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tanda Tangan / Footer */}
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
          .no-print { display: none !important; }
          body { background: white !important; }
          div { box-shadow: none !important; border: 2px solid black !important; }
        }
      `}</style>
    </div>
  );
};

export default CetakKartu;
