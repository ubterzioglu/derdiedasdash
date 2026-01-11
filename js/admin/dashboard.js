/* ============================================
   DER DIE DAS SPACE - ADMIN DASHBOARD
   Dashboard logic for admin panel
   ============================================ */

import { getSupabase } from '../core/supabase.js';
import { requireAdminAuth, adminLogout } from './auth.js';

// Check auth on load
document.addEventListener('DOMContentLoaded', () => {
  if (!requireAdminAuth()) return;
  
  initDashboard();
  setupEventListeners();
});

function setupEventListeners() {
  // Logout button
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to logout?')) {
        adminLogout();
      }
    });
  }
  
  // Period filter
  const periodFilter = document.getElementById('periodFilter');
  if (periodFilter) {
    periodFilter.addEventListener('change', () => {
      loadDashboardData();
    });
  }
}

async function initDashboard() {
  await loadDashboardData();
}

async function loadDashboardData() {
  const supabase = getSupabase();
  if (!supabase) return;
  
  const period = document.getElementById('periodFilter')?.value || '30';
  const days = period === 'all' ? null : parseInt(period);
  
  try {
    // Total users
    let usersQuery = supabase.from('users').select('id', { count: 'exact', head: true });
    const { count: totalUsers } = await usersQuery;
    
    // Total games
    let gamesQuery = supabase.from('user_game_sets').select('id', { count: 'exact', head: true });
    if (days) {
      const dateFrom = new Date();
      dateFrom.setDate(dateFrom.getDate() - days);
      gamesQuery = gamesQuery.gte('completed_at', dateFrom.toISOString());
    }
    const { count: totalGames } = await gamesQuery;
    
    // Total badges
    const { count: totalBadges } = await supabase
      .from('user_badges')
      .select('id', { count: 'exact', head: true });
    
    // Total sets
    const { count: totalSets } = await supabase
      .from('word_sets')
      .select('id', { count: 'exact', head: true });
    
    // Update UI
    if (document.getElementById('totalUsers')) {
      document.getElementById('totalUsers').textContent = totalUsers || 0;
    }
    if (document.getElementById('totalGames')) {
      document.getElementById('totalGames').textContent = totalGames || 0;
    }
    if (document.getElementById('totalBadges')) {
      document.getElementById('totalBadges').textContent = totalBadges || 0;
    }
    if (document.getElementById('totalSets')) {
      document.getElementById('totalSets').textContent = totalSets || 0;
    }
    
    // Load top badges
    await loadTopBadges();
    
  } catch (error) {
    console.error('Error loading dashboard data:', error);
  }
}

async function loadTopBadges() {
  const supabase = getSupabase();
  if (!supabase) return;
  
  try {
    // Get badge counts
    const { data, error } = await supabase
      .from('user_badges')
      .select(`
        badge_id,
        badges (
          badge_code,
          badge_name_en,
          icon_url
        )
      `);
    
    if (error || !data) return;
    
    // Count by badge
    const badgeCounts = {};
    data.forEach(item => {
      const badgeId = item.badge_id;
      if (!badgeCounts[badgeId]) {
        badgeCounts[badgeId] = {
          count: 0,
          badge: item.badges
        };
      }
      badgeCounts[badgeId].count++;
    });
    
    // Sort by count
    const sorted = Object.entries(badgeCounts)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 10);
    
    // Render table
    const tbody = document.getElementById('topBadgesTable');
    if (tbody) {
      tbody.innerHTML = '';
      
      sorted.forEach(([badgeId, data]) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${data.badge.icon_url || '🎖️'} ${data.badge.badge_name_en || data.badge.badge_code}</td>
          <td>${data.count}</td>
          <td>-</td>
        `;
        tbody.appendChild(row);
      });
    }
  } catch (error) {
    console.error('Error loading top badges:', error);
  }
}
