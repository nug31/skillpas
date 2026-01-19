import type { Jurusan, LevelSkill, Siswa, SkillSiswa, StudentListItem, CompetencyHistory } from '../types';

// Minimal mock data to use while developing locally (VITE_USE_MOCK=true)

export const LEVEL_IDS = {
  BASIC1: 'b0000000-0000-0000-0000-000000000001',
  BASIC2: 'b0000000-0000-0000-0000-000000000005', // New level
  INTER: 'b0000000-0000-0000-0000-000000000002',
  ADV: 'b0000000-0000-0000-0000-000000000003',
  MASTER: 'b0000000-0000-0000-0000-000000000004',
};

export const mockLevels: LevelSkill[] = [
  { id: LEVEL_IDS.BASIC1, nama_level: 'Beginner 1 (Internal Prep)', urutan: 1, min_skor: 0, max_skor: 25, badge_name: 'Basic 1', badge_color: '#94a3b8', criteria: ['Mengenal konsep dasar', 'Mampu menggunakan tools dasar', 'Memahami alur kerja sederhana'], hasil_belajar: 'Syarat Kelayakan PKL: Memahami dasar industri dan K3', soft_skill: 'Komunikasi dasar', created_at: new Date().toISOString() },
  { id: LEVEL_IDS.BASIC2, nama_level: 'Beginner 2 (Uji Kompetensi)', urutan: 2, min_skor: 26, max_skor: 50, badge_name: 'Basic 2', badge_color: '#64748b', criteria: ['Menerapkan budaya industri', 'Mampu bekerja dalam tim', 'Memahami standar kualitas'], hasil_belajar: 'Lulus Uji Kompetensi Dasar & Siap Praktik Industri', soft_skill: 'Adaptabilitas Industri', created_at: new Date().toISOString() },
  { id: LEVEL_IDS.INTER, nama_level: 'Intermediate (Specialist)', urutan: 3, min_skor: 51, max_skor: 75, badge_name: 'Specialist', badge_color: '#3b82f6', criteria: ['Menguasai teknik menengah', 'Mampu menyelesaikan masalah kompleks', 'Menerapkan standar industri'], hasil_belajar: 'Fokus Spesialisasi: Menguasai kompetensi utama sesuai jurusan', soft_skill: 'Problem solving', created_at: new Date().toISOString() },
  { id: LEVEL_IDS.ADV, nama_level: 'Advanced', urutan: 4, min_skor: 76, max_skor: 89, badge_name: 'Advance', badge_color: '#f59e0b', criteria: ['Analisis sistem mendalam', 'Optimasi performa', 'Memimpin proyek skala kecil'], hasil_belajar: 'Menganalisis dan mengoptimasi sistem', soft_skill: 'Kepemimpinan', created_at: new Date().toISOString() },
  { id: LEVEL_IDS.MASTER, nama_level: 'Mastery (Expert)', urutan: 5, min_skor: 90, max_skor: 100, badge_name: 'Master', badge_color: '#10b981', criteria: ['Expert di bidangnya', 'Inovasi solusi baru', 'Mentoring Advanced member'], hasil_belajar: 'Ahli dan inovator di bidangnya', soft_skill: 'Mentoring', created_at: new Date().toISOString() },
];

export const JURUSAN_IDS = {
  MESIN: '550e8400-e29b-41d4-a716-446655440001',
  TKR: '550e8400-e29b-41d4-a716-446655440002',
  TSM: '550e8400-e29b-41d4-a716-446655440003',
  ELIND: '550e8400-e29b-41d4-a716-446655440004',
  LISTRIK: '550e8400-e29b-41d4-a716-446655440005',
  KIMIA: '550e8400-e29b-41d4-a716-446655440006',
  AKUNTANSI: '550e8400-e29b-41d4-a716-446655440007',
  HOTEL: '550e8400-e29b-41d4-a716-446655440008',
};

export const mockJurusan: Jurusan[] = [
  { id: JURUSAN_IDS.MESIN, nama_jurusan: 'Teknik Mesin', icon: 'Settings', deskripsi: 'Perancangan dan perawatan mesin', created_at: new Date().toISOString() },
  { id: JURUSAN_IDS.TKR, nama_jurusan: 'Teknik Kendaraan Ringan', icon: 'Car', deskripsi: 'Perawatan kendaraan ringan', created_at: new Date().toISOString() },
  { id: JURUSAN_IDS.TSM, nama_jurusan: 'Teknik Sepeda Motor', icon: 'Bike', deskripsi: 'Perbaikan sepeda motor', created_at: new Date().toISOString() },
  { id: JURUSAN_IDS.ELIND, nama_jurusan: 'Teknik Elektronika Industri', icon: 'Cpu', deskripsi: 'Elektronika & otomasi', created_at: new Date().toISOString() },
  { id: JURUSAN_IDS.LISTRIK, nama_jurusan: 'Teknik Instalasi Tenaga Listrik', icon: 'Zap', deskripsi: 'Instalasi kelistrikan', created_at: new Date().toISOString() },
  { id: JURUSAN_IDS.KIMIA, nama_jurusan: 'Teknik Kimia Industri', icon: 'FlaskConical', deskripsi: 'Proses produksi kimia', created_at: new Date().toISOString() },
  { id: JURUSAN_IDS.AKUNTANSI, nama_jurusan: 'Akuntansi', icon: 'Calculator', deskripsi: 'Pencatatan keuangan', created_at: new Date().toISOString() },
  { id: JURUSAN_IDS.HOTEL, nama_jurusan: 'Perhotelan', icon: 'Hotel', deskripsi: 'Layanan & manajemen hotel', created_at: new Date().toISOString() },
];

