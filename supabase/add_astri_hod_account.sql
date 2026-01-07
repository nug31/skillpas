-- Add Astri Afmi Wulandari, S.Pd as HOD Listrik
INSERT INTO public.users (username, password, name, role, jurusan_id) 
VALUES (
    'hod_listrik', 
    '123', 
    'Astri Afmi Wulandari, S.Pd', 
    'hod', 
    '550e8400-e29b-41d4-a716-446655440005' -- JURUSAN_IDS.LISTRIK
)
ON CONFLICT (username) DO UPDATE SET 
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    jurusan_id = EXCLUDED.jurusan_id;
