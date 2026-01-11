/* ============================================
   DER DIE DAS SPACE - ADMIN SETS
   Set management for admin panel
   ============================================ */

import { getSupabase } from '../core/supabase.js';
import { requireAdminAuth, adminLogout } from './auth.js';

// Check auth on load
document.addEventListener('DOMContentLoaded', () => {
  if (!requireAdminAuth()) return;
  
  initSets();
  setupEventListeners();
  loadGameTypes();
  loadSets();
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
  const gameFilter = document.getElementById('gameFilter');
  const levelFilter = document.getElementById('levelFilter');
  const demoFilter = document.getElementById('demoOnlyFilter');
  
  [gameFilter, levelFilter, demoFilter].forEach(el => {
    if (el) {
      el.addEventListener('change', () => {
        loadSets();
      });
    }
  });
  
  // Question method toggle
  const questionMethod = document.querySelectorAll('input[name="questionMethod"]');
  questionMethod.forEach(radio => {
    radio.addEventListener('change', (e) => {
      const method = e.target.value;
      document.getElementById('manualQuestions').style.display = 
        method === 'manual' ? 'block' : 'none';
      document.getElementById('csvQuestions').style.display = 
        method === 'csv' ? 'block' : 'none';
    });
  });
  
  // Form submit
  const form = document.getElementById('createSetForm');
  if (form) {
    form.addEventListener('submit', handleCreateSet);
  }
}

async function loadGameTypes() {
  const supabase = getSupabase();
  if (!supabase) return;
  
  try {
    const { data, error } = await supabase
      .from('game_types')
      .select('*')
      .order('game_name_en');
    
    if (error || !data) return;
    
    // Populate game filter
    const gameFilter = document.getElementById('gameFilter');
    const setGameType = document.getElementById('setGameType');
    
    data.forEach(game => {
      const option1 = new Option(game.game_name_en, game.game_code);
      const option2 = new Option(game.game_name_en, game.id);
      
      if (gameFilter) gameFilter.appendChild(option1.cloneNode(true));
      if (setGameType) setGameType.appendChild(option2);
    });
  } catch (error) {
    console.error('Error loading game types:', error);
  }
}

async function loadSets() {
  const supabase = getSupabase();
  if (!supabase) return;
  
  const gameFilter = document.getElementById('gameFilter')?.value;
  const levelFilter = document.getElementById('levelFilter')?.value;
  const demoFilter = document.getElementById('demoOnlyFilter')?.checked;
  
  try {
    let query = supabase
      .from('word_sets')
      .select(`
        *,
        game_types (
          game_code,
          game_name_en
        ),
        questions (id)
      `)
      .order('difficulty_level')
      .order('set_number');
    
    if (gameFilter) {
      query = query.eq('game_types.game_code', gameFilter);
    }
    if (levelFilter) {
      query = query.eq('difficulty_level', levelFilter);
    }
    if (demoFilter) {
      query = query.eq('is_demo', true);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error loading sets:', error);
      return;
    }
    
    renderSets(data || []);
  } catch (error) {
    console.error('Error loading sets:', error);
  }
}

function renderSets(sets) {
  const tbody = document.getElementById('setsTableBody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  sets.forEach(set => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${set.id}</td>
      <td>${set.game_types?.game_name_en || '-'}</td>
      <td>${set.set_number}</td>
      <td>Level ${set.difficulty_level}</td>
      <td>${set.questions?.length || 0}</td>
      <td>${set.is_demo ? '✓' : '-'}</td>
      <td>
        <button class="btn btn-sm" onclick="editSet(${set.id})">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteSet(${set.id})">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

async function handleCreateSet(e) {
  e.preventDefault();
  
  const supabase = getSupabase();
  if (!supabase) return;
  
  const gameTypeId = document.getElementById('setGameType').value;
  const setNumber = document.getElementById('setNumber').value;
  const level = document.getElementById('setLevel').value;
  const isDemo = document.getElementById('setIsDemo').checked;
  const questionMethod = document.querySelector('input[name="questionMethod"]:checked').value;
  
  try {
    // Create set
    const { data: newSet, error: setError } = await supabase
      .from('word_sets')
      .insert({
        game_type_id: gameTypeId,
        set_number: setNumber,
        difficulty_level: level,
        is_demo: isDemo
      })
      .select()
      .single();
    
    if (setError) throw setError;
    
    // Add questions
    let questions = [];
    if (questionMethod === 'manual') {
      questions = getManualQuestions();
    } else {
      questions = await getCSVQuestions();
    }
    
    if (questions.length > 0) {
      const questionsToInsert = questions.map((q, index) => ({
        set_id: newSet.id,
        order_in_set: index + 1,
        question_data: q
      }));
      
      await supabase
        .from('questions')
        .insert(questionsToInsert);
    }
    
    alert('Set created successfully!');
    hideCreateSetModal();
    loadSets();
  } catch (error) {
    console.error('Error creating set:', error);
    alert('Error creating set: ' + error.message);
  }
}

function getManualQuestions() {
  // TODO: Implement manual question collection
  return [];
}

async function getCSVQuestions() {
  // TODO: Implement CSV parsing
  return [];
}

function addQuestionRow() {
  const list = document.getElementById('questionsList');
  if (!list) return;
  
  const row = document.createElement('div');
  row.className = 'admin-question-row';
  row.innerHTML = `
    <input type="text" placeholder="Question data (JSON)">
    <button type="button" onclick="this.parentElement.remove()">Remove</button>
  `;
  list.appendChild(row);
}

function previewCSV() {
  // TODO: Implement CSV preview
}

window.showCreateSetModal = function() {
  document.getElementById('createSetModal').style.display = 'flex';
};

window.hideCreateSetModal = function() {
  document.getElementById('createSetModal').style.display = 'none';
};

window.editSet = function(setId) {
  // TODO: Implement edit
  alert('Edit not yet implemented');
};

window.deleteSet = function(setId) {
  if (!confirm('Are you sure you want to delete this set?')) return;
  // TODO: Implement delete
  alert('Delete not yet implemented');
};
