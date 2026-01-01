-- SQL script to add history data for Naufal (12 TKR 3)

BEGIN;

-- 1. Find the Jurusan ID for TKR
DO $$
DECLARE
    jurusan_id_tkr uuid;
    siswa_id_naufal uuid;
    lvl_basic uuid;
    lvl_inter uuid;
    lvl_adv uuid;
BEGIN
    SELECT id INTO jurusan_id_tkr FROM jurusan WHERE nama_jurusan = 'Teknik Kendaraan Ringan' LIMIT 1;
    
    -- 2. Insert Naufal if not exists
    INSERT INTO siswa (nama, kelas, jurusan_id)
    SELECT 'Naufal', 'XII TKR 3', jurusan_id_tkr
    WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Naufal' AND jurusan_id = jurusan_id_tkr)
    RETURNING id INTO siswa_id_naufal;

    -- If student already existed, get their ID
    IF siswa_id_naufal IS NULL THEN
        SELECT id INTO siswa_id_naufal FROM siswa WHERE nama = 'Naufal' AND jurusan_id = jurusan_id_tkr LIMIT 1;
    END IF;

    -- 3. Get level IDs
    SELECT id INTO lvl_basic FROM level_skill WHERE nama_level = 'Pemula / Beginner' LIMIT 1;
    SELECT id INTO lvl_inter FROM level_skill WHERE nama_level = 'Intermediate' LIMIT 1;
    SELECT id INTO lvl_adv FROM level_skill WHERE nama_level = 'Advanced' LIMIT 1;

    -- 4. Insert Skill record (Advanced level)
    INSERT INTO skill_siswa (siswa_id, level_id, skor)
    SELECT siswa_id_naufal, lvl_adv, 72
    WHERE NOT EXISTS (SELECT 1 FROM skill_siswa WHERE siswa_id = siswa_id_naufal);

    -- Note: The current schema doesn't have a dedicated "competency_history" table in the .sql file I saw.
    -- It seems mockCompetencyHistory is a frontend-only mock or might be stored differently.
    -- If there's a table for it, we would insert here. 
    -- Based on the schema I read, only 'skill_siswa' tracks scores/levels.
    -- If the user wants to ADD a table for history, that's a different task.
    -- I will assume for now only the skill record is needed in the DB to show the level.
END $$;

COMMIT;
