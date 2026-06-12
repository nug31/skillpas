-- ===================================================================
-- Fix: Hapus competency_history yang salah untuk siswa skor 0
-- 
-- Masalah: Siswa dengan skor 0 mendapat stempel "Beginner" karena
-- ensureBaselineHistory / import membuat history entry saat
-- score >= min_skor (0 >= 0 = true).
--
-- Script ini menghapus semua entry di competency_history
-- untuk siswa yang masih memiliki skor 0 di skill_siswa.
-- ===================================================================

-- 1. Preview: Lihat data yang akan dihapus (jalankan dulu untuk cek)
SELECT 
    ch.id AS history_id,
    ch.siswa_id,
    s.nama AS nama_siswa,
    s.kelas,
    ss.skor,
    ch.unit_kompetensi,
    ch.penilai,
    ch.tanggal
FROM competency_history ch
JOIN siswa s ON s.id = ch.siswa_id
JOIN skill_siswa ss ON ss.siswa_id = ch.siswa_id
WHERE ss.skor = 0
ORDER BY s.nama, ch.tanggal;

-- 2. Hapus competency_history yang salah untuk siswa dengan skor 0 (hanya yang dibuat oleh sistem)
DELETE FROM competency_history
WHERE siswa_id IN (
    SELECT ss.siswa_id 
    FROM skill_siswa ss 
    WHERE ss.skor = 0
)
AND penilai = 'Sistem';

-- 3. (Opsional) Hapus juga entry yang dibuat oleh sistem (Import/Sync)
--    untuk SEMUA siswa, bukan hanya skor 0.
--    Uncomment jika ingin membersihkan semua baseline history palsu.
--
-- DELETE FROM competency_history
-- WHERE penilai = 'Sistem'
--   AND unit_kompetensi IN ('Kompetensi Dasar (Import)', 'Kompetensi Dasar (Sync)');
