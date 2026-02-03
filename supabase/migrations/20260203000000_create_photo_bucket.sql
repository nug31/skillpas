-- Migration: Create student-photos bucket and set up RLS policies
-- This allows direct image uploads for student profile photos.

-- 1. Create the bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('student-photos', 'student-photos', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Set up RLS Policies for the bucket
-- Note: We use relaxed policies to match the project's current state (Anyone can read/write).

-- Allow public read access to all files in the student-photos bucket
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'student-photos' );

-- Allow anyone to upload files to the student-photos bucket
CREATE POLICY "Anyone Can Upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'student-photos' );

-- Allow anyone to update/replace files in the student-photos bucket
CREATE POLICY "Anyone Can Update"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'student-photos' )
WITH CHECK ( bucket_id = 'student-photos' );

-- Allow anyone to delete files from the student-photos bucket
CREATE POLICY "Anyone Can Delete"
ON storage.objects FOR DELETE
USING ( bucket_id = 'student-photos' );
