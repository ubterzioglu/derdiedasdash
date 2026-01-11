-- ============================================
-- DER DIE DAS SPACE - DATABASE VIEWS
-- Leaderboard views
-- ============================================

-- ============================================
-- GLOBAL LEADERBOARD VIEW
-- ============================================
CREATE OR REPLACE VIEW v_global_leaderboard AS
SELECT 
  u.id as user_id,
  u.display_name,
  u.email,
  ugs.normalized_score,
  ugs.set_score,
  gt.game_name_en as game,
  ugs.level,
  ugs.completed_at,
  ROW_NUMBER() OVER (
    ORDER BY ugs.normalized_score DESC, ugs.completed_at ASC
  ) as rank
FROM user_game_sets ugs
JOIN users u ON ugs.user_id = u.id
JOIN game_types gt ON ugs.game_type_id = gt.id
ORDER BY ugs.normalized_score DESC, ugs.completed_at ASC;

-- ============================================
-- GAME-SPECIFIC LEADERBOARD VIEW
-- ============================================
CREATE OR REPLACE VIEW v_game_leaderboard AS
SELECT 
  u.id as user_id,
  u.display_name,
  u.email,
  ugs.game_type_id,
  gt.game_name_en as game,
  ugs.level,
  ugs.set_score,
  ugs.normalized_score,
  ugs.completed_at,
  ROW_NUMBER() OVER (
    PARTITION BY ugs.game_type_id, ugs.level 
    ORDER BY ugs.set_score DESC, ugs.completed_at ASC
  ) as rank
FROM user_game_sets ugs
JOIN users u ON ugs.user_id = u.id
JOIN game_types gt ON ugs.game_type_id = gt.id
ORDER BY ugs.game_type_id, ugs.level, ugs.set_score DESC;
