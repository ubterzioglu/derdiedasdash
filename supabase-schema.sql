-- Der Die Das Dash Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_races INTEGER DEFAULT 0,
  total_score INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Race results table
CREATE TABLE IF NOT EXISTS race_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  race_number INTEGER NOT NULL CHECK (race_number >= 1 AND race_number <= 10),
  score INTEGER NOT NULL DEFAULT 0,
  answers JSONB NOT NULL DEFAULT '[]'::jsonb,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, race_number)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_race_results_user_id ON race_results(user_id);
CREATE INDEX IF NOT EXISTS idx_race_results_race_number ON race_results(race_number);
CREATE INDEX IF NOT EXISTS idx_race_results_score ON race_results(score DESC);
CREATE INDEX IF NOT EXISTS idx_users_total_score ON users(total_score DESC);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE race_results ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
-- Allow anyone to read user data (for leaderboards)
CREATE POLICY "Allow public read access to users" ON users
  FOR SELECT USING (true);

-- Allow anyone to insert new users
CREATE POLICY "Allow public insert to users" ON users
  FOR INSERT WITH CHECK (true);

-- Allow users to update their own data (though we'll update via service key in practice)
CREATE POLICY "Allow public update to users" ON users
  FOR UPDATE USING (true);

-- RLS Policies for race_results table
-- Allow anyone to read race results (for leaderboards)
CREATE POLICY "Allow public read access to race_results" ON race_results
  FOR SELECT USING (true);

-- Allow anyone to insert race results
CREATE POLICY "Allow public insert to race_results" ON race_results
  FOR INSERT WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
