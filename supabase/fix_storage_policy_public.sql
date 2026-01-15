-- FIX: Allow public/anonymous uploads (Idempotent Version)
-- Reason: The application uses custom authentication (AuthContext) instead of native Supabase Auth.
-- Therefore, the client connection is treated as 'anonymous' by Supabase (no JWT token).
-- We must allow 'public' (anon) role to upload to this specific bucket.

-- 1. Drop ALL potentially conflicting policies first to ensure clean state
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
DROP POLICY IF EXISTS "Public Update" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;

-- 2. Create new PERMISSIVE policies for student-photos bucket

-- Allow anyone to upload to student-photos
CREATE POLICY "Public Upload"
ON storage.objects FOR INSERT
TO public
WITH CHECK ( bucket_id = 'student-photos' );

-- Allow anyone to update files in student-photos (optional, but good for retries)
CREATE POLICY "Public Update"
ON storage.objects FOR UPDATE
TO public
USING ( bucket_id = 'student-photos' );

-- Ensure Select is allowed
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'student-photos' );
