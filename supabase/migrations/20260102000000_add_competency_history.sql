-- Create competency_history table
CREATE TABLE IF NOT EXISTS competency_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  siswa_id uuid NOT NULL REFERENCES siswa(id) ON DELETE CASCADE,
  level_id uuid NOT NULL REFERENCES level_skill(id) ON DELETE CASCADE,
  unit_kompetensi text NOT NULL,
  aktivitas_pembuktian text NOT NULL,
  penilai text NOT NULL,
  hasil text NOT NULL,
  tanggal date NOT NULL,
  catatan text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE competency_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view competency_history"
  ON competency_history FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert competency_history"
  ON competency_history FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update competency_history"
  ON competency_history FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert/Update Bayu Sapta data (NISN: 0083581133)
DO $$
DECLARE
    jurusan_id_tkr uuid;
    siswa_id_bayu uuid;
    lvl_basic uuid;
    lvl_inter uuid;
    lvl_adv uuid;
    lvl_master uuid;
BEGIN
    -- 1. Get Jurusan ID
    SELECT id INTO jurusan_id_tkr FROM jurusan WHERE nama_jurusan = 'Teknik Kendaraan Ringan' LIMIT 1;
    
    -- 2. Find or Insert Bayu Sapta
    SELECT id INTO siswa_id_bayu FROM siswa WHERE nisn = '0083581133' LIMIT 1;
    
    IF siswa_id_bayu IS NULL THEN
        INSERT INTO siswa (nama, kelas, jurusan_id, nisn)
        VALUES ('Bayu Sapta', 'XII TKR 3', jurusan_id_tkr, '0083581133')
        RETURNING id INTO siswa_id_bayu;
    ELSE
        UPDATE siswa SET kelas = 'XII TKR 3' WHERE id = siswa_id_bayu;
    END IF;

    -- 3. Get level IDs
    SELECT id INTO lvl_basic FROM level_skill WHERE nama_level = 'Pemula / Beginner' LIMIT 1;
    SELECT id INTO lvl_inter FROM level_skill WHERE nama_level = 'Intermediate' LIMIT 1;
    SELECT id INTO lvl_adv FROM level_skill WHERE nama_level = 'Advanced' LIMIT 1;
    SELECT id INTO lvl_master FROM level_skill WHERE nama_level = 'Mastery' LIMIT 1;

    -- 4. Ensure Skill record (Mastery level)
    INSERT INTO skill_siswa (siswa_id, level_id, skor, poin)
    VALUES (siswa_id_bayu, lvl_master, 81, 250)
    ON CONFLICT (siswa_id, level_id) DO UPDATE SET skor = 81, poin = 250;

    -- 5. Insert Competency History
    INSERT INTO competency_history (siswa_id, level_id, unit_kompetensi, aktivitas_pembuktian, penilai, hasil, tanggal, catatan)
    VALUES 
    (siswa_id_bayu, lvl_basic, 'Dasar Otomotif', 'Tes Tertulis', 'Guru Produktif', 'Lulus', '2023-09-01', 'Sangat Baik'),
    (siswa_id_bayu, lvl_inter, 'Sistem Rem', 'Praktik Bengkel', 'Instruktur', 'Lulus', '2024-03-15', 'Presisi Tinggi'),
    (siswa_id_bayu, lvl_adv, 'Overhaul Mesin', 'Project Work', 'Kepala Bengkel', 'Lulus', '2024-11-20', 'Mandiri'),
    (siswa_id_bayu, lvl_master, 'Diagnosa EFI', 'Uji Kompetensi', 'LSP P1', 'Lulus', '2025-05-10', 'Kompeten');

END $$;