// Class pools (by jurusan id) — used for generating random 'kelas' values for mock students
const classPools: Record<string, string[]> = {
  [JURUSAN_IDS.MESIN]: [...Array.from({ length: 2 }, (_, i) => `X MESIN ${i + 1}`), ...Array.from({ length: 2 }, (_, i) => `XI MESIN ${i + 1}`), ...Array.from({ length: 2 }, (_, i) => `XII MESIN ${i + 1}`)],
  [JURUSAN_IDS.TKR]: [...Array.from({ length: 2 }, (_, i) => `X TKR ${i + 1}`), ...Array.from({ length: 2 }, (_, i) => `XI TKR ${i + 1}`), ...Array.from({ length: 2 }, (_, i) => `XII TKR ${i + 1}`)],
  [JURUSAN_IDS.TSM]: [...Array.from({ length: 2 }, (_, i) => `X TSM ${i + 1}`), ...Array.from({ length: 2 }, (_, i) => `XI TSM ${i + 1}`), ...Array.from({ length: 2 }, (_, i) => `XII TSM ${i + 1}`)],
  [JURUSAN_IDS.ELIND]: [...Array.from({ length: 4 }, (_, i) => `X ELIND ${i + 1}`), ...Array.from({ length: 4 }, (_, i) => `XI ELIND ${i + 1}`), ...Array.from({ length: 4 }, (_, i) => `XII ELIND ${i + 1}`)],
  [JURUSAN_IDS.LISTRIK]: [...Array.from({ length: 2 }, (_, i) => `X LISTRIK ${i + 1}`), ...Array.from({ length: 2 }, (_, i) => `XI LISTRIK ${i + 1}`), ...Array.from({ length: 2 }, (_, i) => `XII LISTRIK ${i + 1}`)],
  [JURUSAN_IDS.KIMIA]: [...Array.from({ length: 2 }, (_, i) => `X TKI ${i + 1}`), ...Array.from({ length: 2 }, (_, i) => `XI TKI ${i + 1}`), ...Array.from({ length: 2 }, (_, i) => `XII TKI ${i + 1}`)],
  [JURUSAN_IDS.AKUNTANSI]: [...Array.from({ length: 2 }, (_, i) => `X AK ${i + 1}`), ...Array.from({ length: 2 }, (_, i) => `XI AK ${i + 1}`), ...Array.from({ length: 2 }, (_, i) => `XII AK ${i + 1}`)],
  [JURUSAN_IDS.HOTEL]: [...Array.from({ length: 2 }, (_, i) => `X HOTEL ${i + 1}`), ...Array.from({ length: 2 }, (_, i) => `XI HOTEL ${i + 1}`), ...Array.from({ length: 2 }, (_, i) => `XII HOTEL ${i + 1}`)],
};

function pickRandom<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function klassFor(jurusanId: string) {
  const pool = classPools[jurusanId] || ['X'];
  return pickRandom(pool);
}

