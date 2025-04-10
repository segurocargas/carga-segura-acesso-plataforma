/*
  # Set up Storage bucket for vehicle photos
  
  1. Create storage bucket for vehicle photos
  2. Set up RLS policies for bucket access
  3. Enable public access to photos
*/

-- Create the storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('vehicle-photos', 'vehicle-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload vehicle photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'vehicle-photos'
  AND owner = auth.uid()
);

-- Allow authenticated users to update their own files
CREATE POLICY "Allow users to update their own photos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'vehicle-photos'
  AND owner = auth.uid()
)
WITH CHECK (
  bucket_id = 'vehicle-photos'
  AND owner = auth.uid()
);

-- Allow authenticated users to delete their own files
CREATE POLICY "Allow users to delete their own photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'vehicle-photos'
  AND owner = auth.uid()
);

-- Allow public read access to all files
CREATE POLICY "Allow public read access to vehicle photos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'vehicle-photos');