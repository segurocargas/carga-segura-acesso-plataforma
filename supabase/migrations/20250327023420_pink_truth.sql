/*
  # Add company and phone fields to profiles
  
  1. Changes
    - Add company_name field (optional)
    - Add phone1 field
    - Add phone2 field (optional)
    - Add latitude and longitude fields
*/

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS company_name text,
ADD COLUMN IF NOT EXISTS phone1 text,
ADD COLUMN IF NOT EXISTS phone2 text,
ADD COLUMN IF NOT EXISTS latitude numeric,
ADD COLUMN IF NOT EXISTS longitude numeric;