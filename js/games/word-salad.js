/* ============================================
   DER DIE DAS SPACE - WORD SALAD GAME
   Kelimelerden cümle kur oyunu logic
   ============================================ */

import { getSupabase } from '../core/supabase.js';
import { isAuthenticated } from '../core/auth.js';
import { GameTimer, updateTimerDisplay } from '../core/timer.js';
import { ComboManager, updateComboIndicator, hideComboIndicator } from '../core/combo.js';
import { calculateQuestionScore, calculateSetScore, normalizedScore } from '../core/scoring.js';
import { t } from '../core/i18n.js';

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
  gameKey: 'word_salad',
  level: 1,
  set_id: null,
  maxTime: 20, // 20 seconds for Word Salad
  currentSelectedWords: [],
  currentScrambledWords: []
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
    sentenceBuilder: document.getElementById('sentenceBuilder'),
    sentenceSlot: document.getElementById('sentenceSlot'),
    wordCount: document.getElementById('wordCount'),
    scrambledWords: document.getElementById('scrambledWords'),
    resetBtn: document.getElementById('resetBtn'),
    goBtn: document.getElementById('goBtn'),
    timerDisplay: document.getElementById('timerDisplay'),
    comboIndicator: document.getElementById('comboIndicator'),
    currentScore: document.getElementById('currentScore'),
    progressFill: document.getElementById('progressFill'),
    progressText: document.getElementById('progressText'),
    loadingState: document.getElementById('loadingState'),
    gameResults: document.getElementById('gameResults'),
    setInfo: document.getElementById('setInfo')
  };

  // Check if user is authenticated
  const user = await isAuthenticated();
  if (!user) {
    gameState.isDemo = true;
    await loadDemoSet();
  } else {
    await loadAvailableSet();
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

  // Setup buttons
  setupButtons();

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
      .eq('game_types.game_code', 'word_salad')
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
      elements.setInfo.textContent = `Demo Set - Level ${gameState.level}`;
    }
  } catch (error) {
    console.error('Error loading demo set:', error);
    loadPlaceholderSet(true);
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
  // IMPORTANT: All sentences MUST have exactly 10 words!
  const placeholderQuestions = [
    {
      correct_sentence: 'Ich gehe jeden Tag in die große Schule hier',
      scrambled_words: ['Tag', 'die', 'Schule', 'hier', 'gehe', 'große', 'in', 'jeden', 'Ich'],
      word_count: 10
    },
    {
      correct_sentence: 'Der Mann kauft ein neues Auto heute für mich',
      scrambled_words: ['kauft', 'Auto', 'heute', 'Mann', 'ein', 'neues', 'für', 'mich', 'Der'],
      word_count: 10
    },
    {
      correct_sentence: 'Sie liest das interessante Buch gern am Abend',
      scrambled_words: ['liest', 'interessante', 'Buch', 'gern', 'das', 'am', 'Abend', 'Sie'],
      word_count: 10
    },
    {
      correct_sentence: 'Wir fahren morgen mit dem Auto zu dem Park',
      scrambled_words: ['fahren', 'morgen', 'Auto', 'mit', 'dem', 'zu', 'dem', 'Park', 'Wir'],
      word_count: 10
    },
    {
      correct_sentence: 'Das Kind spielt gerne draußen im Garten allein',
      scrambled_words: ['spielt', 'gerne', 'draußen', 'im', 'Garten', 'allein', 'Das', 'Kind'],
      word_count: 10
    },
    {
      correct_sentence: 'Er kocht das leckere Essen für seine Familie heute',
      scrambled_words: ['kocht', 'leckere', 'Essen', 'für', 'seine', 'Familie', 'heute', 'Er', 'das'],
      word_count: 10
    },
    {
      correct_sentence: 'Die Frau geht jeden Morgen in den Supermarkt einkaufen',
      scrambled_words: ['geht', 'Morgen', 'in', 'den', 'Supermarkt', 'einkaufen', 'Die', 'Frau', 'jeden'],
      word_count: 10
    },
    {
      correct_sentence: 'Ich trinke gern Kaffee am Morgen mit meiner Freundin',
      scrambled_words: ['trinke', 'gern', 'Kaffee', 'am', 'Morgen', 'mit', 'meiner', 'Freundin', 'Ich'],
      word_count: 10
    },
    {
      correct_sentence: 'Wir machen einen Ausflug ins Gebirge am Wochenende zusammen',
      scrambled_words: ['machen', 'einen', 'Ausflug', 'ins', 'Gebirge', 'am', 'Wochenende', 'zusammen', 'Wir'],
      word_count: 10
    },
    {
      correct_sentence: 'Das neue Buch liegt auf dem großen Tisch im Wohnzimmer',
      scrambled_words: ['neue', 'Buch', 'liegt', 'auf', 'dem', 'großen', 'Tisch', 'im', 'Wohnzimmer', 'Das'],
      word_count: 10
    }
  ];

  gameState.questions = placeholderQuestions;
  gameState.level = 1;
  gameState.isDemo = isDemo;
  
  if (elements.setInfo) {
    elements.setInfo.textContent = isDemo ? 'Demo Set - Level 1' : 'Level 1 - Set 1';
  }
}

