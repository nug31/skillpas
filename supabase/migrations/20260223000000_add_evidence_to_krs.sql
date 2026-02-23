-- Create a new migration file: supabase\migrations\20260223000000_add_evidence_to_krs.sql
ALTER TABLE krs 
ADD COLUMN IF NOT EXISTS evidence_photos text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS evidence_videos text[] DEFAULT '{}';

-- Optional: Update RLS if needed (but current policies are "Anyone can update", so it should work)
