-- SQL for adding Pak Joko as Guru Produktif TKR
-- Jurusan ID for TKR: 550e8400-e29b-41d4-a716-446655440002

INSERT INTO public.users (username, password, name, role, kelas, jurusan_id)
VALUES
    ('joko_tkr', '123', 'Joko Setyo Nugroho, S.T', 'teacher_produktif', 'XII TKR 3', '550e8400-e29b-41d4-a716-446655440002')
ON CONFLICT (username) 
DO UPDATE SET 
    role = EXCLUDED.role,
    jurusan_id = EXCLUDED.jurusan_id,
    kelas = EXCLUDED.kelas;
