-- SQL for adding default Guru Produktif accounts for all majors
-- Password default: 123

INSERT INTO public.users (username, password, name, role, jurusan_id)
VALUES
    ('prod_mesin', '123', 'Guru Produktif Mesin', 'teacher_produktif', '550e8400-e29b-41d4-a716-446655440001'),
    ('prod_tkr', '123', 'Guru Produktif TKR', 'teacher_produktif', '550e8400-e29b-41d4-a716-446655440002'),
    ('prod_tsm', '123', 'Guru Produktif TSM', 'teacher_produktif', '550e8400-e29b-41d4-a716-446655440003'),
    ('prod_elind', '123', 'Guru Produktif Elind', 'teacher_produktif', '550e8400-e29b-41d4-a716-446655440004'),
    ('prod_listrik', '123', 'Guru Produktif Listrik', 'teacher_produktif', '550e8400-e29b-41d4-a716-446655440005'),
    ('prod_kimia', '123', 'Guru Produktif Kimia', 'teacher_produktif', '550e8400-e29b-41d4-a716-446655440006'),
    ('prod_akuntansi', '123', 'Guru Produktif Akuntansi', 'teacher_produktif', '550e8400-e29b-41d4-a716-446655440007'),
    ('prod_hotel', '123', 'Guru Produktif Perhotelan', 'teacher_produktif', '550e8400-e29b-41d4-a716-446655440008')
ON CONFLICT (username) 
DO UPDATE SET 
    role = EXCLUDED.role,
    jurusan_id = EXCLUDED.jurusan_id;
