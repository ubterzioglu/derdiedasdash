/* ============================================
   DER DIE DAS SPACE - SETS SELECTION
   Set seçimi
   ============================================ */

import { getSupabase } from '../core/supabase.js';
import { getGame } from '../registry.js';
import { t } from '../core/i18n.js';
import { isAuthenticated } from '../core/auth.js';

// Get game code from page name
function getGameCodeFromPage() {
  const path = window.location.pathname;
  const filename = path.split('/').pop();
  
  const gameMap = {
    'der-die-dash-sets.html': 'der_die_dash',
    'case-control-sets.html': 'case_control',
    'word-salad-sets.html': 'word_salad',
    'translation-quest-sets.html': 'translation_quest',
    'five-letter-blitz-sets.html': 'five_letter_blitz'
  };
  
  return gameMap[filename] || null;
}

// State
let currentGame = null;
let selectedDifficulty = null;
let availableSets = [];

// UI Elements
const elements = {
  loadingState: document.getElementById('loadingState'),
  setSection: document.getElementById('setSection'),
  setGrid: document.getElementById('setGrid'),
  selectedDifficultyTitle: document.getElementById('selectedDifficultyTitle'),
  backToDifficultyBtn: document.getElementById('backToDifficultyBtn')
};

// Difficulty levels
const DIFFICULTY_LEVELS = [
  { level: 1, label: 'Kolay', labelEn: 'Easy', emoji: '🟢' },
  { level: 2, label: 'Orta-Kolay', labelEn: 'Medium-Easy', emoji: '🟡' },
  { level: 3, label: 'Orta', labelEn: 'Medium', emoji: '🟠' },
  { level: 4, label: 'Zor', labelEn: 'Hard', emoji: '🔴' },
  { level: 5, label: 'Çok Zor', labelEn: 'Very Hard', emoji: '⚫' }
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

  // Get difficulty level from URL
  const urlParams = new URLSearchParams(window.location.search);
  const level = parseInt(urlParams.get('level'));

  if (!level || level < 1 || level > 5) {
    // Redirect to difficulty selection
    const gameSlug = currentGame.route.replace('games/', '').replace('.html', '');
    window.location.href = `${gameSlug}-difficulty.html`;
    return;
  }

  selectedDifficulty = level;

  // Update title
  const currentLang = localStorage.getItem('language') || 'tr';
  const diffInfo = DIFFICULTY_LEVELS.find(d => d.level === level);
  const label = currentLang === 'tr' ? diffInfo.label : diffInfo.labelEn;
  elements.selectedDifficultyTitle.textContent = `Level ${level} - ${label}`;

  // Update back button
  const gameSlug = currentGame.route.replace('games/', '').replace('.html', '');
  elements.backToDifficultyBtn.href = `${gameSlug}-difficulty.html`;

  // Load sets
  await loadSets(level);
  renderSets();
  
  elements.loadingState.style.display = 'none';
  elements.setSection.style.display = 'block';
}

/**
 * Load sets from database
 */
async function loadSets(difficultyLevel) {
  const supabase = getSupabase();
  if (!supabase) {
    console.error('Supabase not initialized');
    availableSets = [];
    return;
  }

  try {
    // Get game_type_id from game_code
    const { data: gameType, error: gameTypeError } = await supabase
      .from('game_types')
      .select('id')
      .eq('game_code', currentGame.code)
      .single();

    if (gameTypeError || !gameType) {
      console.error('Error loading game type:', gameTypeError);
      availableSets = [];
      return;
    }

    // Load sets for this game and difficulty
    const { data: sets, error: setsError } = await supabase
      .from('word_sets')
      .select('*')
      .eq('game_type_id', gameType.id)
      .eq('difficulty_level', difficultyLevel)
      .order('set_number', { ascending: true });

    if (setsError) {
      console.error('Error loading sets:', setsError);
      availableSets = [];
      return;
    }

    // Check which sets are completed (if user is authenticated)
    const user = await isAuthenticated();
    if (user) {
      const { data: completedSets } = await supabase
        .from('user_game_sets')
        .select('set_id')
        .eq('user_id', user.id)
        .in('set_id', sets.map(s => s.id));

      const completedSetIds = (completedSets || []).map(s => s.set_id);
      availableSets = sets.map(set => ({
        ...set,
        isCompleted: completedSetIds.includes(set.id)
      }));
    } else {
      availableSets = sets.map(set => ({
        ...set,
        isCompleted: false
      }));
    }
  } catch (error) {
    console.error('Error loading sets:', error);
    availableSets = [];
  }
}

/**
 * Render set cards
 */
function renderSets() {
  elements.setGrid.innerHTML = '';

  if (availableSets.length === 0) {
    elements.setGrid.innerHTML = `
      <div class="card" style="text-align: center; padding: var(--space-xl); grid-column: 1 / -1;">
        <p style="color: var(--text-secondary);">Bu zorluk seviyesi için henüz set bulunmuyor.</p>
      </div>
    `;
    return;
  }

  availableSets.forEach(set => {
    const card = document.createElement('div');
    card.className = 'set-card';
    card.setAttribute('data-difficulty-level', set.difficulty_level);
    if (set.isCompleted) {
      card.classList.add('set-card--completed');
    }

    const difficultyClass = getDifficultyClass(set.difficulty_level);
    const difficultyLabel = getDifficultyLabel(set.difficulty_level);

    card.innerHTML = `
      <div class="set-card-header">
        <span class="difficulty-badge difficulty-badge--${difficultyClass}">${difficultyLabel}</span>
        ${set.isCompleted ? '<span class="set-completed-badge">✓ ' + t('completed') + '</span>' : ''}
      </div>
      <div class="set-card-body">
        <h3 class="set-card-title">Set ${set.set_number} - Level ${set.difficulty_level}</h3>
      </div>
    `;

    // Make entire card clickable
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      if (!set.isCompleted) {
        startGame(set.id);
      }
    });

    elements.setGrid.appendChild(card);
  });
}

/**
 * Start game with selected set
 */
function startGame(setId) {
  // currentGame.route is 'games/der-die-dash.html', but we're in games/ folder
  // So we need to use relative path: 'der-die-dash.html'
  const gameSlug = currentGame.route.replace('games/', '');
  window.location.href = `${gameSlug}?setId=${setId}`;
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
