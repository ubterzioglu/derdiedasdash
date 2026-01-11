-- ============================================
-- DER DIE DAS SPACE - DATABASE SCHEMA
-- Supabase PostgreSQL Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. USERS TABLE
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(100),
  auth_provider VARCHAR(50) NOT NULL, -- 'google' or 'supabase'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

-- ============================================
-- 2. GAME TYPES TABLE
-- ============================================
CREATE TABLE game_types (
  id SERIAL PRIMARY KEY,
  game_code VARCHAR(50) UNIQUE NOT NULL,
  game_name_tr VARCHAR(100) NOT NULL,
  game_name_en VARCHAR(100) NOT NULL,
  game_description_tr TEXT,
  game_description_en TEXT,
  is_active BOOLEAN DEFAULT true,
  requires_translation BOOLEAN DEFAULT false,
  timer_seconds INT NOT NULL,
  base_score INT NOT NULL,
  release_version VARCHAR(10),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. WORD SETS TABLE
-- ============================================
CREATE TABLE word_sets (
  id SERIAL PRIMARY KEY,
  game_type_id INT NOT NULL REFERENCES game_types(id),
  set_number INT NOT NULL,
  difficulty_level SMALLINT NOT NULL CHECK (difficulty_level BETWEEN 1 AND 5),
  is_demo BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(game_type_id, set_number)
);

CREATE INDEX idx_word_sets_game_type ON word_sets(game_type_id);
CREATE INDEX idx_word_sets_level ON word_sets(difficulty_level);

-- ============================================
-- 4. QUESTIONS TABLE
-- ============================================
CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  set_id INT NOT NULL REFERENCES word_sets(id) ON DELETE CASCADE,
  question_data JSONB NOT NULL,
  order_in_set SMALLINT NOT NULL CHECK (order_in_set BETWEEN 1 AND 10)
);

CREATE INDEX idx_questions_set_id ON questions(set_id);

-- ============================================
-- 5. USER GAME SETS TABLE
-- ============================================
CREATE TABLE user_game_sets (
  id BIGSERIAL PRIMARY KEY,
  set_uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  set_id INT NOT NULL REFERENCES word_sets(id),
  game_type_id INT NOT NULL REFERENCES game_types(id),
  level SMALLINT NOT NULL CHECK (level BETWEEN 1 AND 5),

  -- Scores
  set_score INT NOT NULL,
  normalized_score INT NOT NULL CHECK (normalized_score BETWEEN 0 AND 1000),
  
  -- Breakdown
  base_total INT NOT NULL,
  speed_bonus_total INT NOT NULL,
  combo_bonus_total INT NOT NULL,
  penalty_total INT NOT NULL,
  
  -- Metrics
  correct_answers SMALLINT NOT NULL,
  wrong_answers SMALLINT NOT NULL,
  max_combo SMALLINT NOT NULL,
  avg_response_time REAL NOT NULL,
  accuracy_percentage REAL NOT NULL,
  
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(user_id, set_id)
);

-- Indexes for leaderboards
CREATE INDEX idx_sets_game_lb 
  ON user_game_sets (game_type_id, normalized_score DESC, completed_at DESC);

CREATE INDEX idx_sets_global_lb 
  ON user_game_sets (normalized_score DESC, completed_at DESC);

CREATE INDEX idx_sets_user 
  ON user_game_sets (user_id, completed_at DESC);

-- ============================================
-- 6. USER GAME SET QUESTIONS TABLE (Optional)
-- ============================================
CREATE TABLE user_game_set_questions (
  id BIGSERIAL PRIMARY KEY,
  set_uuid UUID NOT NULL REFERENCES user_game_sets(set_uuid) ON DELETE CASCADE,
  question_no SMALLINT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  time_used_ms INT,
  speed_bonus INT NOT NULL,
  combo_bonus INT NOT NULL,
  penalty INT NOT NULL,
  base_points INT NOT NULL,
  difficulty_multiplier REAL NOT NULL,
  question_score INT NOT NULL,
  question_payload JSONB,
  
  UNIQUE(set_uuid, question_no)
);

