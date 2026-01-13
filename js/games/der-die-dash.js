/* ============================================
   DER DIE DAS SPACE - DER DIE DASH GAME
   Artikel tahmin oyunu logic
   ============================================ */

import { getSupabase } from '../core/supabase.js';
import { isAuthenticated } from '../core/auth.js';
import { GameTimer, updateTimerDisplay } from '../core/timer.js';
import { ComboManager, updateComboIndicator, hideComboIndicator } from '../core/combo.js';
import { calculateQuestionScore, calculateSetScore, normalizedScore } from '../core/scoring.js';
import { t } from '../core/i18n.js';
import { animateCorrect, animateWrong } from '../core/animations.js';

// Game state
let gameState = {
  currentSet: null,
  questions: [],
  currentQuestionIndex: 0,
  answers: [],
  score: 0,
  timer: null,
  combo: null,
  isDemo: false,
  gameKey: 'der_die_dash',
  level: 1,
  set_id: null
};

// UI Elements
let elements = {};

// Initialize game
document.addEventListener('DOMContentLoaded', async () => {
  await initGame();
});

async function initGame() {
  // Get UI elements
  elements = {
    wordFrame: document.getElementById('wordFrame'),
    currentWord: document.getElementById('currentWord'),
    artikelButtons: document.getElementById('artikelButtons'),
    btnDer: document.getElementById('btnDer'),
    btnDie: document.getElementById('btnDie'),
    btnDas: document.getElementById('btnDas'),
    timerDisplay: document.getElementById('timerDisplay'),
    comboIndicator: document.getElementById('comboIndicator'),
    currentScore: document.getElementById('currentScore'),
    progressFill: document.getElementById('progressFill'),
    progressText: document.getElementById('progressText'),
    loadingState: document.getElementById('loadingState'),
    gameResults: document.getElementById('gameResults'),
    setInfo: document.getElementById('setInfo')
  };

  // Check for setId in URL
  const urlParams = new URLSearchParams(window.location.search);
  const setId = urlParams.get('setId');

  if (setId) {
    // Load specific set - parse to integer
    const setIdInt = parseInt(setId, 10);
    if (isNaN(setIdInt)) {
      console.error('Invalid setId:', setId);
      // Fallback to demo set
      gameState.isDemo = true;
      await loadDemoSet();
    } else {
      await loadSetById(setIdInt);
    }
  } else {
    // Check if user is authenticated
    const user = await isAuthenticated();
    if (!user) {
      // Demo mode
      gameState.isDemo = true;
      await loadDemoSet();
    } else {
      // Load available sets for user
      await loadAvailableSet();
    }
  }

  // Initialize combo manager
  gameState.combo = new ComboManager();
  gameState.combo.onComboStart = (streak) => {
    updateComboIndicator(elements.comboIndicator, streak);
  };
  gameState.combo.onComboUpdate = (streak) => {
    updateComboIndicator(elements.comboIndicator, streak);
  };
  gameState.combo.onComboReset = () => {
    hideComboIndicator(elements.comboIndicator);
  };

  // Setup artikel buttons
  setupArtikelButtons();

  // Start game
  if (gameState.questions.length > 0) {
    elements.loadingState.style.display = 'none';
    startQuestion();
  }
}

/**
 * Load demo set
 */
async function loadDemoSet() {
  const supabase = getSupabase();
  if (!supabase) {
    // Fallback: Use placeholder data
    loadPlaceholderSet(true);
    return;
  }

  try {
    // Load first available set for Level 1 (since demo is removed)
    const { data, error } = await supabase
      .from('word_sets')
      .select(`
        *,
        questions (*)
      `)
      .eq('game_type_id', 1) // der_die_dash
      .eq('difficulty_level', 1) // Level 1
      .order('set_number', { ascending: true })
      .limit(1)
      .single();

    if (error || !data) {
      console.warn('Level 1 set not found, using placeholder');
      loadPlaceholderSet(true);
      return;
    }

    gameState.currentSet = data;
    gameState.set_id = data.id;
    gameState.level = data.difficulty_level;
    gameState.questions = data.questions
      .sort((a, b) => a.order_in_set - b.order_in_set)
      .map(q => q.question_data);
    
    if (elements.setInfo) {
      elements.setInfo.textContent = `Level ${gameState.level} - Set 1`;
    }
  } catch (error) {
    console.error('Error loading demo set:', error);
    loadPlaceholderSet(true);
  }
}

