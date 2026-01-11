/* ============================================
   DER DIE DAS SPACE - 5-LETTER BLITZ GAME
   5 harfli kelime sıralama oyunu logic
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
  gameKey: 'five_letter_blitz',
  level: 1,
  set_id: null,
  maxTime: 10, // 10 seconds for 5-Letter Blitz
  currentSelectedLetters: [],
  currentScrambledLetters: []
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
    letterBuilder: document.getElementById('letterBuilder'),
    letterSlot: document.getElementById('letterSlot'),
    letterCount: document.getElementById('letterCount'),
    scrambledLetters: document.getElementById('scrambledLetters'),
    articleBadge: document.getElementById('articleBadge'),
    resetBtn: document.getElementById('resetBtn'),
    okBtn: document.getElementById('okBtn'),
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
      .eq('game_types.game_code', 'five_letter_blitz')
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
 * IMPORTANT: All words MUST be exactly 5 letters!
 */
function loadPlaceholderSet(isDemo) {
  const placeholderQuestions = [
    { word: 'TISCH', scrambled: ['C', 'I', 'S', 'H', 'T'], article: 'der' },
    { word: 'STUHL', scrambled: ['L', 'H', 'U', 'T', 'S'], article: 'der' },
    { word: 'BUCH', scrambled: ['H', 'U', 'C', 'B'], article: 'das' }, // 4 letters - needs fixing
    { word: 'TASCH', scrambled: ['S', 'T', 'A', 'C', 'H'], article: 'die' },
    { word: 'WOCHE', scrambled: ['E', 'O', 'C', 'H', 'W'], article: 'die' },
    { word: 'BRUCH', scrambled: ['R', 'U', 'C', 'H', 'B'], article: 'der' },
    { word: 'FLUSS', scrambled: ['L', 'U', 'S', 'S', 'F'], article: 'der' },
    { word: 'BLATT', scrambled: ['L', 'A', 'T', 'T', 'B'], article: 'das' },
    { word: 'GABEL', scrambled: ['A', 'E', 'L', 'B', 'G'], article: 'die' },
    { word: 'TISCH', scrambled: ['C', 'I', 'S', 'H', 'T'], article: 'der' } // duplicate, but OK for demo
  ];

  // Filter to only 5-letter words
  const fiveLetterQuestions = placeholderQuestions.filter(q => q.word.length === 5);
  
  gameState.questions = fiveLetterQuestions;
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
  
  if (elements.okBtn) {
    elements.okBtn.addEventListener('click', checkAnswer);
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
  
  // Update article badge
  if (elements.articleBadge) {
    elements.articleBadge.textContent = question.article;
  }
  
  // Reset state
  gameState.currentSelectedLetters = [];
  gameState.currentScrambledLetters = [...question.scrambled];
  
  // Render scrambled letters
  renderScrambledLetters();
  renderSelectedLetters();
  updateLetterCount();
  
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
      checkAnswer(true);
    }
  );

  gameState.timer.start();
}

/**
 * Render scrambled letters
 */
function renderScrambledLetters() {
  if (!elements.scrambledLetters) return;
  
  elements.scrambledLetters.innerHTML = '';
  
  gameState.currentScrambledLetters.forEach((letter, index) => {
    const letterBtn = document.createElement('button');
    letterBtn.className = 'letter-btn';
    letterBtn.textContent = letter;
    letterBtn.dataset.letter = letter;
    letterBtn.dataset.index = index;
    letterBtn.addEventListener('click', () => selectLetter(letter, index));
    elements.scrambledLetters.appendChild(letterBtn);
  });
}

/**
 * Select letter (move from scrambled to selected)
 */
function selectLetter(letter, index) {
  if (gameState.timer && !gameState.timer.getIsRunning()) return;
  if (gameState.currentSelectedLetters.length >= 5) return; // Max 5 letters
  
  // Remove from scrambled
  gameState.currentScrambledLetters.splice(index, 1);
  
  // Add to selected
  gameState.currentSelectedLetters.push(letter);
  
  // Re-render
  renderScrambledLetters();
  renderSelectedLetters();
  updateLetterCount();
}

/**
 * Render selected letters
 */
