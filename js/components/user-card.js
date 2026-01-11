/* ============================================
   DER DIE DAS SPACE - USER CARD COMPONENT
   Leaderboard için kullanıcı kartı
   ============================================ */

import { t } from '../core/i18n.js';

/**
 * Create user card for leaderboard
 * @param {Object} userData - User data with score
 * @param {number} rank - User's rank
 * @param {boolean} isCurrentUser - Whether this is the current user
 * @returns {HTMLElement} User card element
 */
export function createUserCard(userData, rank, isCurrentUser = false) {
  const row = document.createElement('div');
  row.className = 'leaderboard-row';
  if (isCurrentUser) {
    row.classList.add('leaderboard-row--current-user');
  }

  // Badge icons (top 3)
  const rankBadge = rank <= 3 ? getRankBadge(rank) : '';
  const rankDisplay = rankBadge || `#${rank}`;

  row.innerHTML = `
    <div class="leaderboard-rank">${rankDisplay}</div>
    <div class="leaderboard-user">
      <div class="user-avatar">${userData.display_name ? userData.display_name.charAt(0).toUpperCase() : '👤'}</div>
      <div class="user-info">
        <div class="user-name">${userData.display_name || userData.email || 'Anonymous'}</div>
        ${userData.badges && userData.badges.length > 0 ? `
          <div class="user-badges">
            ${userData.badges.slice(0, 3).map(badge => `
              <span class="user-badge-icon" title="${badge.badge_name_en}">${badge.icon_url || '🎖️'}</span>
            `).join('')}
          </div>
        ` : ''}
      </div>
    </div>
    <div class="leaderboard-score">
      <span class="score-value">${userData.normalized_score || userData.set_score || 0}</span>
      ${userData.game ? `<span class="score-game">${userData.game}</span>` : ''}
    </div>
    <div class="leaderboard-level">
      <span class="difficulty-badge difficulty-badge--${getDifficultyClass(userData.level || 1)}">
        L${userData.level || 1}
      </span>
    </div>
    <div class="leaderboard-date">
      ${formatDate(userData.completed_at)}
    </div>
  `;

  return row;
}

/**
 * Get rank badge emoji
 */
function getRankBadge(rank) {
  const badges = {
    1: '🥇',
    2: '🥈',
    3: '🥉'
  };
  return badges[rank] || '';
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
 * Format date for display
 */
function formatDate(dateString) {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return t('justNow') || 'Just now';
  if (diffMins < 60) return `${diffMins}m ${t('ago') || 'ago'}`;
  if (diffHours < 24) return `${diffHours}h ${t('ago') || 'ago'}`;
  if (diffDays < 7) return `${diffDays}d ${t('ago') || 'ago'}`;
  
  return date.toLocaleDateString();
}

/**
 * Render leaderboard rows in container
 * @param {HTMLElement} container - Container element
 * @param {Array} users - Array of user data
 * @param {string} currentUserId - Current user's ID
 */
export function renderLeaderboard(container, users, currentUserId = null) {
  if (!container) return;
  
  container.innerHTML = '';

  // Create header
  const header = document.createElement('div');
  header.className = 'leaderboard-header';
  header.innerHTML = `
    <div class="leaderboard-rank">${t('rank')}</div>
    <div class="leaderboard-user">${t('player')}</div>
    <div class="leaderboard-score">${t('score')}</div>
    <div class="leaderboard-level">${t('level')}</div>
    <div class="leaderboard-date">${t('date') || 'Date'}</div>
  `;
  container.appendChild(header);

  // Render rows
  users.forEach((user, index) => {
    const rank = index + 1;
    const isCurrentUser = currentUserId && user.user_id === currentUserId;
    const row = createUserCard(user, rank, isCurrentUser);
    container.appendChild(row);
  });
}