/**
 * Load set by ID
 */
async function loadSetById(setId) {
  const supabase = getSupabase();
  if (!supabase) {
    loadPlaceholderSet(false);
    return;
  }

  try {
    const { data, error } = await supabase
      .from('word_sets')
      .select(`
        *,
        questions (*)
      `)
      .eq('id', setId)
      .single();

    if (error || !data) {
      console.error('Error loading set:', error);
      console.error('SetId was:', setId);
      // Fallback to placeholder
      loadPlaceholderSet(false);
      return;
    }

    // Check if set has questions
    if (!data.questions || data.questions.length === 0) {
      console.error('Set has no questions:', data.id);
      loadPlaceholderSet(false);
      return;
    }

    gameState.currentSet = data;
    gameState.set_id = data.id;
    gameState.level = data.difficulty_level;
    gameState.isDemo = false;
    gameState.questions = data.questions
      .sort((a, b) => a.order_in_set - b.order_in_set)
      .map(q => q.question_data);
    
    if (elements.setInfo) {
      elements.setInfo.textContent = `Level ${gameState.level} - Set ${data.set_number}`;
    }
    
    console.log('Set loaded successfully:', {
      setId: data.id,
      setNumber: data.set_number,
      level: data.difficulty_level,
      questionCount: gameState.questions.length
    });
  } catch (error) {
    console.error('Error loading set by ID:', error);
    console.error('SetId was:', setId);
    // Fallback to placeholder
    loadPlaceholderSet(false);
  }
}

/**
 * Load available set for authenticated user
 */
async function loadAvailableSet() {
  // TODO: Implement set selection logic
  // For now, load demo set
  await loadDemoSet();
}

/**
 * Load placeholder set (for development/testing)
 */
function loadPlaceholderSet(isDemo) {
  const placeholderQuestions = [
    { word: 'Tisch', correct_article: 'der' },
    { word: 'Tür', correct_article: 'die' },
    { word: 'Auto', correct_article: 'das' },
    { word: 'Buch', correct_article: 'das' },
    { word: 'Stuhl', correct_article: 'der' },
    { word: 'Lampe', correct_article: 'die' },
    { word: 'Fenster', correct_article: 'das' },
    { word: 'Baum', correct_article: 'der' },
    { word: 'Blume', correct_article: 'die' },
    { word: 'Kind', correct_article: 'das' }
  ];

  gameState.questions = placeholderQuestions;
  gameState.level = 1;
  gameState.isDemo = isDemo;
  
  if (elements.setInfo) {
    elements.setInfo.textContent = 'Level 1 - Set 1';
  }
}

/**
 * Setup artikel buttons
 */
function setupArtikelButtons() {
  const buttons = [elements.btnDer, elements.btnDie, elements.btnDas];
  
  buttons.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        if (gameState.timer && !gameState.timer.getIsRunning()) return;
        if (gameState.currentQuestionIndex >= gameState.questions.length) return;
        
        const selectedArticle = btn.dataset.article;
        handleAnswer(selectedArticle);
      });
    }
  });
}

/**
 * Start a new question
 */
function startQuestion() {
  if (gameState.currentQuestionIndex >= gameState.questions.length) {
    endGame();
    return;
  }

  const question = gameState.questions[gameState.currentQuestionIndex];
  
  // Update UI
  if (elements.currentWord) {
    elements.currentWord.textContent = question.word;
  }
  
  // Reset buttons
  resetButtons();

  // Update progress
  updateProgress();

  // Start timer
  const maxTime = 5; // 5 seconds for Der Die Dash
  gameState.timer = new GameTimer(
    maxTime,
    (currentTime, timeUsed) => {
      updateTimerDisplay(elements.timerDisplay, currentTime);
    },
    (timeUsed) => {
      // Timeout - wrong answer
      handleAnswer(null, true);
    }
  );

  gameState.timer.start();
}

/**
 * Handle answer
 */
