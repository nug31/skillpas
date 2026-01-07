-- Query to check students with missing or empty NISN
-- These students UNABLE to login until NISN is provided.

SELECT id, nama, kelas, nisn 
FROM public.siswa 
WHERE nisn IS NULL OR nisn = '';

-- Query to count students with vs without NISN
SELECT 
    COUNT(*) FILTER (WHERE nisn IS NOT NULL AND nisn != '') as has_nisn,
    COUNT(*) FILTER (WHERE nisn IS NULL OR nisn = '') as missing_nisn
FROM public.siswa;
