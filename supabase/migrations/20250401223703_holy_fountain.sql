/*
  # Update profiles table with additional fields
  
  1. Changes
    - Add CNH photo field
    - Add state and city fields
    - Add business type field
    
  2. Security
    - Maintain existing RLS policies
*/

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS cnh_photo text,
ADD COLUMN IF NOT EXISTS state text,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS business_type text CHECK (
  business_type IN (
    'patio',
    'transportadora',
    'cegonheiro',
    'guincho',
    'locadora',
    'concessionaria',
    'seminovos',
    'mudancas'
  )
);