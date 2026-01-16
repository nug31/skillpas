-- ===================================================================
-- Migration: Seed level_skill_jurusan with FULL criteria data
-- Data from actual school curriculum (8 jurusan)
-- Uses subqueries to find actual UUIDs from jurusan and level_skill tables
-- Run this in Supabase SQL Editor
-- ===================================================================

-- First, clear existing data to avoid duplicates
DELETE FROM level_skill_jurusan;

-- ===================================================================
-- TEKNIK KENDARAAN RINGAN / TKR
-- ===================================================================
INSERT INTO level_skill_jurusan (jurusan_id, level_id, hasil_belajar, soft_skill)
SELECT 
    (SELECT id FROM jurusan WHERE nama_jurusan ILIKE '%Kendaraan Ringan%' OR nama_jurusan ILIKE '%TKR%' LIMIT 1),
    (SELECT id FROM level_skill WHERE urutan = 1 LIMIT 1),
    '[
  "Mampu Menerapkan Keselamatan dan kesehatan kerja (K3)",
  "Mampu Membaca Gambar Teknik",
  "Mampu Menghitung rumus dasar kelistrikan",
  "Mampu Menghitung Daya Mesin, Ratio Kompresi dan Volume Silinder",
  "Mampu Menghitung Hukum Pascal",
  "Mampu Menggunakan Handtool",
  "Mampu Menggunakan Alat Ukur (Jangka Sorong, Micrometer, Multimeter analog dan Digital, dan Dial Indicator)",
  "Mampu Menggunakan Kunci Momen dan Pressure Gauge",
  "Mampu Menggunakan Dongkrak dan Jackstand",
  "Mampu Melakukan pemeriksaan baterai dan pemeliharaan baterai",
  "Mampu Menerapkan budaya Industri (SCW, KYT, Kaizen, MSDS, Pengangkatan manual)",
  "Mampu Menggunakan Workshop Equipment (Carlift, Baterai Charger, Impact, Airgun)",
  "Mampu membaca manual perbaikan dan diagram kelistrikan",
  "Mampu melakukan perawatan berkala 10.000 KM"
]',
    'Kebersihan area kerja';

INSERT INTO level_skill_jurusan (jurusan_id, level_id, hasil_belajar, soft_skill)
SELECT 
    (SELECT id FROM jurusan WHERE nama_jurusan ILIKE '%Kendaraan Ringan%' OR nama_jurusan ILIKE '%TKR%' LIMIT 1),
    (SELECT id FROM level_skill WHERE urutan = 2 LIMIT 1),
    '[
  "**Engine**\n1. Mampu Memelihara/Servis Sistem Pendingin\n2. Mampu Memelihara/Servis Sistem Pelumasan\n3. Mampu Melepas/Servis kepala silinder beserta katup\n4. Mampu Memelihara/servis sistem bahan bakar injeksi diesel\n5. Mampu Memelihara/servis sistem bahan bakar injeksi bensin\n6. Mampu Memelihara/Servis Engine Management System",
  "**Electrical**\n1. Mampu Mekerjakan, memasang, dan mengecek pada kelistrikan body\n2. Mampu Memelihara/Servis Sistem Starter\n3. Mampu Memelihara/Servis Sistem Pengisian",
  "**Chassis**\n1. Mampu Memelihara/servis sistem pengereman\n2. Mampu Melakukan penyetelan silau\n3. Mampu Memelihara/servis Transmisi Manual\n4. Mampu Memelihara/servis Sistem Transfer/Transaxle Otomatis\n5. Mampu Memelihara/servis sistem kopling manual\n6. Mampu Memelihara/servis sistem kemudi\n7. Mampu Memelihara/servis suspensi depan dan belakang\n8. Mampu Memelihara/servis sistem AC"
]',
    'Kerja tim bengkel';

INSERT INTO level_skill_jurusan (jurusan_id, level_id, hasil_belajar, soft_skill)
SELECT 
    (SELECT id FROM jurusan WHERE nama_jurusan ILIKE '%Kendaraan Ringan%' OR nama_jurusan ILIKE '%TKR%' LIMIT 1),
    (SELECT id FROM level_skill WHERE urutan = 3 LIMIT 1),
    '[
  "**Engine**\n1. Terampil melakukan perawatan 30.000 KM\n2. Terampil melakukan perawatan 40.000 KM\n3. Terampil Memelihara/Servis Sistem Kelengkapan\n4. Terampil Memelihara/Servis sistem bahan bakar injeksi\n5. Terampil Memelihara/Servis sistem turbo",
  "**Electrical**\n1. Terampil melakukan perakitan sistem pelumasan\n2. Terampil Mengecek sensor Baterai\n3. Terampil Memelihara/Servis sistem AC",
  "**Chassis**\n1. Terampil merawat sistem roda\n2. Terampil Overhaul Master\n3. Terampil Spooring\n4. Terampil Overhaul Kopling\n5. Terampil Memelihara Transmisi Manual",
  "**Autobody and Polishing**\nTerampil dalam perbaikan bodi dan polishing"
]',
    'Kerjasama tim';