// Example students and scores (one score each so UI has a "latest skill" record)
export const mockSiswa: Siswa[] = [
  { id: 's-j1-a', nama: 'Raka Aji', kelas: klassFor(JURUSAN_IDS.MESIN), jurusan_id: JURUSAN_IDS.MESIN, created_at: new Date().toISOString() },
  { id: 's-j1-b', nama: 'Dewi Susanti', kelas: klassFor(JURUSAN_IDS.MESIN), jurusan_id: JURUSAN_IDS.MESIN, created_at: new Date().toISOString() },
  { id: 's-j1-c', nama: 'Budi Santoso', kelas: klassFor(JURUSAN_IDS.MESIN), jurusan_id: JURUSAN_IDS.MESIN, created_at: new Date().toISOString() },
  { id: 's-j1-d', nama: 'Siti Nurhayati', kelas: klassFor(JURUSAN_IDS.MESIN), jurusan_id: JURUSAN_IDS.MESIN, created_at: new Date().toISOString() },

  { id: 's-j2-a', nama: 'Agus Rahman', kelas: klassFor(JURUSAN_IDS.TKR), jurusan_id: JURUSAN_IDS.TKR, created_at: new Date().toISOString() },
  { id: 's-j2-b', nama: 'Intan Maharani', kelas: klassFor(JURUSAN_IDS.TKR), jurusan_id: JURUSAN_IDS.TKR, created_at: new Date().toISOString() },
  { id: 's-j2-c', nama: 'Fikri Hidayat', kelas: klassFor(JURUSAN_IDS.TKR), jurusan_id: JURUSAN_IDS.TKR, created_at: new Date().toISOString() },
  { id: 's-j2-d', nama: 'Maya Putri', kelas: klassFor(JURUSAN_IDS.TKR), jurusan_id: JURUSAN_IDS.TKR, created_at: new Date().toISOString() },

  { id: 's-j3-a', nama: 'Rizky Pratama', kelas: klassFor(JURUSAN_IDS.TSM), jurusan_id: JURUSAN_IDS.TSM, created_at: new Date().toISOString() },
  { id: 's-j3-b', nama: 'Yulia Sari', kelas: klassFor(JURUSAN_IDS.TSM), jurusan_id: JURUSAN_IDS.TSM, created_at: new Date().toISOString() },
  { id: 's-j3-c', nama: 'Deni Prasetyo', kelas: klassFor(JURUSAN_IDS.TSM), jurusan_id: JURUSAN_IDS.TSM, created_at: new Date().toISOString() },
  { id: 's-j3-d', nama: 'Rina Kurnia', kelas: klassFor(JURUSAN_IDS.TSM), jurusan_id: JURUSAN_IDS.TSM, created_at: new Date().toISOString() },

  { id: 's-j4-a', nama: 'Hendra Wijaya', kelas: klassFor(JURUSAN_IDS.ELIND), jurusan_id: JURUSAN_IDS.ELIND, created_at: new Date().toISOString() },
  { id: 's-j4-b', nama: 'Siska Lestari', kelas: klassFor(JURUSAN_IDS.ELIND), jurusan_id: JURUSAN_IDS.ELIND, created_at: new Date().toISOString() },
  { id: 's-j4-c', nama: 'Gilang Pradipta', kelas: klassFor(JURUSAN_IDS.ELIND), jurusan_id: JURUSAN_IDS.ELIND, created_at: new Date().toISOString() },
  { id: 's-j4-d', nama: 'Nadia Amelia', kelas: klassFor(JURUSAN_IDS.ELIND), jurusan_id: JURUSAN_IDS.ELIND, created_at: new Date().toISOString() },

  { id: 's-j5-a', nama: 'Taufik Hidayat', kelas: klassFor(JURUSAN_IDS.LISTRIK), jurusan_id: JURUSAN_IDS.LISTRIK, created_at: new Date().toISOString() },
  { id: 's-j5-b', nama: 'Lia Ramadhani', kelas: klassFor(JURUSAN_IDS.LISTRIK), jurusan_id: JURUSAN_IDS.LISTRIK, created_at: new Date().toISOString() },
  { id: 's-j5-c', nama: 'Wahyu Kurnia', kelas: klassFor(JURUSAN_IDS.LISTRIK), jurusan_id: JURUSAN_IDS.LISTRIK, created_at: new Date().toISOString() },
  { id: 's-j5-d', nama: 'Rahayu Indah', kelas: klassFor(JURUSAN_IDS.LISTRIK), jurusan_id: JURUSAN_IDS.LISTRIK, created_at: new Date().toISOString() },

  { id: 's-j6-a', nama: 'Arif Maulana', kelas: klassFor(JURUSAN_IDS.KIMIA), jurusan_id: JURUSAN_IDS.KIMIA, created_at: new Date().toISOString() },
  { id: 's-j6-b', nama: 'Putri Ananda', kelas: klassFor(JURUSAN_IDS.KIMIA), jurusan_id: JURUSAN_IDS.KIMIA, created_at: new Date().toISOString() },
  { id: 's-j6-c', nama: 'Hendra Saputra', kelas: klassFor(JURUSAN_IDS.KIMIA), jurusan_id: JURUSAN_IDS.KIMIA, created_at: new Date().toISOString() },
  { id: 's-j6-d', nama: 'Megawati', kelas: klassFor(JURUSAN_IDS.KIMIA), jurusan_id: JURUSAN_IDS.KIMIA, created_at: new Date().toISOString() },

  { id: 's-j7-a', nama: 'Daniel Pratama', kelas: klassFor(JURUSAN_IDS.AKUNTANSI), jurusan_id: JURUSAN_IDS.AKUNTANSI, created_at: new Date().toISOString() },
  { id: 's-j7-b', nama: 'Nur Fadilah', kelas: klassFor(JURUSAN_IDS.AKUNTANSI), jurusan_id: JURUSAN_IDS.AKUNTANSI, created_at: new Date().toISOString() },
  { id: 's-j7-c', nama: 'Rian Setiawan', kelas: klassFor(JURUSAN_IDS.AKUNTANSI), jurusan_id: JURUSAN_IDS.AKUNTANSI, created_at: new Date().toISOString() },
  { id: 's-j7-d', nama: 'Sari Melati', kelas: klassFor(JURUSAN_IDS.AKUNTANSI), jurusan_id: JURUSAN_IDS.AKUNTANSI, created_at: new Date().toISOString() },

  { id: 's-j8-a', nama: 'Kevin Alexander', kelas: klassFor(JURUSAN_IDS.HOTEL), jurusan_id: JURUSAN_IDS.HOTEL, created_at: new Date().toISOString() },
  { id: 's-j8-b', nama: 'Mita Sari', kelas: klassFor(JURUSAN_IDS.HOTEL), jurusan_id: JURUSAN_IDS.HOTEL, created_at: new Date().toISOString() },
  { id: 's-j8-c', nama: 'Fajar Prakoso', kelas: klassFor(JURUSAN_IDS.HOTEL), jurusan_id: JURUSAN_IDS.HOTEL, created_at: new Date().toISOString() },
  { id: 's-j8-d', nama: 'Rani Melinda', kelas: klassFor(JURUSAN_IDS.HOTEL), jurusan_id: JURUSAN_IDS.HOTEL, created_at: new Date().toISOString() },
  // --- This matches the username 'siswa_mesin' with name 'Siswa Mesin' in mockUsers.ts ---
  { id: 's-j1-user', nama: 'Siswa Mesin', kelas: 'XII MESIN 1', jurusan_id: JURUSAN_IDS.MESIN, nisn: '12345', wa_number: '628123456789', created_at: new Date().toISOString(), avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', photo_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop' },
  // --- Hero students for other majors ---
  { id: 's-j2-user', nama: 'Siswa TKR', kelas: 'XII TKR 1', jurusan_id: JURUSAN_IDS.TKR, nisn: '22345', wa_number: '628123456790', created_at: new Date().toISOString() },
  { id: 's-j3-user', nama: 'Siswa TSM', kelas: 'XII TSM 1', jurusan_id: JURUSAN_IDS.TSM, nisn: '32345', wa_number: '628123456791', created_at: new Date().toISOString() },
  { id: 's-j4-user', nama: 'Siswa Elind', kelas: 'XII ELIND 1', jurusan_id: JURUSAN_IDS.ELIND, nisn: '42345', wa_number: '628123456792', created_at: new Date().toISOString() },
  { id: 's-j5-user', nama: 'Siswa Listrik', kelas: 'XII LISTRIK 1', jurusan_id: JURUSAN_IDS.LISTRIK, nisn: '52345', wa_number: '628123456793', created_at: new Date().toISOString() },
  { id: 's-j6-user', nama: 'Siswa Kimia', kelas: 'XII TKI 1', jurusan_id: JURUSAN_IDS.KIMIA, nisn: '62345', wa_number: '628123456794', created_at: new Date().toISOString() },
  { id: 's-j7-user', nama: 'Siswa Akuntansi', kelas: 'XII AK 1', jurusan_id: JURUSAN_IDS.AKUNTANSI, nisn: '72345', wa_number: '628123456795', created_at: new Date().toISOString() },
  { id: 's-j8-user', nama: 'Siswa Perhotelan', kelas: 'XII HOTEL 1', jurusan_id: JURUSAN_IDS.HOTEL, nisn: '82345', wa_number: '628123456796', created_at: new Date().toISOString() },
  // --- New Student for 'siswa' login ---
  { id: 's-raka-new', nama: 'Raka Aditya', kelas: 'XII TKR 1', jurusan_id: JURUSAN_IDS.MESIN, nisn: '0012345678', wa_number: '628123456797', created_at: new Date().toISOString(), avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Raka', photo_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop' },
  { id: 's-bayu-sapta', nama: 'Bayu Sapta', kelas: 'XII TKR 3', jurusan_id: JURUSAN_IDS.TKR, nisn: '0083581133', created_at: new Date().toISOString(), avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bayu', photo_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop' },
];