function handleAnswer(selectedArticle, isTimeout = false) {
  if (!gameState.timer) return;
  
  gameState.timer.stop();
  const timeUsed = gameState.timer.getTimeUsed();

  const question = gameState.questions[gameState.currentQuestionIndex];
  const correctArticle = question.correct_article;
  const isCorrect = selectedArticle === correctArticle;

  // Update combo
  if (isCorrect) {
    gameState.combo.addCorrect();
  } else {
    gameState.combo.addWrong();
  }

  // Store answer
  gameState.answers.push({
    question: question,
    selectedArticle: selectedArticle,
    correctArticle: correctArticle,
    isCorrect: isCorrect,
    timeUsed: timeUsed,
    isTimeout: isTimeout
  });

  // Show feedback
  showFeedback(isCorrect, selectedArticle, correctArticle);

  // Calculate and update score
  const questionScore = calculateQuestionScore({
    gameKey: gameState.gameKey,
    level: gameState.level,
    isCorrect: isCorrect,
    timeUsed: timeUsed,
    maxTime: 5,
    comboStreak: gameState.combo.getStreak()
  });

  gameState.score += Math.max(0, questionScore);
  if (elements.currentScore) {
    elements.currentScore.textContent = gameState.score;
    elements.currentScore.classList.add('score-display--updated');
    setTimeout(() => {
      elements.currentScore.classList.remove('score-display--updated');
    }, 300);
  }

  // Move to next question after delay
  setTimeout(() => {
    gameState.currentQuestionIndex++;
    if (gameState.currentQuestionIndex < gameState.questions.length) {
      startQuestion();
    } else {
      endGame();
    }
  }, 1500);
}

/**
 * Show feedback (correct/wrong)
 */
function showFeedback(isCorrect, selectedArticle, correctArticle) {
  // Disable buttons
  disableButtons();

  // Highlight selected button
  const buttons = {
    'der': elements.btnDer,
    'die': elements.btnDie,
    'das': elements.btnDas
  };

  if (selectedArticle && buttons[selectedArticle]) {
    if (isCorrect) {
      animateCorrect(buttons[selectedArticle]);
    } else {
      animateWrong(buttons[selectedArticle]);
      // Highlight correct answer
      if (buttons[correctArticle]) {
        animateCorrect(buttons[correctArticle]);
      }
    }
  } else {
    // Timeout - highlight correct answer
    if (buttons[correctArticle]) {
      animateCorrect(buttons[correctArticle]);
    }
    if (elements.wordFrame) {
      animateWrong(elements.wordFrame);
    }
  }
}

/**
 * Reset buttons
 */
function resetButtons() {
  [elements.btnDer, elements.btnDie, elements.btnDas].forEach(btn => {
    if (btn) {
      btn.classList.remove('artikel-btn--correct', 'artikel-btn--wrong');
      btn.disabled = false;
    }
  });

  if (elements.wordFrame) {
    elements.wordFrame.classList.remove('word-frame--wrong');
  }
}

/**
 * Disable buttons
 */
function disableButtons() {
  [elements.btnDer, elements.btnDie, elements.btnDas].forEach(btn => {
    if (btn) {
      btn.disabled = true;
    }
  });
}

/**
 * Update progress
 */
function updateProgress() {
  const current = gameState.currentQuestionIndex + 1;
  const total = gameState.questions.length;
  const percentage = (current / total) * 100;

  if (elements.progressFill) {
    elements.progressFill.style.width = `${percentage}%`;
  }

  if (elements.progressText) {
    elements.progressText.textContent = `${t('question')} ${current}/${total}`;
  }
}

/**
 * End game - show results
 */
async function endGame() {
  // Calculate final score
  const scoreData = calculateSetScore(
    gameState.answers.map(answer => ({
      gameKey: gameState.gameKey,
      level: gameState.level,
      isCorrect: answer.isCorrect,
      timeUsed: answer.timeUsed,
      maxTime: 5
    }))
  );

  scoreData.maxCombo = gameState.combo.getMaxCombo();

  // Save score if authenticated
  if (!gameState.isDemo && await isAuthenticated()) {
    await saveScore(scoreData);
  }

  // Show results screen
  showResults(scoreData);
}

/**
 * Show results screen
 */
