-- Migration: 20260127000000_fix_missing_history.sql
-- Goal: Ensure all students have competency history records for all levels reached by their score.
-- This handles students who were imported with a score but didn't go through the KRS grading process.

DO $$
DECLARE
    siswa_record RECORD;
    lvl_record RECORD;
    today_date date := CURRENT_DATE;
BEGIN
    -- Loop through all students who have a skill score
    FOR siswa_record IN 
        SELECT s.id, s.nama, ss.skor
        FROM siswa s
        JOIN skill_siswa ss ON s.id = ss.siswa_id
    LOOP
        -- Find all levels reached by this student's score
        FOR lvl_record IN 
            SELECT id, nama_level 
            FROM level_skill 
            WHERE min_skor <= siswa_record.skor
        LOOP
            -- Check if history record already exists for this level
            IF NOT EXISTS (
                SELECT 1 
                FROM competency_history 
                WHERE siswa_id = siswa_record.id 
                AND level_id = lvl_record.id
            ) THEN
                -- Insert a baseline history record
                INSERT INTO competency_history (
                    siswa_id, 
                    level_id, 
                    unit_kompetensi, 
                    aktivitas_pembuktian, 
                    penilai, 
                    hasil, 
                    tanggal, 
                    catatan
                )
                VALUES (
                    siswa_record.id,
                    lvl_record.id,
                    'Kompetensi Dasar (Legacy/Import)',
                    'Verifikasi Data Awal',
                    'Sistem',
                    'Lulus',
                    today_date,
                    'Otomatis ditambahkan untuk sinkronisasi paspor'
                );
                
                RAISE NOTICE 'Added history for student %, level %', siswa_record.nama, lvl_record.nama_level;
            END IF;
        END LOOP;
    END LOOP;
END $$;
