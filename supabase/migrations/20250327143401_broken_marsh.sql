/*
  # Add vehicle photo storage capabilities
  
  1. Enable Large Object support for storing photos
  2. Add photo metadata columns to consultations table
  
  This migration adds proper support for storing vehicle photos and their metadata
*/

-- Enable the lo extension for Large Object support
CREATE EXTENSION IF NOT EXISTS lo;

-- Add a vehicles_photos column to store photo metadata
ALTER TABLE consultations
ADD COLUMN IF NOT EXISTS vehicles_photos jsonb DEFAULT '[]'::jsonb;

-- Create an index on the vehicles_photos column for better query performance
CREATE INDEX IF NOT EXISTS idx_consultations_vehicles_photos ON consultations USING gin (vehicles_photos);

-- Add a policy to allow users to access their own photos
CREATE POLICY "Users can access their own photos"
  ON consultations
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);