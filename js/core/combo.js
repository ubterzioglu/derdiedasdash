/* ============================================
   DER DIE DAS SPACE - COMBO SYSTEM
   Combo tracking and display
   ============================================ */

import { COMBO_START, COMBO_MAX } from './scoring.js';

/**
 * Combo Manager class
 */
export class ComboManager {
  constructor() {
    this.currentStreak = 0;
    this.maxCombo = 0;
    this.pendingReset = false;
    this.onComboStart = null;
    this.onComboUpdate = null;
    this.onComboReset = null;
  }

  /**
   * Add correct answer (increment streak)
   */
  addCorrect() {
    this.currentStreak = Math.min(this.currentStreak + 1, COMBO_MAX);
    this.maxCombo = Math.max(this.maxCombo, this.currentStreak);
    
    // Check if combo started (3 in a row)
    if (this.currentStreak === COMBO_START && this.onComboStart) {
      this.onComboStart(this.currentStreak);
    }
    
    // Update combo display
    if (this.currentStreak >= COMBO_START && this.onComboUpdate) {
      this.onComboUpdate(this.currentStreak);
    }
    
    // Reset after max combo is scored
    if (this.currentStreak >= COMBO_MAX) {
      this.pendingReset = true;
    }
  }

  /**
   * Add wrong answer (reset streak)
   */
  addWrong() {
    if (this.currentStreak >= COMBO_START && this.onComboReset) {
      this.onComboReset();
    }
    this.currentStreak = 0;
    this.pendingReset = false;
  }

  /**
   * Get current streak
   */
  getStreak() {
    const streak = this.currentStreak;

    if (this.pendingReset) {
      this.pendingReset = false;
      this.currentStreak = 0;
      if (this.onComboReset) {
        this.onComboReset();
      }
    }

    return streak;
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
    return this.currentStreak >= COMBO_START;
  }

  /**
   * Reset combo
   */
  reset() {
    if (this.currentStreak >= COMBO_START && this.onComboReset) {
      this.onComboReset();
    }
    this.currentStreak = 0;
    this.pendingReset = false;
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
  indicator.className = 'combo-indicator combo-indicator--hidden';
  indicator.innerHTML = '🔥 <span class="combo-count">0x</span> COMBO!';
  return indicator;
}

/**
 * Update combo indicator
 */
export function updateComboIndicator(indicator, streak) {
  if (streak >= COMBO_START) {
    indicator.classList.remove('combo-indicator--hidden');
    const comboCount = indicator.querySelector('.combo-count');
    if (comboCount) {
      comboCount.textContent = `${streak}x`;
    }
    
    // Add burst animation for new combos
    if (streak === COMBO_START) {
      indicator.classList.add('combo-indicator--burst', 'combo-indicator--new');
      setTimeout(() => {
        indicator.classList.remove('combo-indicator--burst', 'combo-indicator--new');
        indicator.classList.add('combo-indicator--active');
      }, 500);
    }
  } else {
    indicator.classList.add('combo-indicator--hidden');
    indicator.classList.remove('combo-indicator--active', 'combo-indicator--burst');
  }
}

/**
 * Hide combo indicator
 */
export function hideComboIndicator(indicator) {
  indicator.classList.add('combo-indicator--hidden');
  indicator.classList.remove('combo-indicator--active', 'combo-indicator--burst');
}
