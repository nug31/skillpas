-- 1. Create the users table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    jurusan_id UUID REFERENCES public.jurusan(id),
    avatar_url TEXT,
    photo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable RLS and add basic policies (matching the project's current relaxed style)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read users" ON public.users;
CREATE POLICY "Anyone can read users" ON public.users FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert users" ON public.users;
CREATE POLICY "Anyone can insert users" ON public.users FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update users" ON public.users;
CREATE POLICY "Anyone can update users" ON public.users FOR UPDATE USING (true) WITH CHECK (true);

-- 3. Insert HOD accounts (matching JURUSAN_IDS from mockData.ts)
INSERT INTO public.users (username, password, name, role, jurusan_id) 
VALUES 
    ('hod_tsm', '123', 'Okxy Ixganda, S.Pd', 'hod', '550e8400-e29b-41d4-a716-446655440003'),
    ('hod_tkr', '123', 'Abdillah Putra, A.Md', 'hod', '550e8400-e29b-41d4-a716-446655440002'),
    ('hod_mesin', '123', 'Dwi Nugroho, S.T', 'hod', '550e8400-e29b-41d4-a716-446655440001'),
    ('hod_elektro', '123', 'Heru Triatmo,S.Pd. Gr', 'hod', '550e8400-e29b-41d4-a716-446655440004'),
    ('hod_akuntansi', '123', 'Kiki Widia Swara,S.Pd. Gr', 'hod', '550e8400-e29b-41d4-a716-446655440007'),
    ('hod_hotel', '123', 'Refty Royan Juniarti, S.Pd', 'hod', '550e8400-e29b-41d4-a716-446655440008'),
    ('hod_tki', '123', 'Ryo Maytana, S.Pd', 'hod', '550e8400-e29b-41d4-a716-446655440006'),
    ('hod_elin03', '123', 'Eldha Luvy Zha, A.Md', 'hod', '550e8400-e29b-41d4-a716-446655440004'),
    ('hod_tsm03', '123', 'Heri Supriyanto,S.Pd', 'hod', '550e8400-e29b-41d4-a716-446655440003'),
    ('hod_tkr03', '123', 'Rahmat Hidayat, S.Pd.Gr', 'hod', '550e8400-e29b-41d4-a716-446655440002')
ON CONFLICT (username) DO UPDATE SET 
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    jurusan_id = EXCLUDED.jurusan_id;
