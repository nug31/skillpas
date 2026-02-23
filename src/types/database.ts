export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      jurusan: {
        Row: {
          id: string
          nama_jurusan: string
          icon: string
          deskripsi: string
          created_at: string
        }
        Insert: {
          id?: string
          nama_jurusan: string
          icon: string
          deskripsi?: string
          created_at?: string
        }
        Update: {
          id?: string
          nama_jurusan?: string
          icon?: string
          deskripsi?: string
          created_at?: string
        }
      }
      level_skill: {
        Row: {
          id: string
          nama_level: string
          urutan: number
          min_skor: number
          max_skor: number
          badge_color: string
          badge_name: string
          hasil_belajar: string
          soft_skill: string
          created_at: string
        }
        Insert: {
          id?: string
          nama_level: string
          urutan: number
          min_skor: number
          max_skor: number
          badge_color: string
          badge_name: string
          hasil_belajar?: string
          soft_skill?: string
          created_at?: string
        }
        Update: {
          id?: string
          nama_level?: string
          urutan?: number
          min_skor?: number
          max_skor?: number
          badge_color?: string
          badge_name?: string
          hasil_belajar?: string
          soft_skill?: string
          created_at?: string
        }
      }
      siswa: {
        Row: {
          id: string
          nama: string
          kelas: string
          jurusan_id: string
          created_at: string
          nisn?: string
          avatar_url?: string
          photo_url?: string
          wa_number?: string
        }
        Insert: {
          id?: string
          nama: string
          kelas: string
          jurusan_id: string
          created_at?: string
          nisn?: string
          avatar_url?: string
          photo_url?: string
          wa_number?: string
        }
        Update: {
          id?: string
          nama?: string
          kelas?: string
          jurusan_id?: string
          created_at?: string
          nisn?: string
          avatar_url?: string
          photo_url?: string
          wa_number?: string
        }
      }
      skill_siswa: {
        Row: {
          id: string
          siswa_id: string
          level_id: string
          skor: number
          poin: number
          tanggal_pencapaian: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          siswa_id: string
          level_id: string
          skor: number
          poin?: number
          tanggal_pencapaian?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          siswa_id?: string
          level_id?: string
          skor?: number
          poin?: number
          tanggal_pencapaian?: string
          created_at?: string
          updated_at?: string
        }
      }
      level_skill_jurusan: {
        Row: {
          id: string
          jurusan_id: string
          level_id: string
          hasil_belajar: string
          soft_skill: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          jurusan_id: string
          level_id: string
          hasil_belajar?: string
          soft_skill?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          jurusan_id?: string
          level_id?: string
          hasil_belajar?: string
          soft_skill?: string
          created_at?: string
          updated_at?: string
        }
      }
      competency_history: {
        Row: {
          id: string
          siswa_id: string
          level_id: string
          unit_kompetensi: string
          aktivitas_pembuktian: string
          penilai: string
          hasil: string
          tanggal: string
          catatan: string | null
          created_at: string
        }
        Insert: {
          id?: string
          siswa_id: string
          level_id: string
          unit_kompetensi: string
          aktivitas_pembuktian: string
          penilai: string
          hasil: string
          tanggal: string
          catatan?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          siswa_id?: string
          level_id?: string
          unit_kompetensi?: string
          aktivitas_pembuktian?: string
          penilai?: string
          hasil?: string
          tanggal?: string
          catatan?: string | null
          created_at?: string
        }
      }
      student_discipline: {
        Row: {
          id: string
          siswa_id: string
          attendance_pcent: number
          masuk: number
          izin: number
          sakit: number
          alfa: number
          attitude_scores: Json
          updated_at: string
        }
        Insert: {
          id?: string
          siswa_id: string
          attendance_pcent?: number
          masuk?: number
          izin?: number
          sakit?: number
          alfa?: number
          attitude_scores?: Json
          updated_at?: string
        }
        Update: {
          id?: string
          siswa_id?: string
          attendance_pcent?: number
          masuk?: number
          izin?: number
          sakit?: number
          alfa?: number
          attitude_scores?: Json
          updated_at?: string
        }
      }
      krs: {
        Row: {
          id: string
          siswa_id: string
          siswa_nama: string
          kelas: string
          jurusan_id: string
          items: string[]
          status: string
          exam_date: string | null
          notes: string | null
          final_score: number | null
          evidence_photos: string[]
          evidence_videos: string[]
          created_at: string
          updated_at: string
          submitted_at: string
          guru_produktif_approved_at: string | null
          wali_kelas_approved_at: string | null
          hod_approved_at: string | null
        }
        Insert: {
          id?: string
          siswa_id: string
          siswa_nama: string
          kelas: string
          jurusan_id: string
          items?: string[]
          status?: string
          exam_date?: string | null
          notes?: string | null
          final_score?: number | null
          evidence_photos?: string[]
          evidence_videos?: string[]
          created_at?: string
          updated_at?: string
          submitted_at?: string
          guru_produktif_approved_at?: string | null
          wali_kelas_approved_at?: string | null
          hod_approved_at?: string | null
        }
        Update: {
          id?: string
          siswa_id?: string
          siswa_nama?: string
          kelas?: string
          jurusan_id?: string
          items?: string[]
          status?: string
          exam_date?: string | null
          notes?: string | null
          final_score?: number | null
          evidence_photos?: string[]
          evidence_videos?: string[]
          created_at?: string
          updated_at?: string
          submitted_at?: string
          guru_produktif_approved_at?: string | null
          wali_kelas_approved_at?: string | null
          hod_approved_at?: string | null
        }
      }
    }
  }
}