function renderSelectedLetters() {
  if (!elements.letterSlot) return;
  
  if (gameState.currentSelectedLetters.length === 0) {
    elements.letterSlot.innerHTML = `
      <span class="letter-placeholder" data-i18n="clickLettersToBuild">Harflere tıklayarak kelimeyi oluştur</span>
    `;
    return;
  }
  
  elements.letterSlot.innerHTML = '';
  
  gameState.currentSelectedLetters.forEach((letter, index) => {
    const letterSpan = document.createElement('span');
    letterSpan.className = 'selected-letter';
    letterSpan.textContent = letter;
    letterSpan.dataset.index = index;
    letterSpan.addEventListener('click', () => deselectLetter(index));
    elements.letterSlot.appendChild(letterSpan);
  });
}

/**
 * Deselect letter (move from selected to scrambled)
 */
function deselectLetter(index) {
  if (gameState.timer && !gameState.timer.getIsRunning()) return;
  
  const letter = gameState.currentSelectedLetters[index];
  
  // Remove from selected
  gameState.currentSelectedLetters.splice(index, 1);
  
  // Add back to scrambled
  gameState.currentScrambledLetters.push(letter);
  
  // Re-render
  renderScrambledLetters();
  renderSelectedLetters();
  updateLetterCount();
}

/**
 * Reset current question
 */
function resetCurrentQuestion() {
  const question = gameState.questions[gameState.currentQuestionIndex];
  gameState.currentSelectedLetters = [];
  gameState.currentScrambledLetters = [...question.scrambled];
  
  renderScrambledLetters();
  renderSelectedLetters();
  updateLetterCount();
}

/**
 * Update letter count
 */
function updateLetterCount() {
  if (elements.letterCount) {
    const count = gameState.currentSelectedLetters.length;
    elements.letterCount.textContent = `${count}/5`;
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
  const correctWord = question.word;
  const userWord = gameState.currentSelectedLetters.join('');
  const isCorrect = userWord.toUpperCase() === correctWord.toUpperCase();

  // Update combo
  if (isCorrect) {
    gameState.combo.addCorrect();
  } else {
    gameState.combo.addWrong();
  }

  // Store answer
  gameState.answers.push({
    question: question,
    userWord: userWord,
    correctWord: correctWord,
    isCorrect: isCorrect,
    timeUsed: timeUsed,
    isTimeout: isTimeout
  });

  // Show feedback
  showFeedback(isCorrect, userWord, correctWord);

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
function showFeedback(isCorrect, userWord, correctWord) {
  disableButtons();

  if (isCorrect) {
    if (elements.letterBuilder) {
      elements.letterBuilder.classList.add('letter-builder--correct');
    }
  } else {
    if (elements.letterBuilder) {
      elements.letterBuilder.classList.add('letter-builder--wrong');
    }
    
    // Show correct answer
    if (elements.letterSlot) {
      const correctEl = document.createElement('div');
      correctEl.className = 'correct-answer';
      correctEl.innerHTML = `
        <strong>${t('correctAnswer')}:</strong> ${correctWord}
      `;
      elements.letterSlot.parentNode.insertBefore(correctEl, elements.letterSlot.nextSibling);
    }
  }
}

/**
 * Enable buttons
 */
function enableButtons() {
  if (elements.resetBtn) elements.resetBtn.disabled = false;
  if (elements.okBtn) elements.okBtn.disabled = false;
  
  if (elements.letterBuilder) {
    elements.letterBuilder.classList.remove('letter-builder--correct', 'letter-builder--wrong');
  }
  
  // Remove correct answer display if exists
  const correctAnswer = elements.letterBuilder?.querySelector('.correct-answer');
  if (correctAnswer) {
    correctAnswer.remove();
  }
}

/**
 * Disable buttons
 */
function disableButtons() {
  if (elements.resetBtn) elements.resetBtn.disabled = true;
  if (elements.okBtn) elements.okBtn.disabled = true;
  
  // Disable letter buttons
  const letterButtons = elements.scrambledLetters?.querySelectorAll('.letter-btn');
  if (letterButtons) {
    letterButtons.forEach(btn => btn.disabled = true);
  }
  
  // Disable selected letters
  const selectedLetters = elements.letterSlot?.querySelectorAll('.selected-letter');
  if (selectedLetters) {
    selectedLetters.forEach(span => {
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
  if (elements.letterBuilder) elements.letterBuilder.style.display = 'none';
  if (elements.scrambledLetters) elements.scrambledLetters.style.display = 'none';
  if (elements.resetBtn) elements.resetBtn.parentElement.style.display = 'none';
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

    const normalized = normalizedScore(
      scoreData.setScore,
      gameState.gameKey,
      gameState.level
    );

    console.log('Score would be saved:', {
      userId: user.id,
      set_id: gameState.set_id,
      scoreData,
      normalized
    });
  } catch (error) {
    console.error('Error saving score:', error);
  }
}
