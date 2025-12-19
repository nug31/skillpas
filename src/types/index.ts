import type { Database } from './database';

export type Jurusan = Database['public']['Tables']['jurusan']['Row'];
// export type LevelSkill = Database['public']['Tables']['level_skill']['Row']; // Replaced by interface below
export type Siswa = Database['public']['Tables']['siswa']['Row'];
export type SkillSiswa = Database['public']['Tables']['skill_siswa']['Row'];

export interface SiswaWithSkill extends Siswa {
  skill_siswa: SkillSiswa[];
  current_level?: LevelSkill;
  current_skor?: number;
  avatar_url?: string;
  photo_url?: string;
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

export interface StudentListItem {
  id: string;
  nama: string;
  kelas: string;
  skor: number;
  badge_name: BadgeLevel;
  badge_color: string;
  level_name: string;
}

export interface RaceParticipant {
  id: string;
  name: string;
  score: number;
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
  level: string;
  levelColor: string;
  className: string;
}

export type ViewMode = 'list' | 'race' | 'podium';
