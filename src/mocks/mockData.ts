import type { Jurusan, LevelSkill, Siswa, SkillSiswa, StudentListItem } from '../types';

// Minimal mock data to use while developing locally (VITE_USE_MOCK=true)

export const mockLevels: LevelSkill[] = [
  {
    id: 'lvl-basic',
    nama_level: 'Pemula / Beginner',
    urutan: 1,
    min_skor: 0,
    max_skor: 25,
    badge_color: '#94a3b8',
    badge_name: 'Basic',
    hasil_belajar: 'Memahami konsep dasar',
    criteria: ['Memahami konsep dasar', 'Mengenal alat kerja dasar'],
    soft_skill: 'Komunikasi dasar',
    created_at: new Date().toISOString(),
  },
  {
    id: 'lvl-inter',
    nama_level: 'Intermediate',
    urutan: 2,
    min_skor: 26,
    max_skor: 50,
    badge_color: '#3b82f6',
    badge_name: 'Applied',
    hasil_belajar: 'Mampu menerapkan pengetahuan',
    criteria: ['Mampu menerapkan pengetahuan dasar', 'Bisa menggunakan alat dengan benar', 'Memahami prosedur K3'],
    soft_skill: 'Problem solving',
    created_at: new Date().toISOString(),
  },
  {
    id: 'lvl-adv',
    nama_level: 'Advanced',
    urutan: 3,
    min_skor: 51,
    max_skor: 75,
    badge_color: '#f59e0b',
    badge_name: 'Advance',
    hasil_belajar: 'Menguasai keterampilan kompleks',
    criteria: ['Menguasai keterampilan kompleks', 'Mampu menganalisis masalah', 'Bekerja mandiri tanpa pengawasan'],
    soft_skill: 'Kepemimpinan',
    created_at: new Date().toISOString(),
  },
  {
    id: 'lvl-master',
    nama_level: 'Mastery',
    urutan: 4,
    min_skor: 76,
    max_skor: 100,
    badge_color: '#10b981',
    badge_name: 'Master',
    hasil_belajar: 'Ahli dalam bidangnya',
    criteria: ['Ahli dalam bidangnya', 'Mampu mengajar/mentoring junior', 'Inovasi dalam penyelesaian masalah', 'Manajemen proyek skala kecil'],
    soft_skill: 'Mentoring',
    created_at: new Date().toISOString(),
  },
];

export const mockJurusan: Jurusan[] = [
  { id: 'j1', nama_jurusan: 'Teknik Mesin', icon: 'Settings', deskripsi: 'Perancangan dan perawatan mesin', created_at: new Date().toISOString() },
  { id: 'j2', nama_jurusan: 'Teknik Kendaraan Ringan', icon: 'Car', deskripsi: 'Perawatan kendaraan ringan', created_at: new Date().toISOString() },
  { id: 'j3', nama_jurusan: 'Teknik Sepeda Motor', icon: 'Bike', deskripsi: 'Perbaikan sepeda motor', created_at: new Date().toISOString() },
  { id: 'j4', nama_jurusan: 'Teknik Elektronika Industri', icon: 'Cpu', deskripsi: 'Elektronika & otomasi', created_at: new Date().toISOString() },
  { id: 'j5', nama_jurusan: 'Teknik Instalasi Tenaga Listrik', icon: 'Zap', deskripsi: 'Instalasi kelistrikan', created_at: new Date().toISOString() },
  { id: 'j6', nama_jurusan: 'Teknik Kimia Industri', icon: 'FlaskConical', deskripsi: 'Proses produksi kimia', created_at: new Date().toISOString() },
  { id: 'j7', nama_jurusan: 'Akuntansi', icon: 'Calculator', deskripsi: 'Pencatatan keuangan', created_at: new Date().toISOString() },
  { id: 'j8', nama_jurusan: 'Perhotelan', icon: 'Hotel', deskripsi: 'Layanan & manajemen hotel', created_at: new Date().toISOString() },
];

