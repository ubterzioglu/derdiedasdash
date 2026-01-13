/* ============================================
   DER DIE DAS SPACE - SET SELECTION
   Zorluk seviyesi ve set seçimi
   ============================================ */

import { getSupabase } from '../core/supabase.js';
import { getGame, GAME_REGISTRY } from '../registry.js';
import { t } from '../core/i18n.js';
import { isAuthenticated } from '../core/auth.js';

// State
let currentGame = null;
let selectedDifficulty = null;
let availableSets = [];

// UI Elements
const elements = {
  loadingState: document.getElementById('loadingState'),
  difficultySection: document.getElementById('difficultySection'),
  difficultyGrid: document.getElementById('difficultyGrid'),
  setSection: document.getElementById('setSection'),
  setGrid: document.getElementById('setGrid'),
  gameTitle: document.getElementById('gameTitle'),
  gameDescription: document.getElementById('gameDescription'),
  selectedDifficultyTitle: document.getElementById('selectedDifficultyTitle'),
  backToDifficultyBtn: document.getElementById('backToDifficultyBtn'),
  difficultyHeaderCard: document.getElementById('difficultyHeaderCard')
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
  // Get game code from URL
  const urlParams = new URLSearchParams(window.location.search);
  const gameCode = urlParams.get('game');

  if (!gameCode) {
    // No game specified, redirect to home
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

  // Update page title and description
  const currentLang = localStorage.getItem('language') || 'tr';
  const nameKey = currentLang === 'tr' ? 'name_tr' : 'name_en';
  const descKey = currentLang === 'tr' ? 'description_tr' : 'description_en';
  elements.gameTitle.textContent = `${currentGame.icon} ${currentGame[nameKey] || currentGame.name_en}`;
  elements.gameDescription.textContent = currentGame[descKey] || currentGame.description_en;

  // Show difficulty selection
  renderDifficultyLevels();
  elements.loadingState.style.display = 'none';
  elements.difficultySection.style.display = 'block';

  // Setup back button
  elements.backToDifficultyBtn.addEventListener('click', () => {
    selectedDifficulty = null;
    elements.setSection.style.display = 'none';
    elements.difficultySection.style.display = 'block';
  });
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
      <h3 class="difficulty-card-title">
        Level ${diff.level} - ${label}
      </h3>
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

    // Click handler
    card.addEventListener('click', () => {
      selectDifficulty(diff.level);
    });

    elements.difficultyGrid.appendChild(card);
  });
}

/**
 * Select difficulty level and load sets
 */
async function selectDifficulty(level) {
  selectedDifficulty = level;
  elements.difficultySection.style.display = 'none';
  elements.loadingState.style.display = 'block';
  elements.setSection.style.display = 'none';

  // Update title
  const currentLang = localStorage.getItem('language') || 'tr';
  const diffInfo = DIFFICULTY_LEVELS.find(d => d.level === level);
  const label = currentLang === 'tr' ? diffInfo.label : diffInfo.labelEn;
  elements.selectedDifficultyTitle.textContent = `Level ${level} - ${label}`;

  // Update difficulty header card color based on level
  if (elements.difficultyHeaderCard) {
    elements.difficultyHeaderCard.setAttribute('data-difficulty-level', level);
  }

  // Load sets for this difficulty
  await loadSets(level);

  // Render sets
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
  // Navigate to game page with setId parameter
  window.location.href = `${currentGame.route}?setId=${setId}`;
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
