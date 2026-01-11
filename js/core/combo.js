/* ============================================
   DER DIE DAS SPACE - COMBO SYSTEM
   Combo tracking and display
   ============================================ */

import { calculateComboBonus } from './scoring.js';

/**
 * Combo Manager class
 */
export class ComboManager {
  constructor() {
    this.currentStreak = 0;
    this.maxCombo = 0;
    this.onComboStart = null;
    this.onComboUpdate = null;
    this.onComboReset = null;
  }

  /**
   * Add correct answer (increment streak)
   */
  addCorrect() {
    this.currentStreak++;
    this.maxCombo = Math.max(this.maxCombo, this.currentStreak);
    
    // Check if combo started (3 in a row)
    if (this.currentStreak === 3 && this.onComboStart) {
      this.onComboStart(this.currentStreak);
    }
    
    // Update combo display
    if (this.currentStreak >= 3 && this.onComboUpdate) {
      this.onComboUpdate(this.currentStreak);
    }
    
    // Reset after 5 (combo completes)
    if (this.currentStreak === 5) {
      this.currentStreak = 0;
      if (this.onComboReset) {
        this.onComboReset();
      }
    }
  }

  /**
   * Add wrong answer (reset streak)
   */
  addWrong() {
    if (this.currentStreak >= 3 && this.onComboReset) {
      this.onComboReset();
    }
    this.currentStreak = 0;
  }

  /**
   * Get current streak
   */
  getStreak() {
    return this.currentStreak;
  }

  /**
   * Get max combo
   */
  getMaxCombo() {
    return this.maxCombo;
  }

  /**
   * Check if combo is active
   */
  isComboActive() {
    return this.currentStreak >= 3;
  }

  /**
   * Reset combo
   */
  reset() {
    if (this.currentStreak >= 3 && this.onComboReset) {
      this.onComboReset();
    }
    this.currentStreak = 0;
  }

  /**
   * Reset everything (new set)
   */
  resetAll() {
    this.reset();
    this.maxCombo = 0;
  }
}

/**
 * Create combo indicator element
 */
export function createComboIndicator() {
  const indicator = document.createElement('div');
  indicator.className = 'combo-indicator';
  indicator.style.display = 'none';
  indicator.innerHTML = '🔥 <span class="combo-count">0x</span> COMBO!';
  return indicator;
}

/**
 * Update combo indicator
 */
export function updateComboIndicator(indicator, streak) {
  if (streak >= 3) {
    indicator.style.display = 'flex';
    const comboCount = indicator.querySelector('.combo-count');
    if (comboCount) {
      comboCount.textContent = `${streak}x`;
    }
    
    // Add burst animation for new combos
    if (streak === 3) {
      indicator.classList.add('combo-indicator--burst', 'combo-indicator--new');
      setTimeout(() => {
        indicator.classList.remove('combo-indicator--burst', 'combo-indicator--new');
        indicator.classList.add('combo-indicator--active');
      }, 500);
    }
  } else {
    indicator.style.display = 'none';
    indicator.classList.remove('combo-indicator--active', 'combo-indicator--burst');
  }
}

/**
 * Hide combo indicator
 */
export function hideComboIndicator(indicator) {
  indicator.style.display = 'none';
  indicator.classList.remove('combo-indicator--active', 'combo-indicator--burst');
}
