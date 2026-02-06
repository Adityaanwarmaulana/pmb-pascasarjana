# 🎓 Sistem Informasi PMB Pascasarjana (Fullstack)

Sistem Penerimaan Mahasiswa Baru (PMB) berbasis web dengan fitur pemisahan akses antara **Admin Pusat**, **Program Studi (Prodi)**, dan **Pendaftar**.

## 📌 Prasyarat Sistem
- PHP >= 8.2
- Node.js >= 18
- MySQL / MariaDB
- Composer

## 📂 Struktur Folder
- `/backend`: Laravel 11 (REST API)
- `/frontend`: React JS + Vite + Tailwind CSS

## 🛠️ Fitur Utama
- **Multi-Role Auth:** Login berbeda untuk Admin, Prodi, dan Mahasiswa.
- **Workflow Pendaftaran:**
  1. **Pendaftar:** Isi form & upload dokumen (PDF/JPG).
  2. **Admin:** Verifikasi berkas & input jadwal ujian.
  3. **Prodi:** Input nilai ujian & tentukan kelulusan.
- **Cetak Kartu:** Fitur cetak kartu ujian otomatis bagi pendaftar yang lolos verifikasi.

## ⚙️ Cara Menjalankan (Local)

### 1. Backend (Laravel)
```bash
cd backend
composer install
cp .env.example .env # Sesuaikan DB_DATABASE di file .env
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve

2. Frontend (React)
cd frontend
npm install
npm run dev

Akun Akses Default
Role,Username,Password
Admin,admin,password
Prodi,prodi,password

### 4. Mengenai Deployment (Online)
GitHub hanya menyimpan kode (Repository). Untuk membuatnya **Online (Bisa diakses publik)**, kamu butuh layanan tambahan:

* **Frontend (React):** Bisa dideploy gratis ke **Vercel** atau **Netlify**.
* **Backend (Laravel):** Butuh Hosting/VPS (seperti Niagahoster, DomaiNesia, atau Heroku/Railway).
* **Penting:** Karena ini menggunakan database MySQL, deployment ke layanan gratisan agak rumit. Saya sarankan untuk tahap awal, GitHub digunakan sebagai **Portfolio Kode** saja.

---

### Kesimpulan Akhir
1.  Error `sessions` tadi sudah aman (pakai driver `file`).
2.  Dashboard Prodi sudah memisahkan tugas input nilai.
3.  Dashboard Pendaftar sudah bisa cetak kartu dengan rapi.
4.  GitHub sudah siap diisi dengan instruksi README di atas.