CREATE INDEX idx_set_questions 
  ON user_game_set_questions(set_uuid);

-- ============================================
-- 7. USER SET PROGRESS TABLE
-- ============================================
CREATE TABLE user_set_progress (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  set_id INT NOT NULL REFERENCES word_sets(id) ON DELETE CASCADE,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  PRIMARY KEY (user_id, set_id)
);

CREATE INDEX idx_user_progress_user ON user_set_progress(user_id);

-- ============================================
-- 8. BADGES TABLE
-- ============================================
CREATE TABLE badges (
  id SERIAL PRIMARY KEY,
  badge_code VARCHAR(100) UNIQUE NOT NULL,
  badge_type VARCHAR(50) NOT NULL CHECK (badge_type IN ('streak', 'achievement', 'rank', 'milestone')),
  badge_name_tr VARCHAR(200) NOT NULL,
  badge_name_en VARCHAR(200) NOT NULL,
  badge_name_de VARCHAR(200) NOT NULL,
  badge_description_tr TEXT,
  badge_description_en TEXT,
  badge_description_de TEXT,
  icon_url VARCHAR(500),
  rarity VARCHAR(50) NOT NULL CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  criteria JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 9. USER BADGES TABLE
-- ============================================
CREATE TABLE user_badges (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id INT NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB,
  UNIQUE(user_id, badge_id)
);

CREATE INDEX idx_user_badges 
  ON user_badges(user_id, earned_at DESC);

-- ============================================
-- 10. USER LOGIN STREAKS TABLE
-- ============================================
CREATE TABLE user_login_streaks (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  login_date DATE NOT NULL,
  current_streak INT DEFAULT 1,
  longest_streak INT DEFAULT 1,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, login_date)
);

CREATE INDEX idx_streaks_user 
  ON user_login_streaks(user_id, login_date DESC);

-- ============================================
-- 11. ADMIN KEYS TABLE
-- ============================================
CREATE TABLE admin_keys (
  id SERIAL PRIMARY KEY,
  api_key VARCHAR(255) UNIQUE NOT NULL,
  key_name VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used TIMESTAMPTZ
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE word_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_game_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_game_set_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_set_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_login_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_keys ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users: Users can read their own data
CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Game types: Everyone can read
CREATE POLICY "Anyone can read game types"
  ON game_types FOR SELECT
  USING (true);

-- Word sets: Everyone can read
CREATE POLICY "Anyone can read word sets"
  ON word_sets FOR SELECT
  USING (true);

-- Questions: Everyone can read
CREATE POLICY "Anyone can read questions"
  ON questions FOR SELECT
  USING (true);

-- User game sets: Users can read own, everyone can read for leaderboard
CREATE POLICY "Users can read own scores"
  ON user_game_sets FOR SELECT
  USING (auth.uid() = user_id OR true);

CREATE POLICY "Users can insert own scores"
  ON user_game_sets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- User set progress: Users can read/update own
CREATE POLICY "Users can manage own progress"
  ON user_set_progress FOR ALL
  USING (auth.uid() = user_id);

-- Badges: Everyone can read
CREATE POLICY "Anyone can read badges"
  ON badges FOR SELECT
  USING (true);

-- User badges: Users can read own
CREATE POLICY "Users can read own badges"
  ON user_badges FOR SELECT
  USING (auth.uid() = user_id OR true);

CREATE POLICY "Users can insert own badges"
  ON user_badges FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- User login streaks: Users can read own
CREATE POLICY "Users can read own streaks"
  ON user_login_streaks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can manage streaks"
  ON user_login_streaks FOR ALL
  USING (true); -- Functions will handle this

-- Admin keys: No public access
CREATE POLICY "No public access to admin keys"
  ON admin_keys FOR ALL
  USING (false);
