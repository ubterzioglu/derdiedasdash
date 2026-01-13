/* ============================================
   DER DIE DAS SPACE - GAME CARD COMPONENT
   Oyun kartı component'i (index.html için)
   ============================================ */

import { t } from '../core/i18n.js';

/**
 * Create game card element
 * @param {Object} gameData - Game data from database
 * @returns {HTMLElement} Game card element
 */
export function createGameCard(gameData) {
  const card = document.createElement('div');
  card.className = 'game-card';
  card.dataset.game = gameData.game_code;

  const difficultyClass = getDifficultyClass(gameData.difficulty_level || 1);
  const difficultyLabel = getDifficultyLabel(gameData.difficulty_level || 1);

  card.innerHTML = `
    <div class="game-card-icon">${getGameIcon(gameData.game_code)}</div>
    <h3 class="game-card-title">${gameData.game_name_en}</h3>
    <p class="game-card-description">${gameData.game_description_en || ''}</p>
    <span class="difficulty-badge difficulty-badge--${difficultyClass}">${difficultyLabel}</span>
    <a href="games/${gameData.game_code.replace('_', '-')}.html" class="btn btn-primary">
      ${t('play')} >
    </a>
    <div class="game-card-meta">
      <span>⏱ ${gameData.timer_seconds || 5}s</span>
      <span>❓ 10</span>
    </div>
  `;

  return card;
}

/**
 * Get game icon by game code
 */
function getGameIcon(gameCode) {
  const icons = {
    'der_die_dash': '🚀',
    'case_control': '✏️',
    'word_salad': '🥗',
    'translation_quest': '🌍',
    'five_letter_blitz': '⚡'
  };
  return icons[gameCode] || '🎮';
}

/**
 * Get difficulty CSS class
 */
function getDifficultyClass(level) {
  const classes = {
    1: 'easy',
    2: 'medium-easy',
    3: 'medium',
    4: 'hard',
    5: 'very-hard'
  };
  return classes[level] || 'easy';
}

/**
 * Get difficulty label
 */
function getDifficultyLabel(level) {
  const labels = {
    1: 'EASY',
    2: 'MEDIUM-EASY',
    3: 'MEDIUM',
    4: 'HARD',
    5: 'VERY HARD'
  };
  return labels[level] || 'EASY';
}

/**
 * Render game cards in container
 * @param {HTMLElement} container - Container element
 * @param {Array} games - Array of game data
 */
export function renderGameCards(container, games) {
  if (!container) return;
  
  container.innerHTML = '';
  
  games.forEach(game => {
    const card = createGameCard(game);
    container.appendChild(card);
  });
}
