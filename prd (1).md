# PRD: Web App Organisasi Mahasiswa (KM-HSS)

| | |
|---|---|
| **Organisasi** | Kerukunan Mahasiswa Hulu Sungai Selatan wilayah Malang (KM-HSS) |
| **Versi** | 0.2 (disepakati untuk v1) |
| **Tanggal** | 25 November 2026 |
| **Stack** | Next.js (App Router), TypeScript, Supabase, Vercel |
| **Status** | Siap Bangun (v1) |

---

## 1. Ringkasan

Web app resmi organisasi mahasiswa yang bisa diakses publik untuk menampilkan profil organisasi, berita kegiatan, struktur keanggotaan, serta foto dan biodata anggota. Admin dengan email terdaftar mendapat akses ke control panel untuk mengelola seluruh konten tersebut.

## 2. Tujuan dan Non-Tujuan

### Tujuan
- Menjadi wajah digital organisasi: profil, tujuan, dan fokus utama mudah ditemukan.
- Mempublikasikan berita dan dokumentasi kegiatan secara rutin.
- Menampilkan struktur dan anggota organisasi secara jelas.
- Memudahkan admin memperbarui konten tanpa menyentuh kode.
- Berjalan di tier gratis (Supabase + Vercel) untuk tahap awal.

### Non-Tujuan (versi 1)
- Pendaftaran anggota online atau sistem keanggotaan dengan login publik.
- Komentar, forum, atau fitur sosial.
- Sistem keuangan, absensi, atau manajemen acara.
- Multi-bahasa.

## 3. Pengguna

| Peran | Deskripsi | Akses |
|---|---|---|
| **Pengunjung** | Siapa saja (mahasiswa, calon anggota, dosen, mitra) | Baca semua halaman publik, tanpa login |
| **Admin** | Pengurus yang emailnya terdaftar | Semua akses pengunjung + control panel `/admin` |

**[ASUMSI]** Versi 1 hanya punya satu peran admin dengan hak yang sama. Pemisahan peran (mis. editor berita vs pengelola anggota) bisa ditambahkan nanti.

## 4. Fitur

### 4.1 Halaman Publik

| Halaman | Rute | Isi |
|---|---|---|
| Beranda | `/` | Hero, ringkasan profil, berita terbaru, sorotan struktur |
| Profil Organisasi | `/tentang` | Nama, logo, deskripsi, visi, misi, tujuan, fokus utama |
| Berita | `/berita` | Daftar berita terbit (terbaru dulu), paginasi |
| Detail Berita | `/berita/[slug]` | Judul, tanggal, gambar sampul, isi, metadata SEO |
| Struktur Keanggotaan | `/struktur` | Hierarki pengurus inti dan divisi |
| Anggota | `/anggota` | Grid anggota: foto, nama, jabatan, divisi |
| Detail Anggota | `/anggota/[id]` | Foto, nama, jabatan, divisi, bio singkat, sosmed (opsional) |

### 4.2 Autentikasi dan Control Panel Admin

- Login di `/admin/login` menggunakan **Supabase Auth** dengan metode **Email + Password**.
- Hanya email yang ada di tabel `admins` yang dianggap admin. Email lain yang berhasil login tetap tidak bisa membuka `/admin` maupun mengubah data.
- Modul control panel:

| Modul | Rute | Kemampuan |
|---|---|---|
| Dashboard | `/admin` | Ringkasan jumlah berita, anggota, draft |
| Profil Organisasi | `/admin/profil` | Edit nama, logo, deskripsi, visi, misi, tujuan, fokus utama, sosmed organisasi, banner pengumuman (aktif/nonaktif) |
| Berita | `/admin/berita` | Buat, edit, hapus, simpan draft, terbitkan, pilih kategori, tandai sorotan (carousel), unggah gambar sampul |
| Divisi | `/admin/divisi` | Tambah, edit, hapus, atur urutan |
| Anggota | `/admin/anggota` | Tambah, edit, hapus, unggah foto, atur jabatan, status pengurus inti, divisi, urutan tampil |
| Admin | `/admin/pengguna` | Tambah (buat akun) atau hapus akses email admin |