function showResults(scoreData) {
  // Hide game UI
  if (elements.wordFrame) elements.wordFrame.style.display = 'none';
  if (elements.artikelButtons) elements.artikelButtons.style.display = 'none';
  if (elements.timerDisplay) elements.timerDisplay.style.display = 'none';

  // Show results
  if (elements.gameResults) {
    elements.gameResults.style.display = 'block';
    elements.gameResults.innerHTML = `
      <div class="card">
        <div class="card-header text-center">
          <h2>🎉 ${t('setComplete')}</h2>
        </div>
        <div class="card-body">
          <div class="text-center" style="margin: var(--space-xl) 0;">
            <div style="font-size: var(--text-4xl); font-weight: 700; color: var(--color-blue);">
              ${scoreData.setScore}
            </div>
            <p style="color: var(--text-secondary);">${t('yourScore')}</p>
          </div>

          <div class="result-stats-grid">
            <div class="result-stat-card">
              <div class="result-stat-label">✅ ${t('correctAnswers')}</div>
              <div class="result-stat-value">${scoreData.correctAnswers}</div>
            </div>
            <div class="result-stat-card">
              <div class="result-stat-label">❌ ${t('wrongAnswers')}</div>
              <div class="result-stat-value">${scoreData.wrongAnswers}</div>
            </div>
            <div class="result-stat-card">
              <div class="result-stat-label">⏱ ${t('avgTime')}</div>
              <div class="result-stat-value">${scoreData.avgResponseTime.toFixed(1)}s</div>
            </div>
            <div class="result-stat-card">
              <div class="result-stat-label">🔥 ${t('maxCombo')}</div>
              <div class="result-stat-value">${scoreData.maxCombo}</div>
            </div>
          </div>

          ${gameState.isDemo ? `
            <div class="card" style="background: var(--bg-secondary); margin: var(--space-lg) 0;">
              <p style="text-align: center; color: var(--text-secondary);">
                ${t('demoMessage')}
              </p>
              <div style="text-align: center; margin-top: var(--space-md);">
                <a href="../index.html?showRegister=true" class="btn btn-primary">
                  ${t('register')}
                </a>
              </div>
            </div>
          ` : ''}
        </div>
        <div class="result-buttons">
          <a href="../leaderboard.html" class="result-btn">${t('viewLeaderboard')}</a>
          <a href="../index.html" class="result-btn">${t('backToHome')}</a>
        </div>
      </div>
    `;
  }
}

/**
 * Save score to database
 */
async function saveScore(scoreData) {
  const supabase = getSupabase();
  if (!supabase) return;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (!gameState.set_id) {
      console.warn('Set ID not available, cannot save score');
      return;
    }

    // Get game_type_id from game_code
    const { data: gameType, error: gameTypeError } = await supabase
      .from('game_types')
      .select('id')
      .eq('game_code', gameState.gameKey)
      .single();

    if (gameTypeError || !gameType) {
      console.error('Error getting game type:', gameTypeError);
      return;
    }

    const normalized = normalizedScore(
      scoreData.setScore,
      gameState.gameKey,
      gameState.level
    );

    // Save to user_game_sets table
    const { data, error } = await supabase
      .from('user_game_sets')
      .insert({
        user_id: user.id,
        set_id: gameState.set_id,
        game_type_id: gameType.id,
        level: gameState.level,
        set_score: scoreData.setScore,
        normalized_score: normalized,
        base_total: scoreData.baseTotal || 0,
        speed_bonus_total: scoreData.speedBonusTotal || 0,
        combo_bonus_total: scoreData.comboBonusTotal || 0,
        penalty_total: scoreData.penaltyTotal || 0,
        correct_answers: scoreData.correctAnswers,
        wrong_answers: scoreData.wrongAnswers,
        max_combo: scoreData.maxCombo || 0,
        avg_response_time: scoreData.avgResponseTime || 0,
        accuracy_percentage: scoreData.accuracyPercentage || 0
      })
      .select()
      .single();

    if (error) {
      // If duplicate (user already completed this set), update instead
      if (error.code === '23505') {
        const { error: updateError } = await supabase
          .from('user_game_sets')
          .update({
            set_score: scoreData.setScore,
            normalized_score: normalized,
            base_total: scoreData.baseTotal || 0,
            speed_bonus_total: scoreData.speedBonusTotal || 0,
            combo_bonus_total: scoreData.comboBonusTotal || 0,
            penalty_total: scoreData.penaltyTotal || 0,
            correct_answers: scoreData.correctAnswers,
            wrong_answers: scoreData.wrongAnswers,
            max_combo: scoreData.maxCombo || 0,
            avg_response_time: scoreData.avgResponseTime || 0,
            accuracy_percentage: scoreData.accuracyPercentage || 0,
            completed_at: new Date().toISOString()
          })
          .eq('user_id', user.id)
          .eq('set_id', gameState.set_id);

        if (updateError) {
          console.error('Error updating score:', updateError);
        }
      } else {
        console.error('Error saving score:', error);
      }
    } else {
      console.log('Score saved successfully:', data);
    }
  } catch (error) {
    console.error('Error saving score:', error);
  }
}
