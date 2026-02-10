-- INITIALIZATION SCRIPT: Ensure all Teknik Mesin students have a skill record
-- This fixes the issue where the F1 Race Track shows 0.0 for all students.

DO $$
DECLARE
    j_id uuid;
    lvl_basic1 uuid;
BEGIN
    -- 1. Get Jurusan ID for Teknik Mesin
    SELECT id INTO j_id FROM public.jurusan WHERE nama_jurusan ILIKE 'Teknik Mesin' LIMIT 1;
    
    IF j_id IS NULL THEN
        RAISE NOTICE 'Jurusan Teknik Mesin not found';
        RETURN;
    END IF;

    -- 2. Get the lowest level ID (urutan = 1)
    SELECT id INTO lvl_basic1 FROM public.level_skill WHERE urutan = 1 LIMIT 1;

    -- 3. Insert missing skill records with score 0
    INSERT INTO public.skill_siswa (siswa_id, level_id, skor, poin, created_at, updated_at)
    SELECT s.id, lvl_basic1, 0, 50, now(), now()
    FROM public.siswa s
    WHERE s.jurusan_id = j_id
    AND NOT EXISTS (
        SELECT 1 FROM public.skill_siswa ss WHERE ss.siswa_id = s.id
    );

    RAISE NOTICE 'Initialized skill records for Teknik Mesin students who had none.';
END $$;
