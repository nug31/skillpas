import type { Database } from './database';

export type Jurusan = Database['public']['Tables']['jurusan']['Row'];
// export type LevelSkill = Database['public']['Tables']['level_skill']['Row']; // Replaced by interface below
export type Siswa = Database['public']['Tables']['siswa']['Row'];
export type SkillSiswa = Database['public']['Tables']['skill_siswa']['Row'];

export interface SiswaWithSkill extends Siswa {
  skill_siswa: SkillSiswa[];
  riwayat_kompetensi?: CompetencyHistory[];
  current_level?: LevelSkill;
  current_skor?: number;
  current_poin?: number;
  avatar_url?: string;
  photo_url?: string;
  discipline_data?: StudentDiscipline;
}

export interface JurusanWithStats extends Jurusan {
  total_siswa?: number;
}

export type BadgeLevel = 'Basic' | 'Applied' | 'Advance' | 'Master';

// Extend the DB type to include our runtime 'criteria' field logic
export interface LevelSkill extends Omit<Database['public']['Tables']['level_skill']['Row'], 'hasil_belajar'> {
  hasil_belajar: string; // Maintain compatibility but we will parse this or use a new field
  criteria?: string[]; // New field for multiple criteria
}

export interface CompetencyHistory {
  id: string;
  siswa_id: string;
  level_id: string;
  unit_kompetensi: string;
  aktivitas_pembuktian: string;
  penilai: string;
  hasil: string;
  tanggal: string;
  catatan?: string;
}


export interface StudentDiscipline {
  id: string; // usually `disc-${siswa_id}`
  siswa_id: string;
  attendance_pcent: number; // 0-100
  attitude_scores: {
    aspect: string;
    score: number; // 1-100 or 1-5
  }[];
  updated_at: string;
}

export interface StudentListItem {
  id: string;
  nama: string;
  kelas: string;
  skor: number;
  poin: number;
  badge_name: BadgeLevel;
  badge_color: string;
  level_name: string;
  nisn?: string;
  avatar_url?: string;
  photo_url?: string;
  riwayat_kompetensi?: CompetencyHistory[];
  discipline_data?: StudentDiscipline;
}

export interface RaceParticipant {
  id: string;
  name: string;
  score: number;
  poin?: number;
  label: string;
  secondaryLabel?: string;
  icon?: string;
  color?: string;
  rank?: number;
  badge_name?: string;
  avatar_url?: string;
  photo_url?: string;
  alias?: string;
}
export interface StudentStats {
  rank: number;
  totalStudents: number;
  score: number;
  poin: number;
  level: string;
  levelColor: string;
  className: string;
}

export type ViewMode = 'list' | 'race' | 'podium';

export type UserRole = 'student' | 'teacher_produktif' | 'wali_kelas' | 'hod' | 'admin' | 'teacher';

export interface User {
  id: string;
  username: string;
  nama: string;
  role: UserRole;
  jurusan_id?: string;
  kelas?: string;
  nisn?: string;
}

export type KRSStatus = 'pending_produktif' | 'pending_wali' | 'pending_hod' | 'approved' | 'scheduled' | 'rejected' | 'completed';

export interface KRSSubmission {
  id: string;
  siswa_id: string;
  siswa_nama: string;
  kelas: string;
  jurusan_id: string;
  items: string[]; // competence criteria selected
  status: KRSStatus;
  submitted_at: string;
  updated_at: string;
  guru_produktif_approved_at?: string;
  wali_kelas_approved_at?: string;
  hod_approved_at?: string;
  exam_date?: string;
  notes?: string;
  final_score?: number;
}