// Class pools (by jurusan id) — used for generating random 'kelas' values for mock students
const classPools: Record<string, string[]> = {
  j1: [...Array.from({ length: 2 }, (_, i) => `X MESIN ${i + 1}`), ...Array.from({ length: 2 }, (_, i) => `XI MESIN ${i + 1}`), ...Array.from({ length: 2 }, (_, i) => `XII MESIN ${i + 1}`)],
  j2: [...Array.from({ length: 2 }, (_, i) => `X TKR ${i + 1}`), ...Array.from({ length: 2 }, (_, i) => `XI TKR ${i + 1}`), ...Array.from({ length: 2 }, (_, i) => `XII TKR ${i + 1}`)],
  j3: [...Array.from({ length: 2 }, (_, i) => `X TSM ${i + 1}`), ...Array.from({ length: 2 }, (_, i) => `XI TSM ${i + 1}`), ...Array.from({ length: 2 }, (_, i) => `XII TSM ${i + 1}`)],
  j4: [...Array.from({ length: 4 }, (_, i) => `X ELIND ${i + 1}`), ...Array.from({ length: 4 }, (_, i) => `XI ELIND ${i + 1}`), ...Array.from({ length: 4 }, (_, i) => `XII ELIND ${i + 1}`)],
  j5: [...Array.from({ length: 2 }, (_, i) => `X LISTRIK ${i + 1}`), ...Array.from({ length: 2 }, (_, i) => `XI LISTRIK ${i + 1}`), ...Array.from({ length: 2 }, (_, i) => `XII LISTRIK ${i + 1}`)],
  j6: [...Array.from({ length: 2 }, (_, i) => `X TKI ${i + 1}`), ...Array.from({ length: 2 }, (_, i) => `XI TKI ${i + 1}`), ...Array.from({ length: 2 }, (_, i) => `XII TKI ${i + 1}`)],
  j7: [...Array.from({ length: 2 }, (_, i) => `X AK ${i + 1}`), ...Array.from({ length: 2 }, (_, i) => `XI AK ${i + 1}`), ...Array.from({ length: 2 }, (_, i) => `XII AK ${i + 1}`)],
  j8: [...Array.from({ length: 2 }, (_, i) => `X HOTEL ${i + 1}`), ...Array.from({ length: 2 }, (_, i) => `XI HOTEL ${i + 1}`), ...Array.from({ length: 2 }, (_, i) => `XII HOTEL ${i + 1}`)],
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
  { id: 's-j1-a', nama: 'Raka Aji', kelas: klassFor('j1'), jurusan_id: 'j1', created_at: new Date().toISOString() },
  { id: 's-j1-b', nama: 'Dewi Susanti', kelas: klassFor('j1'), jurusan_id: 'j1', created_at: new Date().toISOString() },
  { id: 's-j1-c', nama: 'Budi Santoso', kelas: klassFor('j1'), jurusan_id: 'j1', created_at: new Date().toISOString() },
  { id: 's-j1-d', nama: 'Siti Nurhayati', kelas: klassFor('j1'), jurusan_id: 'j1', created_at: new Date().toISOString() },

  { id: 's-j2-a', nama: 'Agus Rahman', kelas: klassFor('j2'), jurusan_id: 'j2', created_at: new Date().toISOString() },
  { id: 's-j2-b', nama: 'Intan Maharani', kelas: klassFor('j2'), jurusan_id: 'j2', created_at: new Date().toISOString() },
  { id: 's-j2-c', nama: 'Fikri Hidayat', kelas: klassFor('j2'), jurusan_id: 'j2', created_at: new Date().toISOString() },
  { id: 's-j2-d', nama: 'Maya Putri', kelas: klassFor('j2'), jurusan_id: 'j2', created_at: new Date().toISOString() },

  { id: 's-j3-a', nama: 'Rizky Pratama', kelas: klassFor('j3'), jurusan_id: 'j3', created_at: new Date().toISOString() },
  { id: 's-j3-b', nama: 'Yulia Sari', kelas: klassFor('j3'), jurusan_id: 'j3', created_at: new Date().toISOString() },
  { id: 's-j3-c', nama: 'Deni Prasetyo', kelas: klassFor('j3'), jurusan_id: 'j3', created_at: new Date().toISOString() },
  { id: 's-j3-d', nama: 'Rina Kurnia', kelas: klassFor('j3'), jurusan_id: 'j3', created_at: new Date().toISOString() },

  { id: 's-j4-a', nama: 'Hendra Wijaya', kelas: klassFor('j4'), jurusan_id: 'j4', created_at: new Date().toISOString() },
  { id: 's-j4-b', nama: 'Siska Lestari', kelas: klassFor('j4'), jurusan_id: 'j4', created_at: new Date().toISOString() },
  { id: 's-j4-c', nama: 'Gilang Pradipta', kelas: klassFor('j4'), jurusan_id: 'j4', created_at: new Date().toISOString() },
  { id: 's-j4-d', nama: 'Nadia Amelia', kelas: klassFor('j4'), jurusan_id: 'j4', created_at: new Date().toISOString() },

  { id: 's-j5-a', nama: 'Taufik Hidayat', kelas: klassFor('j5'), jurusan_id: 'j5', created_at: new Date().toISOString() },
  { id: 's-j5-b', nama: 'Lia Ramadhani', kelas: klassFor('j5'), jurusan_id: 'j5', created_at: new Date().toISOString() },
  { id: 's-j5-c', nama: 'Wahyu Kurnia', kelas: klassFor('j5'), jurusan_id: 'j5', created_at: new Date().toISOString() },
  { id: 's-j5-d', nama: 'Rahayu Indah', kelas: klassFor('j5'), jurusan_id: 'j5', created_at: new Date().toISOString() },

  { id: 's-j6-a', nama: 'Arif Maulana', kelas: klassFor('j6'), jurusan_id: 'j6', created_at: new Date().toISOString() },
  { id: 's-j6-b', nama: 'Putri Ananda', kelas: klassFor('j6'), jurusan_id: 'j6', created_at: new Date().toISOString() },
  { id: 's-j6-c', nama: 'Hendra Saputra', kelas: klassFor('j6'), jurusan_id: 'j6', created_at: new Date().toISOString() },
  { id: 's-j6-d', nama: 'Megawati', kelas: klassFor('j6'), jurusan_id: 'j6', created_at: new Date().toISOString() },

  { id: 's-j7-a', nama: 'Daniel Pratama', kelas: klassFor('j7'), jurusan_id: 'j7', created_at: new Date().toISOString() },
  { id: 's-j7-b', nama: 'Nur Fadilah', kelas: klassFor('j7'), jurusan_id: 'j7', created_at: new Date().toISOString() },
  { id: 's-j7-c', nama: 'Rian Setiawan', kelas: klassFor('j7'), jurusan_id: 'j7', created_at: new Date().toISOString() },
  { id: 's-j7-d', nama: 'Sari Melati', kelas: klassFor('j7'), jurusan_id: 'j7', created_at: new Date().toISOString() },

  { id: 's-j8-a', nama: 'Kevin Alexander', kelas: klassFor('j8'), jurusan_id: 'j8', created_at: new Date().toISOString() },
  { id: 's-j8-b', nama: 'Mita Sari', kelas: klassFor('j8'), jurusan_id: 'j8', created_at: new Date().toISOString() },
  { id: 's-j8-c', nama: 'Fajar Prakoso', kelas: klassFor('j8'), jurusan_id: 'j8', created_at: new Date().toISOString() },
  { id: 's-j8-d', nama: 'Rani Melinda', kelas: klassFor('j8'), jurusan_id: 'j8', created_at: new Date().toISOString() },
  // --- This matches the username 'siswa_mesin' with name 'Siswa Mesin' in mockUsers.ts ---
  { id: 's-j1-user', nama: 'Siswa Mesin', kelas: 'XII MESIN 1', jurusan_id: 'j1', created_at: new Date().toISOString() },
  // --- Hero students for other majors ---
  { id: 's-j2-user', nama: 'Siswa TKR', kelas: 'XII TKR 1', jurusan_id: 'j2', created_at: new Date().toISOString() },
  { id: 's-j3-user', nama: 'Siswa TSM', kelas: 'XII TSM 1', jurusan_id: 'j3', created_at: new Date().toISOString() },
  { id: 's-j4-user', nama: 'Siswa Elind', kelas: 'XII ELIND 1', jurusan_id: 'j4', created_at: new Date().toISOString() },
  { id: 's-j5-user', nama: 'Siswa Listrik', kelas: 'XII LISTRIK 1', jurusan_id: 'j5', created_at: new Date().toISOString() },
  { id: 's-j6-user', nama: 'Siswa Kimia', kelas: 'XII TKI 1', jurusan_id: 'j6', created_at: new Date().toISOString() },
  { id: 's-j7-user', nama: 'Siswa Akuntansi', kelas: 'XII AK 1', jurusan_id: 'j7', created_at: new Date().toISOString() },
  { id: 's-j8-user', nama: 'Siswa Perhotelan', kelas: 'XII HOTEL 1', jurusan_id: 'j8', created_at: new Date().toISOString() },
];

