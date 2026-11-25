# Desain UI: Web App Organisasi Mahasiswa (KM-HSS)

| | |
|---|---|
| **Organisasi** | Kerukunan Mahasiswa Hulu Sungai Selatan wilayah Malang (KM-HSS) |
| **Versi** | 0.2 (disepakati untuk v1) |
| **Tanggal** | 25 November 2026 |
| **Referensi** | Tata letak portal berita (screenshot TribunNews) |
| **Dokumen terkait** | `prd (1).md` |

> Referensi dipakai untuk **pola tata letak** saja (header, carousel berita utama, daftar berita samping, navigasi kategori). Logo, warna, tipografi, dan iklan **tidak** ditiru. Identitas visual mengikuti organisasi sendiri (logo resmi menyusul, sementara memakai placeholder inisial KM-HSS).

---

## 1. Arah Desain

Gaya **portal berita yang padat informasi namun rapi**: konten terbaru langsung terlihat di atas lipatan layar, dengan satu area utama yang berganti otomatis menampilkan kegiatan terkini.

Prinsip:
1. **Berita dulu.** Pengunjung langsung melihat kegiatan terbaru begitu halaman terbuka.
2. **Hierarki jelas.** Satu berita utama besar, beberapa berita pendukung kecil.
3. **Tanpa iklan.** Ruang yang di referensi dipakai iklan diganti info organisasi (pengumuman, ajakan bergabung, jadwal).
4. **Mobile-first.** Mayoritas pengunjung mahasiswa membuka lewat ponsel.

## 2. Analisis Referensi

| Elemen di referensi | Diadaptasi menjadi |
|---|---|
| Header: logo kiri, tanggal, kolom cari, ikon sosmed, ikon akun | Logo organisasi, kolom cari berita, ikon sosmed organisasi. Ikon akun hanya menuju `/admin/login` (kecil, tidak mencolok) |
| Banner iklan lebar di atas | **Dihapus.** Opsional diganti banner pengumuman (mis. open recruitment) yang bisa dimatikan admin |
| Baris kanal/program (Pendidikan GO, Techno, Video, ...) | Baris **kategori berita** yang bisa digeser: Semua, Kegiatan, Pengumuman, Prestasi, Kegiatan Divisi |
| Baris kota (Jakarta, Bandung, ...) | Menu navigasi utama: Beranda, Tentang, Berita, Struktur, Anggota |
| Blok atas berisi slider (dengan titik indikator) + daftar berita dengan thumbnail dan panah naik/turun | **Hero carousel** + **daftar berita terbaru** (lihat bagian 4) |
| Berita utama: label kategori merah, judul besar tebal, foto besar di kanan | **Kartu berita utama** dengan pola yang sama |
| Kolom iklan kiri dan kanan | Dihapus. Diganti sidebar: Pengumuman, Berita Populer/Terbaru |

## 3. Sitemap dan Halaman

| Halaman | Rute |
|---|---|
| Beranda | `/` |
| Tentang | `/tentang` |
| Berita | `/berita` |
| Detail Berita | `/berita/[slug]` |
| Struktur | `/struktur` |
| Anggota | `/anggota` |
| Detail Anggota | `/anggota/[id]` |
| Login Admin | `/admin/login` |
| Control Panel | `/admin/*` |

## 4. Beranda (Halaman Utama)

### 4.1 Urutan Bagian dari Atas ke Bawah

1. **Header** (sticky)
2. **Bar kategori** (chip yang bisa digeser)
3. **Area Berita Utama** (inti desain, bagian 4.2)
4. **Berita Terbaru** (grid kartu)
5. **Profil Singkat** (visi, tujuan, fokus utama + tombol "Selengkapnya")
6. **Struktur Singkat** (Ketua, Wakil, Sekretaris, Bendahara + tautan ke struktur lengkap)
7. **Footer**

### 4.2 Area Berita Utama (Hero)

Terinspirasi blok atas referensi: satu area besar yang menampilkan kegiatan secara bergantian.

**Layout desktop (≥1024 px)** dalam grid 12 kolom:

```
+----------------------------------------+----------------------+
|                                        |  Berita Terbaru      |
|   HERO CAROUSEL (8 kolom)              |  [thumb] Judul 1     |
|   foto besar + overlay gradient        |  [thumb] Judul 2     |
|   label kategori                       |  [thumb] Judul 3     |
|   judul besar                          |  [thumb] Judul 4     |
|   tanggal + tombol "Baca"              |  (4 kolom)           |
|   o  o  [o]  o  o   < >                |                      |
+----------------------------------------+----------------------+
```

