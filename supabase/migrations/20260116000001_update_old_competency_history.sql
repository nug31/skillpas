-- ===================================================================
-- Migration: Update old competency_history records with full criteria
-- This maps short labels to full criteria based on level and jurusan
-- Run this AFTER running the seed_level_skill_jurusan.sql
-- ===================================================================

-- Update TKR students with old short labels
UPDATE competency_history ch
SET unit_kompetensi = (
    SELECT lsj.hasil_belajar
    FROM level_skill_jurusan lsj
    JOIN siswa s ON s.id = ch.siswa_id
    WHERE lsj.jurusan_id = s.jurusan_id
    AND lsj.level_id = ch.level_id
    LIMIT 1
)
WHERE EXISTS (
    SELECT 1 FROM siswa s 
    WHERE s.id = ch.siswa_id 
    AND EXISTS (SELECT 1 FROM level_skill_jurusan lsj WHERE lsj.jurusan_id = s.jurusan_id AND lsj.level_id = ch.level_id)
);

-- Verify the update
SELECT 
    ch.id,
    s.nama AS siswa_nama,
    j.nama_jurusan,
    ls.nama_level,
    LEFT(ch.unit_kompetensi, 100) as unit_kompetensi_preview,
    ch.hasil,
    ch.tanggal
FROM competency_history ch
JOIN siswa s ON s.id = ch.siswa_id
JOIN jurusan j ON j.id = s.jurusan_id
JOIN level_skill ls ON ls.id = ch.level_id
ORDER BY j.nama_jurusan, ch.tanggal DESC;