INSERT INTO level_skill_jurusan (jurusan_id, level_id, hasil_belajar, soft_skill)
SELECT 
    (SELECT id FROM jurusan WHERE nama_jurusan ILIKE '%Kendaraan Ringan%' OR nama_jurusan ILIKE '%TKR%' LIMIT 1),
    (SELECT id FROM level_skill WHERE urutan = 4 LIMIT 1),
    '[
  "**Engine**\n1. Mahir Overhaul Engine",
  "**Body**\n1. Mahir Overhaul Transmisi manual\n2. Mahir Overhaul Transmisi Otomatis",
  "**Electrical**\n1. Mahir Diagnosis Immobilizer pada sensor dan ECU\n2. Mampu engine analyzer scanning",
  "**Autobody and Polishing**\n1. Mahir Melakukan Overhaul AC\n2. Mahir Melakukan Polishing\n3. Terampil Mengidentifikasi Komponen Bodi yang korosif"
]',
    'Analisis kerusakan';

INSERT INTO level_skill_jurusan (jurusan_id, level_id, hasil_belajar, soft_skill)
SELECT 
    (SELECT id FROM jurusan WHERE nama_jurusan ILIKE '%Kendaraan Ringan%' OR nama_jurusan ILIKE '%TKR%' LIMIT 1),
    (SELECT id FROM level_skill WHERE urutan = 5 LIMIT 1),
    '[
  "Menjadi Mentor atau sertifikasi yang ditujukan pada salah satu spesialisasinya",
  "Mentoring/membantu Input 500% pada salah satu modul",
  "Menjalankan 2 atau lebih spesialisasi pada tingkat Advanced"
]',
    'Mentoring teknis';

-- ===================================================================
-- TEKNIK KIMIA INDUSTRI / TKI
-- ===================================================================
INSERT INTO level_skill_jurusan (jurusan_id, level_id, hasil_belajar, soft_skill)
SELECT 
    (SELECT id FROM jurusan WHERE nama_jurusan ILIKE '%Kimia%' LIMIT 1),
    (SELECT id FROM level_skill WHERE urutan = 1 LIMIT 1),
    '[
  "Mampu Menerapkan standar Keselamatan dan Kesehatan Kerja (K3)",
  "Mampu Menangani Limbah Bahan Berbahaya Beracun (B3)",
  "Mampu Menerapkan 5R di Laboratorium",
  "Mampu Membaca Formulasi dan Bahan Baku (Raw Material)",
  "Mampu Menghitung Presentase dan Konversi Pada Formulasi Cat",
  "Mampu Menggunakan Alat Ukur Timbangan (Digital Analytical Balance)",
  "Mampu Melakukan Titrasi Sederhana",
  "Mampu Melakukan Pengenceran Larutan",
  "Mampu Melakukan Analisis Reaksi Kimia",
  "Mampu Menggunakan Alat - Alat Kimia Dasar"
]',
    'Kerapihan lab';

INSERT INTO level_skill_jurusan (jurusan_id, level_id, hasil_belajar, soft_skill)
SELECT 
    (SELECT id FROM jurusan WHERE nama_jurusan ILIKE '%Kimia%' LIMIT 1),
    (SELECT id FROM level_skill WHERE urutan = 2 LIMIT 1),
    '[
  "**Paint Applicator**\n1. Mampu Menjelaskan Mekanisme Korosi\n2. Mampu Melakukan Persiapan Permukaan\n3. Mampu Membaca Technical Data Sheet (TDS) Suatu Produk Cat\n4. Mampu Melakukan Teknik Aplikasi Pengecatan (Kuas, Roller dan Alat Spray)",
  "**Lab Technician**\n1. Mampu Melakukan Proses Pembuatan Produk Cat\n2. Mampu Melakukan Pengujian Cat Basah (Visko, Density/Specific Gravity, Fineness Grind)\n3. Mampu Membuat Panel Uji\n4. Mampu Melakukan Pengujian Cat Kering (Gloss, Color Match)"
]',
    'Akurasi';

