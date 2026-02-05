-- FIX: Synchronize users.jurusan_id with actual jurusan table IDs
-- This fixes issues where hardcoded UUIDs in setup scripts don't match 
-- the randomly generated IDs in the production database.

-- Update by matching the 'kelas' column patterns to the correct Jurusan
UPDATE public.users
SET jurusan_id = (SELECT id FROM public.jurusan WHERE nama_jurusan = 'Teknik Kendaraan Ringan')
WHERE kelas LIKE '%TKR%' OR username LIKE '%tkr%';

UPDATE public.users
SET jurusan_id = (SELECT id FROM public.jurusan WHERE nama_jurusan = 'Teknik Mesin')
WHERE kelas LIKE '%MESIN%' OR kelas LIKE '%MES%' OR username LIKE '%mesin%' OR username LIKE '%mes_';

UPDATE public.users
SET jurusan_id = (SELECT id FROM public.jurusan WHERE nama_jurusan = 'Teknik Sepeda Motor')
WHERE kelas LIKE '%TSM%' OR kelas LIKE '%TBSM%' OR username LIKE '%tsm%';

UPDATE public.users
SET jurusan_id = (SELECT id FROM public.jurusan WHERE nama_jurusan = 'Teknik Elektronika Industri')
WHERE kelas LIKE '%ELIN%' OR kelas LIKE '%ELI%' OR username LIKE '%elin%';

UPDATE public.users
SET jurusan_id = (SELECT id FROM public.jurusan WHERE nama_jurusan = 'Teknik Instalasi Tenaga Listrik')
WHERE kelas LIKE '%LIS%' OR kelas LIKE '%TITL%' OR username LIKE '%lis%';

UPDATE public.users
SET jurusan_id = (SELECT id FROM public.jurusan WHERE nama_jurusan = 'Teknik Kimia Industri')
WHERE kelas LIKE '%TKI%' OR kelas LIKE '%KIMIA%' OR username LIKE '%kimia%';

UPDATE public.users
SET jurusan_id = (SELECT id FROM public.jurusan WHERE nama_jurusan = 'Akuntansi')
WHERE kelas LIKE '%AK%' OR username LIKE '%ak%';

UPDATE public.users
SET jurusan_id = (SELECT id FROM public.jurusan WHERE nama_jurusan = 'Perhotelan')
WHERE kelas LIKE '%HOTEL%' OR username LIKE '%hotel%';

-- Explicitly fix pak joko just in case
UPDATE public.users
SET jurusan_id = (SELECT id FROM public.jurusan WHERE nama_jurusan = 'Teknik Kendaraan Ringan')
WHERE name LIKE '%Joko Setyo Nugroho%';