export const mockSkillSiswa: SkillSiswa[] = [
  { id: 'ss-deni', siswa_id: 's-j3-c', level_id: 'lvl-adv', skor: 58, poin: 200, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-rina', siswa_id: 's-j3-d', level_id: 'lvl-inter', skor: 33, poin: 150, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  { id: 'ss-hendra', siswa_id: 's-j4-a', level_id: 'lvl-master', skor: 93, poin: 250, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-siska', siswa_id: 's-j4-b', level_id: 'lvl-master', skor: 77, poin: 250, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-gilang', siswa_id: 's-j4-c', level_id: 'lvl-adv', skor: 54, poin: 200, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-nadia', siswa_id: 's-j4-d', level_id: 'lvl-inter', skor: 29, poin: 150, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  { id: 'ss-taufik', siswa_id: 's-j5-a', level_id: 'lvl-master', skor: 97, poin: 250, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-lia', siswa_id: 's-j5-b', level_id: 'lvl-master', skor: 86, poin: 250, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-wahyu', siswa_id: 's-j5-c', level_id: 'lvl-adv', skor: 69, poin: 200, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-rahayu', siswa_id: 's-j5-d', level_id: 'lvl-adv', skor: 52, poin: 200, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  { id: 'ss-arif', siswa_id: 's-j6-a', level_id: 'lvl-master', skor: 94, poin: 250, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-putri', siswa_id: 's-j6-b', level_id: 'lvl-master', skor: 81, poin: 250, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-hendra2', siswa_id: 's-j6-c', level_id: 'lvl-adv', skor: 65, poin: 200, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-megawati', siswa_id: 's-j6-d', level_id: 'lvl-inter', skor: 38, poin: 150, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  { id: 'ss-daniel', siswa_id: 's-j7-a', level_id: 'lvl-master', skor: 92, poin: 250, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-nur', siswa_id: 's-j7-b', level_id: 'lvl-master', skor: 80, poin: 250, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-rian', siswa_id: 's-j7-c', level_id: 'lvl-adv', skor: 63, poin: 200, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-sari', siswa_id: 's-j7-d', level_id: 'lvl-inter', skor: 49, poin: 150, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  { id: 'ss-kevin', siswa_id: 's-j8-a', level_id: 'lvl-master', skor: 90, poin: 250, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-mita', siswa_id: 's-j8-b', level_id: 'lvl-master', skor: 76, poin: 250, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-fajar', siswa_id: 's-j8-c', level_id: 'lvl-adv', skor: 59, poin: 200, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-rani', siswa_id: 's-j8-d', level_id: 'lvl-inter', skor: 42, poin: 150, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // --- Matching logged-in test user ---
  { id: 'ss-siswa-mesin', siswa_id: 's-j1-user', level_id: 'lvl-adv', skor: 78, poin: 200, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  // --- Skills for other hero students ---
  { id: 'ss-siswa-tkr', siswa_id: 's-j2-user', level_id: 'lvl-adv', skor: 82, poin: 200, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-siswa-tsm', siswa_id: 's-j3-user', level_id: 'lvl-adv', skor: 75, poin: 200, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-siswa-elind', siswa_id: 's-j4-user', level_id: 'lvl-master', skor: 88, poin: 250, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-siswa-listrik', siswa_id: 's-j5-user', level_id: 'lvl-inter', skor: 65, poin: 150, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-siswa-kimia', siswa_id: 's-j6-user', level_id: 'lvl-adv', skor: 70, poin: 200, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-siswa-akuntansi', siswa_id: 's-j7-user', level_id: 'lvl-master', skor: 91, poin: 250, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-siswa-hotel', siswa_id: 's-j8-user', level_id: 'lvl-inter', skor: 60, poin: 150, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  // skill for Raka Aditya
  { id: 'ss-raka-new', siswa_id: 's-raka-new', level_id: 'lvl-adv', skor: 85, poin: 200, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

export const mockCompetencyHistory: CompetencyHistory[] = [
  {
    id: 'h1',
    siswa_id: 's-j1-user',
    level_id: LEVEL_IDS.BASIC1,
    unit_kompetensi: 'K3 Dasar',
    aktivitas_pembuktian: 'Praktik bengkel',
    penilai: 'Guru Produktif',
    hasil: 'Lulus',
    tanggal: '2024-08-12',
    catatan: 'Disiplin baik'
  },
  {
    id: 'h2',
    siswa_id: 's-j1-user',
    level_id: LEVEL_IDS.INTER,
    unit_kompetensi: 'Operasi Mesin Bubut',
    aktivitas_pembuktian: 'Job Sheet',
    penilai: 'Guru + Instruktur',
    hasil: 'Lulus',
    tanggal: '2025-01-15',
    catatan: 'Perlu kecepatan'
  },
  {
    id: 'h3',
    siswa_id: 's-j1-user',
    level_id: LEVEL_IDS.ADV,
    unit_kompetensi: 'Produksi Komponen',
    aktivitas_pembuktian: 'Teaching Factory',
    penilai: 'Industri',
    hasil: 'Lulus',
    tanggal: '2025-09-10',
    catatan: 'Siap PKL'
  }
];

export const mockDiscipline: import('../types').StudentDiscipline[] = [
  {
    id: 'disc-s-j1-user',
    siswa_id: 's-j1-user',
    attendance_pcent: 95,
    attendance_counts: { masuk: 180, izin: 2, sakit: 1, alfa: 0 },
    attitude_scores: [
      { aspect: 'Disiplin', score: 85 },
      { aspect: 'Tanggung Jawab', score: 92 },
      { aspect: 'Jujur', score: 87 },
      { aspect: 'Kerjasama', score: 88 },
      { aspect: 'Peduli', score: 90 }
    ],
    updated_at: new Date().toISOString()
  },
  {
    id: 'disc-raka-new',
    siswa_id: 's-raka-new',
    attendance_pcent: 88,
    attendance_counts: { masuk: 165, izin: 5, sakit: 3, alfa: 2 },
    attitude_scores: [
      { aspect: 'Disiplin', score: 80 },
      { aspect: 'Tanggung Jawab', score: 82 },
      { aspect: 'Jujur', score: 75 },
      { aspect: 'Kerjasama', score: 85 },
      { aspect: 'Peduli', score: 80 }
    ],
    updated_at: new Date().toISOString()
  },
  {
    id: 'disc-s-bayu-sapta',
    siswa_id: 's-bayu-sapta',
    attendance_pcent: 92,
    attendance_counts: { masuk: 175, izin: 3, sakit: 2, alfa: 0 },
    attitude_scores: [
      { aspect: 'Disiplin', score: 88 },
      { aspect: 'Tanggung Jawab', score: 90 },
      { aspect: 'Jujur', score: 85 },
      { aspect: 'Kerjasama', score: 82 },
      { aspect: 'Peduli', score: 85 }
    ],
    updated_at: new Date().toISOString()
  }
];

// per-jurusan overrides for level descriptions
export const mockLevelOverrides: Array<{
  jurusan_id: string;
  level_id: string;
  hasil_belajar?: string;
  criteria?: string[];
  soft_skill?: string;
}> = [
    // j1: Teknik Mesin
    {
      jurusan_id: JURUSAN_IDS.MESIN,
      level_id: LEVEL_IDS.BASIC1,
      hasil_belajar: JSON.stringify(['Memahami dasar mekanika', 'Mengenal alat ukur presisi (jangka sorong, mikrometer)']),
      soft_skill: 'Kedisiplinan bengkel'
    },
    {
      jurusan_id: JURUSAN_IDS.MESIN,
      level_id: LEVEL_IDS.INTER,
      hasil_belajar: JSON.stringify(['Mampu melakukan pengefraisan dasar', 'Menggunakan mesin bubut dengan benar', 'Memahami K3 di bengkel mesin']),
      soft_skill: 'Ketelitian kerja'
    },
    {
      jurusan_id: JURUSAN_IDS.MESIN,
      level_id: LEVEL_IDS.ADV,
      hasil_belajar: JSON.stringify(['Mengoperasikan mesin CNC', 'Menganalisis kerusakan komponen mesin', 'Bekerja mandiri pada proyek perakitan']),
      soft_skill: 'Penyelesaian masalah teknis'
    },
    {
      jurusan_id: JURUSAN_IDS.MESIN,
      level_id: LEVEL_IDS.MASTER,
      hasil_belajar: JSON.stringify(['Mahir merancang sistem mekanik', 'Perawatan mesin tingkat lanjut', 'Inovasi perancangan alat bantu mesin', 'Manajemen workshop skala kecil']),
      soft_skill: 'Kepemimpinan teknis'
    },

    // j2: Teknik Kendaraan Ringan (TKR)
    {
      jurusan_id: JURUSAN_IDS.TKR,
      level_id: LEVEL_IDS.BASIC1,
      hasil_belajar: JSON.stringify(['Memahami prinsip mesin 4 tak', 'Mengenal kunci-kunci bengkel otomotif']),
      soft_skill: 'Kebersihan area kerja'
    },
    {
      jurusan_id: JURUSAN_IDS.TKR,
      level_id: LEVEL_IDS.INTER,
      hasil_belajar: JSON.stringify([
        '**Engine**\nPerawatan dan perbaikan sistem mesin kendaraan.',
        '**Electrical**\nPerbaikan sistem kelistrikan kendaraan.',
        '**Chassis**\nPerawatan sistem kemudi, suspensi, dan pengereman.',
        '**Autobody**\nPerbaikan bodi dan pengecatan kendaraan.'
      ]),
      soft_skill: 'Kerjasama tim'
    },
    {
      jurusan_id: JURUSAN_IDS.TKR,
      level_id: LEVEL_IDS.ADV,
      hasil_belajar: JSON.stringify(['Overhaul mesin kendaraan', 'Menganalisis gangguan sistem EFI/Common Rail', 'Bekerja mandiri pada servis berkala']),
      soft_skill: 'Analisis kerusakan'
    },
    {
      jurusan_id: JURUSAN_IDS.TKR,
      level_id: LEVEL_IDS.MASTER,
      hasil_belajar: JSON.stringify(['Ahli diagnosis sistem hybrid/listrik', 'Mentoring mekanik junior', 'Inovasi efisiensi bahan bakar', 'Manajemen bengkel servis']),
      soft_skill: 'Mentoring teknis'
    },

    // j3: Teknik Sepeda Motor (TSM)
    {
      jurusan_id: JURUSAN_IDS.TSM,
      level_id: LEVEL_IDS.BASIC1,
      hasil_belajar: JSON.stringify(['Memahami komponen dasar motor', 'Mengenal alat servis motor']),
      soft_skill: 'Etika kerja'
    },
    {
      jurusan_id: JURUSAN_IDS.TSM,
      level_id: LEVEL_IDS.INTER,
      hasil_belajar: JSON.stringify(['Melakukan servis CVT/Rantai', 'Menggunakan multimeter pada kelistrikan motor', 'Memahami K3 perbengkelan']),
      soft_skill: 'Komunikasi pelanggan'
    },
    {
      jurusan_id: JURUSAN_IDS.TSM,
      level_id: LEVEL_IDS.ADV,
      hasil_belajar: JSON.stringify(['Diagnosis sistem PGM-FI', 'Menganalisis kerusakan transmisi otomatis', 'Bekerja mandiri pada restorasi mesin']),
      soft_skill: 'Ketekunan mendalam'
    },
    {
      jurusan_id: JURUSAN_IDS.TSM,
      level_id: LEVEL_IDS.MASTER,
      hasil_belajar: JSON.stringify(['Ahli modifikasi performa aman', 'Mentoring teknisi AHASS junior', 'Inovasi sistem pengereman', 'Manajemen gerai suku cadang']),
      soft_skill: 'Kreativitas teknis'
    },

    // j4: Teknik Elektronika Industri (Elind)
    {
      jurusan_id: JURUSAN_IDS.ELIND,
      level_id: LEVEL_IDS.BASIC1,
      hasil_belajar: JSON.stringify(['Memahami komponen elektronika pasif', 'Mengenal alat ukur multimeter/osiloskop']),
      soft_skill: 'Fokus detail'
    },
    {
      jurusan_id: JURUSAN_IDS.ELIND,
      level_id: LEVEL_IDS.INTER,
      hasil_belajar: JSON.stringify(['Membaca skema PCB', 'Menyolder komponen SMD dengan benar', 'Memahami K3 kelistrikan']),
      soft_skill: 'Kesabaran tinggi'
    },
    {
      jurusan_id: JURUSAN_IDS.ELIND,
      level_id: LEVEL_IDS.ADV,
      hasil_belajar: JSON.stringify(['Merancang sirkuit kontrol', 'Pemrograman PLC dasar', 'Troubleshooting sistem kontrol']),
      soft_skill: 'Analisis sistem'
    },
    {
      jurusan_id: JURUSAN_IDS.ELIND,
      level_id: LEVEL_IDS.MASTER,
      hasil_belajar: JSON.stringify(['Desain sistem robotika industri', 'Mentoring teknisi otomasi', 'Inovasi Internet of Things (IoT)', 'Manajemen proyek instalasi sensor']),
      soft_skill: 'Visi teknologi'
    },

    // j5: Teknik Instalasi Tenaga Listrik
    {
      jurusan_id: JURUSAN_IDS.LISTRIK,
      level_id: LEVEL_IDS.BASIC1,
      hasil_belajar: JSON.stringify(['Memahami hukum Ohm & Kirchhoff', 'Mengenal material instalasi listrik']),
      soft_skill: 'Kesadaran bahaya'
    },
    {
      jurusan_id: JURUSAN_IDS.LISTRIK,
      level_id: LEVEL_IDS.INTER,
      hasil_belajar: JSON.stringify(['Memasang instalasi penerangan', 'Menggunakan tang ampere dan megger', 'Memahami K3 ketenagalistrikan']),
      soft_skill: 'Prosedur keselamatan'
    },
    {
      jurusan_id: JURUSAN_IDS.LISTRIK,
      level_id: LEVEL_IDS.ADV,
      hasil_belajar: JSON.stringify(['Instalasi motor listrik 3 fasa', 'Menganalisis gangguan panel distribusi', 'Bekerja mandiri pada instalasi gedung']),
      soft_skill: 'Tanggung jawab'
    },
    {
      jurusan_id: JURUSAN_IDS.LISTRIK,
      level_id: LEVEL_IDS.MASTER,
      hasil_belajar: JSON.stringify(['Desain sistem PLTS mandiri', 'Mentoring instalatur junior', 'Inovasi efisiensi energi', 'Manajemen proyek instalasi industri']),
      soft_skill: 'Pengambilan keputusan'
    },

    // j6: Teknik Kimia Industri
    {
      jurusan_id: JURUSAN_IDS.KIMIA,
      level_id: LEVEL_IDS.BASIC1,
      hasil_belajar: JSON.stringify(['Memahami konsep stoikiometri', 'Mengenal alat gelas laboratorium']),
      soft_skill: 'Kerapihan lab'
    },
    {
      jurusan_id: JURUSAN_IDS.KIMIA,
      level_id: LEVEL_IDS.INTER,
      hasil_belajar: JSON.stringify(['Melakukan titrasi dengan akurat', 'Menggunakan neraca analitik dengan benar', 'Memahami K3 laboratorium kimia']),
      soft_skill: 'Akurasi'
    },
    {
      jurusan_id: JURUSAN_IDS.KIMIA,
      level_id: LEVEL_IDS.ADV,
      hasil_belajar: JSON.stringify(['Pengoperasian instrumen AAS/GC', 'Menganalisis kualitas bahan baku', 'Bekerja mandiri pada proses distilasi']),
      soft_skill: 'Berpikir kritis'
    },
    {
      jurusan_id: JURUSAN_IDS.KIMIA,
      level_id: LEVEL_IDS.MASTER,
      hasil_belajar: JSON.stringify(['Ahli optimasi proses produksi', 'Mentoring analis laboratorium', 'Inovasi pengolahan limbah', 'Manajemen unit produksi kimia']),
      soft_skill: 'Keberlanjutan/Sustainability'
    },

    // j7: Akuntansi
    {
      jurusan_id: JURUSAN_IDS.AKUNTANSI,
      level_id: LEVEL_IDS.BASIC1,
      hasil_belajar: JSON.stringify(['Memahami persamaan dasar akuntansi', 'Mengenal dokumen transaksi keuangan']),
      soft_skill: 'Kejujuran/Integritas'
    },
    {
      jurusan_id: JURUSAN_IDS.AKUNTANSI,
      level_id: LEVEL_IDS.INTER,
      hasil_belajar: JSON.stringify(['Menyusun jurnal umum & buku besar', 'Menggunakan aplikasi spreadsheet akuntansi', 'Memahami etika profesi akuntansi']),
      soft_skill: 'Ketelitian angka'
    },
    {
      jurusan_id: JURUSAN_IDS.AKUNTANSI,
      level_id: LEVEL_IDS.ADV,
      hasil_belajar: JSON.stringify(['Menyusun laporan keuangan lengkap', 'Menganalisis rasio keuangan', 'Bekerja mandiri pada rekonsiliasi bank']),
      soft_skill: 'Analisis data'
    },
    {
      jurusan_id: JURUSAN_IDS.AKUNTANSI,
      level_id: LEVEL_IDS.MASTER,
      hasil_belajar: JSON.stringify(['Ahli audit internal dasar', 'Mentoring staf administrasi', 'Inovasi sistem akuntansi digital', 'Manajemen perpajakan skala kecil']),
      soft_skill: 'Kepemimpinan strategis'
    },

    // j8: Perhotelan
    {
      jurusan_id: JURUSAN_IDS.HOTEL,
      level_id: LEVEL_IDS.BASIC1,
      hasil_belajar: JSON.stringify(['Memahami standar personal grooming', 'Mengenal peralatan housekeeping']),
      soft_skill: 'Ramah tamah'
    },
    {
      jurusan_id: JURUSAN_IDS.HOTEL,
      level_id: LEVEL_IDS.INTER,
      hasil_belajar: JSON.stringify(['Melakukan make up room sesuai SOP', 'Menggunakan sistem reservasi hotel', 'Memahami K3 keramahtamahan']),
      soft_skill: 'Layanan prima'
    },
    {
      jurusan_id: JURUSAN_IDS.HOTEL,
      level_id: LEVEL_IDS.ADV,
      hasil_belajar: JSON.stringify(['Menangani keluhan tamu (Guest Handling)', 'Menganalisis tingkat hunian kamar', 'Bekerja mandiri pada shift operasional']),
      soft_skill: 'Empati'
    },
    {
      jurusan_id: JURUSAN_IDS.HOTEL,
      level_id: LEVEL_IDS.MASTER,
      hasil_belajar: JSON.stringify(['Ahli manajemen banquet', 'Mentoring staf operasional baru', 'Inovasi layanan customer experience', 'Manajemen operasional front office']),
      soft_skill: 'Negosiasi'
    },
  ];

export function getTopStudentForJurusan(jurusanId: string): { nama: string; skor: number; kelas?: string } | null {
  const students = mockSiswa.filter((s) => s.jurusan_id === jurusanId);
  if (students.length === 0) return null;
  // find highest skor from mockSkillSiswa
  let top: { nama: string; skor: number; kelas?: string } | null = null;
  students.forEach((s) => {
    const sk = mockSkillSiswa.find((r) => r.siswa_id === s.id);
    if (!sk) return;
    if (!top || sk.skor > top.skor) top = { nama: s.nama, skor: sk.skor, kelas: s.kelas };
  });
  return top;
}

export function getTopStudentsForJurusan(jurusanId: string, count = 3): { id: string; nama: string; skor: number; kelas?: string }[] {
  const list = getStudentListForJurusan(jurusanId);
  return list.sort((a, b) => b.skor - a.skor).slice(0, count).map((s) => ({ id: s.id, nama: s.nama, skor: s.skor, kelas: s.kelas }));
}

export function getStudentListForJurusan(jurusanId: string): StudentListItem[] {
  const levels = mockLevels;
  const students = mockSiswa.filter((s) => s.jurusan_id === jurusanId);

  return students
    .map((s) => {
      const sk = mockSkillSiswa.find((r) => r.siswa_id === s.id);
      if (!sk) return null;
      const level = levels.find((l) => sk.skor >= l.min_skor && sk.skor <= l.max_skor);
      const badge_name = (level?.badge_name ?? 'Basic') as any;
      const badge_color = level?.badge_color ?? '#94a3b8';
      const level_name = level?.nama_level ?? 'Pemula / Beginner';
      const poin = (level?.urutan ?? 1) * 50 + 50;

      return {
        id: s.id,
        nama: s.nama,
        kelas: s.kelas,
        skor: sk.skor,
        poin: poin,
        badge_name,
        badge_color,
        level_name,
        avatar_url: s.avatar_url,
        photo_url: s.photo_url,
        riwayat_kompetensi: mockCompetencyHistory.filter(h => h.siswa_id === s.id)
      } as StudentListItem;
    })
    .filter(Boolean) as StudentListItem[];
}

export function getLevelsForJurusan(jurusanId: string) {
  // merge mockLevels with any overrides for this jurusan
  return mockLevels.map((lvl) => {
    const ov = mockLevelOverrides.find((o) => o.jurusan_id === jurusanId && o.level_id === lvl.id);
    const finalHasilBelajar = ov?.hasil_belajar ?? lvl.hasil_belajar;

    let criteria = lvl.criteria;
    if (ov?.hasil_belajar && ov.hasil_belajar.startsWith('[')) {
      try {
        criteria = JSON.parse(ov.hasil_belajar);
      } catch (e) {
        // use default
      }
    }

    return {
      ...lvl,
      hasil_belajar: finalHasilBelajar,
      criteria: criteria,
      soft_skill: ov?.soft_skill ?? lvl.soft_skill,
    };
  });
}

export function getAverageSkorForJurusan(jurusanId: string): number {
  const students = mockSiswa.filter((s) => s.jurusan_id === jurusanId);
  if (students.length === 0) return 0;

  let totalSkor = 0;
  let count = 0;

  students.forEach((s) => {
    const sk = mockSkillSiswa.find((r) => r.siswa_id === s.id);
    if (sk) {
      totalSkor += sk.skor;
      count++;
    }
  });

  return count > 0 ? totalSkor / count : 0;
}

export function getAllJurusanWithAverageSkors(): Array<{ jurusanId: string; averageSkor: number; studentCount: number }> {
  return mockJurusan.map((j) => {
    const students = mockSiswa.filter((s) => s.jurusan_id === j.id);
    const averageSkor = getAverageSkorForJurusan(j.id);
    return {
      jurusanId: j.id,
      averageSkor,
      studentCount: students.length,
    };
  });
}

export default {
  mockLevels,
  mockJurusan,
  mockSiswa,
  mockSkillSiswa,
  mockCompetencyHistory,
  mockDiscipline,
  mockLevelOverrides,
  getTopStudentForJurusan,
  getTopStudentsForJurusan,
  getStudentListForJurusan,
  getLevelsForJurusan,
  getAverageSkorForJurusan,
  getAllJurusanWithAverageSkors,
};
