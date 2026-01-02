-- Migration: Relax RLS policies to allow anonymous writes for mock-authenticated users
-- This allows the demo application to update criteria and student data without requiring full Supabase Auth.

-- 1. Relax level_skill_jurusan
DROP POLICY IF EXISTS "Authenticated users can insert level_skill_jurusan" ON level_skill_jurusan;
DROP POLICY IF EXISTS "Authenticated users can update level_skill_jurusan" ON level_skill_jurusan;

CREATE POLICY "Anyone can insert level_skill_jurusan"
  ON level_skill_jurusan FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update level_skill_jurusan"
  ON level_skill_jurusan FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- 2. Relax competency_history
DROP POLICY IF EXISTS "Authenticated users can insert competency_history" ON competency_history;
DROP POLICY IF EXISTS "Authenticated users can update competency_history" ON competency_history;

CREATE POLICY "Anyone can insert competency_history"
  ON competency_history FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update competency_history"
  ON competency_history FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- 3. Relax skill_siswa
DROP POLICY IF EXISTS "Authenticated users can insert skill_siswa" ON skill_siswa;
DROP POLICY IF EXISTS "Authenticated users can update skill_siswa" ON skill_siswa;

CREATE POLICY "Anyone can insert skill_siswa"
  ON skill_siswa FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update skill_siswa"
  ON skill_siswa FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete skill_siswa"
  ON skill_siswa FOR DELETE
  USING (true);

-- 4. Relax siswa (if needed for profile updates)
DROP POLICY IF EXISTS "Authenticated users can insert siswa" ON siswa;
DROP POLICY IF EXISTS "Authenticated users can update siswa" ON siswa;

CREATE POLICY "Anyone can insert siswa"
  ON siswa FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update siswa"
  ON siswa FOR UPDATE
  USING (true)
  WITH CHECK (true);