export const mockSkillSiswa: SkillSiswa[] = [
  { id: 'ss-raka', siswa_id: 's-j1-a', level_id: 'lvl-master', skor: 98, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-dewi', siswa_id: 's-j1-b', level_id: 'lvl-adv', skor: 84, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-budi', siswa_id: 's-j1-c', level_id: 'lvl-adv', skor: 71, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-siti', siswa_id: 's-j1-d', level_id: 'lvl-adv', skor: 60, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  { id: 'ss-agus', siswa_id: 's-j2-a', level_id: 'lvl-master', skor: 95, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-intan', siswa_id: 's-j2-b', level_id: 'lvl-adv', skor: 82, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-fikri', siswa_id: 's-j2-c', level_id: 'lvl-adv', skor: 64, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-maya', siswa_id: 's-j2-d', level_id: 'lvl-inter', skor: 45, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  { id: 'ss-rizky', siswa_id: 's-j3-a', level_id: 'lvl-master', skor: 96, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-yulia', siswa_id: 's-j3-b', level_id: 'lvl-master', skor: 79, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-deni', siswa_id: 's-j3-c', level_id: 'lvl-adv', skor: 58, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-rina', siswa_id: 's-j3-d', level_id: 'lvl-inter', skor: 33, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  { id: 'ss-hendra', siswa_id: 's-j4-a', level_id: 'lvl-master', skor: 93, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-siska', siswa_id: 's-j4-b', level_id: 'lvl-master', skor: 77, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-gilang', siswa_id: 's-j4-c', level_id: 'lvl-adv', skor: 54, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-nadia', siswa_id: 's-j4-d', level_id: 'lvl-inter', skor: 29, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  { id: 'ss-taufik', siswa_id: 's-j5-a', level_id: 'lvl-master', skor: 97, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-lia', siswa_id: 's-j5-b', level_id: 'lvl-master', skor: 86, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-wahyu', siswa_id: 's-j5-c', level_id: 'lvl-adv', skor: 69, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-rahayu', siswa_id: 's-j5-d', level_id: 'lvl-adv', skor: 52, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  { id: 'ss-arif', siswa_id: 's-j6-a', level_id: 'lvl-master', skor: 94, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-putri', siswa_id: 's-j6-b', level_id: 'lvl-master', skor: 81, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-hendra2', siswa_id: 's-j6-c', level_id: 'lvl-adv', skor: 65, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-megawati', siswa_id: 's-j6-d', level_id: 'lvl-inter', skor: 38, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  { id: 'ss-daniel', siswa_id: 's-j7-a', level_id: 'lvl-master', skor: 92, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-nur', siswa_id: 's-j7-b', level_id: 'lvl-master', skor: 80, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-rian', siswa_id: 's-j7-c', level_id: 'lvl-adv', skor: 63, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-sari', siswa_id: 's-j7-d', level_id: 'lvl-inter', skor: 49, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  { id: 'ss-kevin', siswa_id: 's-j8-a', level_id: 'lvl-master', skor: 90, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-mita', siswa_id: 's-j8-b', level_id: 'lvl-master', skor: 76, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-fajar', siswa_id: 's-j8-c', level_id: 'lvl-adv', skor: 59, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-rani', siswa_id: 's-j8-d', level_id: 'lvl-inter', skor: 42, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // --- Matching logged-in test user ---
  { id: 'ss-siswa-mesin', siswa_id: 's-j1-user', level_id: 'lvl-adv', skor: 78, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  // --- Skills for other hero students ---
  { id: 'ss-siswa-tkr', siswa_id: 's-j2-user', level_id: 'lvl-adv', skor: 82, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-siswa-tsm', siswa_id: 's-j3-user', level_id: 'lvl-adv', skor: 75, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-siswa-elind', siswa_id: 's-j4-user', level_id: 'lvl-master', skor: 88, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-siswa-listrik', siswa_id: 's-j5-user', level_id: 'lvl-inter', skor: 65, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-siswa-kimia', siswa_id: 's-j6-user', level_id: 'lvl-adv', skor: 70, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-siswa-akuntansi', siswa_id: 's-j7-user', level_id: 'lvl-master', skor: 91, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-siswa-hotel', siswa_id: 's-j8-user', level_id: 'lvl-inter', skor: 60, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
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
      jurusan_id: 'j1',
      level_id: 'lvl-basic',
      hasil_belajar: 'Memahami dasar mekanika & alat ukur',
      criteria: ['Memahami dasar mekanika', 'Mengenal alat ukur presisi (jangka sorong, mikrometer)'],
      soft_skill: 'Kedisiplinan bengkel'
    },
    {
      jurusan_id: 'j1',
      level_id: 'lvl-inter',
      hasil_belajar: 'Mampu pengoperasian mesin dasar',
      criteria: ['Mampu melakukan pengefraisan dasar', 'Menggunakan mesin bubut dengan benar', 'Memahami K3 di bengkel mesin'],
      soft_skill: 'Ketelitian kerja'
    },
    {
      jurusan_id: 'j1',
      level_id: 'lvl-adv',
      hasil_belajar: 'Mengoperasikan mesin CNC & Analisis',
      criteria: ['Mengoperasikan mesin CNC', 'Menganalisis kerusakan komponen mesin', 'Bekerja mandiri pada proyek perakitan'],
      soft_skill: 'Penyelesaian masalah teknis'
    },
    {
      jurusan_id: 'j1',
      level_id: 'lvl-master',
      hasil_belajar: 'Mahir merancang dan merawat sistem mekanik tingkat lanjut',
      criteria: ['Mahir merancang sistem mekanik', 'Perawatan mesin tingkat lanjut', 'Inovasi perancangan alat bantu mesin', 'Manajemen workshop skala kecil'],
      soft_skill: 'Kepemimpinan teknis'
    },

    // j2: Teknik Kendaraan Ringan (TKR)
    {
      jurusan_id: 'j2',
      level_id: 'lvl-basic',
      hasil_belajar: 'Memahami prinsip mesin & alat bengkel',
      criteria: ['Memahami prinsip mesin 4 tak', 'Mengenal kunci-kunci bengkel otomotif'],
      soft_skill: 'Kebersihan area kerja'
    },
    {
      jurusan_id: 'j2',
      level_id: 'lvl-inter',
      hasil_belajar: 'Melakukan service berkala dasar',
      criteria: ['Melakukan tune-up mesin bensin', 'Menggunakan scanner diagnostik dasar', 'Memahami K3 otomotif'],
      soft_skill: 'Kerjasama tim'
    },
    {
      jurusan_id: 'j2',
      level_id: 'lvl-adv',
      hasil_belajar: 'Overhaul & Diagnosis Sistem EFI',
      criteria: ['Overhaul mesin kendaraan', 'Menganalisis gangguan sistem EFI/Common Rail', 'Bekerja mandiri pada servis berkala'],
      soft_skill: 'Analisis kerusakan'
    },
    {
      jurusan_id: 'j2',
      level_id: 'lvl-master',
      hasil_belajar: 'Ahli diagnosis & Manajemen Bengkel',
      criteria: ['Ahli diagnosis sistem hybrid/listrik', 'Mentoring mekanik junior', 'Inovasi efisiensi bahan bakar', 'Manajemen bengkel servis'],
      soft_skill: 'Mentoring teknis'
    },

    // j3: Teknik Sepeda Motor (TSM)
    {
      jurusan_id: 'j3',
      level_id: 'lvl-basic',
      hasil_belajar: 'Komponen motor & alat servis dasar',
      criteria: ['Memahami komponen dasar motor', 'Mengenal alat servis motor'],
      soft_skill: 'Etika kerja'
    },
    {
      jurusan_id: 'j3',
      level_id: 'lvl-inter',
      hasil_belajar: 'Servis transmisi & Kelistrikan motor',
      criteria: ['Melakukan servis CVT/Rantai', 'Menggunakan multimeter pada kelistrikan motor', 'Memahami K3 perbengkelan'],
      soft_skill: 'Komunikasi pelanggan'
    },
    {
      jurusan_id: 'j3',
      level_id: 'lvl-adv',
      hasil_belajar: 'Diagnosis Injeksi & Transmisi otomatis',
      criteria: ['Diagnosis sistem PGM-FI', 'Menganalisis kerusakan transmisi otomatis', 'Bekerja mandiri pada restorasi mesin'],
      soft_skill: 'Ketekunan mendalam'
    },
    {
      jurusan_id: 'j3',
      level_id: 'lvl-master',
      hasil_belajar: 'Ahli modifikasi Aman & Manajemen Gerai',
      criteria: ['Ahli modifikasi performa aman', 'Mentoring teknisi AHASS junior', 'Inovasi sistem pengereman', 'Manajemen gerai suku cadang'],
      soft_skill: 'Kreativitas teknis'
    },

    // j4: Teknik Elektronika Industri (Elind)
    {
      jurusan_id: 'j4',
      level_id: 'lvl-basic',
      hasil_belajar: 'Komponen elektronika & alat ukur',
      criteria: ['Memahami komponen elektronika pasif', 'Mengenal alat ukur multimeter/osiloskop'],
      soft_skill: 'Fokus detail'
    },
    {
      jurusan_id: 'j4',
      level_id: 'lvl-inter',
      hasil_belajar: 'Reading Schematics & Soldering',
      criteria: ['Membaca skema PCB', 'Menyolder komponen SMD dengan benar', 'Memahami K3 kelistrikan'],
      soft_skill: 'Kesabaran tinggi'
    },
    {
      jurusan_id: 'j4',
      level_id: 'lvl-adv',
      hasil_belajar: 'Mampu merancang sirkuit kontrol dan mengoperasikan PLC',
      criteria: ['Merancang sirkuit kontrol', 'Pemrograman PLC dasar', 'Troubleshooting sistem kontrol'],
      soft_skill: 'Analisis sistem'
    },
    {
      jurusan_id: 'j4',
      level_id: 'lvl-master',
      hasil_belajar: 'Desain Robotika & Manajemen IoT',
      criteria: ['Desain sistem robotika industri', 'Mentoring teknisi otomasi', 'Inovasi Internet of Things (IoT)', 'Manajemen proyek instalasi sensor'],
      soft_skill: 'Visi teknologi'
    },

    // j5: Teknik Instalasi Tenaga Listrik
    {
      jurusan_id: 'j5',
      level_id: 'lvl-basic',
      hasil_belajar: 'Hukum dasar listrik & Material',
      criteria: ['Memahami hukum Ohm & Kirchhoff', 'Mengenal material instalasi listrik'],
      soft_skill: 'Kesadaran bahaya'
    },
    {
      jurusan_id: 'j5',
      level_id: 'lvl-inter',
      hasil_belajar: 'Instalasi Penerangan & Alat ukur daya',
      criteria: ['Memasang instalasi penerangan', 'Menggunakan tang ampere dan megger', 'Memahami K3 ketenagalistrikan'],
      soft_skill: 'Prosedur keselamatan'
    },
    {
      jurusan_id: 'j5',
      level_id: 'lvl-adv',
      hasil_belajar: 'Instalasi Motor 3 FASA & Panel',
      criteria: ['Instalasi motor listrik 3 fasa', 'Menganalisis gangguan panel distribusi', 'Bekerja mandiri pada instalasi gedung'],
      soft_skill: 'Tanggung jawab'
    },
    {
      jurusan_id: 'j5',
      level_id: 'lvl-master',
      hasil_belajar: 'Desain PLTS & Manajemen Energi',
      criteria: ['Desain sistem PLTS mandiri', 'Mentoring instalatur junior', 'Inovasi efisiensi energi', 'Manajemen proyek instalasi industri'],
      soft_skill: 'Pengambilan keputusan'
    },

    // j6: Teknik Kimia Industri
    {
      jurusan_id: 'j6',
      level_id: 'lvl-basic',
      hasil_belajar: 'Stoikiometri & Alat gelas lab',
      criteria: ['Memahami konsep stoikiometri', 'Mengenal alat gelas laboratorium'],
      soft_skill: 'Kerapihan lab'
    },
    {
      jurusan_id: 'j6',
      level_id: 'lvl-inter',
      hasil_belajar: 'Titrasi & Akurasi pengukuran',
      criteria: ['Melakukan titrasi dengan akurat', 'Menggunakan neraca analitik dengan benar', 'Memahami K3 laboratorium kimia'],
      soft_skill: 'Akurasi'
    },
    {
      jurusan_id: 'j6',
      level_id: 'lvl-adv',
      hasil_belajar: 'Instrumen AAS/GC & Analisis bahan',
      criteria: ['Pengoperasian instrumen AAS/GC', 'Menganalisis kualitas bahan baku', 'Bekerja mandiri pada proses distilasi'],
      soft_skill: 'Berpikir kritis'
    },
    {
      jurusan_id: 'j6',
      level_id: 'lvl-master',
      hasil_belajar: 'Optimasi Proses & Manajemen Limbah',
      criteria: ['Ahli optimasi proses produksi', 'Mentoring analis laboratorium', 'Inovasi pengolahan limbah', 'Manajemen unit produksi kimia'],
      soft_skill: 'Keberlanjutan/Sustainability'
    },

    // j7: Akuntansi
    {
      jurusan_id: 'j7',
      level_id: 'lvl-basic',
      hasil_belajar: 'Persamaan Dasar & Dokumen Transaksi',
      criteria: ['Memahami persamaan dasar akuntansi', 'Mengenal dokumen transaksi keuangan'],
      soft_skill: 'Kejujuran/Integritas'
    },
    {
      jurusan_id: 'j7',
      level_id: 'lvl-inter',
      hasil_belajar: 'Jurnal, Buku Besar & Spreadsheet',
      criteria: ['Menyusun jurnal umum & buku besar', 'Menggunakan aplikasi spreadsheet akuntansi', 'Memahami etika profesi akuntansi'],
      soft_skill: 'Ketelitian angka'
    },
    {
      jurusan_id: 'j7',
      level_id: 'lvl-adv',
      hasil_belajar: 'Laporan Keuangan & Rekonsiliasi',
      criteria: ['Menyusun laporan keuangan lengkap', 'Menganalisis rasio keuangan', 'Bekerja mandiri pada rekonsiliasi bank'],
      soft_skill: 'Analisis data'
    },
    {
      jurusan_id: 'j7',
      level_id: 'lvl-master',
      hasil_belajar: 'Audit Internal & Sistem Digital',
      criteria: ['Ahli audit internal dasar', 'Mentoring staf administrasi', 'Inovasi sistem akuntansi digital', 'Manajemen perpajakan skala kecil'],
      soft_skill: 'Kepemimpinan strategis'
    },

    // j8: Perhotelan
    {
      jurusan_id: 'j8',
      level_id: 'lvl-basic',
      hasil_belajar: 'Personal Grooming & Housekeeping',
      criteria: ['Memahami standar personal grooming', 'Mengenal peralatan housekeeping'],
      soft_skill: 'Ramah tamah'
    },
    {
      jurusan_id: 'j8',
      level_id: 'lvl-inter',
      hasil_belajar: 'Make up Room & Reservasi',
      criteria: ['Melakukan make up room sesuai SOP', 'Menggunakan sistem reservasi hotel', 'Memahami K3 keramahtamahan'],
      soft_skill: 'Layanan prima'
    },
    {
      jurusan_id: 'j8',
      level_id: 'lvl-adv',
      hasil_belajar: 'Guest Handling & Analisis Hunian',
      criteria: ['Menangani keluhan tamu (Guest Handling)', 'Menganalisis tingkat hunian kamar', 'Bekerja mandiri pada shift operasional'],
      soft_skill: 'Empati'
    },
    {
      jurusan_id: 'j8',
      level_id: 'lvl-master',
      hasil_belajar: 'Banquet & Manajemen Front Office',
      criteria: ['Ahli manajemen banquet', 'Mentoring staf operasional baru', 'Inovasi layanan customer experience', 'Manajemen operasional front office'],
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

      return {
        id: s.id,
        nama: s.nama,
        kelas: s.kelas,
        skor: sk.skor,
        badge_name,
        badge_color,
        level_name,
      } as StudentListItem;
    })
    .filter(Boolean) as StudentListItem[];
}

export function getLevelsForJurusan(jurusanId: string) {
  // merge mockLevels with any overrides for this jurusan
  return mockLevels.map((lvl) => {
    const ov = mockLevelOverrides.find((o) => o.jurusan_id === jurusanId && o.level_id === lvl.id);
    return {
      ...lvl,
      hasil_belajar: ov?.hasil_belajar ?? lvl.hasil_belajar,
      criteria: ov?.criteria ?? lvl.criteria,
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
  mockLevelOverrides,
  getTopStudentForJurusan,
  getTopStudentsForJurusan,
  getStudentListForJurusan,
  getLevelsForJurusan,
  getAverageSkorForJurusan,
  getAllJurusanWithAverageSkors,
};
