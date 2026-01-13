# Der Die Das Space - Database Schema Analysis

**Generated**: 2026-01-13
**Schema Version**: Production (Supabase PostgreSQL)
**Analyst**: Claude Code Backend Analysis

---

## Table of Contents
1. [High-Level Overview](#high-level-overview)
2. [Database Objects Inventory](#database-objects-inventory)
3. [Entity Relationships (ERD)](#entity-relationships-erd)
4. [Security Model & RLS Policies](#security-model--rls-policies)
5. [TypeScript Type Definitions](#typescript-type-definitions)
6. [Supabase Query Patterns](#supabase-query-patterns)
7. [Critical Issues & Fixes](#critical-issues--fixes)
8. [Onboarding Checklist](#onboarding-checklist)
9. [Performance Considerations](#performance-considerations)
10. [Migration & TODO List](#migration--todo-list)

---

## High-Level Overview

### What This System Does
**Der Die Das Space** is a gamified German language learning platform with 5 different games. Users play question sets, earn scores, collect badges, maintain login streaks, and compete on leaderboards. The system tracks detailed performance metrics and automatically awards achievements.

### Core Statistics
- **11 Tables**: users, game_types, word_sets, questions, user_game_sets, user_game_set_questions, badges, user_badges, user_login_streaks, user_set_progress, admin_keys
- **2 Views**: v_global_leaderboard, v_game_leaderboard
- **5 Functions**: Badge checking, streak tracking, score management
- **10 Indexes**: Optimized for leaderboards and user history
- **All RLS Enabled**: But some policies need fixes

### The 5 Games
1. **Der Die Dash** - Article guessing (der/die/das)
2. **Case Control** - Preposition challenge
3. **Word Salad** - Sentence building
4. **Translation Quest** - German translation
5. **Five Letter Blitz** - Letter ordering

### Scoring System
- **Base Points**: Game-specific (20-30)
- **Speed Bonus**: Based on response time
- **Combo Bonus**: Streak rewards
- **Penalties**: Wrong answers
- **Normalized Score**: 0-1000 scale for leaderboards

---

## Database Objects Inventory

### Tables

#### 1. `users` (Core Identity)
**Purpose**: Central user identity table linked to Supabase Auth

```sql
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email varchar(255) UNIQUE NOT NULL,
  display_name varchar(100),
  auth_provider varchar(50) NOT NULL,  -- 'email', 'google'
  created_at timestamptz DEFAULT now(),
  last_login timestamptz
);
```

**Relationships**: Referenced by all `user_*` tables
**RLS**: Users can SELECT/UPDATE own row only
**Notes**: Links to Supabase auth.users via id

---

#### 2. `game_types` (Game Definitions)
**Purpose**: Defines the 5 games with configuration

```sql
CREATE TABLE game_types (
  id integer PRIMARY KEY,
  game_code varchar(50) UNIQUE NOT NULL,  -- 'der-die-dash', etc.
  game_name_tr varchar(100) NOT NULL,
  game_name_en varchar(100) NOT NULL,
  game_description_tr text,
  game_description_en text,
  is_active boolean DEFAULT true,
  requires_translation boolean DEFAULT false,
  timer_seconds integer NOT NULL,         -- Always 5
  base_score integer NOT NULL,            -- 20-30 depending on game
  release_version varchar(10),
  created_at timestamptz DEFAULT now()
);
```

**Expected Data**:
```typescript
[
  { game_code: 'der-die-dash', timer_seconds: 5, base_score: 20 },
  { game_code: 'case-control', timer_seconds: 5, base_score: 25 },
  { game_code: 'word-salad', timer_seconds: 5, base_score: 30 },
  { game_code: 'translation-quest', timer_seconds: 5, base_score: 22 },
  { game_code: 'five-letter-blitz', timer_seconds: 5, base_score: 25 }
]
```

**RLS**: Anyone can SELECT (public read)

---

#### 3. `word_sets` (Question Collections)
**Purpose**: Groups 10 questions into playable sets

```sql
CREATE TABLE word_sets (
  id integer PRIMARY KEY,
  game_type_id integer REFERENCES game_types(id) NOT NULL,
  set_number integer NOT NULL,
  difficulty_level smallint CHECK (difficulty_level BETWEEN 1 AND 5) NOT NULL,
  is_demo boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE (game_type_id, set_number)
);
```

**Indexes**:
- `idx_word_sets_game_type` ON (game_type_id)
- `idx_word_sets_level` ON (difficulty_level)

**RLS**: Anyone can SELECT
**Notes**: Each set contains exactly 10 questions (enforced by questions.order_in_set constraint)

---

#### 4. `questions` (Question Data)
**Purpose**: Stores flexible question data per game type

```sql
CREATE TABLE questions (
  id integer PRIMARY KEY,
  set_id integer REFERENCES word_sets(id) ON DELETE CASCADE NOT NULL,
  question_data jsonb NOT NULL,
  order_in_set smallint CHECK (order_in_set BETWEEN 1 AND 10) NOT NULL
);
```

**Index**: `idx_questions_set_id` ON (set_id)

**JSONB Structure Examples**:
```json
// Der Die Dash
{
  "word": "Hund",
  "correct_article": "der",
  "options": ["der", "die", "das"]
}

// Translation Quest
{
  "german_word": "Hund",
  "translation_tr": "köpek",
  "translation_en": "dog"
}

// Five Letter Blitz
{
  "word": "BLUME",
  "scrambled": "ULMBE"
}

// Word Salad
{
  "correct_order": ["Ich", "gehe", "nach", "Hause"],
  "scrambled": ["nach", "Ich", "Hause", "gehe"]
}

// Case Control
{
  "sentence": "Ich gehe ___ Park",
  "correct_preposition": "in den",
  "options": ["in den", "im", "an den", "auf den"]
}
```

**RLS**: Anyone can SELECT

---

#### 5. `user_game_sets` (Completed Sessions)
**Purpose**: Records each completed game session with full statistics

```sql
CREATE TABLE user_game_sets (
  id bigint PRIMARY KEY,
  set_uuid uuid UNIQUE DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  set_id integer REFERENCES word_sets(id) NOT NULL,
  game_type_id integer REFERENCES game_types(id) NOT NULL,
  level smallint CHECK (level BETWEEN 1 AND 5) NOT NULL,

  -- Scoring
  set_score integer NOT NULL,                    -- Raw total score
  normalized_score integer CHECK (normalized_score BETWEEN 0 AND 1000) NOT NULL,
  base_total integer NOT NULL,
  speed_bonus_total integer NOT NULL,
  combo_bonus_total integer NOT NULL,
  penalty_total integer NOT NULL,

  -- Statistics
  correct_answers smallint NOT NULL,
  wrong_answers smallint NOT NULL,
  max_combo smallint NOT NULL,
  avg_response_time real NOT NULL,
  accuracy_percentage real NOT NULL,

  completed_at timestamptz DEFAULT now() NOT NULL,

  UNIQUE (user_id, set_id)  -- One attempt per user per set
);
```

**Indexes** (Optimized for leaderboards):
- `idx_sets_global_lb` ON (normalized_score DESC, completed_at DESC)
- `idx_sets_game_lb` ON (game_type_id, normalized_score DESC, completed_at DESC)
- `idx_sets_user` ON (user_id, completed_at DESC)

**RLS**:
- Users can INSERT own scores
- Anyone can SELECT (for leaderboards)

**Notes**:
- `set_uuid` is used as FK for question details
- `normalized_score` ensures fair comparison across games

---

#### 6. `user_game_set_questions` (Question-Level Details)
**Purpose**: Granular analytics for each question in a session

```sql
CREATE TABLE user_game_set_questions (
  id bigint PRIMARY KEY,
  set_uuid uuid REFERENCES user_game_sets(set_uuid) ON DELETE CASCADE NOT NULL,
  question_no smallint NOT NULL,
  is_correct boolean NOT NULL,
  time_used_ms integer,
  speed_bonus integer NOT NULL,
  combo_bonus integer NOT NULL,
  penalty integer NOT NULL,
  base_points integer NOT NULL,
  difficulty_multiplier real NOT NULL,
  question_score integer NOT NULL,
  question_payload jsonb,  -- User's answer, correct answer, etc.

  UNIQUE (set_uuid, question_no)
);
```

**Index**: `idx_set_questions` ON (set_uuid)

**⚠️ CRITICAL ISSUE**: RLS enabled but NO policies exist!
This will block all INSERT/SELECT operations.

**question_payload Example**:
```json
{
  "user_answer": "der",
  "correct_answer": "der",
  "time_ms": 2347,
  "combo_at_time": 3
}
```

---

#### 7. `badges` (Achievement Definitions)
**Purpose**: Defines badges with unlock criteria

```sql
CREATE TABLE badges (
  id integer PRIMARY KEY,
  badge_code varchar(100) UNIQUE NOT NULL,  -- 'first_game', 'streak_7'
  badge_type varchar(50) CHECK (badge_type IN ('streak', 'achievement', 'rank', 'milestone')) NOT NULL,
  badge_name_tr varchar(200) NOT NULL,
  badge_name_en varchar(200) NOT NULL,
  badge_name_de varchar(200) NOT NULL,
  badge_description_tr text,
  badge_description_en text,
  badge_description_de text,
  icon_url varchar(500),
  rarity varchar(50) CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')) NOT NULL,
  criteria jsonb NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
```

**Criteria Examples**:
```json
// Achievement: Complete X games
{"type": "games_completed", "count": 10}

// Achievement: Perfect score
{"type": "perfect_score", "correct_answers": 10}

// Streak: Login X days consecutively
{"type": "streak_days", "days": 7}
```

**RLS**: Anyone can SELECT

---

#### 8. `user_badges` (User Unlocks)
**Purpose**: Tracks which users earned which badges

```sql
CREATE TABLE user_badges (
  id integer PRIMARY KEY,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  badge_id integer REFERENCES badges(id) ON DELETE CASCADE NOT NULL,
  earned_at timestamptz DEFAULT now(),
  metadata jsonb,

  UNIQUE (user_id, badge_id)  -- One badge per user
);
```

**Index**: `idx_user_badges` ON (user_id, earned_at DESC)

**RLS**:
- Users can INSERT own
- Anyone can SELECT (badge showcase visibility)

---

#### 9. `user_login_streaks` (Daily Login Tracking)
**Purpose**: Tracks consecutive daily logins

```sql
CREATE TABLE user_login_streaks (
  id integer PRIMARY KEY,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  login_date date NOT NULL,
  current_streak integer DEFAULT 1,
  longest_streak integer DEFAULT 1,
  last_updated timestamptz DEFAULT now(),

  UNIQUE (user_id, login_date)
);
```

**Index**: `idx_streaks_user` ON (user_id, login_date DESC)

**RLS**:
- ⚠️ "System can manage" (USING true) - TOO PERMISSIVE
- Users can SELECT own

**Notes**: Updated by `update_login_streak()` function

---

#### 10. `user_set_progress` (Set Completion)
**Purpose**: Tracks which sets users have completed

```sql
CREATE TABLE user_set_progress (
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  set_id integer REFERENCES word_sets(id) ON DELETE CASCADE,
  is_completed boolean DEFAULT false,
  completed_at timestamptz,

  PRIMARY KEY (user_id, set_id)
);
```

**Index**: `idx_user_progress_user` ON (user_id)

**RLS**: Users can manage own (USING user_id = auth.uid())

---

#### 11. `admin_keys` (Admin Authentication)
**Purpose**: API keys for admin panel authentication

```sql
CREATE TABLE admin_keys (
  id integer PRIMARY KEY,
  api_key varchar(255) UNIQUE NOT NULL,
  key_name varchar(100),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  last_used timestamptz
);
```

**RLS**: USING (false) - No public access

**⚠️ Issue**: `anon` and `authenticated` have table grants but policy blocks them. Should revoke grants.

---

### Views

#### `v_global_leaderboard`
**Purpose**: Global ranking across all games

```sql
CREATE VIEW v_global_leaderboard AS
SELECT
  u.id AS user_id,
  u.display_name,
  u.email,
  ugs.normalized_score,
  ugs.set_score,
  gt.game_name_en AS game,
  ugs.level,
  ugs.completed_at,
  ROW_NUMBER() OVER (ORDER BY ugs.normalized_score DESC, ugs.completed_at) AS rank
FROM user_game_sets ugs
JOIN users u ON ugs.user_id = u.id
JOIN game_types gt ON ugs.game_type_id = gt.id
ORDER BY ugs.normalized_score DESC, ugs.completed_at;
```

**Usage**: Display top 100 players globally

---

#### `v_game_leaderboard`
**Purpose**: Per-game, per-level rankings

```sql
CREATE VIEW v_game_leaderboard AS
SELECT
  u.id AS user_id,
  u.display_name,
  u.email,
  ugs.game_type_id,
  gt.game_name_en AS game,
  ugs.level,
  ugs.set_score,
  ugs.normalized_score,
  ugs.completed_at,
  ROW_NUMBER() OVER (PARTITION BY ugs.game_type_id, ugs.level
                     ORDER BY ugs.set_score DESC, ugs.completed_at) AS rank
FROM user_game_sets ugs
JOIN users u ON ugs.user_id = u.id
JOIN game_types gt ON ugs.game_type_id = gt.id
ORDER BY ugs.game_type_id, ugs.level, ugs.set_score DESC;
```

**Usage**: Display top players per game/difficulty

---

### Functions

#### 1. `check_and_award_badges(p_user_id uuid)`
**Returns**: `TABLE(badge_id int, badge_code varchar)`

**Purpose**: Automatically checks and awards badges based on criteria

**Logic**:
1. Loop through active badges user hasn't earned
2. Check criteria based on `badge_type`:
   - **achievement/games_completed**: Count completed games
   - **achievement/perfect_score**: Check for perfect scores
   - **streak**: Check current login streak
3. Insert into `user_badges` if earned
4. Return newly earned badges

**Usage**:
```typescript
const { data: newBadges } = await supabase
  .rpc('check_and_award_badges', { p_user_id: userId });
```

**Security**: All roles can execute

---

#### 2. `update_login_streak(p_user_id uuid)`
**Returns**: `TABLE(current_streak int, longest_streak int)`

**Purpose**: Updates login streak on daily login

**Logic**:
1. Get last login date
2. If first login → streak = 1
3. If already logged in today → return current
4. If consecutive day (yesterday) → increment streak
5. If streak broken → reset to 1
6. Update longest_streak if exceeded

**Usage**:
```typescript
const { data: streak } = await supabase
  .rpc('update_login_streak', { p_user_id: userId });
```

**Security**: All roles can execute

---

#### 3. `upsert_best_score(p_user_id uuid, p_new_score int)`
**Returns**: `integer` (final best score)

**⚠️ ORPHANED FUNCTION**: References non-existent `scores` table

**Purpose**: Updates best score only if higher

**Security**: SECURITY DEFINER (runs with postgres privileges)

**Recommendation**: Remove or refactor to use `user_game_sets`

---

#### 4. `update_updated_at_column()`
**Returns**: `trigger`

**Purpose**: Trigger function to set `updated_at = NOW()`

**⚠️ NOT ATTACHED**: No tables use this trigger

---

#### 5. `update_scores_updated_at()`
**Returns**: `trigger`

**Purpose**: Same as above, for `scores` table

**⚠️ ORPHANED**: References non-existent table

---

## Entity Relationships (ERD)

```
┌─────────┐
│  users  │ (1)
└────┬────┘
     │
     ├──< user_game_sets (M)
     ├──< user_badges (M)
     ├──< user_login_streaks (M)
     └──< user_set_progress (M)

┌────────────┐
│ game_types │ (1)
└─────┬──────┘
      │
      ├──< word_sets (M)
      └──< user_game_sets (M)

┌───────────┐
│ word_sets │ (1)
└─────┬─────┘
      │
      ├──< questions (M, exactly 10)
      ├──< user_game_sets (M)
      └──< user_set_progress (M)

┌────────┐
│ badges │ (1)
└────┬───┘
     │
     └──< user_badges (M)

┌────────────────┐
│ user_game_sets │ (1, set_uuid)
└────────┬───────┘
         │
         └──< user_game_set_questions (M, exactly 10)
```

### Cardinality Summary

| Relationship | Type | Notes |
|--------------|------|-------|
| users → user_game_sets | 1:M | One user, many game sessions |
| game_types → word_sets | 1:M | One game, many sets |
| word_sets → questions | 1:10 | Exactly 10 questions per set |
| user_game_sets → user_game_set_questions | 1:10 | Exactly 10 answers per session |
| users → badges | M:M | Via user_badges join table |
| users → word_sets | M:M | Via user_set_progress |

---

## Security Model & RLS Policies

### RLS Status Summary

| Table | RLS Enabled | Policies Exist | Status |
|-------|-------------|----------------|--------|
| admin_keys | ✅ | ✅ | 🟢 Locked down |
| badges | ✅ | ✅ | 🟢 Public read |
| game_types | ✅ | ✅ | 🟢 Public read |
| questions | ✅ | ✅ | 🟢 Public read |
| word_sets | ✅ | ✅ | 🟢 Public read |
| users | ✅ | ✅ | 🟢 User owns data |
| user_badges | ✅ | ✅ | 🟡 Privacy concern |
| user_game_sets | ✅ | ✅ | 🟡 Privacy concern |
| user_game_set_questions | ✅ | ❌ | 🔴 BROKEN |
| user_login_streaks | ✅ | ⚠️ | 🔴 TOO PERMISSIVE |
| user_set_progress | ✅ | ✅ | 🟢 User owns data |

---

### Policy Breakdown

#### Public Read (Game Content)
```sql
-- Applied to: badges, game_types, questions, word_sets
CREATE POLICY "Anyone can read X" ON X
FOR SELECT USING (true);
```

**Rationale**: Game content must be public for gameplay
**Security**: ✅ Safe - read-only, no sensitive data

---

#### User Data Isolation
```sql
-- users table
CREATE POLICY "Users can read own data" ON users
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
FOR UPDATE USING (auth.uid() = id);
```

**Rationale**: Users should only access their own profile
**Security**: ✅ Safe - proper isolation

---

#### Score Submission
```sql
-- user_game_sets
CREATE POLICY "Users can insert own scores" ON user_game_sets
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own scores" ON user_game_sets
FOR SELECT USING (auth.uid() = user_id OR true);
```

**⚠️ Privacy Concern**: `OR true` makes ALL scores public
**Rationale**: Needed for leaderboards
**Recommendation**: Add `users.is_public` column

---

#### Badge System
```sql
-- user_badges
CREATE POLICY "Users can insert own badges" ON user_badges
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own badges" ON user_badges
FOR SELECT USING (auth.uid() = user_id OR true);
```

**⚠️ Same Issue**: All badge data is public

---

#### 🔴 Critical Issue: Missing Policies
```sql
-- user_game_set_questions: RLS enabled but NO policies!
-- Result: ALL operations will fail for anon/authenticated roles
```

**Impact**:
- Cannot insert question answers after game completion
- Cannot view question-level analytics
- Breaks core functionality

**Required Fix**:
```sql
CREATE POLICY "Users can insert own question answers"
ON user_game_set_questions FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_game_sets
    WHERE set_uuid = user_game_set_questions.set_uuid
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can read own question answers"
ON user_game_set_questions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_game_sets
    WHERE set_uuid = user_game_set_questions.set_uuid
    AND user_id = auth.uid()
  )
);
```

---

#### 🔴 Critical Issue: Overly Permissive Streak Policy
```sql
-- user_login_streaks
CREATE POLICY "System can manage streaks" ON user_login_streaks
USING (true);
```

**Problem**: `USING (true)` allows ANYONE to do ANYTHING
**Intended**: Only service_role should manage via function
**Fix**: Remove policy, rely on function execution with elevated privileges

---

### Role Permissions

All tables have grants to:
- `postgres` (superuser)
- `anon` (unauthenticated)
- `authenticated` (logged-in users)
- `service_role` (backend functions)

**⚠️ Issue**: `admin_keys` has grants to `anon` and `authenticated` despite policy blocking access. Should revoke:

```sql
REVOKE ALL ON admin_keys FROM anon;
REVOKE ALL ON admin_keys FROM authenticated;
```

---

## TypeScript Type Definitions

### Core Interfaces

```typescript
// User Identity
export interface User {
  id: string; // uuid
  email: string;
  display_name: string | null;
  auth_provider: 'email' | 'google';
  created_at: string; // ISO timestamp
  last_login: string | null;
}

// Game Definition
export interface GameType {
  id: number;
  game_code: 'der-die-dash' | 'case-control' | 'word-salad' | 'translation-quest' | 'five-letter-blitz';
  game_name_tr: string;
  game_name_en: string;
  game_description_tr: string | null;
  game_description_en: string | null;
  is_active: boolean;
  requires_translation: boolean;
  timer_seconds: number; // Always 5
  base_score: number; // 20-30
  release_version: string | null;
  created_at: string;
}

// Question Set
export interface WordSet {
  id: number;
  game_type_id: number;
  set_number: number;
  difficulty_level: 1 | 2 | 3 | 4 | 5;
  is_demo: boolean;
  created_at: string;
}

// Question
export interface Question {
  id: number;
  set_id: number;
  question_data: QuestionData; // Game-specific
  order_in_set: number; // 1-10
}

// Game-specific question data types
export type QuestionData =
  | DerDieDashQuestion
  | CaseControlQuestion
  | WordSaladQuestion
  | TranslationQuestQuestion
  | FiveLetterBlitzQuestion;

export interface DerDieDashQuestion {
  word: string;
  correct_article: 'der' | 'die' | 'das';
  options: ['der', 'die', 'das'];
}

export interface CaseControlQuestion {
  sentence: string;
  correct_preposition: string;
  options: string[];
}

export interface WordSaladQuestion {
  correct_order: string[];
  scrambled: string[];
}

export interface TranslationQuestQuestion {
  german_word: string;
  translation_tr: string;
  translation_en: string;
}

export interface FiveLetterBlitzQuestion {
  word: string; // 5 letters
  scrambled: string;
}

// Completed Game Session
export interface UserGameSet {
  id: number;
  set_uuid: string;
  user_id: string;
  set_id: number;
  game_type_id: number;
  level: 1 | 2 | 3 | 4 | 5;

  // Scoring
  set_score: number; // Raw total
  normalized_score: number; // 0-1000
  base_total: number;
  speed_bonus_total: number;
  combo_bonus_total: number;
  penalty_total: number;

  // Statistics
  correct_answers: number; // 0-10
  wrong_answers: number; // 0-10
  max_combo: number;
  avg_response_time: number; // milliseconds
  accuracy_percentage: number; // 0-100

  completed_at: string;
}

// Question Answer Detail
export interface UserGameSetQuestion {
  id: number;
  set_uuid: string;
  question_no: number; // 1-10
  is_correct: boolean;
  time_used_ms: number | null;
  speed_bonus: number;
  combo_bonus: number;
  penalty: number;
  base_points: number;
  difficulty_multiplier: number;
  question_score: number;
  question_payload: QuestionPayload | null;
}

export interface QuestionPayload {
  user_answer: string;
  correct_answer: string;
  time_ms: number;
  combo_at_time: number;
}

// Badge Definition
export interface Badge {
  id: number;
  badge_code: string;
  badge_type: 'streak' | 'achievement' | 'rank' | 'milestone';
  badge_name_tr: string;
  badge_name_en: string;
  badge_name_de: string;
  badge_description_tr: string | null;
  badge_description_en: string | null;
  badge_description_de: string | null;
  icon_url: string | null;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  criteria: BadgeCriteria;
  is_active: boolean;
  created_at: string;
}

export type BadgeCriteria =
  | { type: 'games_completed'; count: number }
  | { type: 'perfect_score'; correct_answers: number }
  | { type: 'streak_days'; days: number };

// User Badge
export interface UserBadge {
  id: number;
  user_id: string;
  badge_id: number;
  earned_at: string;
  metadata: Record<string, any> | null;
}

// Login Streak
export interface UserLoginStreak {
  id: number;
  user_id: string;
  login_date: string; // YYYY-MM-DD
  current_streak: number;
  longest_streak: number;
  last_updated: string;
}

// Set Progress
export interface UserSetProgress {
  user_id: string;
  set_id: number;
  is_completed: boolean;
  completed_at: string | null;
}

// Leaderboard Views
export interface GlobalLeaderboardEntry {
  user_id: string;
  display_name: string | null;
  email: string;
  normalized_score: number;
  set_score: number;
  game: string;
  level: number;
  completed_at: string;
  rank: number;
}

export interface GameLeaderboardEntry {
  user_id: string;
  display_name: string | null;
  email: string;
  game_type_id: number;
  game: string;
  level: number;
  set_score: number;
  normalized_score: number;
  completed_at: string;
  rank: number;
}
```

---

## Supabase Query Patterns

### Game Setup Queries

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 1. Get all active games
async function getGames() {
  const { data, error } = await supabase
    .from('game_types')
    .select('*')
    .eq('is_active', true)
    .order('id');

  return data;
}

// 2. Get sets for a game and difficulty
async function getGameSets(gameTypeId: number, level: number) {
  const { data, error } = await supabase
    .from('word_sets')
    .select('*')
    .eq('game_type_id', gameTypeId)
    .eq('difficulty_level', level)
    .order('set_number');

  return data;
}

// 3. Get demo sets (free to play)
async function getDemoSets(gameTypeId: number) {
  const { data, error } = await supabase
    .from('word_sets')
    .select('*, questions(*)')
    .eq('game_type_id', gameTypeId)
    .eq('is_demo', true)
    .order('set_number');

  return data;
}

// 4. Get questions for a set
async function getSetQuestions(setId: number) {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('set_id', setId)
    .order('order_in_set');

  return data; // Array of 10 questions
}

// 5. Get full set with questions (joined)
async function getFullSet(setId: number) {
  const { data, error } = await supabase
    .from('word_sets')
    .select(`
      *,
      game_types(*),
      questions(*)
    `)
    .eq('id', setId)
    .single();

  return data;
}
```

---

### Game Submission Queries

```typescript
// 6. Submit completed game session
async function submitGameSession(sessionData: {
  user_id: string;
  set_id: number;
  game_type_id: number;
  level: number;
  set_score: number;
  normalized_score: number;
  base_total: number;
  speed_bonus_total: number;
  combo_bonus_total: number;
  penalty_total: number;
  correct_answers: number;
  wrong_answers: number;
  max_combo: number;
  avg_response_time: number;
  accuracy_percentage: number;
}) {
  const { data: gameSet, error } = await supabase
    .from('user_game_sets')
    .insert(sessionData)
    .select()
    .single();

  if (error) throw error;
  return gameSet;
}

// 7. Submit question answers (batch insert)
async function submitQuestionAnswers(
  setUuid: string,
  answers: Array<{
    question_no: number;
    is_correct: boolean;
    time_used_ms: number;
    speed_bonus: number;
    combo_bonus: number;
    penalty: number;
    base_points: number;
    difficulty_multiplier: number;
    question_score: number;
    question_payload: QuestionPayload;
  }>
) {
  const { data, error } = await supabase
    .from('user_game_set_questions')
    .insert(
      answers.map(a => ({
        set_uuid: setUuid,
        ...a
      }))
    );

  if (error) throw error;
  return data;
}

// 8. Mark set as completed
async function markSetCompleted(userId: string, setId: number) {
  const { data, error } = await supabase
    .from('user_set_progress')
    .upsert({
      user_id: userId,
      set_id: setId,
      is_completed: true,
      completed_at: new Date().toISOString()
    });

  return data;
}

// 9. Complete game submission workflow
async function completeGameWorkflow(
  userId: string,
  setId: number,
  gameTypeId: number,
  level: number,
  gameResults: GameResults
) {
  // 1. Submit game session
  const gameSet = await submitGameSession({
    user_id: userId,
    set_id: setId,
    game_type_id: gameTypeId,
    level: level,
    ...gameResults.summary
  });

  // 2. Submit question details
  await submitQuestionAnswers(gameSet.set_uuid, gameResults.questions);

  // 3. Mark set completed
  await markSetCompleted(userId, setId);

  // 4. Update login streak
  await supabase.rpc('update_login_streak', { p_user_id: userId });

  // 5. Check for new badges
  const { data: newBadges } = await supabase.rpc('check_and_award_badges', {
    p_user_id: userId
  });

  return {
    gameSet,
    newBadges
  };
}
```

---

### User Profile Queries

```typescript
// 10. Get user profile with stats
async function getUserProfile(userId: string) {
  // Get user
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  // Get all game sessions
  const { data: sessions } = await supabase
    .from('user_game_sets')
    .select('*')
    .eq('user_id', userId);

  // Get badges
  const { data: badges } = await supabase
    .from('user_badges')
    .select('*, badges(*)')
    .eq('user_id', userId)
    .order('earned_at', { ascending: false });

  // Get current streak
  const { data: streak } = await supabase
    .from('user_login_streaks')
    .select('*')
    .eq('user_id', userId)
    .order('login_date', { ascending: false })
    .limit(1)
    .single();

  // Calculate stats
  const stats = {
    total_games: sessions?.length || 0,
    total_score: sessions?.reduce((sum, s) => sum + s.normalized_score, 0) || 0,
    avg_accuracy: sessions?.reduce((sum, s) => sum + s.accuracy_percentage, 0) / (sessions?.length || 1) || 0,
    perfect_scores: sessions?.filter(s => s.correct_answers === 10).length || 0,
    max_combo: Math.max(...(sessions?.map(s => s.max_combo) || [0])),
    current_streak: streak?.current_streak || 0,
    longest_streak: streak?.longest_streak || 0,
  };

  return {
    user,
    stats,
    badges,
    recent_sessions: sessions?.slice(0, 10)
  };
}

// 11. Get user game history
async function getUserGameHistory(userId: string, limit = 20) {
  const { data, error } = await supabase
    .from('user_game_sets')
    .select(`
      *,
      game_types(game_name_en, game_code),
      word_sets(set_number, difficulty_level)
    `)
    .eq('user_id', userId)
    .order('completed_at', { ascending: false })
    .limit(limit);

  return data;
}

// 12. Get user's completed sets
async function getUserCompletedSets(userId: string) {
  const { data, error } = await supabase
    .from('user_set_progress')
    .select(`
      *,
      word_sets(
        id,
        set_number,
        difficulty_level,
        game_types(game_name_en, game_code)
      )
    `)
    .eq('user_id', userId)
    .eq('is_completed', true);

  return data;
}
```

---

### Leaderboard Queries

```typescript
// 13. Get global leaderboard (top 100)
async function getGlobalLeaderboard(limit = 100) {
  const { data, error } = await supabase
    .from('v_global_leaderboard')
    .select('*')
    .limit(limit);

  return data;
}

// 14. Get user's global rank
async function getUserGlobalRank(userId: string) {
  const { data, error } = await supabase
    .from('v_global_leaderboard')
    .select('rank')
    .eq('user_id', userId)
    .order('rank')
    .limit(1)
    .single();

  return data?.rank;
}

// 15. Get game-specific leaderboard
async function getGameLeaderboard(
  gameTypeId: number,
  level: number,
  limit = 100
) {
  const { data, error } = await supabase
    .from('v_game_leaderboard')
    .select('*')
    .eq('game_type_id', gameTypeId)
    .eq('level', level)
    .limit(limit);

  return data;
}

// 16. Get user's rank in specific game/level
async function getUserGameRank(
  userId: string,
  gameTypeId: number,
  level: number
) {
  const { data, error } = await supabase
    .from('v_game_leaderboard')
    .select('rank')
    .eq('user_id', userId)
    .eq('game_type_id', gameTypeId)
    .eq('level', level)
    .order('rank')
    .limit(1)
    .single();

  return data?.rank;
}
```

---

### Badge & Streak Queries

```typescript
// 17. Get all badges with user's earned status
async function getBadgesWithStatus(userId: string) {
  const { data: allBadges } = await supabase
    .from('badges')
    .select('*')
    .eq('is_active', true)
    .order('rarity, badge_type');

  const { data: earnedBadges } = await supabase
    .from('user_badges')
    .select('badge_id')
    .eq('user_id', userId);

  const earnedIds = new Set(earnedBadges?.map(b => b.badge_id));

  return allBadges?.map(badge => ({
    ...badge,
    is_earned: earnedIds.has(badge.id)
  }));
}

// 18. Update login streak
async function updateUserLoginStreak(userId: string) {
  const { data, error } = await supabase.rpc('update_login_streak', {
    p_user_id: userId
  });

  return data?.[0]; // { current_streak, longest_streak }
}

// 19. Check and award badges
async function checkAndAwardBadges(userId: string) {
  const { data, error } = await supabase.rpc('check_and_award_badges', {
    p_user_id: userId
  });

  return data; // Array of newly earned badges
}

// 20. Get user's recent badges
async function getUserRecentBadges(userId: string, limit = 5) {
  const { data, error } = await supabase
    .from('user_badges')
    .select('*, badges(*)')
    .eq('user_id', userId)
    .order('earned_at', { ascending: false })
    .limit(limit);

  return data;
}
```

---

## Critical Issues & Fixes

### 🔴 CRITICAL #1: Missing RLS Policies on `user_game_set_questions`

**Problem**: RLS is enabled but no policies exist. All operations will fail.

**Impact**:
- Cannot insert question answers
- Cannot view question-level analytics
- **BREAKS CORE GAMEPLAY FUNCTIONALITY**

**Fix**:
```sql
-- Allow users to insert their own question answers
CREATE POLICY "Users can insert own question answers"
ON user_game_set_questions
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_game_sets
    WHERE set_uuid = user_game_set_questions.set_uuid
    AND user_id = auth.uid()
  )
);

-- Allow users to read their own question answers
CREATE POLICY "Users can read own question answers"
ON user_game_set_questions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_game_sets
    WHERE set_uuid = user_game_set_questions.set_uuid
    AND user_id = auth.uid()
  )
);

-- Optional: Allow admins/analytics to read all (via service_role)
CREATE POLICY "Service role can read all question answers"
ON user_game_set_questions
FOR SELECT
TO service_role
USING (true);
```

---

### 🔴 CRITICAL #2: Overly Permissive Streak Policy

**Problem**: `USING (true)` on `user_login_streaks` allows anyone to modify any streak.

**Current Policy**:
```sql
CREATE POLICY "System can manage streaks"
ON user_login_streaks
USING (true);
```

**Impact**:
- Malicious users can manipulate anyone's streak
- Badge farming exploit
- Data integrity compromise

**Fix**:
```sql
-- Remove the permissive policy
DROP POLICY "System can manage streaks" ON user_login_streaks;

-- Keep the read policy for users
-- (Already exists: "Users can read own streaks")

-- Function already has necessary privileges
-- No additional policy needed
```

**Note**: The `update_login_streak()` function runs with sufficient privileges and doesn't need the permissive policy.

---

### 🟡 MEDIUM #3: Privacy Concerns

**Problem**: `OR true` in SELECT policies exposes all user data publicly.

**Affected Tables**:
- `user_game_sets` - All scores visible
- `user_badges` - All badge unlocks visible

**Rationale**: Needed for leaderboards and badge showcases

**Recommendation**: Add privacy controls

**Fix**:
```sql
-- Add privacy column to users
ALTER TABLE users ADD COLUMN is_public BOOLEAN DEFAULT true;

-- Update policies
DROP POLICY "Users can read own scores" ON user_game_sets;
CREATE POLICY "Users can read scores" ON user_game_sets
FOR SELECT USING (
  auth.uid() = user_id
  OR EXISTS (
    SELECT 1 FROM users
    WHERE id = user_game_sets.user_id
    AND is_public = true
  )
);

DROP POLICY "Users can read own badges" ON user_badges;
CREATE POLICY "Users can read badges" ON user_badges
FOR SELECT USING (
  auth.uid() = user_id
  OR EXISTS (
    SELECT 1 FROM users
    WHERE id = user_badges.user_id
    AND is_public = true
  )
);
```

---

### 🟡 MEDIUM #4: Orphaned Functions

**Problem**: Functions reference non-existent `scores` table

**Affected Functions**:
- `upsert_best_score()` - References `scores` table
- `update_scores_updated_at()` - Trigger for `scores` table

**Fix**: Remove or refactor
```sql
DROP FUNCTION upsert_best_score(uuid, integer);
DROP FUNCTION update_scores_updated_at();
DROP FUNCTION update_updated_at_column(); -- Not attached anywhere
```

---

### 🟢 LOW #5: Unnecessary Grants on `admin_keys`

**Problem**: `anon` and `authenticated` have ALL grants despite RLS blocking access

**Fix**:
```sql
REVOKE ALL ON admin_keys FROM anon;
REVOKE ALL ON admin_keys FROM authenticated;
REVOKE ALL ON SEQUENCE admin_keys_id_seq FROM anon;
REVOKE ALL ON SEQUENCE admin_keys_id_seq FROM authenticated;
```

---

## Onboarding Checklist

### Day 1: Understanding the Domain
- [ ] Read [PROJECT_STATUS.md](PROJECT_STATUS.md) and understand the 5 game types
- [ ] Review this schema analysis document
- [ ] Study the ER diagram and relationships
- [ ] Understand the scoring system: base + speed + combo - penalty

### Day 2: Local Setup
- [ ] Install Supabase CLI: `npm install -g supabase`
- [ ] Initialize local Supabase: `supabase init` (if not already initialized)
- [ ] Start local instance: `supabase start`
- [ ] Apply schema: `supabase db reset`
- [ ] Create and run seed script for test data

### Day 3: Security & RLS Testing
- [ ] Review all RLS policies in this document
- [ ] Apply critical fixes (user_game_set_questions policies)
- [ ] Test as `anon` user: Can read game content?
- [ ] Test as `authenticated` user: Can submit scores?
- [ ] Test isolation: User A cannot see User B's private data
- [ ] Verify admin_keys is locked down

### Day 4: Query Patterns
- [ ] Try all TypeScript query patterns from this document
- [ ] Load questions for a set
- [ ] Submit a complete game session (10 questions)
- [ ] View leaderboards (global and game-specific)
- [ ] Call `update_login_streak()` function
- [ ] Call `check_and_award_badges()` function

### Day 5: Integration Testing
- [ ] Connect frontend to local Supabase
- [ ] Play a complete game through the UI
- [ ] Verify data in `user_game_sets`
- [ ] Verify question details in `user_game_set_questions`
- [ ] Check `user_set_progress` updated
- [ ] Earn a badge and verify in `user_badges`
- [ ] Check leaderboard rankings update

### Week 2: Production Readiness
- [ ] Apply all critical fixes to production
- [ ] Set up database backups
- [ ] Configure monitoring (slow queries, connections)
- [ ] Create migration workflow
- [ ] Document deployment process
- [ ] Set up error tracking (Sentry, etc.)

---

## Performance Considerations

### Current Index Coverage

**Excellent Coverage** ✅:
- Global leaderboard: `idx_sets_global_lb`
- Game leaderboards: `idx_sets_game_lb`
- User history: `idx_sets_user`
- Question lookup: `idx_questions_set_id`

### Recommended Additional Indexes

```sql
-- 1. User game history filtered by game type
CREATE INDEX idx_user_game_history
ON user_game_sets(user_id, game_type_id, completed_at DESC);

-- 2. Badge lookup by type and rarity (admin panel)
CREATE INDEX idx_badges_type_rarity
ON badges(badge_type, rarity)
WHERE is_active = true;

-- 3. Active word sets by game (frequent query)
CREATE INDEX idx_word_sets_game_active
ON word_sets(game_type_id, difficulty_level, set_number);
```

### Query Optimization Tips

1. **Leaderboard Queries**:
   - Consider materialized views with hourly refresh
   - Cache top 100 results in Redis
   - Use pagination for long leaderboards

2. **User Profile**:
   - Cache profile stats (total games, avg accuracy)
   - Invalidate on new game completion

3. **Badge Checking**:
   - Run `check_and_award_badges()` async after game submission
   - Don't block UI on badge checking

### Scalability Considerations

**Short-term (< 10K users)**:
- Current schema is sufficient
- No partitioning needed

**Medium-term (10K - 100K users)**:
- Consider partitioning `user_game_set_questions` by month
- Materialize leaderboard views
- Add audit log table

**Long-term (> 100K users)**:
- Partition large tables (`user_game_sets`, `user_game_set_questions`)
- Move historical data to archive tables
- Consider read replicas for leaderboards
- Implement proper caching strategy (Redis)

---

## Migration & TODO List

### 🔴 CRITICAL (Fix Immediately)

```sql
-- FIX 1: Add RLS policies to user_game_set_questions
CREATE POLICY "Users can insert own question answers"
ON user_game_set_questions FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_game_sets
    WHERE set_uuid = user_game_set_questions.set_uuid
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can read own question answers"
ON user_game_set_questions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_game_sets
    WHERE set_uuid = user_game_set_questions.set_uuid
    AND user_id = auth.uid()
  )
);

-- FIX 2: Remove overly permissive streak policy
DROP POLICY "System can manage streaks" ON user_login_streaks;

-- FIX 3: Test all INSERT/UPDATE/DELETE operations
-- Run integration tests as authenticated user
```

---

### 🟡 HIGH PRIORITY (Week 1)

```sql
-- 1. Add privacy controls
ALTER TABLE users ADD COLUMN is_public BOOLEAN DEFAULT true;

-- 2. Update privacy policies
DROP POLICY "Users can read own scores" ON user_game_sets;
CREATE POLICY "Users can read scores" ON user_game_sets
FOR SELECT USING (
  auth.uid() = user_id
  OR EXISTS (SELECT 1 FROM users WHERE id = user_game_sets.user_id AND is_public = true)
);

-- 3. Revoke unnecessary grants
REVOKE ALL ON admin_keys FROM anon;
REVOKE ALL ON admin_keys FROM authenticated;

-- 4. Remove orphaned functions
DROP FUNCTION IF EXISTS upsert_best_score(uuid, integer);
DROP FUNCTION IF EXISTS update_scores_updated_at();
DROP FUNCTION IF EXISTS update_updated_at_column();
```

---

### 🟢 MEDIUM PRIORITY (Month 1)

```sql
-- 1. Add performance indexes
CREATE INDEX idx_user_game_history
ON user_game_sets(user_id, game_type_id, completed_at DESC);

CREATE INDEX idx_badges_type_rarity
ON badges(badge_type, rarity) WHERE is_active = true;

-- 2. Add data validation
ALTER TABLE user_game_sets
ADD CONSTRAINT check_total_answers
CHECK (correct_answers + wrong_answers = 10);

-- 3. Add audit logging
CREATE TABLE audit_log (
  id bigserial PRIMARY KEY,
  user_id uuid REFERENCES users(id),
  action varchar(50) NOT NULL,
  table_name varchar(50) NOT NULL,
  record_id bigint,
  old_data jsonb,
  new_data jsonb,
  ip_address inet,
  created_at timestamptz DEFAULT now()
);

-- 4. Add soft delete support
ALTER TABLE users ADD COLUMN deleted_at timestamptz;
ALTER TABLE badges ADD COLUMN deleted_at timestamptz;
```

---

### 🔵 LOW PRIORITY (Month 3+)

```sql
-- 1. Materialize leaderboard views
CREATE MATERIALIZED VIEW mv_global_leaderboard AS
SELECT * FROM v_global_leaderboard;

CREATE UNIQUE INDEX ON mv_global_leaderboard(user_id, completed_at);

-- Refresh hourly via cron job
CREATE EXTENSION IF NOT EXISTS pg_cron;
SELECT cron.schedule('refresh-leaderboards', '0 * * * *',
  'REFRESH MATERIALIZED VIEW CONCURRENTLY mv_global_leaderboard');

-- 2. Add partitioning for large tables
CREATE TABLE user_game_set_questions_2026_01
PARTITION OF user_game_set_questions
FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');

-- 3. Add full-text search on questions (if needed)
ALTER TABLE questions ADD COLUMN search_vector tsvector;
CREATE INDEX idx_questions_search ON questions USING GIN(search_vector);

-- 4. Add analytics views
CREATE VIEW v_user_stats AS
SELECT
  user_id,
  COUNT(*) as total_games,
  SUM(normalized_score) as total_score,
  AVG(accuracy_percentage) as avg_accuracy,
  COUNT(*) FILTER (WHERE correct_answers = 10) as perfect_scores,
  MAX(max_combo) as best_combo
FROM user_game_sets
GROUP BY user_id;
```

---

### Data Integrity Checks

```sql
-- 1. Verify all sets have 10 questions
SELECT
  set_id,
  COUNT(*) as question_count
FROM questions
GROUP BY set_id
HAVING COUNT(*) != 10;
-- Should return 0 rows

-- 2. Verify normalized scores are in range
SELECT COUNT(*)
FROM user_game_sets
WHERE normalized_score < 0 OR normalized_score > 1000;
-- Should return 0

-- 3. Find orphaned records
SELECT COUNT(*) FROM user_badges ub
WHERE NOT EXISTS (SELECT 1 FROM users u WHERE u.id = ub.user_id);
-- Should return 0

-- 4. Check for duplicate badges
SELECT user_id, badge_id, COUNT(*)
FROM user_badges
GROUP BY user_id, badge_id
HAVING COUNT(*) > 1;
-- Should return 0 rows
```

---

## Schema Quality Score: 7.5/10

| Category | Score | Assessment |
|----------|-------|------------|
| **Normalization** | 9/10 | Well-normalized, appropriate use of JSONB |
| **Indexing** | 9/10 | Excellent coverage for expected query patterns |
| **Constraints** | 8/10 | Good PKs/FKs/UNIQUEs, some missing CHECKs |
| **RLS Security** | 6/10 | Enabled everywhere but critical policy gaps |
| **Naming** | 9/10 | Consistent, clear, follows conventions |
| **Documentation** | 4/10 | No inline COMMENT ON statements |
| **Performance** | 8/10 | Good indexes, views could be materialized |
| **Scalability** | 7/10 | No partitioning yet, will need long-term |

**Overall Assessment**: Solid foundation with critical security fixes needed before production launch.

---

## Quick Reference: Common Operations

### Start a Game
1. GET `/game_types?is_active=true` - List games
2. GET `/word_sets?game_type_id={id}&difficulty_level={level}` - Get sets
3. GET `/questions?set_id={id}` - Get 10 questions

### Submit Game Results
1. POST `/user_game_sets` - Insert session summary
2. POST `/user_game_set_questions` - Insert 10 question answers (batch)
3. POST `/user_set_progress` - Mark set completed
4. RPC `update_login_streak` - Update streak
5. RPC `check_and_award_badges` - Check for new badges

### View Leaderboards
1. GET `/v_global_leaderboard?limit=100` - Global top 100
2. GET `/v_game_leaderboard?game_type_id={id}&level={level}&limit=100`

### User Profile
1. GET `/users?id={id}` - User info
2. GET `/user_game_sets?user_id={id}&order=completed_at.desc` - Game history
3. GET `/user_badges?user_id={id}&select=*,badges(*)` - User badges
4. GET `/user_login_streaks?user_id={id}&order=login_date.desc&limit=1` - Current streak

---

**Document Version**: 1.0
**Last Updated**: 2026-01-13
**Maintained By**: Development Team
**For Questions**: See [PROJECT_STATUS.md](PROJECT_STATUS.md) or create an issue

---

*This document was auto-generated by Claude Code Backend Analysis. Review and update as schema evolves.*