**Layout mobile (<768 px):** carousel penuh lebar di atas (rasio 16:9), daftar berita terbaru di bawahnya sebagai daftar vertikal.

**Perilaku carousel:**
- Menampilkan hingga **5 berita** dengan status terbit. Admin dapat menandai berita sebagai **"Sorotan"** (`is_featured`) melalui control panel untuk menentukan isi carousel; jika belum ada yang ditandai, otomatis memakai 5 berita terbit terbaru.
- **Ganti otomatis** tiap 6 detik, transisi fade atau slide 400 ms.
- **Jeda** saat kursor di atas carousel, saat fokus keyboard di dalamnya, atau saat tab tidak aktif.
- **Kontrol:** panah kiri/kanan, titik indikator yang bisa diklik, geser (swipe) di ponsel.
- Menghormati `prefers-reduced-motion`: bila aktif, tidak ada ganti otomatis dan transisi dimatikan.
- Tiap slide: foto sampul, label kategori, judul (maks 2 baris di mobile, 3 di desktop), tanggal, dan seluruh slide dapat diklik menuju detail berita.
- Gambar slide pertama dimuat prioritas (`priority` pada `next/image`) agar LCP cepat; slide lain dimuat malas.

**Daftar Berita Terbaru (samping):**
- Empat item: thumbnail persegi kecil + judul (maks 3 baris) + tanggal.
- Item yang sedang tampil di carousel diberi penanda aktif. **[ASUMSI]** Klik item mengganti slide carousel, tidak langsung pindah halaman. Alternatif: langsung menuju detail berita.

### 4.3 Berita Terbaru (Grid)
- Desktop 3 kolom, tablet 2 kolom, mobile 1 kolom.
- Kartu: gambar (rasio 16:9), label kategori, judul (maks 2 baris), ringkasan (maks 2 baris), tanggal.
- Tombol "Lihat Semua Berita" menuju `/berita`.

## 5. Halaman Lain

### 5.1 `/berita`
Bar kategori sebagai filter, grid kartu berita, paginasi (atau "Muat lebih banyak"). Kolom cari di header memfilter berdasarkan judul.

### 5.2 `/berita/[slug]`
- Label kategori, judul besar tebal, tanggal terbit, penulis (opsional).
- Gambar sampul lebar, isi artikel dengan lebar baca nyaman (maks ±70 karakter per baris).
- Di bawah: "Berita Lainnya" (3 kartu).
- Tombol bagikan (salin tautan, WhatsApp).

### 5.3 `/tentang`
Logo dan nama, deskripsi, blok **Visi**, **Misi**, **Tujuan**, **Fokus Utama** sebagai kartu atau bagian bergantian kiri-kanan.

### 5.4 `/struktur`
Pengurus inti (`is_core = true`) di baris atas (kartu lebih besar), lalu divisi sebagai bagian terpisah dengan anggotanya dalam daftar hierarki sederhana.

### 5.5 `/anggota`
- Grid kartu: foto persegi (rasio 1:1), nama, jabatan, divisi.
- Filter berdasarkan divisi, kolom cari nama.
- Desktop 4 kolom, tablet 3, mobile 2.

### 5.6 `/anggota/[id]`
Foto besar, nama, jabatan, divisi, bio singkat, tautan sosmed (jika diisi).

## 6. Control Panel Admin

Desain lebih sederhana dan fungsional, terpisah dari tampilan publik.

- **Layout:** sidebar kiri (Dashboard, Profil, Berita, Divisi, Anggota, Admin), area konten di kanan. Di mobile, sidebar menjadi menu hamburger.
- **Dashboard:** kartu ringkasan (jumlah berita terbit, draft, anggota, divisi) dan pintasan "Tulis Berita".
- **Daftar data:** tabel dengan pencarian, status (draft/terbit), tombol edit dan hapus. Hapus selalu meminta konfirmasi.
- **Form:** validasi langsung per kolom, pratinjau gambar sebelum unggah, tombol simpan jelas, notifikasi sukses/gagal (toast).
- **Berita:** tombol "Simpan Draft" dan "Terbitkan", pilihan kategori, penanda "Sorotan" untuk carousel.
- **Login `/admin/login`:** form Email + Password, tombol masuk, pesan netral bila kredensial salah atau email tidak terdaftar sebagai admin.

## 7. Sistem Visual

### 7.1 Warna
Warna final mengikuti identitas organisasi. **[ASUMSI]** Usulan token awal (bisa diganti):

