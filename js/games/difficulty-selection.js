/* ============================================
   DER DIE DAS SPACE - DIFFICULTY SELECTION
   Zorluk seviyesi seçimi
   ============================================ */

import { getSupabase } from '../core/supabase.js';
import { getGame } from '../registry.js';
import { t } from '../core/i18n.js';

// Get game code from page name
function getGameCodeFromPage() {
  const path = window.location.pathname;
  const filename = path.split('/').pop();
  
  // Extract game code from filename (e.g., der-die-dash-difficulty.html -> der_die_dash)
  const gameMap = {
    'der-die-dash-difficulty.html': 'der_die_dash',
    'case-control-difficulty.html': 'case_control',
    'word-salad-difficulty.html': 'word_salad',
    'translation-quest-difficulty.html': 'translation_quest',
    'five-letter-blitz-difficulty.html': 'five_letter_blitz'
  };
  
  return gameMap[filename] || null;
}

// State
let currentGame = null;

// UI Elements
const elements = {
  loadingState: document.getElementById('loadingState'),
  difficultySection: document.getElementById('difficultySection'),
  difficultyGrid: document.getElementById('difficultyGrid')
};

// Difficulty levels
const DIFFICULTY_LEVELS = [
  { level: 1, label: 'Kolay', labelEn: 'Easy', emoji: '🟢', color: '#88CC00' },
  { level: 2, label: 'Orta-Kolay', labelEn: 'Medium-Easy', emoji: '🟡', color: '#FFCC00' },
  { level: 3, label: 'Orta', labelEn: 'Medium', emoji: '🟠', color: '#FF9933' },
  { level: 4, label: 'Zor', labelEn: 'Hard', emoji: '🔴', color: '#FF5C6E' },
  { level: 5, label: 'Çok Zor', labelEn: 'Very Hard', emoji: '⚫', color: '#333333' }
];

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await init();
});

async function init() {
  // Get game code from page name
  const gameCode = getGameCodeFromPage();

  if (!gameCode) {
    window.location.href = '../index.html';
    return;
  }

  // Get game info
  currentGame = getGame(gameCode);
  if (!currentGame) {
    console.error('Game not found:', gameCode);
    window.location.href = '../index.html';
    return;
  }

  // Show difficulty selection
  renderDifficultyLevels();
  elements.loadingState.style.display = 'none';
  elements.difficultySection.style.display = 'block';
}

/**
 * Render difficulty level cards
 */
function renderDifficultyLevels() {
  elements.difficultyGrid.innerHTML = '';

  DIFFICULTY_LEVELS.forEach(diff => {
    const card = document.createElement('div');
    card.className = 'difficulty-card';
    card.style.cursor = 'pointer';
    card.style.transition = 'all 0.3s ease';

    const currentLang = localStorage.getItem('language') || 'tr';
    const label = currentLang === 'tr' ? diff.label : diff.labelEn;

    card.innerHTML = `
      <div class="difficulty-card-icon" style="font-size: 3rem; margin-bottom: var(--space-sm);">
        ${diff.emoji}
      </div>
      <h3 class="difficulty-card-title" style="font-size: var(--text-lg); font-weight: 600; margin-bottom: var(--space-xs);">
        Level ${diff.level}
      </h3>
      <p class="difficulty-card-label" style="font-size: var(--text-sm); color: var(--text-secondary);">
        ${label}
      </p>
    `;

    // Add hover effect
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-4px)';
      card.style.boxShadow = 'var(--shadow-lg)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
      card.style.boxShadow = 'var(--shadow-md)';
    });

    // Click handler - navigate to sets page
    card.addEventListener('click', () => {
      const gameSlug = currentGame.route.replace('games/', '').replace('.html', '');
      window.location.href = `${gameSlug}-sets.html?level=${diff.level}`;
    });

    elements.difficultyGrid.appendChild(card);
  });
}