INSERT INTO level_skill_jurusan (jurusan_id, level_id, hasil_belajar, soft_skill)
SELECT 
    (SELECT id FROM jurusan WHERE nama_jurusan ILIKE '%Kimia%' LIMIT 1),
    (SELECT id FROM level_skill WHERE urutan = 3 LIMIT 1),
    '[
  "**Paint Applicator**\n1. Terampil Menganalisa Technical Data Sheet (TDS)\n2. Terampil Memahami Persiapan Permukaan Sesuai Standar SSPC/NACE\n3. Terampil Melakukan Pengecekan Kondisi Lingkungan\n4. Terampil Melakukan Teknik Aplikasi Pengecatan\n5. Terampil Mengetahui Jenis Paint Defects",
  "**Lab Technician**\n1. Terampil Melakukan Formulasi Sederhana\n2. Terampil Melakukan Uji Kekentalan (Visko)\n3. Terampil Melakukan Gloss & Color Test\n4. Terampil Melakukan Uji Daya Rekat (Adhesion Test)\n5. Terampil Melakukan Uji Kekerasan (Hardness Test)"
]',
    'Berpikir kritis';

INSERT INTO level_skill_jurusan (jurusan_id, level_id, hasil_belajar, soft_skill)
SELECT 
    (SELECT id FROM jurusan WHERE nama_jurusan ILIKE '%Kimia%' LIMIT 1),
    (SELECT id FROM level_skill WHERE urutan = 4 LIMIT 1),
    '[
  "**Paint Applicator**\n1. Mahir Mengoperasikan Sistem Kompressor\n2. Mahir Menggunakan Semua Jenis Alat Aplikasi Pengecatan",
  "**Lab Technician**\n1. Mahir Membuat Formulasi Cat dan Proses Pembuatan Cat Baru\n2. Mahir Membuat Technical Data Sheet (TDS) Suatu Produk"
]',
    'Analisis sistem';

INSERT INTO level_skill_jurusan (jurusan_id, level_id, hasil_belajar, soft_skill)
SELECT 
    (SELECT id FROM jurusan WHERE nama_jurusan ILIKE '%Kimia%' LIMIT 1),
    (SELECT id FROM level_skill WHERE urutan = 5 LIMIT 1),
    '[
  "Menjadi Mentor Bagi Teman Lainnya Selama Minimal 6 Bulan",
  "Inovasi Pengembangan Produk Green Eco Paint"
]',
    'Keberlanjutan/Sustainability';

-- ===================================================================
-- TEKNIK MESIN
-- ===================================================================
INSERT INTO level_skill_jurusan (jurusan_id, level_id, hasil_belajar, soft_skill)
SELECT 
    (SELECT id FROM jurusan WHERE nama_jurusan ILIKE '%Mesin%' AND nama_jurusan NOT ILIKE '%Sepeda%' AND nama_jurusan NOT ILIKE '%Kendaraan%' LIMIT 1),
    (SELECT id FROM level_skill WHERE urutan = 1 LIMIT 1),
    '[
  "K3 dan Budaya Kerja",
  "Menggunakan Alat Ukur Presisi (Mikrometer, Jangka Sorong, dan Height Gauge)",
  "Menggunakan Perkakas Tangan (Praktek Kerja Bangku)",
  "Gambar Teknik 2D menggunakan Software AutoCAD",
  "Melakukan Pengelasan 1F dan 2F SMAW",
  "Melakukan Proses Pemesinan Dasar (Bubut dan Frais)",
  "Membuat Program Dasar-dasar CNC Turning"
]',
    'Kedisiplinan bengkel';

INSERT INTO level_skill_jurusan (jurusan_id, level_id, hasil_belajar, soft_skill)
SELECT 
    (SELECT id FROM jurusan WHERE nama_jurusan ILIKE '%Mesin%' AND nama_jurusan NOT ILIKE '%Sepeda%' AND nama_jurusan NOT ILIKE '%Kendaraan%' LIMIT 1),
    (SELECT id FROM level_skill WHERE urutan = 2 LIMIT 1),
    '[
  "**Pengelasan**\n1. Melakukan pengelasan 3F sampai 1G SMAW",
  "**CAD/CAM**\n1. Membuat CAM turning dan milling menggunakan software Inventor dan Mastercam\n2. Menggunakan software CAD dalam pembuatan benda kerja 3D",
  "**Pemesinan Konvensional**\n1. Melakukan proses pembubutan (ulir, pembubutan dalam, dan pembubutan profil tertentu)\n2. Melakukan proses pengefraisan (roda gigi lurus)\n3. Mengasah alat potong bubut dan frais"
]',
    'Ketelitian kerja';

INSERT INTO level_skill_jurusan (jurusan_id, level_id, hasil_belajar, soft_skill)
SELECT 
    (SELECT id FROM jurusan WHERE nama_jurusan ILIKE '%Mesin%' AND nama_jurusan NOT ILIKE '%Sepeda%' AND nama_jurusan NOT ILIKE '%Kendaraan%' LIMIT 1),
    (SELECT id FROM level_skill WHERE urutan = 3 LIMIT 1),
    '[
  "**Pengelasan**\n1. Melakukan pengelasan 2G sampai 4G SMAW",
  "**CAD/CAM**\n1. Membuat program CAM satu operasi\n2. Merancang benda sederhana (assembly 3D)",
  "**Pemesinan Konvensional**\n1. Melakukan pembuatan attachment (lathe dog, tapper, steady rest, dan follow rest)\n2. Melakukan pengefraisan dengan dividing head dan rotary table"
]',
    'Penyelesaian masalah teknis';

