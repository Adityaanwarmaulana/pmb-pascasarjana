import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  GraduationCap,
  FileText,
  Image,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const FormPendaftaran = () => {
  const [formData, setFormData] = useState({
    jenjang: "S2",
    prodi: "",
    pendidikan_terakhir: "",
    dokumen_pdf: null,
    foto_jpg: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

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
      alert("Pendaftaran berhasil dikirim! Menuju dashboard status...");
      navigate("/pendaftar/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Gagal mengirim data. Pastikan format file PDF (<2MB) dan foto JPG/PNG.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-2xl w-full bg-white shadow-xl rounded-3xl border border-slate-200/80 p-8 md:p-10 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-12 h-12 bg-gradient-to-tr from-amber-600 to-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20 shrink-0">
            <GraduationCap size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Formulir Pendaftaran Pascasarjana
            </h2>
            <p className="text-slate-500 text-sm mt-0.5">
              Lengkapi informasi akademik dan unggah dokumen persyaratan
              seleksi.
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-2xl flex items-center gap-3 text-sm">
            <AlertCircle size={18} className="text-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                Jenjang Pendidikan
              </label>
              <select
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                value={formData.jenjang}
                onChange={(e) =>
                  setFormData({ ...formData, jenjang: e.target.value })
                }
              >
                <option value="S2">Magister (S2)</option>
                <option value="S3">Doktor (S3)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                Program Studi Pilihan
              </label>
              <input
                type="text"
                placeholder="Contoh: Magister Ilmu Komputer"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                value={formData.prodi}
                onChange={(e) =>
                  setFormData({ ...formData, prodi: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Pendidikan Terakhir (Asal Kampus & Jurusan)
            </label>
            <input
              type="text"
              placeholder="Contoh: S1 Teknik Informatika - Universitas Indonesia"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
              value={formData.pendidikan_terakhir}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  pendidikan_terakhir: e.target.value,
                })
              }
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2">
              {/* DI-PERBAIKI: Menghapus 'block' dan menggunakan 'flex' saja */}
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                <FileText size={14} className="text-amber-600" /> Berkas
                Ijazah/Transkrip (PDF)
              </label>
              <input
                type="file"
                accept=".pdf"
                className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 cursor-pointer"
                onChange={(e) =>
                  setFormData({ ...formData, dokumen_pdf: e.target.files[0] })
                }
                required
              />
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2">
              {/* DI-PERBAIKI: Menghapus 'block' dan menggunakan 'flex' saja */}
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                <Image size={14} className="text-amber-600" /> Pas Foto Formal
                (JPG/PNG)
              </label>
              <input
                type="file"
                accept="image/*"
                className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 cursor-pointer"
                onChange={(e) =>
                  setFormData({ ...formData, foto_jpg: e.target.files[0] })
                }
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-orange-500/20 transition-all transform active:scale-95 flex items-center justify-center gap-2 text-sm mt-4"
          >
            {isLoading ? "Mengirim Berkas..." : "Kirim Berkas Pendaftaran"}{" "}
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormPendaftaran;
