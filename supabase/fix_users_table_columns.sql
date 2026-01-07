-- Run this if the "users" table already exists but is missing columns
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS kelas TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS nisn TEXT;
