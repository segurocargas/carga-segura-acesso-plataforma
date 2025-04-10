/*
  # Add consultations table

  1. New Tables
    - `consultations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `created_at` (timestamp)
      - `origin_state` (text)
      - `origin_city` (text)
      - `destination_state` (text)
      - `destination_city` (text)
      - `vehicles` (jsonb)
      - `total_value` (numeric)
      - `insurance_value` (numeric)
      - `percentage` (numeric)

  2. Security
    - Enable RLS on `consultations` table
    - Add policies for authenticated users to:
      - Insert their own consultations
      - Read their own consultations
*/

CREATE TABLE IF NOT EXISTS consultations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  origin_state text NOT NULL,
  origin_city text NOT NULL,
  destination_state text NOT NULL,
  destination_city text NOT NULL,
  vehicles jsonb NOT NULL,
  total_value numeric NOT NULL,
  insurance_value numeric NOT NULL,
  percentage numeric NOT NULL
);

ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own consultations"
  ON consultations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own consultations"
  ON consultations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX consultations_user_id_created_at_idx ON consultations(user_id, created_at DESC);