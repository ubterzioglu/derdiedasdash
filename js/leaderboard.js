/* ============================================
   DER DIE DAS SPACE - LEADERBOARD
   Global and game-specific leaderboards
   ============================================ */

import { getSupabase } from './core/supabase.js';
import { getCurrentUser } from './core/auth.js';
import { t } from './core/i18n.js';

let leaderboardCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await initLeaderboard();
});

async function initLeaderboard() {
  // Setup tabs
  setupTabs();
  
  // Load global leaderboard
  await loadGlobalLeaderboard();
  
  // Setup game leaderboard filters
  setupGameFilters();
}

/**
 * Setup tab switching
 */
function setupTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const sections = {
    global: document.getElementById('globalLeaderboard'),
    game: document.getElementById('gameLeaderboard')
  };

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      
      // Update active state
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Show/hide sections
      Object.keys(sections).forEach(key => {
        if (sections[key]) {
          sections[key].style.display = key === tab ? 'block' : 'none';
        }
      });
      
      // Load data for selected tab
      if (tab === 'game') {
        loadGameLeaderboard();
      }
    });
  });
}

/**
 * Load global leaderboard
 */
async function loadGlobalLeaderboard(forceRefresh = false) {
  const tbody = document.getElementById('globalLeaderboardBody');
  if (!tbody) return;

  try {
    // Check cache
    if (!forceRefresh && leaderboardCache && cacheTimestamp) {
      const age = Date.now() - cacheTimestamp;
      if (age < CACHE_DURATION) {
        renderGlobalLeaderboard(leaderboardCache, tbody);
        return;
      }
    }

    // Fetch from database
    const supabase = getSupabase();
    if (!supabase) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center">${t('errorNetwork')}</td></tr>`;
      return;
    }

    const { data, error } = await supabase
      .from('v_global_leaderboard')
      .select('*')
      .limit(100);

    if (error) throw error;

    // Update cache
    leaderboardCache = data;
    cacheTimestamp = Date.now();

    // Render
    renderGlobalLeaderboard(data, tbody);

    // Highlight current user
    const user = await getCurrentUser();
    if (user) {
      highlightCurrentUser(user.id);
    }
  } catch (error) {
    console.error('Error loading global leaderboard:', error);
    tbody.innerHTML = `<tr><td colspan="5" class="text-center">${t('errorNetwork')}</td></tr>`;
  }
}

/**
 * Render global leaderboard
 */
function renderGlobalLeaderboard(data, tbody) {
  if (!data || data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center">${t('noData') || 'Henüz skor yok'}</td></tr>`;
    return;
  }

  tbody.innerHTML = data.map((entry, index) => `
    <tr data-user-id="${entry.user_id}">
      <td>#${entry.rank || index + 1}</td>
      <td>${entry.display_name || entry.email || 'Anonymous'}</td>
      <td>${entry.game || 'N/A'}</td>
      <td>Level ${entry.level || 1}</td>
      <td><strong>${entry.normalized_score || entry.set_score || 0}</strong></td>
    </tr>
  `).join('');
}

/**
 * Load game-specific leaderboard
 */
async function loadGameLeaderboard() {
  const tbody = document.getElementById('gameLeaderboardBody');
  if (!tbody) return;

  const gameFilter = document.getElementById('gameFilter');
  const levelFilter = document.getElementById('levelFilter');

  if (!gameFilter || !levelFilter) return;

  const gameType = gameFilter.value;
  const level = levelFilter.value;

  try {
    const supabase = getSupabase();
    if (!supabase) {
      tbody.innerHTML = `<tr><td colspan="4" class="text-center">${t('errorNetwork')}</td></tr>`;
      return;
    }

    // Get game_type_id
    const { data: gameTypeData } = await supabase
      .from('game_types')
      .select('id')
      .eq('game_code', gameType)
      .single();

    if (!gameTypeData) {
      tbody.innerHTML = `<tr><td colspan="4" class="text-center">${t('errorGeneric')}</td></tr>`;
      return;
    }

    let query = supabase
      .from('v_game_leaderboard')
      .select('*')
      .eq('game_type_id', gameTypeData.id)
      .limit(100);

    if (level) {
      query = query.eq('level', parseInt(level));
    }

    const { data, error } = await query;

    if (error) throw error;

    renderGameLeaderboard(data, tbody);

    // Highlight current user
    const user = await getCurrentUser();
    if (user) {
      highlightCurrentUser(user.id, 'game');
    }
  } catch (error) {
    console.error('Error loading game leaderboard:', error);
    tbody.innerHTML = `<tr><td colspan="4" class="text-center">${t('errorNetwork')}</td></tr>`;
  }
}

/**
 * Render game leaderboard
 */
function renderGameLeaderboard(data, tbody) {
  if (!data || data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" class="text-center">${t('noData') || 'Henüz skor yok'}</td></tr>`;
    return;
  }

  tbody.innerHTML = data.map((entry, index) => `
    <tr data-user-id="${entry.user_id}">
      <td>#${entry.rank || index + 1}</td>
      <td>${entry.display_name || entry.email || 'Anonymous'}</td>
      <td>Level ${entry.level || 1}</td>
      <td><strong>${entry.set_score || 0}</strong></td>
    </tr>
  `).join('');
}

/**
 * Setup game leaderboard filters
 */
function setupGameFilters() {
  const gameFilter = document.getElementById('gameFilter');
  const levelFilter = document.getElementById('levelFilter');

  if (gameFilter) {
    gameFilter.addEventListener('change', loadGameLeaderboard);
  }

  if (levelFilter) {
    levelFilter.addEventListener('change', loadGameLeaderboard);
  }
}

/**
 * Highlight current user in leaderboard
 */
function highlightCurrentUser(userId, type = 'global') {
  const tbody = type === 'global' 
    ? document.getElementById('globalLeaderboardBody')
    : document.getElementById('gameLeaderboardBody');

  if (!tbody) return;

  const userRow = tbody.querySelector(`tr[data-user-id="${userId}"]`);
  if (userRow) {
    userRow.classList.add('leaderboard-row--current-user');
    userRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