/**
 * Setup buttons
 */
function setupButtons() {
  if (elements.resetBtn) {
    elements.resetBtn.addEventListener('click', resetCurrentQuestion);
  }
  
  if (elements.goBtn) {
    elements.goBtn.addEventListener('click', checkAnswer);
  }
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
  
  // Reset state
  gameState.currentSelectedWords = [];
  gameState.currentScrambledWords = [...question.scrambled_words];
  
  // Render scrambled words
  renderScrambledWords();
  renderSelectedWords();
  updateWordCount();
  
  // Reset buttons
  enableButtons();

  // Update progress
  updateProgress();

  // Start timer
  gameState.timer = new GameTimer(
    gameState.maxTime,
    (currentTime, timeUsed) => {
      updateTimerDisplay(elements.timerDisplay, currentTime);
    },
    (timeUsed) => {
      // Timeout - check answer as is
      checkAnswer(true);
    }
  );

  gameState.timer.start();
}

/**
 * Render scrambled words
 */
function renderScrambledWords() {
  if (!elements.scrambledWords) return;
  
  elements.scrambledWords.innerHTML = '';
  
  gameState.currentScrambledWords.forEach((word, index) => {
    const wordBtn = document.createElement('button');
    wordBtn.className = 'word-btn';
    wordBtn.textContent = word;
    wordBtn.dataset.word = word;
    wordBtn.dataset.index = index;
    wordBtn.addEventListener('click', () => selectWord(word, index));
    elements.scrambledWords.appendChild(wordBtn);
  });
}

/**
 * Select word (move from scrambled to selected)
 */
function selectWord(word, index) {
  if (gameState.timer && !gameState.timer.getIsRunning()) return;
  
  // Remove from scrambled
  gameState.currentScrambledWords.splice(index, 1);
  
  // Add to selected
  gameState.currentSelectedWords.push(word);
  
  // Re-render
  renderScrambledWords();
  renderSelectedWords();
  updateWordCount();
}

/**
 * Render selected words
 */
function renderSelectedWords() {
  if (!elements.sentenceSlot) return;
  
  if (gameState.currentSelectedWords.length === 0) {
    elements.sentenceSlot.innerHTML = `
      <span class="sentence-placeholder" data-i18n="clickWordsToBuild">Kelimelere tıklayarak cümleyi oluştur</span>
    `;
    return;
  }
  
  elements.sentenceSlot.innerHTML = '';
  
  gameState.currentSelectedWords.forEach((word, index) => {
    const wordSpan = document.createElement('span');
    wordSpan.className = 'selected-word';
    wordSpan.textContent = word;
    wordSpan.dataset.index = index;
    wordSpan.addEventListener('click', () => deselectWord(index));
    elements.sentenceSlot.appendChild(wordSpan);
  });
}

/**
 * Deselect word (move from selected to scrambled)
 */
function deselectWord(index) {
  if (gameState.timer && !gameState.timer.getIsRunning()) return;
  
  const word = gameState.currentSelectedWords[index];
  
  // Remove from selected
  gameState.currentSelectedWords.splice(index, 1);
  
  // Add back to scrambled
  gameState.currentScrambledWords.push(word);
  
  // Re-render
  renderScrambledWords();
  renderSelectedWords();
  updateWordCount();
}

/**
 * Reset current question
 */
function resetCurrentQuestion() {
  const question = gameState.questions[gameState.currentQuestionIndex];
  gameState.currentSelectedWords = [];
  gameState.currentScrambledWords = [...question.scrambled_words];
  
  renderScrambledWords();
  renderSelectedWords();
  updateWordCount();
}

/**
 * Update word count
 */
function updateWordCount() {
  if (elements.wordCount) {
    const count = gameState.currentSelectedWords.length;
    const total = gameState.questions[gameState.currentQuestionIndex].word_count;
    elements.wordCount.textContent = `${count}/${total}`;
  }
}

