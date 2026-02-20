-- DEMO SEEDING SCRIPT: Randomly populate scores for ALL MAJORS
-- Use this to create a VIBRANT race with different positions.

DO $$
DECLARE
    j_record RECORD;
BEGIN
    -- Loop through all known majors
    FOR j_record IN SELECT id, nama_jurusan FROM public.jurusan LOOP
        
        RAISE NOTICE 'Seeding scores for %...', j_record.nama_jurusan;

        -- Update skill scores for students in this major
        -- We give slightly different ranges to create leaders and laggers naturally
        -- Mesin: Strong (70-95)
        -- TKR: Strong (65-90)
        -- Others: Average (50-85)
        
        UPDATE public.skill_siswa ss
        SET skor = CASE 
            WHEN j_record.nama_jurusan ILIKE '%Mesin%' THEN floor(random() * (95-70+1) + 70)
            WHEN j_record.nama_jurusan ILIKE '%Kendaraan%' THEN floor(random() * (90-65+1) + 65)
            ELSE floor(random() * (85-50+1) + 50)
        END,
        updated_at = now()
        FROM public.siswa s
        WHERE ss.siswa_id = s.id
        AND s.jurusan_id = j_record.id;

    END LOOP;

    RAISE NOTICE 'All majors seeded with random scores relative to their tier.';
END $$;
