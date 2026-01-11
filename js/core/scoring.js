/* ============================================
   DER DIE DAS SPACE - UNIFIED SCORING SYSTEM
   Puanlama motoru (tüm oyunlar için)
   ============================================ */

// Base scores per game
const BASE_SCORES = {
  der_die_dash: 20,
  case_control: 25,
  word_salad: 30,
  translation_quest: 22,
  five_letter_blitz: 25
};

// Difficulty multipliers
const DIFFICULTY_MULTIPLIERS = {
  1: 1.0,
  2: 1.1,
  3: 1.25,
  4: 1.45,
  5: 1.7
};

// Wrong answer penalties
const PENALTIES = {
  der_die_dash: -5,
  case_control: -7,
  word_salad: -10,
  translation_quest: -5,
  five_letter_blitz: -7
};

/**
 * Calculate speed bonus based on time used
 * @param {number} timeUsed - Time used in seconds
 * @param {number} maxTime - Maximum time allowed in seconds
 * @returns {number} Speed bonus points
 */
export function calculateSpeedBonus(timeUsed, maxTime) {
  const ratio = timeUsed / maxTime;
  
  if (ratio <= 0.30) return 10;
  if (ratio <= 0.50) return 6;
  if (ratio <= 0.70) return 3;
  if (ratio <= 0.90) return 1;
  return 0;
}

/**
 * Calculate combo bonus based on streak
 * @param {number} streak - Current combo streak
 * @returns {number} Combo bonus points
 */
export function calculateComboBonus(streak) {
  if (streak < 3) return 0;
  if (streak < 5) return 5;
  if (streak === 5) return 8;
  return 0; // Reset after 5
}

/**
 * Calculate question score
 * @param {Object} params - Question parameters
 * @param {string} params.gameKey - Game identifier
 * @param {number} params.level - Difficulty level (1-5)
 * @param {boolean} params.isCorrect - Was answer correct?
 * @param {number} params.timeUsed - Time used in seconds
 * @param {number} params.maxTime - Maximum time allowed
 * @param {number} params.comboStreak - Current combo streak
 * @returns {number} Question score
 */
export function calculateQuestionScore(params) {
  const {
    gameKey,
    level,
    isCorrect,
    timeUsed,
    maxTime,
    comboStreak
  } = params;

  // Wrong answer - apply penalty
  if (!isCorrect) {
    const penalty = PENALTIES[gameKey] || 0;
    return Math.max(0, penalty); // Never go below 0
  }

  // Correct answer - calculate score
  const baseScore = BASE_SCORES[gameKey] || 20;
  const multiplier = DIFFICULTY_MULTIPLIERS[level] || 1.0;
  const adjustedBase = baseScore * multiplier;
  
  const speedBonus = calculateSpeedBonus(timeUsed, maxTime);
  const comboBonus = calculateComboBonus(comboStreak);

  return adjustedBase + speedBonus + comboBonus;
}

/**
 * Calculate maximum possible set score
 * @param {string} gameKey - Game identifier
 * @param {number} level - Difficulty level
 * @returns {number} Maximum possible score
 */
export function maxPossibleSetScore(gameKey, level) {
  const base = BASE_SCORES[gameKey] || 20;
  const mult = DIFFICULTY_MULTIPLIERS[level] || 1.0;
  const perfectSpeed = 100; // 10 questions × +10 bonus
  const perfectCombo = 36;  // Max combo bonus (5 streak at question 5)
  
  return (10 * base * mult) + perfectSpeed + perfectCombo;
}

/**
 * Calculate normalized score (0-1000) for global leaderboard
 * @param {number} setScore - Actual set score
 * @param {string} gameKey - Game identifier
 * @param {number} level - Difficulty level
 * @returns {number} Normalized score (0-1000)
 */
export function normalizedScore(setScore, gameKey, level) {
  const max = maxPossibleSetScore(gameKey, level);
  return Math.round((setScore / max) * 1000);
}

/**
 * Calculate set score from array of questions
 * @param {Array} questions - Array of question results
 * @returns {Object} Set score breakdown
 */
export function calculateSetScore(questions) {
  let totalScore = 0;
  let correctCount = 0;
  let wrongCount = 0;
  let maxCombo = 0;
  let currentStreak = 0;
  let totalTime = 0;
  let speedBonusTotal = 0;
  let comboBonusTotal = 0;
  let penaltyTotal = 0;
  let baseTotal = 0;

  questions.forEach(q => {
    if (q.isCorrect) {
      currentStreak++;
      correctCount++;
      maxCombo = Math.max(maxCombo, currentStreak);
      totalTime += q.timeUsed || 0;
      
      // Reset combo after 5
      if (currentStreak === 5) {
        currentStreak = 0;
      }
    } else {
      currentStreak = 0;
      wrongCount++;
    }

    const score = calculateQuestionScore({
      gameKey: q.gameKey,
      level: q.level,
      isCorrect: q.isCorrect,
      timeUsed: q.timeUsed || 0,
      maxTime: q.maxTime || 5,
      comboStreak: q.isCorrect ? currentStreak : 0
    });

    // Track breakdown
    if (q.isCorrect) {
      const base = BASE_SCORES[q.gameKey] || 20;
      const mult = DIFFICULTY_MULTIPLIERS[q.level] || 1.0;
      baseTotal += base * mult;
      
      const speedBonus = calculateSpeedBonus(q.timeUsed || 0, q.maxTime || 5);
      speedBonusTotal += speedBonus;
      
      const comboBonus = calculateComboBonus(q.isCorrect ? currentStreak : 0);
      comboBonusTotal += comboBonus;
    } else {
      penaltyTotal += Math.abs(score);
    }

    totalScore += Math.max(0, score); // Never go below 0
  });

  // Perfect set bonus
  if (correctCount === 10) {
    totalScore += 50;
  }

  return {
    setScore: totalScore,
    correctAnswers: correctCount,
    wrongAnswers: wrongCount,
    maxCombo: maxCombo,
    avgResponseTime: correctCount > 0 ? totalTime / correctCount : 0,
    accuracyPercentage: (correctCount / 10) * 100,
    baseTotal: baseTotal,
    speedBonusTotal: speedBonusTotal,
    comboBonusTotal: comboBonusTotal,
    penaltyTotal: penaltyTotal
  };
}

/**
 * Get base score for a game
 * @param {string} gameKey - Game identifier
 * @returns {number} Base score
 */
export function getBaseScore(gameKey) {
  return BASE_SCORES[gameKey] || 20;
}

/**
 * Get penalty for a game
 * @param {string} gameKey - Game identifier
 * @returns {number} Penalty points
 */
export function getPenalty(gameKey) {
  return PENALTIES[gameKey] || -5;
}

/**
 * Get difficulty multiplier
 * @param {number} level - Difficulty level (1-5)
 * @returns {number} Multiplier
 */
export function getDifficultyMultiplier(level) {
  return DIFFICULTY_MULTIPLIERS[level] || 1.0;
}