## 5. Alur Pengguna Utama

1. **Pengunjung membaca berita:** Beranda → Berita → Detail Berita.
2. **Pengunjung melihat struktur:** Struktur → klik anggota → Detail Anggota.
3. **Admin menerbitkan berita:** Login → `/admin/berita` → Buat baru → isi konten dan gambar → Terbitkan → muncul di situs publik.
4. **Admin menambah anggota:** Login → `/admin/anggota` → Tambah → isi biodata, unggah foto, pilih divisi dan jabatan → Simpan.
5. **Email tidak terdaftar mencoba masuk:** Ditolak dan diarahkan keluar dari `/admin`.

## 6. Model Data (v1)

**`organization_profile`** (satu baris)
`id`, `name`, `logo_url`, `description`, `vision`, `mission`, `goals`, `main_focus`, `social_links` (JSONB), `announcement_enabled` (boolean), `announcement_text`, `announcement_url`, `updated_at`

**`posts`**
`id`, `title`, `slug` (unik), `category` (`kegiatan` | `pengumuman` | `prestasi` | `divisi`), `excerpt`, `content` (teks polos/paragraf), `cover_image_url`, `is_featured` (boolean, untuk sorotan carousel), `status` (`draft` | `published`), `published_at`, `created_at`, `updated_at`, `author_email`

**`divisions`**
`id`, `name`, `description`, `sort_order`

**`members`**
`id`, `full_name`, `position`, `is_core` (boolean, penanda pengurus inti), `division_id` (nullable, FK), `photo_url`, `bio`, `social_links` (JSONB, opsional), `sort_order`, `is_active`, `created_at`, `updated_at`

**`admins`**
`email` (PK, huruf kecil), `created_at`

Versi 1 hanya menampilkan pengurus aktif satu periode. Jika riwayat per periode diperlukan di masa depan, tabel `periods` dan kolom `period_id` pada `members` dapat ditambahkan di v2.

## 7. Keamanan dan Privasi

- **Tiga lapis proteksi admin:**
  1. Middleware Next.js: redirect jika tidak ada sesi.
  2. Server Component/Server Action: validasi email ada di `admins` sebelum membaca atau menulis.
  3. **Row Level Security (RLS)** Supabase: lapis utama.
- **Kebijakan RLS:**
  - Publik: `SELECT` hanya pada `posts` berstatus `published`, serta `members`, `divisions`, `organization_profile`.
  - Tulis (`INSERT`/`UPDATE`/`DELETE`): hanya untuk email di `admins`.
  - Tabel `admins` tidak dapat dibaca publik.
- **Storage:** bucket publik untuk baca; upload dan hapus hanya admin. Batasi tipe file (JPG/PNG/WebP) dan ukuran (mis. maks 2 MB).
- `SUPABASE_SERVICE_ROLE_KEY` tidak boleh dipakai di sisi klien dan tidak boleh diawali `NEXT_PUBLIC_`.
- **Privasi biodata:** hanya tampilkan data yang disetujui anggota (nama, foto, jabatan, bio singkat). Nomor HP dan alamat **tidak** ditampilkan publik. Sediakan cara bagi anggota meminta data dihapus atau diubah.
- Sanitasi konten berita sebelum dirender untuk mencegah XSS.

## 8. Kebutuhan Non-Fungsional

| Aspek | Target |
|---|---|
| Performa | Halaman publik memakai Server Components dengan caching/revalidate; LCP < 2,5 dtk pada koneksi seluler normal |
| Gambar | `next/image` dengan optimasi, ukuran unggahan dibatasi |
| SEO | Metadata dinamis per berita, Open Graph, `sitemap.xml`, `robots.txt` |
| Responsif | Mobile-first, nyaman di ponsel (mayoritas pengguna mahasiswa) |
| Aksesibilitas | Teks alternatif gambar, kontras memadai, navigasi keyboard |
| Ketersediaan | Mengikuti SLA tier gratis Vercel dan Supabase |

