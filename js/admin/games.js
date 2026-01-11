/* ============================================
   DER DIE DAS SPACE - ADMIN GAMES
   Game type management for admin panel
   ============================================ */

import { getSupabase } from '../core/supabase.js';
import { requireAdminAuth, adminLogout } from './auth.js';

// Check auth on load
document.addEventListener('DOMContentLoaded', () => {
  if (!requireAdminAuth()) return;
  
  initGames();
  setupEventListeners();
  loadGames();
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
  
  // Form submit
  const form = document.getElementById('editGameForm');
  if (form) {
    form.addEventListener('submit', handleEditGame);
  }
}

async function loadGames() {
  const supabase = getSupabase();
  if (!supabase) return;
  
  try {
    const { data: games, error: gamesError } = await supabase
      .from('game_types')
      .select('*')
      .order('game_name_en');
    
    if (gamesError) {
      console.error('Error loading games:', gamesError);
      return;
    }
    
    // Get set counts for each game
    const gamesWithCounts = await Promise.all(
      (games || []).map(async (game) => {
        const { count } = await supabase
          .from('word_sets')
          .select('id', { count: 'exact', head: true })
          .eq('game_type_id', game.id);
        
        return {
          ...game,
          set_count: count || 0
        };
      })
    );
    
    renderGames(gamesWithCounts);
  } catch (error) {
    console.error('Error loading games:', error);
  }
}

function renderGames(games) {
  const tbody = document.getElementById('gamesTableBody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  games.forEach(game => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${game.id}</td>
      <td>${game.game_code}</td>
      <td>${game.game_name_en}</td>
      <td>${game.timer_seconds}s</td>
      <td>${game.base_score}</td>
      <td>${game.set_count || 0}</td>
      <td>${game.is_active ? '✓' : '-'}</td>
      <td>
        <button class="btn btn-sm" onclick="editGame(${game.id})">Edit</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

async function editGame(gameId) {
  const supabase = getSupabase();
  if (!supabase) return;
  
  try {
    const { data, error } = await supabase
      .from('game_types')
      .select('*')
      .eq('id', gameId)
      .single();
    
    if (error) throw error;
    
    // Populate form
    document.getElementById('editGameId').value = data.id;
    document.getElementById('editGameCode').value = data.game_code;
    document.getElementById('editGameNameEn').value = data.game_name_en;
    document.getElementById('editTimerSeconds').value = data.timer_seconds;
    document.getElementById('editBaseScore').value = data.base_score;
    document.getElementById('editIsActive').checked = data.is_active;
    
    // Show modal
    document.getElementById('editGameModal').style.display = 'flex';
  } catch (error) {
    console.error('Error loading game:', error);
    alert('Error loading game: ' + error.message);
  }
}

async function handleEditGame(e) {
  e.preventDefault();
  
  const supabase = getSupabase();
  if (!supabase) return;
  
  const gameId = document.getElementById('editGameId').value;
  
  try {
    const updateData = {
      game_name_en: document.getElementById('editGameNameEn').value,
      timer_seconds: parseInt(document.getElementById('editTimerSeconds').value),
      base_score: parseInt(document.getElementById('editBaseScore').value),
      is_active: document.getElementById('editIsActive').checked
    };
    
    const { error } = await supabase
      .from('game_types')
      .update(updateData)
      .eq('id', gameId);
    
    if (error) throw error;
    
    alert('Game updated successfully!');
    hideEditGameModal();
    loadGames();
  } catch (error) {
    console.error('Error updating game:', error);
    alert('Error updating game: ' + error.message);
  }
}

window.editGame = editGame;

window.hideEditGameModal = function() {
  document.getElementById('editGameModal').style.display = 'none';
  document.getElementById('editGameForm').reset();
};
