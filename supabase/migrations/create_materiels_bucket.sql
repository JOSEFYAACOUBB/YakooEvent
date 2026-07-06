-- ─── Fix 'materiels' Storage Bucket RLS ──────────────────────────────────────
-- Run this in: Supabase Dashboard → SQL Editor → New Query

-- 1. Make sure the bucket is public
UPDATE storage.buckets
SET public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
WHERE id = 'materiels';

-- If the bucket doesn't exist yet, create it
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('materiels', 'materiels', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

-- 2. Drop existing policies that might be blocking (ignore errors if they don't exist)
DROP POLICY IF EXISTS "Allow uploads"       ON storage.objects;
DROP POLICY IF EXISTS "Allow public read"   ON storage.objects;
DROP POLICY IF EXISTS "Allow delete"        ON storage.objects;
DROP POLICY IF EXISTS "Allow update"        ON storage.objects;

-- 3. Allow ALL operations for anon and authenticated on the materiels bucket
CREATE POLICY "materiels_insert" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'materiels');

CREATE POLICY "materiels_select" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'materiels');

CREATE POLICY "materiels_update" ON storage.objects
  FOR UPDATE TO anon, authenticated
  USING (bucket_id = 'materiels');

CREATE POLICY "materiels_delete" ON storage.objects
  FOR DELETE TO anon, authenticated
  USING (bucket_id = 'materiels');

-- Done! Upload should now work.