INSERT INTO level_skill_jurusan (jurusan_id, level_id, hasil_belajar, soft_skill)
SELECT 
    (SELECT id FROM jurusan WHERE nama_jurusan ILIKE '%Mesin%' AND nama_jurusan NOT ILIKE '%Sepeda%' AND nama_jurusan NOT ILIKE '%Kendaraan%' LIMIT 1),
    (SELECT id FROM level_skill WHERE urutan = 4 LIMIT 1),
    '[
  "**Pengelasan**\n1. Melakukan pengelasan 2G sampai 6G FCAW",
  "**CAD/CAM**\n1. Membuat program CAM dua operasi\n2. Merancang benda detail (assembly 3D)",
  "**Pemesinan Konvensional**\n1. Melakukan proses pembuatan benda kerja suaian (fitting) dan toleransi khusus\n2. Melakukan proses pengefraisan macam-macam roda gigi"
]',
    'Kepemimpinan teknis';

INSERT INTO level_skill_jurusan (jurusan_id, level_id, hasil_belajar, soft_skill)
SELECT 
    (SELECT id FROM jurusan WHERE nama_jurusan ILIKE '%Mesin%' AND nama_jurusan NOT ILIKE '%Sepeda%' AND nama_jurusan NOT ILIKE '%Kendaraan%' LIMIT 1),
    (SELECT id FROM level_skill WHERE urutan = 5 LIMIT 1),
    '[
  "**Pengelasan**\n1. Melakukan pengelasan 1F sampai 4G TIG",
  "**CAD/CAM**\n1. Membuat program CAM tiga sampai empat operasi\n2. Merancang benda kompleks (assembly 3D)",
  "**Pemesinan Konvensional**\n1. Melakukan proses pembubutan poros eksentrik menggunakan independent chuck\n2. Membuat benda kerja rakitan"
]',
    'Inovasi teknis';

-- ===================================================================
-- TEKNIK SEPEDA MOTOR / TSM
-- ===================================================================
INSERT INTO level_skill_jurusan (jurusan_id, level_id, hasil_belajar, soft_skill)
SELECT 
    (SELECT id FROM jurusan WHERE nama_jurusan ILIKE '%Sepeda Motor%' OR nama_jurusan ILIKE '%TSM%' LIMIT 1),
    (SELECT id FROM level_skill WHERE urutan = 1 LIMIT 1),
    '[
  "Menerapkan K3 Saat Praktek",
  "Menerapkan 5R saat Praktek (Baik Sebelum, Saat, Maupun Sesudah)",
  "Memahami Hand Tools (Baik nama, cara penggunaan, dan perawatannya)",
  "Memahami Spesial Service Tools (Baik nama, cara penggunaan, dan perawatannya)",
  "Memahami Power Tools (Baik nama, cara penggunaan, dan perawatannya)",
  "Memahami jenis-jenis Mur dan baut",
  "Memahami jenis-jenis pelumas (Spesifikasi maupun fungsi)",
  "Memahami cara kerja mesin dengan pembakaran dalam baik 2 tak maupun 4 tak",
  "Mampu mendeskripsikan komponen mesin pembakaran dalam baik 2 tak maupun 4 tak beserta fungsinya",
  "Memahami komponen Sasis sepeda motor (Cara kerja maupun fungsinya)",
  "Memahami komponen maupun sistem kelistrikan sepeda motor (Cara kerja maupun fungsinya)"
]',
    'Etika kerja';

INSERT INTO level_skill_jurusan (jurusan_id, level_id, hasil_belajar, soft_skill)
SELECT 
    (SELECT id FROM jurusan WHERE nama_jurusan ILIKE '%Sepeda Motor%' OR nama_jurusan ILIKE '%TSM%' LIMIT 1),
    (SELECT id FROM level_skill WHERE urutan = 2 LIMIT 1),
    '[
  "Melakukan perawatan pada komponen sasis sepeda motor",
  "Melakukan perawatan pada komponen mesin sepeda motor",
  "Melakukan perawatan pada kelistrikan sepeda motor"
]',
    'Komunikasi pelanggan';

