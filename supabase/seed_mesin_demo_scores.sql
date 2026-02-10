-- DEMO SEEDING SCRIPT: Randomly populate scores for Teknik Mesin
-- Use this ONLY for testing the race track animations.

DO $$
DECLARE
    j_id uuid;
BEGIN
    -- 1. Get Jurusan ID for Teknik Mesin
    SELECT id INTO j_id FROM public.jurusan WHERE nama_jurusan ILIKE 'Teknik Mesin' LIMIT 1;
    
    IF j_id IS NULL THEN
        RAISE NOTICE 'Jurusan Teknik Mesin not found';
        RETURN;
    END IF;

    -- 2. Update existing skill records with random scores (50-95) for the TOP 10
    -- This assumes initialize_mesin_scores.sql has been run
    UPDATE public.skill_siswa ss
    SET skor = floor(random() * (95-50+1) + 50),
        updated_at = now()
    FROM public.siswa s
    WHERE ss.siswa_id = s.id
    AND s.jurusan_id = j_id
    AND s.id IN (
        SELECT id FROM public.siswa 
        WHERE jurusan_id = j_id 
        ORDER BY nama ASC LIMIT 10
    );

    RAISE NOTICE 'Seeded random scores for the first 10 students in Teknik Mesin.';
END $$;
