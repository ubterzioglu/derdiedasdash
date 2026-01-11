-- ============================================
-- DER DIE DAS SPACE - DATABASE FUNCTIONS
-- Stored procedures
-- ============================================

-- ============================================
-- UPDATE LOGIN STREAK FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION update_login_streak(p_user_id UUID)
RETURNS TABLE(current_streak INT, longest_streak INT) AS $$
DECLARE
  v_last_login DATE;
  v_current_streak INT;
  v_longest_streak INT;
BEGIN
  -- Get last login
  SELECT login_date, user_login_streaks.current_streak, user_login_streaks.longest_streak
  INTO v_last_login, v_current_streak, v_longest_streak
  FROM user_login_streaks
  WHERE user_id = p_user_id
  ORDER BY login_date DESC
  LIMIT 1;

  -- If no previous login
  IF v_last_login IS NULL THEN
    INSERT INTO user_login_streaks (user_id, login_date, current_streak, longest_streak)
    VALUES (p_user_id, CURRENT_DATE, 1, 1);
    RETURN QUERY SELECT 1, 1;
    RETURN;
  END IF;

  -- If already logged in today
  IF v_last_login = CURRENT_DATE THEN
    RETURN QUERY SELECT v_current_streak, v_longest_streak;
    RETURN;
  END IF;

  -- If consecutive day
  IF v_last_login = CURRENT_DATE - 1 THEN
    v_current_streak := v_current_streak + 1;
    v_longest_streak := GREATEST(v_current_streak, v_longest_streak);
  ELSE
    -- Streak broken
    v_current_streak := 1;
  END IF;

  -- Insert new record
  INSERT INTO user_login_streaks (user_id, login_date, current_streak, longest_streak)
  VALUES (p_user_id, CURRENT_DATE, v_current_streak, v_longest_streak)
  ON CONFLICT (user_id, login_date) DO UPDATE
  SET current_streak = EXCLUDED.current_streak,
      longest_streak = EXCLUDED.longest_streak,
      last_updated = NOW();

  RETURN QUERY SELECT v_current_streak, v_longest_streak;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- CHECK AND AWARD BADGES FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION check_and_award_badges(p_user_id UUID)
RETURNS TABLE(badge_id INT, badge_code VARCHAR) AS $$
DECLARE
  v_badge RECORD;
  v_criteria JSONB;
  v_earned BOOLEAN;
  v_games_completed INT;
  v_current_streak INT;
BEGIN
  -- Loop through active badges
  FOR v_badge IN 
    SELECT b.id, b.badge_code, b.badge_type, b.criteria
    FROM badges b
    WHERE b.is_active = true
    AND NOT EXISTS (
      SELECT 1 FROM user_badges ub 
      WHERE ub.user_id = p_user_id AND ub.badge_id = b.id
    )
  LOOP
    v_criteria := v_badge.criteria;
    v_earned := false;

    -- Check criteria based on type
    IF v_badge.badge_type = 'achievement' THEN
      -- Games completed check
      IF v_criteria->>'type' = 'games_completed' THEN
        SELECT COUNT(*) INTO v_games_completed
        FROM user_game_sets
        WHERE user_id = p_user_id;
        
        IF v_games_completed >= (v_criteria->>'count')::INT THEN
          v_earned := true;
        END IF;
      END IF;

      -- Perfect score check
      IF v_criteria->>'type' = 'perfect_score' THEN
        SELECT EXISTS (
          SELECT 1 FROM user_game_sets
          WHERE user_id = p_user_id 
          AND correct_answers = (v_criteria->>'correct_answers')::INT
        ) INTO v_earned;
      END IF;
    END IF;

    IF v_badge.badge_type = 'streak' THEN
      SELECT COALESCE(MAX(current_streak), 0) INTO v_current_streak
      FROM user_login_streaks
      WHERE user_id = p_user_id;
      
      IF v_current_streak >= (v_criteria->>'days')::INT THEN
        v_earned := true;
      END IF;
    END IF;

    -- Award badge if earned
    IF v_earned THEN
      INSERT INTO user_badges (user_id, badge_id)
      VALUES (p_user_id, v_badge.id)
      ON CONFLICT DO NOTHING;
      
      RETURN QUERY SELECT v_badge.id, v_badge.badge_code;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;