INSERT INTO level_skill_jurusan (jurusan_id, level_id, hasil_belajar, soft_skill)
SELECT 
    (SELECT id FROM jurusan WHERE nama_jurusan ILIKE '%Sepeda Motor%' OR nama_jurusan ILIKE '%TSM%' LIMIT 1),
    (SELECT id FROM level_skill WHERE urutan = 3 LIMIT 1),
    '[
  "**Service Motor Honda**\nMelakukan Tune-up rutin sepeda motor (setel klep & rantai).\n* Menggunakan Diagnostic Tools (Scanner) untuk cek dasar.\n* Melakukan servis sistem transmisi CVT (Matic) & rantai (Manual).",
  "**Body Painting**\nMempelajari teknik pengecatan bodi motor, pengolahan warna, penggunaan alat pengecatan, dan kontrol kualitas hasil cat."
]',
    'Ketekunan mendalam';

INSERT INTO level_skill_jurusan (jurusan_id, level_id, hasil_belajar, soft_skill)
SELECT 
    (SELECT id FROM jurusan WHERE nama_jurusan ILIKE '%Sepeda Motor%' OR nama_jurusan ILIKE '%TSM%' LIMIT 1),
    (SELECT id FROM level_skill WHERE urutan = 4 LIMIT 1),
    '[
  "Melakukan diagnosis/troubleshooting pada mesin sepeda motor",
  "Melakukan diagnosis/troubleshooting pada komponen sasis sepeda motor",
  "Melakukan diagnosis/troubleshooting pada komponen kelistrikan pada sepeda motor"
]',
    'Kreativitas teknis';

INSERT INTO level_skill_jurusan (jurusan_id, level_id, hasil_belajar, soft_skill)
SELECT 
    (SELECT id FROM jurusan WHERE nama_jurusan ILIKE '%Sepeda Motor%' OR nama_jurusan ILIKE '%TSM%' LIMIT 1),
    (SELECT id FROM level_skill WHERE urutan = 5 LIMIT 1),
    '[
  "Melakukan overhaul engine pada sepeda motor",
  "Melakukan diagnosis menggunakan digital diagnostic tools",
  "Melakukan diagnosis kerusakan secara visual dan auditory"
]',
    'Mentoring teknis';

-- ===================================================================
-- AKUNTANSI
-- ===================================================================
INSERT INTO level_skill_jurusan (jurusan_id, level_id, hasil_belajar, soft_skill)
SELECT 
    (SELECT id FROM jurusan WHERE nama_jurusan ILIKE '%Akuntansi%' LIMIT 1),
    (SELECT id FROM level_skill WHERE urutan = 1 LIMIT 1),
    '[
  "Mampu membuat surat niaga/bisnis",
  "Mampu berkomunikasi bisnis via email, telepon, dan tatap muka",
  "Mampu melakukan filing dokumen dengan tepat",
  "Mampu input data di Ms. Excel (Spreadsheet) dengan tepat",
  "Mampu mengetik 10 jari dengan tepat dan cepat"
]',
    'Kejujuran/Integritas';

INSERT INTO level_skill_jurusan (jurusan_id, level_id, hasil_belajar, soft_skill)
SELECT 
    (SELECT id FROM jurusan WHERE nama_jurusan ILIKE '%Akuntansi%' LIMIT 1),
    (SELECT id FROM level_skill WHERE urutan = 2 LIMIT 1),
    '[
  "Mampu membuat laporan keuangan perusahaan jasa",
  "Mampu menghitung PPh 21 Orang Pribadi"
]',
    'Ketelitian angka';

INSERT INTO level_skill_jurusan (jurusan_id, level_id, hasil_belajar, soft_skill)
SELECT 
    (SELECT id FROM jurusan WHERE nama_jurusan ILIKE '%Akuntansi%' LIMIT 1),
    (SELECT id FROM level_skill WHERE urutan = 3 LIMIT 1),
    '[
  "**Akuntansi**\nTerampil membuat laporan keuangan perusahaan dagang",
  "**Perpajakan**\nTerampil menghitung, melaporkan, dan melakukan pembayaran pajak penghasilan pungut potong (PPh 22, 23, 24, 26, 4 ayat 2, dan pasal 15)"
]',
    'Analisis data';

INSERT INTO level_skill_jurusan (jurusan_id, level_id, hasil_belajar, soft_skill)
SELECT 
    (SELECT id FROM jurusan WHERE nama_jurusan ILIKE '%Akuntansi%' LIMIT 1),
    (SELECT id FROM level_skill WHERE urutan = 4 LIMIT 1),
    '[
  "**Akuntansi**\nMahir membuat laporan keuangan perusahaan dagang dengan menggunakan komputer akuntansi (MYOB)",
  "**Perpajakan**\nMahir menghitung, melaporkan, dan melakukan pembayaran pajak penghasilan (PPh) badan, PPN."
]',
    'Kepemimpinan strategis';

