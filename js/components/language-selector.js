/* ============================================
   DER DIE DAS SPACE - LANGUAGE SELECTOR
   Dil değiştirici component
   ============================================ */

import { setLanguage, getCurrentLanguage, t } from '../core/i18n.js';

/**
 * Initialize language selector
 */
export function initLanguageSelector() {
  // Language buttons
  const langButtons = document.querySelectorAll('[data-lang]');
  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      changeLanguage(lang);
    });
  });

  // Update active state
  updateActiveLanguage();
}

/**
 * Change language
 */
export function changeLanguage(lang) {
  if (!lang || (lang !== 'tr' && lang !== 'en')) return;
  
  setLanguage(lang);
  updateActiveLanguage();
  
  // Save to localStorage
  localStorage.setItem('language', lang);
  
  // Trigger language change event
  window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
}

/**
 * Update active language button
 */
function updateActiveLanguage() {
  const currentLang = getCurrentLanguage();
  
  document.querySelectorAll('[data-lang]').forEach(btn => {
    if (btn.dataset.lang === currentLang) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

/**
 * Show language selection modal (first visit)
 */
export function showLanguageModal() {
  const modal = document.getElementById('languageModal');
  if (!modal) return;

  // Check if language already selected
  const savedLang = localStorage.getItem('language');
  if (savedLang) {
    changeLanguage(savedLang);
    return;
  }

  // Show modal
  modal.style.display = 'flex';

  // Setup modal buttons
  const modalButtons = modal.querySelectorAll('[data-lang]');
  modalButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      changeLanguage(lang);
      modal.style.display = 'none';
    });
  });
}

/**
 * Hide language modal
 */
export function hideLanguageModal() {
  const modal = document.getElementById('languageModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// Auto-initialize on load
document.addEventListener('DOMContentLoaded', () => {
  // Check if first visit
  const hasVisited = localStorage.getItem('hasVisited');
  if (!hasVisited) {
    showLanguageModal();
    localStorage.setItem('hasVisited', 'true');
  } else {
    initLanguageSelector();
  }
});

// Listen for language changes
window.addEventListener('languageChanged', () => {
  updateActiveLanguage();
});
