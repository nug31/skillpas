-- FIX: Allow public/anonymous updates to 'siswa' and 'users' tables
-- Reason: The application uses custom authentication (AuthContext) instead of native Supabase Auth.
-- Therefore, Supabase sees all requests as 'anonymous' (public role).
-- The default policies restrict updates to 'authenticated' users, causing profile updates to fail.

-- 1. Fix 'siswa' table policies
-- Drop existing restrictive policies if needed (or just add new permissive one)
DROP POLICY IF EXISTS "Public can update siswa" ON public.siswa;
CREATE POLICY "Public can update siswa"
ON public.siswa
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Ensure Insert is also allowed (if needed for registration, though strictly we might want to restrict this)
-- For now, focused on profile update (UPDATE)

-- 2. Fix 'users' table policies (for Teachers/Staff)
DROP POLICY IF EXISTS "Public can update users" ON public.users;
CREATE POLICY "Public can update users"
ON public.users
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- 3. Ensure Select policies exist
DROP POLICY IF EXISTS "Public can view siswa" ON public.siswa;
CREATE POLICY "Public can view siswa"
ON public.siswa
FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Public can view users" ON public.users;
CREATE POLICY "Public can view users"
ON public.users
FOR SELECT
TO public
USING (true);

-- 4. Fix 'skill_siswa' table policies
DROP POLICY IF EXISTS "Public can update skill_siswa" ON public.skill_siswa;
CREATE POLICY "Public can update skill_siswa"
ON public.skill_siswa
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Public can insert skill_siswa" ON public.skill_siswa;
CREATE POLICY "Public can insert skill_siswa"
ON public.skill_siswa
FOR INSERT
TO public
WITH CHECK (true);

-- 5. Fix 'competency_history' table policies
DROP POLICY IF EXISTS "Public can update competency_history" ON public.competency_history;
CREATE POLICY "Public can update competency_history"
ON public.competency_history
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Public can insert competency_history" ON public.competency_history;
CREATE POLICY "Public can insert competency_history"
ON public.competency_history
FOR INSERT
TO public
WITH CHECK (true);