INSERT INTO level_skill_jurusan (jurusan_id, level_id, hasil_belajar, soft_skill)
SELECT 
    (SELECT id FROM jurusan WHERE nama_jurusan ILIKE '%Akuntansi%' LIMIT 1),
    (SELECT id FROM level_skill WHERE urutan = 5 LIMIT 1),
    '[
  "Menjadi teknisi akuntan yunior",
  "Menjadi tax advisor",
  "Inovasi sistem akuntansi digital"
]',
    'Mentoring keuangan';

-- ===================================================================
-- PERHOTELAN / HOTEL
-- ===================================================================
INSERT INTO level_skill_jurusan (jurusan_id, level_id, hasil_belajar, soft_skill)
SELECT 
    (SELECT id FROM jurusan WHERE nama_jurusan ILIKE '%Hotel%' OR nama_jurusan ILIKE '%Perhotelan%' LIMIT 1),
    (SELECT id FROM level_skill WHERE urutan = 1 LIMIT 1),
    '[
  "Menerapkan standar K3 Industri Perhotelan",
  "Mengidentifikasi jenis industri perhotelan dan jenisnya hotel",
  "Mengistilahkan SOP dasar hotel dan lagu sambutan",
  "**Front Office**\nMenjelaskan prosedur lama secara standar hotel\nMelakukan simulasi check-in/check-out",
  "**Housekeeping**\nMelakukan bed making single bed (standard) dengan waktu 10-12 menit\nMelakukan room make-up procedure dengan waktu 20 menit",
  "**Food and Beverages**\nMenjelaskan berbagai simulasi peralatan makanan\nMelakukan penataan prasmanan"
]',
    'Ramah tamah';

INSERT INTO level_skill_jurusan (jurusan_id, level_id, hasil_belajar, soft_skill)
SELECT 
    (SELECT id FROM jurusan WHERE nama_jurusan ILIKE '%Hotel%' OR nama_jurusan ILIKE '%Perhotelan%' LIMIT 1),
    (SELECT id FROM level_skill WHERE urutan = 2 LIMIT 1),
    '[
  "**Housekeeping**\nMelakukan proses check-in & check-out lengkap\nMenguasai jenis-jenis produk amenities",
  "**Front Office**\nMelakukan bed making queen/king size standar hotel dalam 4 menit\nMelakukan room cleaning",
  "**Food & Beverages (F&B)**\nMembuat breakfast standar hotel\nMembuat coffee latte art basic\nMembuat 10 style napkin"
]',
    'Layanan prima';

INSERT INTO level_skill_jurusan (jurusan_id, level_id, hasil_belajar, soft_skill)
SELECT 
    (SELECT id FROM jurusan WHERE nama_jurusan ILIKE '%Hotel%' OR nama_jurusan ILIKE '%Perhotelan%' LIMIT 1),
    (SELECT id FROM level_skill WHERE urutan = 3 LIMIT 1),
    '[
  "**Housekeeping**\nMenjalankan welcome drink service\nMenguasai semua area public",
  "**Front Office/Laundry**\nMengerjakan alat-alat laundry (washing, drying, folding)\nMengerjakan laundry standar",
  "**Rooms**\nMenangani persediaan standar\nMenguasai housekeeping area public",
  "**Food & Beverages (F&B)**\nMembuat minuman special\nMembuat 20 style napkin"
]',
    'Empati';

INSERT INTO level_skill_jurusan (jurusan_id, level_id, hasil_belajar, soft_skill)
SELECT 
    (SELECT id FROM jurusan WHERE nama_jurusan ILIKE '%Hotel%' OR nama_jurusan ILIKE '%Perhotelan%' LIMIT 1),
    (SELECT id FROM level_skill WHERE urutan = 4 LIMIT 1),
    '[
  "**Front Office (Receptionist)**\nMelakukan proses check-in/check-out secara lancar\nMenangani keluhan tamu (problem-solving)\nMahir menggunakan sistem POS",
  "**Housekeeping**\nMenguasai semua level housekeeping\nMahir mengoperasikan semua peralatan",
  "**Bartender**\nMembuat skill mix drinks\nMahir seni garnish",
  "**Barista**\nPraktek skill barista profesional"
]',
    'Negosiasi';

INSERT INTO level_skill_jurusan (jurusan_id, level_id, hasil_belajar, soft_skill)
SELECT 
    (SELECT id FROM jurusan WHERE nama_jurusan ILIKE '%Hotel%' OR nama_jurusan ILIKE '%Perhotelan%' LIMIT 1),
    (SELECT id FROM level_skill WHERE urutan = 5 LIMIT 1),
    '[
  "**Front Office**\nMenguasai SOP lengkap Front Office\nMenangani keluhan secara profesional\nGuest satisfaction > 100%",
  "**Housekeeping**\nMenguasai semua job level\nRepeat customer > 0%",
  "**Bartender**\nMahir semua teknik bartending\nMenguasai SOP cleaning machine",
  "**Barista**\nMenguasai semua skill barista professional"
]',
    'Kepemimpinan hospitality';

