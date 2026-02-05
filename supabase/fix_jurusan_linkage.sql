-- FIX: Synchronize users.jurusan_id with actual jurusan table IDs
-- This fixes issues where hardcoded UUIDs in setup scripts don't match 
-- the randomly generated IDs in the production database.

-- Update Pak Joko specifically
UPDATE public.users
SET jurusan_id = (SELECT id FROM public.jurusan WHERE nama_jurusan = 'Teknik Kendaraan Ringan')
WHERE username = 'joko_tkr';

-- Update all other staff based on their current assigned jurusan (if any linkage exists)
-- Or more safely, update based on a mapping if we had one.
-- For now, we'll ensure the productifs and HODs are linked correctly if they have a name reference.

UPDATE public.users
SET jurusan_id = (SELECT id FROM public.jurusan WHERE nama_jurusan = 'Teknik Kendaraan Ringan')
WHERE username IN ('prod_tkr', 'hod_tkr', 'walas_joko');

UPDATE public.users
SET jurusan_id = (SELECT id FROM public.jurusan WHERE nama_jurusan = 'Teknik Mesin')
WHERE username IN ('prod_mesin', 'hod_mesin');

UPDATE public.users
SET jurusan_id = (SELECT id FROM public.jurusan WHERE nama_jurusan = 'Teknik Sepeda Motor')
WHERE username IN ('prod_tsm', 'hod_tsm');

UPDATE public.users
SET jurusan_id = (SELECT id FROM public.jurusan WHERE nama_jurusan = 'Teknik Elektronika Industri')
WHERE username IN ('prod_elind', 'hod_elind');

UPDATE public.users
SET jurusan_id = (SELECT id FROM public.jurusan WHERE nama_jurusan = 'Teknik Instalasi Tenaga Listrik')
WHERE username IN ('prod_listrik', 'hod_listrik');

UPDATE public.users
SET jurusan_id = (SELECT id FROM public.jurusan WHERE nama_jurusan = 'Teknik Kimia Industri')
WHERE username IN ('prod_kimia', 'hod_kimia');

UPDATE public.users
SET jurusan_id = (SELECT id FROM public.jurusan WHERE nama_jurusan = 'Akuntansi')
WHERE username IN ('prod_akuntansi', 'hod_akuntansi');

UPDATE public.users
SET jurusan_id = (SELECT id FROM public.jurusan WHERE nama_jurusan = 'Perhotelan')
WHERE username IN ('prod_hotel', 'hod_hotel');
