-- SQL Script to insert HOD accounts into 'users' table in Supabase
-- Note: Replace JURUSAN_IDS with actual UUIDs from your 'jurusan' table.
-- Password '123' is NOT hashed here as the current structure might handle it differently.
-- If using Supabase Auth (auth.users), a more complex script or dashboard manual entry is required.
-- This script assumes a custom 'users' table in the 'public' schema as seen in some parts of the code.

INSERT INTO public.users (id, username, password, name, role, jurusan_id) 
VALUES 
    (gen_random_uuid(), 'hod_tsm', '123', 'Okxy Ixganda, S.Pd', 'hod', '550e8400-e29b-41d4-a716-446655440003'),
    (gen_random_uuid(), 'hod_tkr', '123', 'Abdillah Putra, A.Md', 'hod', '550e8400-e29b-41d4-a716-446655440002'),
    (gen_random_uuid(), 'hod_mesin', '123', 'Dwi Nugroho, S.T', 'hod', '550e8400-e29b-41d4-a716-446655440001'),
    (gen_random_uuid(), 'hod_elektro', '123', 'Heru Triatmo,S.Pd. Gr', 'hod', '550e8400-e29b-41d4-a716-446655440004'),
    (gen_random_uuid(), 'hod_akuntansi', '123', 'Kiki Widia Swara,S.Pd. Gr', 'hod', '550e8400-e29b-41d4-a716-446655440007'),
    (gen_random_uuid(), 'hod_hotel', '123', 'Refty Royan Juniarti, S.Pd', 'hod', '550e8400-e29b-41d4-a716-446655440008'),
    (gen_random_uuid(), 'hod_tki', '123', 'Ryo Maytana, S.Pd', 'hod', '550e8400-e29b-41d4-a716-446655440006'),
    (gen_random_uuid(), 'hod_elin03', '123', 'Eldha Luvy Zha, A.Md', 'hod', '550e8400-e29b-41d4-a716-446655440004'),
    (gen_random_uuid(), 'hod_tsm03', '123', 'Heri Supriyanto,S.Pd', 'hod', '550e8400-e29b-41d4-a716-446655440003'),
    (gen_random_uuid(), 'hod_tkr03', '123', 'Rahmat Hidayat, S.Pd.Gr', 'hod', '550e8400-e29b-41d4-a716-446655440002')
ON CONFLICT (username) DO UPDATE SET 
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    jurusan_id = EXCLUDED.jurusan_id;
