/* ============================================
   DER DIE DAS SPACE - MAIN APP LOGIC
   Index page orchestrator
   ============================================ */

import { getCurrentUser } from './core/auth.js';
import { getSupabase } from './core/supabase.js';

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
  await initApp();
});

async function initApp() {
  // Check if language is selected
  // Setup accordion
  setupAccordion();

  // Setup hamburger menu
  setupHamburgerMenu();

  // Check referral code
  checkReferralCode();
  
  // Load user stats if authenticated
  const user = await getCurrentUser();
  if (user) {
    await loadUserStats(user.id);
  }
}

/**
 * Setup accordion for "How to Play"
 */
function setupAccordion() {
  const card = document.getElementById('howToPlayCard');
  const header = document.getElementById('howToPlayHeader');
  const body = document.getElementById('howToPlayBody');
  const icon = header?.querySelector('.accordion-icon');
  
  if (card && header && body) {
    header.addEventListener('click', () => {
      const isActive = body.style.display === 'block' || body.style.display === '';
      
      if (isActive) {
        body.style.display = 'none';
        card.classList.remove('active');
        if (icon) {
          icon.style.transform = 'rotate(0deg)';
        }
      } else {
        body.style.display = 'block';
        card.classList.add('active');
        if (icon) {
          icon.style.transform = 'rotate(180deg)';
        }
      }
    });
  }
}

/**
 * Load user stats
 */
async function loadUserStats(userId) {
  const supabase = getSupabase();
  if (!supabase) return;
  
  try {
    // Get user stats from database
    // This will be implemented when database is ready
    // For now, placeholder
    
    // Example:
    // const { data } = await supabase
    //   .from('user_game_sets')
    //   .select('*')
    //   .eq('user_id', userId)
    //   .order('completed_at', { ascending: false })
    //   .limit(1);
  } catch (error) {
    console.error('Error loading user stats:', error);
  }
}

/**
 * Check referral code from URL
 */
async function checkReferralCode() {
  const { getReferralFromURL } = await import('./core/referral.js');
  const refCode = getReferralFromURL();

  if (refCode) {
    // Store referral code for later processing
    localStorage.setItem('referralCode', refCode);

    // Show welcome message if user registers
    console.log('Referral code detected:', refCode);
  }
}

/**
 * Setup hamburger menu
 */
function setupHamburgerMenu() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const closeMenuBtn = document.getElementById('closeMenuBtn');
  const slideMenu = document.getElementById('slideMenu');
  const menuOverlay = document.getElementById('menuOverlay');

  if (!hamburgerBtn || !slideMenu || !menuOverlay) return;

  // Open menu
  hamburgerBtn.addEventListener('click', () => {
    slideMenu.classList.add('active');
    menuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  // Close menu
  const closeMenu = () => {
    slideMenu.classList.remove('active');
    menuOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  closeMenuBtn?.addEventListener('click', closeMenu);
  menuOverlay.addEventListener('click', closeMenu);

  // Close on menu item click
  const menuItems = document.querySelectorAll('.slide-menu-item');
  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      // If it's an anchor link, don't close immediately
      if (item.getAttribute('href').startsWith('#')) {
        setTimeout(closeMenu, 300);
      } else {
        closeMenu();
      }
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && slideMenu.classList.contains('active')) {
      closeMenu();
    }
  });
}
