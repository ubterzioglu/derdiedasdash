-- ============================================
-- DER DIE DAS SPACE - SEED DATA
-- Initial badges and demo set
-- ============================================

-- ============================================
-- GAME TYPES SEED DATA
-- ============================================
INSERT INTO game_types (game_code, game_name_tr, game_name_en, timer_seconds, base_score, requires_translation, release_version) VALUES
  ('der_die_dash', 'Der Die Dash', 'Der Die Dash', 5, 20, false, 'v1.0'),
  ('case_control', 'Case Control', 'Case Control', 5, 25, false, 'v1.0'),
  ('word_salad', 'Word Salad', 'Word Salad', 20, 30, false, 'v1.0'),
  ('translation_quest', 'Translation Quest', 'Translation Quest', 8, 22, true, 'v1.0'),
  ('five_letter_blitz', '5-Letter Blitz', '5-Letter Blitz', 10, 25, false, 'v1.0')
ON CONFLICT (game_code) DO NOTHING;

-- ============================================
-- BADGES SEED DATA
-- ============================================
INSERT INTO badges (badge_code, badge_type, badge_name_tr, badge_name_en, badge_name_de, badge_description_tr, badge_description_en, badge_description_de, rarity, criteria, icon_url) VALUES
  ('first_game', 'achievement', 'İlk Oyun', 'First Game', 'Erstes Spiel', 'İlk oyununu tamamladın!', 'You completed your first game!', 'Du hast dein erstes Spiel abgeschlossen!', 'common', '{"type": "games_completed", "count": 1}', '🎮'),
  ('streak_3_days', 'streak', '3 Günlük Seri', '3 Day Streak', '3-Tage-Serie', '3 gün üst üste giriş yaptın!', 'Logged in for 3 consecutive days!', 'Du hast dich 3 Tage hintereinander angemeldet!', 'common', '{"type": "streak", "days": 3}', '🔥'),
  ('streak_7_days', 'streak', '7 Günlük Seri', '7 Day Streak', '7-Tage-Serie', '1 hafta boyunca her gün girdin!', 'Logged in every day for a week!', 'Eine Woche lang jeden Tag eingeloggt!', 'rare', '{"type": "streak", "days": 7}', '🔥🔥'),
  ('perfect_game', 'achievement', 'Mükemmel Oyun', 'Perfect Game', 'Perfektes Spiel', '10/10 doğru cevap verdin!', 'Got 10/10 correct answers!', '10/10 richtige Antworten!', 'rare', '{"type": "perfect_score", "correct_answers": 10}', '⭐'),
  ('sets_10', 'achievement', '10 Set Tamamladı', '10 Sets Completed', '10 Sets Abgeschlossen', '10 set tamamladın, harikasın!', 'Completed 10 sets, amazing!', '10 Sets abgeschlossen, fantastisch!', 'common', '{"type": "games_completed", "count": 10}', '🏆')
ON CONFLICT (badge_code) DO NOTHING;

-- ============================================
-- DEMO SET - DER DIE DASH (Placeholder)
-- ============================================

-- Get game_type_id for der_die_dash
DO $$
DECLARE
  v_game_type_id INT;
  v_set_id INT;
BEGIN
  -- Get game type ID
  SELECT id INTO v_game_type_id FROM game_types WHERE game_code = 'der_die_dash' LIMIT 1;
  
  IF v_game_type_id IS NULL THEN
    RAISE EXCEPTION 'Game type der_die_dash not found. Run game_types seed data first.';
  END IF;

  -- Create demo set
  INSERT INTO word_sets (game_type_id, set_number, difficulty_level, is_demo)
  VALUES (v_game_type_id, 0, 1, true)
  ON CONFLICT (game_type_id, set_number) DO UPDATE SET is_demo = true
  RETURNING id INTO v_set_id;

  -- Insert demo questions
  INSERT INTO questions (set_id, question_data, order_in_set) VALUES
    (v_set_id, '{"word": "Tisch", "correct_article": "der"}'::jsonb, 1),
    (v_set_id, '{"word": "Tür", "correct_article": "die"}'::jsonb, 2),
    (v_set_id, '{"word": "Auto", "correct_article": "das"}'::jsonb, 3),
    (v_set_id, '{"word": "Buch", "correct_article": "das"}'::jsonb, 4),
    (v_set_id, '{"word": "Stuhl", "correct_article": "der"}'::jsonb, 5),
    (v_set_id, '{"word": "Lampe", "correct_article": "die"}'::jsonb, 6),
    (v_set_id, '{"word": "Fenster", "correct_article": "das"}'::jsonb, 7),
    (v_set_id, '{"word": "Baum", "correct_article": "der"}'::jsonb, 8),
    (v_set_id, '{"word": "Blume", "correct_article": "die"}'::jsonb, 9),
    (v_set_id, '{"word": "Kind", "correct_article": "das"}'::jsonb, 10)
  ON CONFLICT DO NOTHING;

END $$;

-- ============================================
-- DEMO SET - LEVEL 1 SET 1 (Placeholder)
-- ============================================

DO $$
DECLARE
  v_game_type_id INT;
  v_set_id INT;
BEGIN
  -- Get game type ID
  SELECT id INTO v_game_type_id FROM game_types WHERE game_code = 'der_die_dash' LIMIT 1;
  
  IF v_game_type_id IS NULL THEN
    RETURN;
  END IF;

  -- Create Level 1 Set 1
  INSERT INTO word_sets (game_type_id, set_number, difficulty_level, is_demo)
  VALUES (v_game_type_id, 1, 1, false)
  ON CONFLICT (game_type_id, set_number) DO NOTHING
  RETURNING id INTO v_set_id;

  IF v_set_id IS NOT NULL THEN
    -- Insert questions
    INSERT INTO questions (set_id, question_data, order_in_set) VALUES
      (v_set_id, '{"word": "Haus", "correct_article": "das"}'::jsonb, 1),
      (v_set_id, '{"word": "Katze", "correct_article": "die"}'::jsonb, 2),
      (v_set_id, '{"word": "Tisch", "correct_article": "der"}'::jsonb, 3),
      (v_set_id, '{"word": "Schule", "correct_article": "die"}'::jsonb, 4),
      (v_set_id, '{"word": "Brot", "correct_article": "das"}'::jsonb, 5),
      (v_set_id, '{"word": "Mann", "correct_article": "der"}'::jsonb, 6),
      (v_set_id, '{"word": "Frau", "correct_article": "die"}'::jsonb, 7),
      (v_set_id, '{"word": "Kind", "correct_article": "das"}'::jsonb, 8),
      (v_set_id, '{"word": "Hund", "correct_article": "der"}'::jsonb, 9),
      (v_set_id, '{"word": "Mutter", "correct_article": "die"}'::jsonb, 10)
    ON CONFLICT DO NOTHING;
  END IF;

END $$;

-- ============================================
-- ADMIN KEY (Generate your own!)
-- ============================================
-- To generate a secure API key, run:
-- node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
--
-- Then replace YOUR_GENERATED_KEY_HERE below:
--
-- INSERT INTO admin_keys (api_key, key_name, is_active) VALUES
--   ('YOUR_GENERATED_KEY_HERE', 'Master Admin Key', true);
