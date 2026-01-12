/* ============================================
   DER DIE DAS SPACE - LANGUAGE SELECTOR
   Dil değiştirici component
   ============================================ */

import { setLanguage, getCurrentLanguage } from '../core/i18n.js';

const LANGUAGE_MODAL_KEY = 'languageModalSeen';

/**
 * Initialize language selector
 */
export function initLanguageSelector() {
  // Language buttons
  const langButtons = document.querySelectorAll('[data-lang]');
  langButtons.forEach(btn => {
    if (btn.closest('#languageModal')) return;
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
    if (btn.closest('#languageModal')) return;
    const isActive = btn.dataset.lang === currentLang;
    btn.classList.toggle('active', isActive);

    if (btn.classList.contains('btn')) {
      btn.classList.toggle('btn-primary', isActive);
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
      localStorage.setItem(LANGUAGE_MODAL_KEY, 'true');
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
  initLanguageSelector();

  const savedLang = localStorage.getItem('language');
  const hasSeenModal = localStorage.getItem(LANGUAGE_MODAL_KEY);
  if (!savedLang && !hasSeenModal) {
    showLanguageModal();
  }
});

// Listen for language changes
window.addEventListener('languageChanged', () => {
  updateActiveLanguage();
});
