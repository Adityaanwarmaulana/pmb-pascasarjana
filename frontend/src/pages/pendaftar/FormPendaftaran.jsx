import React, { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const FormPendaftaran = () => {
  const [formData, setFormData] = useState({
    jenjang: "S2",
    prodi: "",
    pendidikan_terakhir: "",
    dokumen_pdf: null,
    foto_jpg: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("jenjang", formData.jenjang);
    data.append("prodi", formData.prodi);
    data.append("pendidikan_terakhir", formData.pendidikan_terakhir);
    data.append("dokumen_pdf", formData.dokumen_pdf);
    data.append("foto_jpg", formData.foto_jpg);

    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_URL}/pendaftaran`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Berhasil Daftar!");
    } catch (err) {
      alert("Gagal mengirim data. Cek kembali format file Anda.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white shadow-xl rounded-2xl border-t-8 border-primary-dark">
      <h2 className="text-2xl font-bold text-primary-dark mb-6">
        Formulir Pendaftaran Pascasarjana
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Jenjang Pendidikan
          </label>
          <select
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-light outline-none"
            onChange={(e) =>
              setFormData({ ...formData, jenjang: e.target.value })
            }
          >
            <option value="S2">Magister (S2)</option>
            <option value="S3">Doktor (S3)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Program Studi
          </label>
          <input
            type="text"
            placeholder="Masukkan Prodi Tujuan"
            className="w-full p-3 border rounded-lg"
            onChange={(e) =>
              setFormData({ ...formData, prodi: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Pendidikan Terakhir
          </label>
          <input
            type="text"
            placeholder="Contoh: S1 Teknik Informatika"
            className="w-full p-3 border rounded-lg"
            onChange={(e) =>
              setFormData({ ...formData, pendidikan_terakhir: e.target.value })
            }
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Ijazah/Berkas (PDF)
            </label>
            <input
              type="file"
              accept=".pdf"
              className="text-sm"
              onChange={(e) =>
                setFormData({ ...formData, dokumen_pdf: e.target.files[0] })
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Pas Foto (JPG)
            </label>
            <input
              type="file"
              accept="image/*"
              className="text-sm"
              onChange={(e) =>
                setFormData({ ...formData, foto_jpg: e.target.files[0] })
              }
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-primary-dark text-white font-bold py-3 rounded-xl hover:bg-green-900 transition-all shadow-lg"
        >
          Kirim Pendaftaran
        </button>
      </form>
    </div>
  );
};

export default FormPendaftaran;
