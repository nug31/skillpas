-- Create krs table to store student study plans
CREATE TABLE IF NOT EXISTS krs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  siswa_id uuid NOT NULL, -- references siswa(id) but we might want to be loose for now if data is messy, but best to be strict usually. Let's make it strict or just uuid.
  -- In this project, siswa table exists. Let's try to reference it.
  -- referencing siswa(id) ON DELETE CASCADE
  siswa_nama text NOT NULL,
  kelas text NOT NULL,
  jurusan_id uuid NOT NULL,
  items text[] DEFAULT '{}', -- Array of competency criteria strings
  status text NOT NULL DEFAULT 'pending_produktif', -- pending_produktif, pending_wali, pending_hod, approved, scheduled, completed, rejected
  exam_date date,
  notes text,
  final_score integer,
  
  -- Timestamps for audit
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  submitted_at timestamptz DEFAULT now(),
  guru_produktif_approved_at timestamptz,
  wali_kelas_approved_at timestamptz,
  hod_approved_at timestamptz
);

-- Enable RLS
ALTER TABLE krs ENABLE ROW LEVEL SECURITY;

-- Policies
-- For now, we are relaxing everything as requested in previous patterns for this project (Mock Auth)
-- 1. Everyone can view everything (so teachers can see student data, students can see their own)
CREATE POLICY "Anyone can view krs"
  ON krs FOR SELECT
  USING (true);

-- 2. Anyone can insert (students submitting)
CREATE POLICY "Anyone can insert krs"
  ON krs FOR INSERT
  WITH CHECK (true);

-- 3. Anyone can update (teachers approving, students re-submitting if needed?)
CREATE POLICY "Anyone can update krs"
  ON krs FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- 4. Anyone can delete (admin cleanup)
CREATE POLICY "Anyone can delete krs"
  ON krs FOR DELETE
  USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_krs_siswa_id ON krs(siswa_id);
CREATE INDEX IF NOT EXISTS idx_krs_status ON krs(status);
CREATE INDEX IF NOT EXISTS idx_krs_jurusan_id ON krs(jurusan_id);
