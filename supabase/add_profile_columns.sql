-- FIX: Add missing profile photo columns to tables
-- Reason: The application attempts to save 'avatar_url' and 'photo_url' but the database tables lack these columns.

-- 1. Add columns to 'siswa' table
ALTER TABLE public.siswa 
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- 2. Add columns to 'users' table (for teachers/staff)
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- 3. Update the schema cache (handled automatically by Supabase usually, but good to know)
-- The error "Could not find column in schema cache" usually resolves after ALTER TABLE.
