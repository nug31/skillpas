-- First, ensure the columns exist (in case the previous script wasn't run)
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS kelas TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS nisn TEXT;

-- Add Joko Setyo Nugroho as a Wali Kelas for XII TKR 3
INSERT INTO public.users (username, password, name, role, jurusan_id, kelas) 
VALUES (
    'joko_tkr', 
    '123', 
    'Joko Setyo Nugroho, S.T', 
    'wali_kelas', 
    '550e8400-e29b-41d4-a716-446655440002', -- JURUSAN_IDS.TKR
    'XII TKR 3'
)
ON CONFLICT (username) DO UPDATE SET 
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    jurusan_id = EXCLUDED.jurusan_id,
    kelas = EXCLUDED.kelas,
    nisn = EXCLUDED.nisn;
