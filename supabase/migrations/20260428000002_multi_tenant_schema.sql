
-- 1. Create sekolah table
CREATE TABLE IF NOT EXISTS sekolah (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_sekolah text NOT NULL UNIQUE,
  kode_sekolah text NOT NULL UNIQUE, -- '01', '02', '03', 'asy-syarif'
  alamat text,
  created_at timestamptz DEFAULT now()
);

-- 2. Seed initial branches with your specific names
INSERT INTO sekolah (nama_sekolah, kode_sekolah)
VALUES 
  ('SMK Mitra Industri', '01'),
  ('SMK Mitra Industri 02 Pati', '02'),
  ('SMK Mitra Industri 03', '03'),
  ('Asy-Syarif Mitra Industri', 'asy-syarif')
ON CONFLICT (kode_sekolah) DO UPDATE SET nama_sekolah = EXCLUDED.nama_sekolah;

-- 3. Add sekolah_id to existing tables
-- We will use SMK Mitra Industri ('01') as the default for all existing data
DO $$
DECLARE
    default_id uuid;
    tbl text;
    tables_to_update text[] := ARRAY[
        'jurusan', 'siswa', 'users', 'krs', 
        'skill_siswa', 'competency_history', 
        'student_discipline', 'notifications', 
        'level_skill_jurusan'
    ];
BEGIN
    -- Ambil ID SMK Mitra Industri sebagai default
    SELECT id INTO default_id FROM sekolah WHERE kode_sekolah = '01' LIMIT 1;

    FOREACH tbl IN ARRAY tables_to_update LOOP
        -- Tambahkan kolom jika belum ada
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = tbl AND column_name = 'sekolah_id') THEN
            EXECUTE format('ALTER TABLE %I ADD COLUMN sekolah_id uuid REFERENCES sekolah(id)', tbl);
            -- Set data lama ke SMK Mitra Industri (01)
            EXECUTE format('UPDATE %I SET sekolah_id = %L WHERE sekolah_id IS NULL', tbl, default_id);
        END IF;
    END LOOP;
END $$;
