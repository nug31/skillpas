-- Migration: Restructure Competency Levels and Score Ranges
-- Current levels: 4 levels (0-25, 26-50, 51-75, 76-100)
-- New levels: 5 levels with tighter ranges and PKL milestones

-- 1. Clean existing levels (to avoid conflicts or messy updates)
-- We'll use a transaction/safe approach. 
-- Since skill_siswa references level_skill, we should update instead of delete if possible, 
-- but restructuring IDs might be better for 5 levels.

DO $$
BEGIN
    -- Update existing level names and ranges
    
    -- Level 1: Beginner 1 (Syarat PKL)
    UPDATE level_skill 
    SET nama_level = 'Beginner 1 (Internal Prep)', 
        min_skor = 0, 
        max_skor = 25, 
        badge_name = 'Basic 1', 
        hasil_belajar = 'Syarat Kelayakan PKL: Memahami dasar industri dan K3',
        urutan = 1
    WHERE urutan = 1;

    -- Level 2: Beginner 2 (Setelah PKL) - This is a NEW level in the middle
    -- We need to shift others up or insert.
    IF NOT EXISTS (SELECT 1 FROM level_skill WHERE nama_level = 'Beginner 2 (Industrial Ready)') THEN
        INSERT INTO level_skill (nama_level, urutan, min_skor, max_skor, badge_name, badge_color, hasil_belajar, soft_skill)
        VALUES ('Beginner 2 (Industrial Ready)', 2, 26, 50, 'Basic 2', '#64748b', 'Pasca PKL: Mampu menerapkan budaya industri di lingkungan sekolah', 'Adaptabilitas Industri');
    END IF;

    -- Shift Intermediate to 3
    UPDATE level_skill 
    SET nama_level = 'Intermediate (Specialist)', 
        min_skor = 51, 
        max_skor = 75, 
        badge_name = 'Specialist', 
        badge_color = '#3b82f6',
        hasil_belajar = 'Fokus Spesialisasi: Menguasai kompetensi utama sesuai jurusan',
        urutan = 3
    WHERE urutan = 2 AND nama_level = 'Intermediate';

    -- Shift Advanced to 4
    UPDATE level_skill 
    SET nama_level = 'Advanced', 
        min_skor = 76, 
        max_skor = 89, 
        badge_name = 'Advance', 
        badge_color = '#f59e0b',
        urutan = 4
    WHERE urutan = 3 AND nama_level = 'Advanced';

    -- Shift Mastery to 5
    UPDATE level_skill 
    SET nama_level = 'Mastery (Expert)', 
        min_skor = 90, 
        max_skor = 100, 
        badge_name = 'Master', 
        badge_color = '#10b981',
        urutan = 5
    WHERE urutan = 4 AND nama_level = 'Mastery';

    -- 6. Synchronize all students to the new ranges
    -- Re-assign level_id and update poin based on current scores
    UPDATE skill_siswa ss
    SET 
        level_id = ls.id,
        poin = ls.urutan * 50 + 50,
        updated_at = now()
    FROM level_skill ls
    WHERE ss.skor BETWEEN ls.min_skor AND ls.max_skor;

    -- Optional: Sync competency history level_ids if they were hardcoded/referencing old logic
    -- (Only for the latest entry per student to be safe, but simple sync is usually fine for dev)
    UPDATE competency_history ch
    SET level_id = ls.id
    FROM level_skill ls, skill_siswa ss
    WHERE ch.siswa_id = ss.siswa_id 
    AND ss.skor BETWEEN ls.min_skor AND ls.max_skor
    AND ch.level_id != ls.id; -- Sync if different (simplified)

END $$;
