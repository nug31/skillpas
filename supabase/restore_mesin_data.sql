-- RESTORATION SCRIPT: Teknik Mesin Student Data
-- This script re-populates the students and their initial scores.

DO $$
DECLARE
    j_id uuid;
    lvl_basic1 uuid;
    lvl_basic2 uuid;
    lvl_inter uuid;
    lvl_adv uuid;
    lvl_master uuid;
BEGIN
    -- 1. Get Jurusan ID for Teknik Mesin
    SELECT id INTO j_id FROM public.jurusan WHERE nama_jurusan ILIKE 'Teknik Mesin' LIMIT 1;
    
    IF j_id IS NULL THEN
        RAISE EXCEPTION 'Jurusan Teknik Mesin not found';
    END IF;

    -- 2. Get Level IDs by urutan (more reliable than names)
    SELECT id INTO lvl_basic1 FROM public.level_skill WHERE urutan = 1 LIMIT 1;
    SELECT id INTO lvl_basic2 FROM public.level_skill WHERE urutan = 2 LIMIT 1;
    SELECT id INTO lvl_inter  FROM public.level_skill WHERE urutan = 3 LIMIT 1;
    SELECT id INTO lvl_adv    FROM public.level_skill WHERE urutan = 4 LIMIT 1;
    SELECT id INTO lvl_master FROM public.level_skill WHERE urutan = 5 LIMIT 1;

    -- 3. Restore Students
    -- Note: Using a temp table to track new IDs if needed, but here we just use names for simplicity in skills insert
    INSERT INTO public.siswa (nama, kelas, jurusan_id, nisn) VALUES
        ('Raka Aji', 'XII MESIN 1', j_id, '11111'),
        ('Dewi Susanti', 'XII MESIN 1', j_id, '11112'),
        ('Budi Santoso', 'XII MESIN 2', j_id, '11113'),
        ('Siti Nurhayati', 'XII MESIN 2', j_id, '11114'),
        ('Oki Setiawan', 'XII MESIN 4 03', j_id, '31111'),
        ('Pandu Winata', 'XII MESIN 4 03', j_id, '31112'),
        ('Qori Ananda', 'XII MESIN 4 03', j_id, '31113'),
        ('Siswa Mesin', 'XII MESIN 1', j_id, '12345'),
        ('Raka Aditya', 'XII TKR 1', j_id, '0012345678')
    ON CONFLICT (nisn) DO NOTHING;

    -- 4. Restore Skill Records
    -- Raka Aji (Master)
    INSERT INTO public.skill_siswa (siswa_id, level_id, skor, poin)
    SELECT s.id, lvl_master, 98, 300 FROM public.siswa s 
    WHERE s.nama = 'Raka Aji' AND s.jurusan_id = j_id 
    AND NOT EXISTS (SELECT 1 FROM public.skill_siswa ss WHERE ss.siswa_id = s.id);

    -- Dewi Susanti (Advance)
    INSERT INTO public.skill_siswa (siswa_id, level_id, skor, poin)
    SELECT s.id, lvl_adv, 84, 250 FROM public.siswa s 
    WHERE s.nama = 'Dewi Susanti' AND s.jurusan_id = j_id 
    AND NOT EXISTS (SELECT 1 FROM public.skill_siswa ss WHERE ss.siswa_id = s.id);

    -- Budi Santoso (Specialist/Intermediate)
    INSERT INTO public.skill_siswa (siswa_id, level_id, skor, poin)
    SELECT s.id, lvl_inter, 68, 200 FROM public.siswa s 
    WHERE s.nama = 'Budi Santoso' AND s.jurusan_id = j_id 
    AND NOT EXISTS (SELECT 1 FROM public.skill_siswa ss WHERE ss.siswa_id = s.id);

    -- Siswa Mesin (Specialist/Intermediate)
    INSERT INTO public.skill_siswa (siswa_id, level_id, skor, poin)
    SELECT s.id, lvl_inter, 72, 200 FROM public.siswa s 
    WHERE s.nama = 'Siswa Mesin' AND s.jurusan_id = j_id 
    AND NOT EXISTS (SELECT 1 FROM public.skill_siswa ss WHERE ss.siswa_id = s.id);

    -- Kampus 03 students (Basic 1)
    INSERT INTO public.skill_siswa (siswa_id, level_id, skor, poin)
    SELECT s.id, lvl_basic1, 15, 100 FROM public.siswa s 
    WHERE s.jurusan_id = j_id AND s.kelas LIKE '%03'
    AND NOT EXISTS (SELECT 1 FROM public.skill_siswa ss WHERE ss.siswa_id = s.id);

END $$;
