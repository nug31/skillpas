-- ===================================================================
-- Script to verify and update competency_history data
-- ===================================================================

-- 1. Check current level_skill_jurusan data for ALL JURUSAN
-- This shows what criteria SHOULD be used for each level per jurusan
SELECT 
    lsj.jurusan_id,
    j.nama_jurusan,
    ls.nama_level,
    lsj.hasil_belajar AS criteria_json
FROM level_skill_jurusan lsj
JOIN jurusan j ON j.id = lsj.jurusan_id
JOIN level_skill ls ON ls.id = lsj.level_id
ORDER BY j.nama_jurusan, ls.urutan;

-- 2. Check current competency_history entries with simplified unit_kompetensi
-- These are the records that might need updating (ALL JURUSAN)
SELECT 
    ch.id,
    s.nama AS siswa_nama,
    j.nama_jurusan,
    ls.nama_level,
    ch.unit_kompetensi,
    ch.hasil,
    ch.tanggal
FROM competency_history ch
JOIN siswa s ON s.id = ch.siswa_id
JOIN jurusan j ON j.id = s.jurusan_id
JOIN level_skill ls ON ls.id = ch.level_id
ORDER BY j.nama_jurusan, ch.tanggal DESC;

-- 3. OPTIONAL: If you need to manually update a specific competency_history entry
-- Replace 'HISTORY_ID' with the actual ID from query above
-- Replace 'FULL_CRITERIA_TEXT' with the correct criteria text from level_skill_jurusan

-- UPDATE competency_history 
-- SET unit_kompetensi = 'Mampu Menerapkan Keselamatan dan kesehatan kerja (K3), Mampu Membaca Gambar Teknik, ...'
-- WHERE id = 'HISTORY_ID';

-- ===================================================================
-- NOTE: The `unit_kompetensi` field in `competency_history` stores
-- the criteria items selected by students during KRS submission.
-- If the full criteria are now in `level_skill_jurusan.hasil_belajar`,
-- new KRS submissions will automatically use the full text.
-- This script is for fixing OLD records only.
-- ===================================================================
