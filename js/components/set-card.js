/* ============================================
   DER DIE DAS SPACE - SET CARD COMPONENT
   Set kartı component'i (oyun sayfaları için)
   ============================================ */

import { t } from '../core/i18n.js';

/**
 * Create set card element
 * @param {Object} setData - Set data from database
 * @param {boolean} isCompleted - Whether set is completed
 * @returns {HTMLElement} Set card element
 */
export function createSetCard(setData, isCompleted = false) {
  const card = document.createElement('div');
  card.className = 'set-card';
  if (isCompleted) {
    card.classList.add('set-card--completed');
  }

  const difficultyClass = getDifficultyClass(setData.difficulty_level);
  const difficultyLabel = getDifficultyLabel(setData.difficulty_level);

  card.innerHTML = `
    <div class="set-card-header">
      <span class="difficulty-badge difficulty-badge--${difficultyClass}">${difficultyLabel}</span>
      ${isCompleted ? '<span class="set-completed-badge">✓ ' + t('completed') + '</span>' : ''}
    </div>
    <div class="set-card-body">
      <h3 class="set-card-title">Set ${setData.set_number}</h3>
      <p class="set-card-description">Level ${setData.difficulty_level}</p>
    </div>
    <div class="set-card-footer">
      ${isCompleted ? 
        `<button class="btn btn-secondary" disabled>${t('completed')}</button>` :
        `<a href="#" class="btn btn-primary" data-set-id="${setData.id}">${t('play')}</a>`
      }
    </div>
  `;

  // Add click handler if not completed
  if (!isCompleted) {
    const playBtn = card.querySelector('[data-set-id]');
    if (playBtn) {
      playBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const setId = playBtn.dataset.setId;
        if (setId) {
          startSet(setId);
        }
      });
    }
  }

  return card;
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
 * Start set (navigate to game page with set ID)
 */
function startSet(setId) {
  // Get current game type from URL or context
  const currentPath = window.location.pathname;
  const gameMatch = currentPath.match(/games\/([^\/]+)\.html/);
  
  if (gameMatch) {
    const gameCode = gameMatch[1];
    window.location.href = `games/${gameCode}.html?setId=${setId}`;
  }
}

/**
 * Render set cards in container
 * @param {HTMLElement} container - Container element
 * @param {Array} sets - Array of set data
 * @param {Array} completedSets - Array of completed set IDs
 */
export function renderSetCards(container, sets, completedSets = []) {
  if (!container) return;
  
  container.innerHTML = '';
  
  // Group by difficulty level
  const grouped = {};
  sets.forEach(set => {
    const level = set.difficulty_level;
    if (!grouped[level]) {
      grouped[level] = [];
    }
    grouped[level].push(set);
  });

  // Render by level
  Object.keys(grouped).sort().forEach(level => {
    const levelSection = document.createElement('div');
    levelSection.className = 'set-level-section';
    
    const levelHeader = document.createElement('h3');
    levelHeader.textContent = `${t('level')} ${level}`;
    levelSection.appendChild(levelHeader);

    const levelGrid = document.createElement('div');
    levelGrid.className = 'set-grid';

    grouped[level].forEach(set => {
      const isCompleted = completedSets.includes(set.id);
      const card = createSetCard(set, isCompleted);
      levelGrid.appendChild(card);
    });

    levelSection.appendChild(levelGrid);
    container.appendChild(levelSection);
  });
}
