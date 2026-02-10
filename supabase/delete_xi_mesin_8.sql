-- Deletion script for class "XI MESIN 8"
-- This script removes students, their skill records, history, discipline, and any assigned Wali Kelas.

BEGIN;

-- 1. Delete skill records for students in XI MESIN 8
DELETE FROM public.skill_siswa 
WHERE siswa_id IN (SELECT id FROM public.siswa WHERE kelas ILIKE 'XI MESIN 8');

-- 2. Delete competency history for students in XI MESIN 8
DELETE FROM public.competency_history 
WHERE siswa_id IN (SELECT id FROM public.siswa WHERE kelas ILIKE 'XI MESIN 8');

-- 3. Delete discipline records for students in XI MESIN 8
DELETE FROM public.student_discipline 
WHERE siswa_id IN (SELECT id FROM public.siswa WHERE kelas ILIKE 'XI MESIN 8');

-- 4. Delete students in XI MESIN 8
DELETE FROM public.siswa WHERE kelas ILIKE 'XI MESIN 8';

-- 5. Delete Wali Kelas assigned ONLY to XI MESIN 8
DELETE FROM public.users WHERE role = 'wali_kelas' AND kelas ILIKE 'XI MESIN 8';

COMMIT;