-- ===================================================================
-- TEKNIK ELEKTRONIKA INDUSTRI / ELIND
-- ===================================================================
INSERT INTO level_skill_jurusan (jurusan_id, level_id, hasil_belajar, soft_skill)
SELECT 
    (SELECT id FROM jurusan WHERE nama_jurusan ILIKE '%Elektronika%' OR nama_jurusan ILIKE '%Elind%' LIMIT 1),
    (SELECT id FROM level_skill WHERE urutan = 1 LIMIT 1),
    '[
  "Peserta didik mampu mengukur tegangan, Arus AC/DC dan membaca hasil pengukuran multimeter analog dan digital dengan akurat",
  "Peserta didik mampu menggambar rangkaian elektronika secara manual dengan simbol standar, koneksi benar, penamaan komponen tepat, serta hasil gambar rapi, terbaca, dan bebas kesalahan koneksi.",
  "Peserta didik mampu memahami konsep dasar pemrograman mikrokontroler serta menulis, mengunggah, dan menjalankan program sederhana yang mengolah input dan output dengan logika benar hingga menghasilkan minimal satu proyek fungsional.",
  "Peserta didik mampu menerapkan K3 secara konsisten serta melakukan soldering dan desoldering komponen dengan hasil rapi, aman, memenuhi standar kualitas, tidak merusak PCB, dan rangkaian berfungsi dengan baik"
]',
    'Fokus detail';

INSERT INTO level_skill_jurusan (jurusan_id, level_id, hasil_belajar, soft_skill)
SELECT 
    (SELECT id FROM jurusan WHERE nama_jurusan ILIKE '%Elektronika%' OR nama_jurusan ILIKE '%Elind%' LIMIT 1),
    (SELECT id FROM level_skill WHERE urutan = 2 LIMIT 1),
    '[
  "Peserta didik mampu memilih alat ukur yang tepat, melakukan pengukuran tegangan dan arus AC/DC pada rangkaian aktif, menganalisis hasil pengukuran, serta mengidentifikasi ketidaksesuaian nilai terhadap spesifikasi rangkaian",
  "Peserta didik mampu menggambar rangkaian elektronika menggunakan aplikasi dengan simbol standar, koneksi benar, penamaan komponen tepat, serta hasil gambar rapi, terbaca, dan bebas kesalahan koneksi.",
  "Peserta didik mampu mengembangkan program mikrokontroler dengan logika kondisi, input-output lebih dari satu, serta melakukan debugging sederhana hingga sistem bekerja stabil sesuai tujuan.",
  "Peserta didik mampu melakukan soldering dan desoldering secara presisi pada rangkaian kerja, termasuk perbaikan kesalahan pemasangan komponen dengan tetap menerapkan K3 dan menjaga kualitas PCB"
]',
    'Kesabaran tinggi';

INSERT INTO level_skill_jurusan (jurusan_id, level_id, hasil_belajar, soft_skill)
SELECT 
    (SELECT id FROM jurusan WHERE nama_jurusan ILIKE '%Elektronika%' OR nama_jurusan ILIKE '%Elind%' LIMIT 1),
    (SELECT id FROM level_skill WHERE urutan = 3 LIMIT 1),
    '[
  "**IOT**\nMempelajari sistem otomatis berbasis internet seperti smart home dan industri 4.0. Siswa belajar merancang, memprogram, dan menghubungkan perangkat ke jaringan.",
  "**Robotik**\nBelajar merakit dan memprogram robot untuk kebutuhan industri. Siswa dilatih menggunakan sensor, aktuator, dan mikrokontroler.",
  "**PLC**\nMempelajari pengendalian mesin otomatis menggunakan PLC yang banyak digunakan di pabrik modern untuk sistem produksi dan keamanan"
]',
    'Analisis sistem';

INSERT INTO level_skill_jurusan (jurusan_id, level_id, hasil_belajar, soft_skill)
SELECT 
    (SELECT id FROM jurusan WHERE nama_jurusan ILIKE '%Elektronika%' OR nama_jurusan ILIKE '%Elind%' LIMIT 1),
    (SELECT id FROM level_skill WHERE urutan = 4 LIMIT 1),
    '[
  "Menganalisis dan mengoptimasi sistem"
]',
    'Visi teknologi';

INSERT INTO level_skill_jurusan (jurusan_id, level_id, hasil_belajar, soft_skill)
SELECT 
    (SELECT id FROM jurusan WHERE nama_jurusan ILIKE '%Elektronika%' OR nama_jurusan ILIKE '%Elind%' LIMIT 1),
    (SELECT id FROM level_skill WHERE urutan = 5 LIMIT 1),
    '[
  "Ahli dan inovator di bidangnya"
]',
    'Mentoring otomasi';

