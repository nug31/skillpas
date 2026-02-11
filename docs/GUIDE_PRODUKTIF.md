# Panduan Penggunaan Skill Passport (Guru Produktif)

Guru Produktif adalah **penguji utama** kompetensi teknis siswa di jurusan masing-masing. Anda bertanggung jawab memverifikasi pendaftaran sertifikasi, menilai ujian praktik, dan memastikan skor kompetensi siswa tercatat dengan akurat.

---

## 1. Cara Login
1. Buka halaman website **Skill Passport**.
2. Masukkan **Username** dan **Password** akun Guru Produktif Anda.
3. Klik tombol **Masuk Sistem**.
4. Setelah berhasil login, Anda akan melihat Dashboard utama dengan label peran **Guru Produktif**.

> **Daftar Akun Default:**

| Jurusan | Username | Password |
|---------|----------|----------|
| Teknik Mesin | `prod_mesin` | `123` |
| TKR | `prod_tkr` | `123` |
| TSM | `prod_tsm` | `123` |
| Elektronika Industri | `prod_elind` | `123` |
| Teknik Listrik | `prod_listrik` | `123` |
| Teknik Kimia Industri | `prod_kimia` | `123` |
| Akuntansi | `prod_akuntansi` | `123` |
| Perhotelan | `prod_hotel` | `123` |

> ⚠️ **Penting:** Segera ganti password default setelah login pertama kali.

---

## 2. Dashboard Utama

Setelah login, Dashboard menampilkan:

- **Nama & Peran**: Identitas Anda dengan label "Guru Produktif".
- **Overview**: Jumlah total jurusan dan siswa terdaftar.
- **Tombol Verifikasi Sertifikasi**: Tombol utama Anda, dengan **badge angka merah** yang menunjukkan jumlah pengajuan yang menunggu review.
- **Kartu Jurusan**: Klik untuk melihat detail siswa di jurusan Anda.

---

## 3. Verifikasi Sertifikasi (Fitur Utama)

Ini adalah tugas inti Guru Produktif. Klik tombol **"Verifikasi Sertifikasi"** di Dashboard.

### Tab 1: Pengajuan (Review Pendaftaran)

Halaman ini menampilkan semua pendaftaran sertifikasi siswa di jurusan Anda yang berstatus **"Menunggu Guru Produktif"**.

#### Cara Review Satu per Satu:
1. Klik tombol **"Review Pengajuan"** pada kartu siswa.
2. Modal akan menampilkan **detail kriteria kompetensi** yang dipilih siswa.
3. Anda bisa menambahkan **Catatan untuk Siswa** di kolom yang tersedia.
4. Pilih aksi:
   - ✅ **Setujui** → Status berubah menjadi "Menunggu HOD" untuk dijadwalkan ujian.
   - ❌ **Tolak** → Wajib memberikan catatan alasan penolakan.

#### Cara Batch Approval (Setujui Massal):
1. Centang **checkbox** di pojok kiri atas setiap kartu siswa yang ingin disetujui.
2. Pada **bar aksi** yang muncul di bawah layar, Anda akan melihat jumlah terpilih.
3. Klik **"Setujui Batch"** untuk menyetujui semuanya sekaligus.

> 💡 **Tips:** Gunakan batch approval saat banyak siswa mendaftar di periode yang sama untuk menghemat waktu.

---

### Tab 2: Penilaian Ujian (Input Nilai)

Setelah ujian dilaksanakan, Guru Produktif bertanggung jawab menginput nilai:

1. Klik tab **"Penilaian Ujian"** di halaman Verifikasi Sertifikasi.
2. Daftar siswa yang sudah **terjadwal ujian** akan muncul.
3. Pilih siswa, lalu klik **"Input Nilai Ujian"**.
4. Pada modal penilaian:
   - Masukkan **Skor** hasil ujian.
   - Pilih hasil: **Lulus** atau **Tidak Lulus**.
   - Tambahkan **Catatan Penilaian** jika diperlukan.
5. Klik **Konfirmasi** untuk menyimpan.

**Dampak penilaian:**
- ✅ **Lulus**: XP siswa bertambah, level badge bisa naik, riwayat tercatat di passport.
- ❌ **Tidak Lulus**: Siswa dapat mendaftar ulang di periode berikutnya.

