/* ============================================
   DER DIE DAS SPACE - TRANSLATION QUEST GAME
   Çeviri oyunu logic (TR/EN şıklar)
   ============================================ */

import { getSupabase } from '../core/supabase.js';
import { isAuthenticated } from '../core/auth.js';
import { GameTimer, updateTimerDisplay } from '../core/timer.js';
import { ComboManager, updateComboIndicator, hideComboIndicator } from '../core/combo.js';
import { calculateQuestionScore, calculateSetScore, normalizedScore } from '../core/scoring.js';
import { t, getCurrentLanguage } from '../core/i18n.js';
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
  gameKey: 'translation_quest',
  level: 1,
  set_id: null,
  maxTime: 8
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
    article: document.getElementById('article'),
    currentWord: document.getElementById('currentWord'),
    translationOptions: document.getElementById('translationOptions'),
    optionA: document.getElementById('optionA'),
    optionB: document.getElementById('optionB'),
    optionC: document.getElementById('optionC'),
    optionD: document.getElementById('optionD'),
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
    // Load specific set
    await loadSetById(setId);
  } else {
    // Check if user is authenticated
    const user = await isAuthenticated();
    if (!user) {
      gameState.isDemo = true;
      await loadDemoSet();
    } else {
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

  // Setup translation options
  setupTranslationOptions();

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
    loadPlaceholderSet(true);
    return;
  }

  try {
    const { data, error } = await supabase
      .from('word_sets')
      .select(`
        *,
        questions (*),
        game_types!inner(game_code)
      `)
      .eq('game_types.game_code', 'translation_quest')
      .eq('is_demo', true)
      .single();

    if (error || !data) {
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
        questions (*),
        game_types!inner(game_code)
      `)
      .eq('game_types.game_code', 'translation_quest')
      .eq('id', setId)
      .single();

    if (error || !data) {
      console.error('Error loading set:', error);
      // Fallback to demo set
      gameState.isDemo = true;
      await loadDemoSet();
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
  } catch (error) {
    console.error('Error loading set by ID:', error);
    // Fallback to demo set
    gameState.isDemo = true;
    await loadDemoSet();
  }
}

/**
 * Load available set
 */
async function loadAvailableSet() {
  await loadDemoSet();
}

/**
 * Load placeholder set
 */
function loadPlaceholderSet(isDemo) {
  const placeholderQuestions = [
    {
      word: 'Tisch',
      article: 'der',
      translation_tr: 'Masa',
      translation_en: 'Table',
      wrong_options_tr: ['Kapı', 'Araba', 'Kitap'],
      wrong_options_en: ['Door', 'Car', 'Book']
    },
    {
      word: 'Tür',
      article: 'die',
      translation_tr: 'Kapı',
      translation_en: 'Door',
      wrong_options_tr: ['Pencere', 'Duvar', 'Zemin'],
      wrong_options_en: ['Window', 'Wall', 'Floor']
    },
    {
      word: 'Auto',
      article: 'das',
      translation_tr: 'Araba',
      translation_en: 'Car',
      wrong_options_tr: ['Bisiklet', 'Motor', 'Tren'],
      wrong_options_en: ['Bicycle', 'Motorcycle', 'Train']
    },
    {
      word: 'Buch',
      article: 'das',
      translation_tr: 'Kitap',
      translation_en: 'Book',
      wrong_options_tr: ['Dergi', 'Gazete', 'Mektup'],
      wrong_options_en: ['Magazine', 'Newspaper', 'Letter']
    },
    {
      word: 'Stuhl',
      article: 'der',
      translation_tr: 'Sandalye',
      translation_en: 'Chair',
      wrong_options_tr: ['Masa', 'Kanepe', 'Yatak'],
      wrong_options_en: ['Table', 'Sofa', 'Bed']
    },
    {
      word: 'Lampe',
      article: 'die',
      translation_tr: 'Lamba',
      translation_en: 'Lamp',
      wrong_options_tr: ['Işık', 'Fener', 'Ampul'],
      wrong_options_en: ['Light', 'Flashlight', 'Bulb']
    },
    {
      word: 'Fenster',
      article: 'das',
      translation_tr: 'Pencere',
      translation_en: 'Window',
      wrong_options_tr: ['Kapı', 'Duvar', 'Çatı'],
      wrong_options_en: ['Door', 'Wall', 'Roof']
    },
    {
      word: 'Baum',
      article: 'der',
      translation_tr: 'Ağaç',
      translation_en: 'Tree',
      wrong_options_tr: ['Çiçek', 'Yaprak', 'Dal'],
      wrong_options_en: ['Flower', 'Leaf', 'Branch']
    },
    {
      word: 'Blume',
      article: 'die',
      translation_tr: 'Çiçek',
      translation_en: 'Flower',
      wrong_options_tr: ['Ağaç', 'Yaprak', 'Dal'],
      wrong_options_en: ['Tree', 'Leaf', 'Branch']
    },
    {
      word: 'Kind',
      article: 'das',
      translation_tr: 'Çocuk',
      translation_en: 'Child',
      wrong_options_tr: ['Yetişkin', 'Bebek', 'Genç'],
      wrong_options_en: ['Adult', 'Baby', 'Youth']
    }
  ];

  gameState.questions = placeholderQuestions;
  gameState.level = 1;
  gameState.isDemo = isDemo;
  
  if (elements.setInfo) {
    elements.setInfo.textContent = 'Level 1 - Set 1';
  }
}

/**
 * Setup translation options
 */
function setupTranslationOptions() {
  const options = [elements.optionA, elements.optionB, elements.optionC, elements.optionD];
  
  options.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        if (gameState.timer && !gameState.timer.getIsRunning()) return;
        if (gameState.currentQuestionIndex >= gameState.questions.length) return;
        
        const selectedTranslation = btn.querySelector('.option-text')?.textContent;
        handleAnswer(selectedTranslation);
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
  
  // Update German word
  if (elements.article) {
    elements.article.textContent = question.article;
  }
  if (elements.currentWord) {
    elements.currentWord.textContent = question.word;
  }
  
  // Update translation options based on UI language
  updateTranslationOptions(question);
  
  // Reset buttons
  resetButtons();

  // Update progress
  updateProgress();

  // Start timer
  gameState.timer = new GameTimer(
    gameState.maxTime,
    (currentTime, timeUsed) => {
      updateTimerDisplay(elements.timerDisplay, currentTime);
    },
    (timeUsed) => {
      handleAnswer(null, true);
    }
  );

  gameState.timer.start();
}

/**
 * Update translation options based on UI language
 */
function updateTranslationOptions(question) {
  const currentLang = getCurrentLanguage();
  
  let correctTranslation, wrongOptions;
  if (currentLang === 'tr') {
    correctTranslation = question.translation_tr;
    wrongOptions = question.wrong_options_tr;
  } else {
    correctTranslation = question.translation_en;
    wrongOptions = question.wrong_options_en;
  }
  
  // Shuffle options
  const allOptions = [correctTranslation, ...wrongOptions];
  const shuffled = shuffleArray([...allOptions]);
  
  // Update buttons
  const options = [elements.optionA, elements.optionB, elements.optionC, elements.optionD];
  shuffled.forEach((option, index) => {
    if (options[index]) {
      const optionText = options[index].querySelector('.option-text');
      if (optionText) {
        optionText.textContent = option;
      }
      options[index].dataset.translation = option;
      options[index].dataset.isCorrect = (option === correctTranslation) ? 'true' : 'false';
    }
  });
}

/**
 * Shuffle array
 */
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Handle answer
 */
async function handleAnswer(selectedTranslation, isTimeout = false) {
  if (!gameState.timer) return;
  
  gameState.timer.stop();
  const timeUsed = gameState.timer.getTimeUsed();

  const question = gameState.questions[gameState.currentQuestionIndex];
  const currentLang = getCurrentLanguage();
  const correctTranslation = currentLang === 'tr' 
    ? question.translation_tr 
    : question.translation_en;
  const isCorrect = selectedTranslation === correctTranslation;

  // Update combo
  if (isCorrect) {
    gameState.combo.addCorrect();
  } else {
    gameState.combo.addWrong();
  }

  // Store answer
  gameState.answers.push({
    question: question,
    selectedTranslation: selectedTranslation,
    correctTranslation: correctTranslation,
    isCorrect: isCorrect,
    timeUsed: timeUsed,
    isTimeout: isTimeout
  });

  // Show feedback
  showFeedback(isCorrect, selectedTranslation, correctTranslation);

  // Calculate and update score
  const questionScore = calculateQuestionScore({
    gameKey: gameState.gameKey,
    level: gameState.level,
    isCorrect: isCorrect,
    timeUsed: timeUsed,
    maxTime: gameState.maxTime,
    comboStreak: gameState.combo.getStreak()
  });

  gameState.score += Math.max(0, questionScore);
  if (elements.currentScore) {
    elements.currentScore.textContent = gameState.score;
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
 * Show feedback
 */
function showFeedback(isCorrect, selectedTranslation, correctTranslation) {
  disableButtons();

  const options = [elements.optionA, elements.optionB, elements.optionC, elements.optionD];
  
  options.forEach(btn => {
    if (!btn) return;
    const translation = btn.dataset.translation;
    const isCorrectOption = btn.dataset.isCorrect === 'true';
    
    if (translation === selectedTranslation) {
      if (isCorrect) {
        animateCorrect(btn);
      } else {
        animateWrong(btn);
      }
    }
    
    if (isCorrectOption && !isCorrect) {
      animateCorrect(btn);
    }
  });
}

/**
 * Reset buttons
 */
function resetButtons() {
  const options = [elements.optionA, elements.optionB, elements.optionC, elements.optionD];
  
  options.forEach(btn => {
    if (btn) {
      btn.classList.remove('translation-option--correct', 'translation-option--wrong');
      btn.disabled = false;
    }
  });
}

/**
 * Disable buttons
 */
function disableButtons() {
  const options = [elements.optionA, elements.optionB, elements.optionC, elements.optionD];
  
  options.forEach(btn => {
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
 * End game
 */
async function endGame() {
  const scoreData = calculateSetScore(
    gameState.answers.map(answer => ({
      gameKey: gameState.gameKey,
      level: gameState.level,
      isCorrect: answer.isCorrect,
      timeUsed: answer.timeUsed,
      maxTime: gameState.maxTime
    }))
  );

  scoreData.maxCombo = gameState.combo.getMaxCombo();

  if (!gameState.isDemo && await isAuthenticated()) {
    await saveScore(scoreData);
  }

  showResults(scoreData);
}

/**
 * Show results screen
 */
function showResults(scoreData) {
  if (elements.wordFrame) elements.wordFrame.style.display = 'none';
  if (elements.translationOptions) elements.translationOptions.style.display = 'none';
  if (elements.timerDisplay) elements.timerDisplay.style.display = 'none';

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
 * Save score
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
    }
  } catch (error) {
    console.error('Error saving score:', error);
  }
}