| Token | Fungsi | Contoh |
|---|---|---|
| `--color-primary` | Header, tombol utama, tautan | Biru tua `#0B3D91` |
| `--color-accent` | Label kategori, penanda aktif | Merah `#D62828` |
| `--color-bg` | Latar halaman | `#FFFFFF` |
| `--color-surface` | Kartu, sidebar | `#F5F7FA` |
| `--color-text` | Teks utama | `#1A1A1A` |
| `--color-muted` | Teks sekunder, tanggal | `#6B7280` |
| `--color-border` | Garis pemisah | `#E5E7EB` |

Kontras teks terhadap latar minimal 4,5:1. Mode gelap tidak termasuk versi 1.

### 7.2 Tipografi
- **Judul:** sans-serif tebal (700), tegas seperti judul portal berita. **[ASUMSI]** Gunakan font via `next/font` (mis. Inter atau Plus Jakarta Sans).
- **Isi:** sans-serif reguler, 16 px, tinggi baris 1,6 (artikel 18 px di desktop).
- Skala judul (desktop): H1 40 px, H2 28 px, H3 20 px. Mobile dikurangi sekitar 20%.
- Label kategori: huruf kapital, 12 px, tebal, warna aksen.

### 7.3 Spasi dan Grid
- Kontainer maks 1200 px, rata tengah, padding samping 16 px (mobile) / 24 px (desktop).
- Grid 12 kolom, jarak antarkolom 24 px.
- Skala spasi kelipatan 4 px (4, 8, 12, 16, 24, 32, 48).
- Sudut kartu membulat 8 px, bayangan halus.

### 7.4 Breakpoint

| Nama | Lebar |
|---|---|
| Mobile | < 768 px |
| Tablet | 768 sampai 1023 px |
| Desktop | ≥ 1024 px |

### 7.5 Komponen Utama

| Komponen | Catatan |
|---|---|
| `Header` | Sticky, logo, menu, kolom cari, sosmed; menjadi hamburger di mobile |
| `CategoryBar` | Chip horizontal yang bisa digeser, chip aktif berwarna primer |
| `HeroCarousel` | Lihat bagian 4.2 |
| `NewsListItem` | Thumbnail + judul + tanggal |
| `NewsCard` | Gambar, label, judul, ringkasan, tanggal |
| `MemberCard` | Foto, nama, jabatan, divisi |
| `SectionHeading` | Judul bagian dengan garis aksen di kiri |
| `Footer` | Logo, tautan cepat, sosmed, hak cipta |
| `Pagination` | Nomor halaman atau tombol muat lebih banyak |
| `Toast`, `ConfirmDialog` | Untuk control panel |

## 8. Aksesibilitas

- Carousel memakai `role="region"` dengan `aria-roledescription="carousel"`; tombol kontrol punya label; slide tidak aktif disembunyikan dari pembaca layar.
- Tombol jeda/putar tersedia untuk pengguna yang tidak ingin ganti otomatis.
- Semua gambar punya teks alternatif (judul berita atau nama anggota).
- Fokus keyboard terlihat jelas; urutan tab logis.
- Area sentuh minimal 44×44 px di ponsel.

## 9. Performa Tampilan

- `next/image` dengan ukuran responsif dan format modern (WebP/AVIF).
- Hanya gambar slide pertama yang prioritas; lainnya lazy.
- Reservasi ruang (rasio tetap) untuk gambar agar tidak terjadi layout shift.
- Skeleton loading untuk daftar berita dan grid anggota.

## 10. Keadaan Khusus (States)

| Situasi | Tampilan |
|---|---|
| Belum ada berita | Pesan ramah "Belum ada kegiatan" + ilustrasi sederhana; carousel disembunyikan |
| Berita hanya 1 | Carousel tampil statis tanpa panah dan titik |
| Gambar sampul tidak ada | Placeholder dengan logo organisasi |
| Foto anggota tidak ada | Avatar inisial nama |
| Pencarian tanpa hasil | Pesan "Tidak ditemukan" + saran kata kunci lain |
| Halaman tidak ada | Halaman 404 dengan tautan ke beranda |
| Gagal memuat data | Pesan galat singkat + tombol coba lagi |

## 11. Status Keputusan Desain (v1)

1. **Warna dan logo:** menggunakan palet awal (`#0B3D91` & `#D62828`) dan placeholder logo KM-HSS; logo resmi menyusul dan dapat diunggah melalui `/admin/profil`.
2. **Isi carousel:** dipilih admin lewat penanda "Sorotan" (`is_featured`), dengan fallback 5 berita terbit terbaru.
3. **Banner pengumuman & sosmed:** disertakan di v1 dan dapat diaktifkan/nonaktifkan dari `/admin/profil`.
4. **Kategori berita:** *Kegiatan, Pengumuman, Prestasi, Kegiatan Divisi*.
5. **Mode gelap:** tidak termasuk di versi 1 (mode terang saja).