-- ===================================================================
-- TEKNIK INSTALASI TENAGA LISTRIK
-- ===================================================================
INSERT INTO level_skill_jurusan (jurusan_id, level_id, hasil_belajar, soft_skill)
SELECT 
    (SELECT id FROM jurusan WHERE nama_jurusan ILIKE '%Listrik%' OR nama_jurusan ILIKE '%TITL%' LIMIT 1),
    (SELECT id FROM level_skill WHERE urutan = 1 LIMIT 1),
    '[
  "K3 & Budaya Kerja",
  "Perkakas Tangan (Hand Tools) Manual dan Bertenaga",
  "Alat Ukur (Measuring) Mekanik dan Listrik",
  "Rangkaian Dasar Kelistrikan (Dasar Listrik dan Elektronika)",
  "Gambar Teknik berbasis software (Visio dan AutoCAD)",
  "Teknik digital",
  "Terminasi & Penyekunan Kabel (Crimping)"
]',
    'Kesadaran bahaya';

INSERT INTO level_skill_jurusan (jurusan_id, level_id, hasil_belajar, soft_skill)
SELECT 
    (SELECT id FROM jurusan WHERE nama_jurusan ILIKE '%Listrik%' OR nama_jurusan ILIKE '%TITL%' LIMIT 1),
    (SELECT id FROM level_skill WHERE urutan = 2 LIMIT 1),
    '[
  "**Instalasi penerangan 1 fasa**\nPemasangan instalasi penerangan 1 fasa berbasis smart building (sensor PIR, Photocell, Timer digital dan smart switch)",
  "**Instalasi kendali motor listrik**\nPemasangan Instalasi Motor Listrik Star Delta Berbasis Kontaktor Magnet (Konvensional)"
]',
    'Prosedur keselamatan';

INSERT INTO level_skill_jurusan (jurusan_id, level_id, hasil_belajar, soft_skill)
SELECT 
    (SELECT id FROM jurusan WHERE nama_jurusan ILIKE '%Listrik%' OR nama_jurusan ILIKE '%TITL%' LIMIT 1),
    (SELECT id FROM level_skill WHERE urutan = 3 LIMIT 1),
    '[
  "**Instalasi listrik penerangan 3 fasa**\nMemasang dan menguji instalasi listrik gedung industri dengan sistem 3 fasa yang aman dan efisien.",
  "**Instalasi PLC HMI berbasis VSD**\nMengendalikan dan memonitor sistem otomatis industri menggunakan PLC, HMI, dan pengatur kecepatan motor (VSD)."
]',
    'Tanggung jawab';

INSERT INTO level_skill_jurusan (jurusan_id, level_id, hasil_belajar, soft_skill)
SELECT 
    (SELECT id FROM jurusan WHERE nama_jurusan ILIKE '%Listrik%' OR nama_jurusan ILIKE '%TITL%' LIMIT 1),
    (SELECT id FROM level_skill WHERE urutan = 4 LIMIT 1),
    '[
  "**Fault finding pada rangkaian penerangan 3 fasa**\nMenyelesaikan gangguan (Short circuit, Overload, atau Open circuit) menggunakan wiring diagram dan alat ukur.",
  "**Integrasi Sistem & Komunikasi Data (Industrial IoT Dasar)**\nMenampilkan data monitoring jarak jauh (Remote Monitoring) sederhana (bisa via Web Server PLC atau aplikasi IoT di Smartphone)"
]',
    'Pengambilan keputusan';

INSERT INTO level_skill_jurusan (jurusan_id, level_id, hasil_belajar, soft_skill)
SELECT 
    (SELECT id FROM jurusan WHERE nama_jurusan ILIKE '%Listrik%' OR nama_jurusan ILIKE '%TITL%' LIMIT 1),
    (SELECT id FROM level_skill WHERE urutan = 5 LIMIT 1),
    '[
  "**Inovasi Smart Building/ Factory & IoT (Internet of Things)**\nMerancang dan mengimplementasikan sistem Otomasi Gedung (Building Automation) atau industri yang dapat dikontrol jarak jauh, hemat energi, dan berbasis data."
]',
    'Inovasi energi';

-- ===================================================================
-- DONE! All 8 Jurusan Complete. Verify the data
-- ===================================================================
SELECT 
    lsj.jurusan_id,
    j.nama_jurusan,
    ls.nama_level,
    LEFT(lsj.hasil_belajar, 80) as criteria_preview,
    lsj.soft_skill
FROM level_skill_jurusan lsj
JOIN jurusan j ON j.id = lsj.jurusan_id
JOIN level_skill ls ON ls.id = lsj.level_id
ORDER BY j.nama_jurusan, ls.urutan;
