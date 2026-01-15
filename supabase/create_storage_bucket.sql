-- Enable the storage extension if not already enabled (usually enabled by default in Supabase)
-- CREATE EXTENSION IF NOT EXISTS storage SCHEMA extensions;

-- Create the bucket 'student-photos'
INSERT INTO storage.buckets (id, name, public)
VALUES ('student-photos', 'student-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Allow public read access to all files in the bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'student-photos' );

-- Policy: Allow authenticated users to upload files
-- We restrict this to creating objects (uploads)
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'student-photos' );

-- Policy: Allow users to update their own files (optional, but good for re-uploads)
-- Ideally we'd check if the file name contains their ID, but for now we'll allow authenticated updates
CREATE POLICY "Authenticated Update"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'student-photos' );
