-- Migration: Add photo_url to siswa table
ALTER TABLE siswa ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- Update existing sample students with NULL photo_url (explicitly)
UPDATE siswa SET photo_url = NULL WHERE photo_url IS NULL;

-- Example: If we want to set a default for a specific student for testing
-- UPDATE siswa SET photo_url = 'https://example.com/photo.jpg' WHERE nama = 'Bayu Sapta';
