/*
  # Create Student Discipline Table
  
  ## Overview
  This migration creates the `student_discipline` table to track student attendance
  and other discipline-related metrics.
  
  ## Tables Created
  
  ### 1. student_discipline
  - `id` (uuid, primary key)
  - `siswa_id` (uuid, foreign key to siswa)
  - `attendance_pcent` (numeric) - 0-100 percentage
  - `updated_at` (timestamptz)
*/

CREATE TABLE IF NOT EXISTS student_discipline (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  siswa_id uuid NOT NULL REFERENCES siswa(id) ON DELETE CASCADE,
  attendance_pcent numeric NOT NULL DEFAULT 100 CHECK (attendance_pcent >= 0 AND attendance_pcent <= 100),
  masuk integer NOT NULL DEFAULT 0,
  izin integer NOT NULL DEFAULT 0,
  sakit integer NOT NULL DEFAULT 0,
  alfa integer NOT NULL DEFAULT 0,
  attitude_scores jsonb DEFAULT '[]'::jsonb,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(siswa_id)
);

-- Enable RLS
ALTER TABLE student_discipline ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view student_discipline"
  ON student_discipline FOR SELECT
  USING (true);

CREATE POLICY "Public can update student_discipline"
  ON student_discipline FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can insert student_discipline"
  ON student_discipline FOR INSERT
  TO public
  WITH CHECK (true);

-- Seed initial data for existing students (defaulting to random-ish high attendance)
INSERT INTO student_discipline (siswa_id, attendance_pcent)
SELECT id, floor(random() * (100 - 85 + 1) + 85)
FROM siswa
ON CONFLICT (siswa_id) DO NOTHING;
