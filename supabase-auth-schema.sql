-- Supabase Auth Schema for Der Die Das Dash
-- Run this in your Supabase SQL Editor after enabling Auth

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Scores table (extends auth.users)
CREATE TABLE IF NOT EXISTS scores (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  best_score INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_scores_best_score ON scores(best_score DESC);
CREATE INDEX IF NOT EXISTS idx_scores_updated_at ON scores(updated_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for clean setup)
DROP POLICY IF EXISTS "Users can view their own scores" ON scores;
DROP POLICY IF EXISTS "Users can insert their own scores" ON scores;
DROP POLICY IF EXISTS "Users can update their own scores" ON scores;

-- RLS Policies for scores table
-- SELECT: Users can only view their own score
CREATE POLICY "Users can view their own scores" ON scores
  FOR SELECT USING (auth.uid() = user_id);

-- INSERT: Users can only insert scores with their own user_id
CREATE POLICY "Users can insert their own scores" ON scores
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can only update their own scores
CREATE POLICY "Users can update their own scores" ON scores
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_scores_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_scores_updated_at ON scores;
CREATE TRIGGER update_scores_updated_at
  BEFORE UPDATE ON scores
  FOR EACH ROW
  EXECUTE FUNCTION update_scores_updated_at();

-- Function to upsert best score (only increase if new score is higher)
CREATE OR REPLACE FUNCTION upsert_best_score(p_user_id UUID, p_new_score INTEGER)
RETURNS INTEGER AS $$
DECLARE
  current_best INTEGER;
  final_score INTEGER;
BEGIN
  -- Get current best score
  SELECT COALESCE(best_score, 0) INTO current_best
  FROM scores
  WHERE user_id = p_user_id;

  -- Only update if new score is higher
  IF p_new_score > current_best THEN
    INSERT INTO scores (user_id, best_score)
    VALUES (p_user_id, p_new_score)
    ON CONFLICT (user_id)
    DO UPDATE SET 
      best_score = p_new_score,
      updated_at = NOW();
    final_score := p_new_score;
  ELSE
    final_score := current_best;
  END IF;

  RETURN final_score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
