-- ================================================
-- THE CHAMOMILE GARDEN — Supabase Setup
-- Run this entire file in your Supabase SQL Editor
-- ================================================

-- 1. Create the poems table
CREATE TABLE IF NOT EXISTS poems (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at timestamptz DEFAULT now(),
  title text NOT NULL,
  content text NOT NULL,
  icon_id text NOT NULL DEFAULT '🌸',
  tag_name text NOT NULL DEFAULT 'SOUL',
  water_count int4 NOT NULL DEFAULT 0
);

-- 2. Enable Row Level Security
ALTER TABLE poems ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies (safe to re-run)
DROP POLICY IF EXISTS "Public can read poems" ON poems;
DROP POLICY IF EXISTS "Anon can insert poems" ON poems;
DROP POLICY IF EXISTS "Anon can update poems" ON poems;
DROP POLICY IF EXISTS "Anon can delete poems" ON poems;

-- 4. Public read — everyone can see poems
CREATE POLICY "Public can read poems"
  ON poems FOR SELECT
  USING (true);

-- 5. Admin write access (gated by frontend password, anon key used)
CREATE POLICY "Anon can insert poems"
  ON poems FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anon can update poems"
  ON poems FOR UPDATE
  USING (true);

CREATE POLICY "Anon can delete poems"
  ON poems FOR DELETE
  USING (true);

-- 6. Increment water count safely (SECURITY DEFINER bypasses RLS)
CREATE OR REPLACE FUNCTION increment_water(poem_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE poems
  SET water_count = water_count + 1
  WHERE id = poem_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Done! Your garden is ready to bloom 🌸
