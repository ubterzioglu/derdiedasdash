/* ============================================
   DER DIE DAS SPACE - ADMIN BADGES
   Badge management for admin panel
   ============================================ */

import { getSupabase } from '../core/supabase.js';
import { requireAdminAuth, adminLogout } from './auth.js';

// Check auth on load
document.addEventListener('DOMContentLoaded', () => {
  if (!requireAdminAuth()) return;
  
  initBadges();
  setupEventListeners();
  loadBadges();
});

function setupEventListeners() {
  // Logout
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to logout?')) {
        adminLogout();
      }
    });
  }
  
  // Filters
  const typeFilter = document.getElementById('badgeTypeFilter');
  const rarityFilter = document.getElementById('badgeRarityFilter');
  const activeFilter = document.getElementById('activeOnlyFilter');
  
  [typeFilter, rarityFilter, activeFilter].forEach(el => {
    if (el) {
      el.addEventListener('change', () => {
        loadBadges();
      });
    }
  });
  
  // Badge type change - update criteria builder
  const badgeType = document.getElementById('badgeType');
  if (badgeType) {
    badgeType.addEventListener('change', () => {
      updateCriteriaBuilder(badgeType.value);
    });
  }
  
  // Form submit
  const form = document.getElementById('createBadgeForm');
  if (form) {
    form.addEventListener('submit', handleCreateBadge);
  }
}

async function loadBadges() {
  const supabase = getSupabase();
  if (!supabase) return;
  
  const typeFilter = document.getElementById('badgeTypeFilter')?.value;
  const rarityFilter = document.getElementById('badgeRarityFilter')?.value;
  const activeFilter = document.getElementById('activeOnlyFilter')?.checked;
  
  try {
    let query = supabase
      .from('badges')
      .select(`
        *,
        user_badges (id)
      `)
      .order('badge_type')
      .order('badge_name_en');
    
    if (typeFilter) {
      query = query.eq('badge_type', typeFilter);
    }
    if (rarityFilter) {
      query = query.eq('rarity', rarityFilter);
    }
    if (activeFilter) {
      query = query.eq('is_active', true);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error loading badges:', error);
      return;
    }
    
    renderBadges(data || []);
  } catch (error) {
    console.error('Error loading badges:', error);
  }
}

function renderBadges(badges) {
  const tbody = document.getElementById('badgesTableBody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  badges.forEach(badge => {
    const userCount = badge.user_badges?.length || 0;
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${badge.icon_url || '🎖️'}</td>
      <td>${badge.badge_code}</td>
      <td>${badge.badge_name_en}</td>
      <td>${badge.badge_type}</td>
      <td>${badge.rarity}</td>
      <td>${badge.is_active ? '✓' : '-'}</td>
      <td>${userCount}</td>
      <td>
        <button class="btn btn-sm" onclick="editBadge(${badge.id})">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteBadge(${badge.id})">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function updateCriteriaBuilder(badgeType) {
  const builder = document.getElementById('criteriaBuilder');
  if (!builder) return;
  
  // Clear existing
  builder.innerHTML = '';
  
  // Show appropriate fields based on type
  switch (badgeType) {
    case 'streak':
      builder.innerHTML = `
        <div class="admin-form-group">
          <label for="criteriaDays">Days</label>
          <input type="number" id="criteriaDays" min="1" onchange="updateCriteriaJSON()">
        </div>
        <div class="admin-form-group">
          <label>
            <input type="checkbox" id="criteriaConsecutive" onchange="updateCriteriaJSON()">
            Consecutive
          </label>
        </div>
      `;
      break;
    
    case 'achievement':
      builder.innerHTML = `
        <div class="admin-form-group">
          <label for="criteriaCount">Count</label>
          <input type="number" id="criteriaCount" min="1" onchange="updateCriteriaJSON()">
        </div>
        <div class="admin-form-group">
          <label for="criteriaGameType">Game Type (optional)</label>
          <select id="criteriaGameType" onchange="updateCriteriaJSON()">
            <option value="">All games</option>
          </select>
        </div>
      `;
      break;
    
    case 'rank':
      builder.innerHTML = `
        <div class="admin-form-group">
          <label for="criteriaMaxRank">Max Rank</label>
          <input type="number" id="criteriaMaxRank" min="1" onchange="updateCriteriaJSON()">
        </div>
        <div class="admin-form-group">
          <label for="criteriaScope">Scope</label>
          <select id="criteriaScope" onchange="updateCriteriaJSON()">
            <option value="global">Global</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      `;
      break;
    
    default:
      builder.innerHTML = '<p>Select badge type to configure criteria</p>';
  }
  
  updateCriteriaJSON();
}

window.updateCriteriaJSON = function() {
  const badgeType = document.getElementById('badgeType')?.value;
  const jsonField = document.getElementById('criteriaJSON');
  if (!jsonField) return;
  
  let criteria = { type: badgeType };
  
  switch (badgeType) {
    case 'streak':
      const days = document.getElementById('criteriaDays')?.value;
      const consecutive = document.getElementById('criteriaConsecutive')?.checked;
      if (days) criteria.days = parseInt(days);
      if (consecutive) criteria.consecutive = true;
      break;
    
    case 'achievement':
      const count = document.getElementById('criteriaCount')?.value;
      const gameType = document.getElementById('criteriaGameType')?.value;
      if (count) criteria.count = parseInt(count);
      if (gameType) criteria.game_type = gameType;
      break;
    
    case 'rank':
      const maxRank = document.getElementById('criteriaMaxRank')?.value;
      const scope = document.getElementById('criteriaScope')?.value;
      if (maxRank) criteria.max_rank = parseInt(maxRank);
      if (scope) criteria.scope = scope;
      break;
  }
  
  jsonField.value = JSON.stringify(criteria, null, 2);
};

async function handleCreateBadge(e) {
  e.preventDefault();
  
  const supabase = getSupabase();
  if (!supabase) return;
  
  try {
    const badgeData = {
      badge_code: document.getElementById('badgeCode').value,
      badge_type: document.getElementById('badgeType').value,
      badge_name_tr: document.getElementById('badgeNameTr').value,
      badge_name_en: document.getElementById('badgeNameEn').value,
      badge_name_de: document.getElementById('badgeNameDe').value,
      badge_description_tr: document.getElementById('badgeDescTr').value,
      badge_description_en: document.getElementById('badgeDescEn').value,
      badge_description_de: document.getElementById('badgeDescDe').value,
      icon_url: document.getElementById('badgeIcon').value,
      rarity: document.getElementById('badgeRarity').value,
      criteria: JSON.parse(document.getElementById('criteriaJSON').value),
      is_active: document.getElementById('badgeIsActive').checked
    };
    
    const { error } = await supabase
      .from('badges')
      .insert(badgeData);
    
    if (error) throw error;
    
    alert('Badge created successfully!');
    hideCreateBadgeModal();
    loadBadges();
  } catch (error) {
    console.error('Error creating badge:', error);
    alert('Error creating badge: ' + error.message);
  }
}

window.showCreateBadgeModal = function() {
  document.getElementById('createBadgeModal').style.display = 'flex';
};

window.hideCreateBadgeModal = function() {
  document.getElementById('createBadgeModal').style.display = 'none';
  document.getElementById('createBadgeForm').reset();
  document.getElementById('criteriaBuilder').innerHTML = '';
};

window.testBadge = function() {
  alert('Badge testing not yet implemented');
};

window.editBadge = function(badgeId) {
  alert('Edit not yet implemented');
};

window.deleteBadge = function(badgeId) {
  if (!confirm('Are you sure you want to delete this badge?')) return;
  alert('Delete not yet implemented');
};