## 9. Arsitektur Teknis

- **Frontend/Backend:** Next.js App Router + TypeScript. Server Actions atau Route Handlers untuk operasi admin.
- **Database dan Auth:** Supabase (PostgreSQL, Auth, Storage) dengan `@supabase/ssr`.
- **Styling:** **[ASUMSI]** Tailwind CSS (opsional shadcn/ui untuk komponen admin).
- **Validasi:** **[ASUMSI]** Zod untuk validasi input form.
- **Deploy:** Vercel, terhubung ke repository Git. Environment variable diatur di dashboard Vercel.
- **Lingkungan:** minimal `development` dan `production`. **[ASUMSI]** Gunakan satu proyek Supabase dulu, pisahkan staging jika dibutuhkan.

Struktur folder (usulan):

```
src/
  app/
    (public)/        # beranda, tentang, berita, struktur, anggota
    admin/           # login + control panel
  components/
  lib/
    supabase/        # client server/browser, middleware helper
    validations/
  types/
middleware.ts
supabase/
  migrations/        # SQL skema + kebijakan RLS
```

## 10. Rencana Rilis

| Fase | Cakupan |
|---|---|
| **0. Setup** | Repo, proyek Supabase, skema tabel + RLS, deploy kerangka ke Vercel |
| **1. Auth dan Admin dasar** | Login email + password, tabel `admins`, middleware, layout admin |
| **2. Konten inti** | CRUD profil organisasi, divisi, anggota (dengan upload foto) |
| **3. Berita** | CRUD berita, draft/terbit, gambar sampul |
| **4. Halaman publik** | Semua halaman publik, SEO, responsif |
| **5. Finalisasi** | Pengujian RLS, aksesibilitas, domain, konten awal, serah terima |

## 11. Kriteria Keberhasilan

- Admin dapat menerbitkan berita baru dalam kurang dari 5 menit tanpa bantuan developer.
- Pengguna tanpa email admin tidak dapat membaca draft maupun mengubah data (terverifikasi lewat pengujian RLS).
- Semua halaman publik dapat dibuka di ponsel tanpa login.
- Skor Lighthouse performa dan SEO ≥ 90 pada halaman publik utama.

## 12. Risiko

| Risiko | Mitigasi |
|---|---|
| Konfigurasi RLS salah sehingga data bocor | Uji dengan akun non-admin; tulis kebijakan di migrasi SQL yang direview |
| Pergantian kepengurusan, admin lama masih punya akses | Halaman kelola admin; prosedur cabut akses tiap periode |
| Batas tier gratis (storage, bandwidth, project pause pada Supabase gratis jika tidak aktif) | Kompres gambar, pantau penggunaan, siapkan rencana upgrade |
| Data pribadi anggota tampil tanpa persetujuan | Tampilkan data minimal, minta persetujuan anggota |

## 13. Keputusan yang Disepakati (v1)

1. **Struktur:** Daftar hierarki (Pengurus Inti + per Divisi).
2. **Periode:** Hanya menampilkan pengurus aktif saat ini.
3. **Editor berita:** Teks polos/paragraf + 1 gambar sampul.
4. **Kategori & Sorotan:** Kategori berita (*Kegiatan, Pengumuman, Prestasi, Kegiatan Divisi*) dan penanda "Sorotan" carousel dapat dipilih admin melalui control panel.
5. **Banner Pengumuman & Sosmed:** Disertakan di v1 dan dapat dikontrol dari `/admin/profil`.
6. **Login:** Email + Password via Supabase Auth.
7. **Identitas visual:** Nama resmi **Kerukunan Mahasiswa Hulu Sungai Selatan wilayah Malang (KM-HSS)**; logo menyusul (menggunakan placeholder sementara).