/**
 * Check answer
 */
async function checkAnswer(isTimeout = false) {
  if (!gameState.timer) return;
  
  gameState.timer.stop();
  const timeUsed = gameState.timer.getTimeUsed();

  const question = gameState.questions[gameState.currentQuestionIndex];
  const correctSentence = question.correct_sentence;
  const userSentence = gameState.currentSelectedWords.join(' ');
  const isCorrect = userSentence.toLowerCase() === correctSentence.toLowerCase();

  // Update combo
  if (isCorrect) {
    gameState.combo.addCorrect();
  } else {
    gameState.combo.addWrong();
  }

  // Store answer
  gameState.answers.push({
    question: question,
    userSentence: userSentence,
    correctSentence: correctSentence,
    isCorrect: isCorrect,
    timeUsed: timeUsed,
    isTimeout: isTimeout
  });

  // Show feedback
  showFeedback(isCorrect, userSentence, correctSentence);

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

  // Disable buttons
  disableButtons();

  // Move to next question after delay
  setTimeout(() => {
    gameState.currentQuestionIndex++;
    if (gameState.currentQuestionIndex < gameState.questions.length) {
      startQuestion();
    } else {
      endGame();
    }
  }, isCorrect ? 2000 : 3000);
}

/**
 * Show feedback
 */
function showFeedback(isCorrect, userSentence, correctSentence) {
  disableButtons();

  if (isCorrect) {
    if (elements.sentenceBuilder) {
      elements.sentenceBuilder.classList.add('sentence-builder--correct');
    }
  } else {
    if (elements.sentenceBuilder) {
      elements.sentenceBuilder.classList.add('sentence-builder--wrong');
    }
    
    // Show correct answer
    if (elements.sentenceSlot) {
      const correctEl = document.createElement('div');
      correctEl.className = 'correct-answer';
      correctEl.innerHTML = `
        <strong>${t('correctAnswer')}:</strong> ${correctSentence}
      `;
      elements.sentenceSlot.parentNode.insertBefore(correctEl, elements.sentenceSlot.nextSibling);
    }
  }
}

/**
 * Enable buttons
 */
function enableButtons() {
  if (elements.resetBtn) elements.resetBtn.disabled = false;
  if (elements.goBtn) elements.goBtn.disabled = false;
  
  if (elements.sentenceBuilder) {
    elements.sentenceBuilder.classList.remove('sentence-builder--correct', 'sentence-builder--wrong');
  }
  
  // Remove correct answer display if exists
  const correctAnswer = elements.sentenceBuilder?.querySelector('.correct-answer');
  if (correctAnswer) {
    correctAnswer.remove();
  }
}

/**
 * Disable buttons
 */
function disableButtons() {
  if (elements.resetBtn) elements.resetBtn.disabled = true;
  if (elements.goBtn) elements.goBtn.disabled = true;
  
  // Disable word buttons
  const wordButtons = elements.scrambledWords?.querySelectorAll('.word-btn');
  if (wordButtons) {
    wordButtons.forEach(btn => btn.disabled = true);
  }
  
  // Disable selected words
  const selectedWords = elements.sentenceSlot?.querySelectorAll('.selected-word');
  if (selectedWords) {
    selectedWords.forEach(span => {
      span.style.pointerEvents = 'none';
    });
  }
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
  if (elements.sentenceBuilder) elements.sentenceBuilder.style.display = 'none';
  if (elements.scrambledWords) elements.scrambledWords.style.display = 'none';
  if (elements.actionButtons) elements.actionButtons.style.display = 'none';
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

          <div style="margin: var(--space-xl) 0;">
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-md);">
              <div>
                <strong>✅ ${t('correctAnswers')}:</strong> ${scoreData.correctAnswers}
              </div>
              <div>
                <strong>❌ ${t('wrongAnswers')}:</strong> ${scoreData.wrongAnswers}
              </div>
              <div>
                <strong>⏱ ${t('avgTime')}:</strong> ${scoreData.avgResponseTime.toFixed(1)}s
              </div>
              <div>
                <strong>🔥 ${t('maxCombo')}:</strong> ${scoreData.maxCombo}
              </div>
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
        <div class="card-footer">
          <a href="../index.html" class="btn btn-primary">${t('backToHome')}</a>
          <a href="../leaderboard.html" class="btn btn-secondary">${t('viewLeaderboard')}</a>
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
