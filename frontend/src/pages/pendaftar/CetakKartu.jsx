import React from "react";

const CetakKartu = ({ data }) => {
  const handlePrint = () => window.print();

  return (
    <div className="p-10 bg-white border-2 border-dashed border-gray-400 max-w-2xl mx-auto mt-10 rounded-lg">
      <div className="text-center border-b-2 border-black pb-4 mb-4">
        <h1 className="text-xl font-bold uppercase">
          Kartu Peserta Ujian PMB Pascasarjana
        </h1>
        <p>Tahun Akademik 2026/2027</p>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between">
          <span>Nama Peserta:</span>
          <span className="font-bold">{data.user.name}</span>
        </div>
        <div className="flex justify-between">
          <span>Program Studi:</span>
          <span className="font-bold">
            {data.jenjang} - {data.prodi}
          </span>
        </div>
        <div className="p-4 bg-gray-100 rounded text-center">
          <p className="text-xs uppercase font-bold">Jadwal Ujian</p>
          <p className="text-lg font-black">
            {new Date(data.jadwal.tanggal_ujian).toLocaleString("id-ID")}
          </p>
          <p>Lokasi: {data.jadwal.ruangan}</p>
        </div>
      </div>
      <button
        onClick={handlePrint}
        className="mt-10 w-full bg-black text-white py-2 rounded no-print"
      >
        KLIK UNTUK CETAK (PRINT)
      </button>
      <style>{`@media print { .no-print { display: none; } }`}</style>
    </div>
  );
};