---

## 4. Pengelolaan Data Siswa

Klik kartu jurusan Anda di Dashboard untuk masuk ke halaman detail jurusan.

### Edit Skor Kompetensi
Guru Produktif bisa langsung mengedit skor komptensi siswa di tabel *Daftar Siswa per Level*:
1. Cari siswa di tabel.
2. Klik kolom **Skor** dan masukkan nilai baru (0–100).
3. Level badge otomatis menyesuaikan sesuai skor.

### Edit Data & Kehadiran Siswa
1. Klik nama siswa di tabel untuk membuka **Modal Detail Siswa**.
2. Klik tombol **"Edit Data & Hadir"** (ikon pensil).
3. Anda bisa memperbarui:
   - **Nama** dan **Kelas** siswa.
   - **Foto profil** siswa (upload, maks 200KB).
4. Klik **Simpan** untuk menyimpan perubahan.

### Edit Kriteria Level Skill
Guru Produktif memiliki hak untuk mengedit standar kriteria kompetensi:
1. Di halaman detail jurusan, scroll ke bagian **Level Skill**.
2. Klik ikon **pensil (Edit)** pada level yang ingin diubah.
3. Masukkan/perbarui unit kompetensi sesuai kurikulum terbaru.
4. Simpan perubahan.

---

## 5. Fitur Tambahan

### Kirim Pesan WhatsApp
Pada kartu siswa yang sudah terjadwal ujian, terdapat tombol **"Pesan WA"**. Klik untuk mengirimkan pesan notifikasi jadwal ujian ke siswa via WhatsApp.

### Student Race & Leaderboard
Lihat peringkat siswa secara visual di bagian **Student Race** dalam halaman detail jurusan. Fitur ini menunjukkan perbandingan skor antar siswa dalam bentuk animasi balapan.

### Import & Hapus Data Massal
- **Import Siswa**: Upload file Excel/CSV untuk menambahkan siswa baru secara massal.
- **Hapus Semua**: Menghapus seluruh data siswa di jurusan (gunakan dengan sangat hati-hati!).

---

## 6. Alur Kerja Guru Produktif

```
┌─────────────────────────────┐
│  Login sebagai Guru         │
│  Produktif                  │
└────────┬────────────────────┘
         ▼
┌─────────────────────────────┐
│  Cek Badge Pengajuan        │
│  di Dashboard               │
└────────┬────────────────────┘
         ▼
┌─────────────────────────────┐
│  Klik "Verifikasi           │
│  Sertifikasi"               │
└────────┬────────────────────┘
         ▼
┌─────────────────────────────┐
│  Review & Setujui/Tolak     │
│  (Satu per satu / Batch)    │
└────────┬────────────────────┘
         ▼
┌─────────────────────────────┐
│  Menunggu Persetujuan HOD   │
│  & Penjadwalan Ujian        │
└────────┬────────────────────┘
         ▼
┌─────────────────────────────┐
│  Laksanakan Ujian           │
│  Kompetensi                 │
└────────┬────────────────────┘
         ▼
┌─────────────────────────────┐
│  Input Nilai di Tab         │
│  "Penilaian Ujian"          │
└────────┬────────────────────┘
         ▼
┌─────────────────────────────┐
│  Skor & Level Siswa         │
│  Terupdate Otomatis 🎉      │
└─────────────────────────────┘
```

---

## 7. FAQ Guru Produktif

**Q: Siswa yang saya setujui tidak muncul di Tab Penilaian Ujian?**
A: Pendaftaran harus disetujui oleh HOD terlebih dahulu dan dijadwalkan ujian. Setelah HOD menetapkan tanggal, siswa akan muncul di tab Penilaian Ujian.

**Q: Apakah saya bisa melihat siswa dari jurusan lain?**
A: Tidak. Guru Produktif hanya melihat dan mengelola siswa di jurusan yang sama (sesuai `jurusan_id` akun Anda).

**Q: Bagaimana jika saya salah menolak pendaftaran siswa?**
A: Siswa dapat mendaftar ulang setelah pendaftaran ditolak. Pastikan selalu memberikan catatan alasan penolakan yang jelas.

---
*Pastikan setiap penilaian kompetensi dilakukan secara objektif dan terstandar sesuai kriteria industri.*
