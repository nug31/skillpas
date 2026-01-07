-- Migration: Fix Bayu Sapta's Level
-- NISN: 0083581133, Score: 81
-- Should be 'Advanced' (76-89) instead of 'Mastery (Expert)' (90-100)

DO $$ 
DECLARE 
    target_siswa_id uuid;
    lvl_adv_id uuid;
    lvl_master_id uuid;
BEGIN
    -- 1. Correct the level of Bayu Sapta in skill_siswa
    SELECT id INTO target_siswa_id FROM siswa WHERE nisn = '0083581133' LIMIT 1;
    
    -- Get correct level IDs
    SELECT id INTO lvl_adv_id FROM level_skill WHERE nama_level = 'Advanced' LIMIT 1;
    SELECT id INTO lvl_master_id FROM level_skill WHERE nama_level = 'Mastery (Expert)' LIMIT 1;

    IF target_siswa_id IS NOT NULL THEN
        -- Update current skill level
        UPDATE skill_siswa 
        SET level_id = lvl_adv_id, 
            poin = 250 -- Keep points as they were or adjust if needed (Advanced is usually 250)
        WHERE siswa_id = target_siswa_id;

        -- 2. Correct latest competency history entry if it was marked as Master
        UPDATE competency_history
        SET level_id = lvl_adv_id
        WHERE siswa_id = target_siswa_id 
        AND level_id = lvl_master_id
        AND unit_kompetensi = 'Diagnosa EFI'; -- Specific to the incorrect entry found in migration
    END IF;
END $$;
