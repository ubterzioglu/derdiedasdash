/* ============================================
   DER DIE DAS SPACE - MAIN APP LOGIC
   Index page orchestrator
   ============================================ */

import { t } from './core/i18n.js';
import { getCurrentUser, isAuthenticated, onAuthStateChange, logout } from './core/auth.js';
import { getSupabase } from './core/supabase.js';

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
  await initApp();
});

async function initApp() {
  // Check if language is selected
  // Setup auth
  setupAuth();
  
  // Setup accordion
  setupAccordion();
  
  // Setup game card accordions
  setupGameAccordions();

  // Setup hamburger menu
  setupHamburgerMenu();

  // Setup login/register modals
  setupAuthModals();
  
  // Check referral code
  checkReferralCode();
  
  // Load user stats if authenticated
  const user = await getCurrentUser();
  if (user) {
    await loadUserStats(user.id);
  }
}

/**
 * Setup authentication UI
 */
function setupAuth() {
  onAuthStateChange((user) => {
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    const welcomeSection = document.getElementById('welcomeSection');
    const stickyCta = document.getElementById('stickyCta');
    
    if (user) {
      // User is logged in
      if (authButtons) authButtons.style.display = 'none';
      if (userMenu) {
        userMenu.style.display = 'flex';
        const userNameEl = document.getElementById('userName');
        if (userNameEl) {
          userNameEl.textContent = `👤 ${user.user_metadata?.display_name || user.email || 'User'}`;
        }
      }
      if (welcomeSection) welcomeSection.style.display = 'block';
      if (stickyCta) stickyCta.style.display = 'none';
      
      // Setup logout
      const logoutBtn = document.getElementById('logoutBtn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
          await logout();
        });
      }
    } else {
      // User is not logged in
      if (authButtons) authButtons.style.display = 'flex';
      if (userMenu) userMenu.style.display = 'none';
      if (welcomeSection) welcomeSection.style.display = 'none';
      if (stickyCta) stickyCta.style.display = 'block';
    }
  });
}

/**
 * Setup accordion for "How to Play"
 */
function setupAccordion() {
  const header = document.getElementById('howToPlayHeader');
  const body = document.getElementById('howToPlayBody');
  
  if (header && body) {
    header.addEventListener('click', () => {
      const isActive = header.classList.contains('active');
      
      if (isActive) {
        header.classList.remove('active');
        body.classList.remove('active');
      } else {
        header.classList.add('active');
        body.classList.add('active');
      }
    });
    
    // Open by default on first visit
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
      header.classList.add('active');
      body.classList.add('active');
      localStorage.setItem('hasVisited', 'true');
    }
  }
}

/**
 * Setup game card accordions
 */
function setupGameAccordions() {
  const gameCards = document.querySelectorAll('.game-card-accordion');
  
  gameCards.forEach(card => {
    const header = card.querySelector('.game-card-header');
    const body = card.querySelector('.game-card-body');
    const icon = header.querySelector('.accordion-icon');
    
    if (header && body) {
      header.addEventListener('click', () => {
        const isActive = card.classList.contains('active');
        
        if (isActive) {
          card.classList.remove('active');
          body.style.display = 'none';
          icon.textContent = '▼';
        } else {
          // Close other cards
          gameCards.forEach(otherCard => {
            if (otherCard !== card) {
              otherCard.classList.remove('active');
              otherCard.querySelector('.game-card-body').style.display = 'none';
              otherCard.querySelector('.accordion-icon').textContent = '▼';
            }
          });
          
          card.classList.add('active');
          body.style.display = 'block';
          icon.textContent = '▲';
        }
      });
    }
  });
}

/**
 * Toggle game accordion (for inline onclick)
 */
window.toggleGameAccordion = function(header) {
  const card = header.closest('.game-card-accordion');
  const body = card.querySelector('.game-card-body');
  const icon = header.querySelector('.accordion-icon');
  const isActive = card.classList.contains('active');
  
  if (isActive) {
    card.classList.remove('active');
    body.style.display = 'none';
    icon.textContent = '▼';
  } else {
    // Close other cards
    document.querySelectorAll('.game-card-accordion').forEach(otherCard => {
      if (otherCard !== card) {
        otherCard.classList.remove('active');
        otherCard.querySelector('.game-card-body').style.display = 'none';
        otherCard.querySelector('.accordion-icon').textContent = '▼';
      }
    });
    
    card.classList.add('active');
    body.style.display = 'block';
    icon.textContent = '▲';
  }
};

/**
 * Setup login/register modals
 */
function setupAuthModals() {
  const loginBtn = document.getElementById('loginBtn');
  const registerBtn = document.getElementById('registerBtn');
  const loginBtnSticky = document.getElementById('loginBtnSticky');
  const registerBtnSticky = document.getElementById('registerBtnSticky');
  
  [loginBtn, loginBtnSticky].forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => showLoginModal());
    }
  });
  
  [registerBtn, registerBtnSticky].forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => showRegisterModal());
    }
  });
}

/**
 * Show login modal
 */
function showLoginModal() {
  const modal = document.getElementById('loginModal');
  if (!modal) return;
  
  modal.innerHTML = `
    <div class="modal">
      <button class="modal-close" onclick="this.closest('.modal-overlay').style.display='none'">×</button>
      <div class="modal-header">
        <h2>${t('login')}</h2>
      </div>
      <div class="modal-body">
        <form id="loginForm">
          <div class="form-group">
            <label class="form-label">${t('emailPlaceholder')}</label>
            <input type="email" class="form-input" id="loginEmail" required>
          </div>
          <div class="form-group">
            <label class="form-label">${t('passwordPlaceholder')}</label>
            <input type="password" class="form-input" id="loginPassword" required>
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%;">${t('login')}</button>
        </form>
        
        <div class="divider">${t('or') || 'veya'}</div>
        
        <button class="btn btn-secondary" style="width: 100%;" id="googleLoginBtn">
          ${t('loginWithGoogle')}
        </button>
        
        <p style="text-align: center; margin-top: 1rem;">
          ${t('dontHaveAccount')} <a href="#" id="switchToRegister">${t('register')}</a>
        </p>
      </div>
    </div>
  `;
  
  modal.style.display = 'flex';
  
  // Setup form handlers
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      
      try {
        const { loginWithEmail } = await import('./core/auth.js');
        await loginWithEmail(email, password);
        modal.style.display = 'none';
        window.location.reload();
      } catch (error) {
        alert(t('errorAuth') + ': ' + error.message);
      }
    });
  }
  
  const googleBtn = document.getElementById('googleLoginBtn');
  if (googleBtn) {
    googleBtn.addEventListener('click', async () => {
      try {
        const { loginWithGoogle } = await import('./core/auth.js');
        await loginWithGoogle();
      } catch (error) {
        alert(t('errorAuth') + ': ' + error.message);
      }
    });
  }
  
  const switchBtn = document.getElementById('switchToRegister');
  if (switchBtn) {
    switchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.style.display = 'none';
      showRegisterModal();
    });
  }
}

/**
 * Show register modal
 */
function showRegisterModal() {
  const modal = document.getElementById('loginModal');
  if (!modal) return;
  
  modal.innerHTML = `
    <div class="modal">
      <button class="modal-close" onclick="this.closest('.modal-overlay').style.display='none'">×</button>
      <div class="modal-header">
        <h2>${t('register')}</h2>
      </div>
      <div class="modal-body">
        <form id="registerForm">
          <div class="form-group">
            <label class="form-label">${t('displayNamePlaceholder')}</label>
            <input type="text" class="form-input" id="registerName" required>
          </div>
          <div class="form-group">
            <label class="form-label">${t('emailPlaceholder')}</label>
            <input type="email" class="form-input" id="registerEmail" required>
          </div>
          <div class="form-group">
            <label class="form-label">${t('passwordPlaceholder')}</label>
            <input type="password" class="form-input" id="registerPassword" required minlength="6">
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%;">${t('register')}</button>
        </form>
        
        <div class="divider">${t('or') || 'veya'}</div>
        
        <button class="btn btn-secondary" style="width: 100%;" id="googleRegisterBtn">
          ${t('loginWithGoogle')}
        </button>
        
        <p style="text-align: center; margin-top: 1rem;">
          ${t('alreadyHaveAccount')} <a href="#" id="switchToLogin">${t('login')}</a>
        </p>
      </div>
    </div>
  `;
  
  modal.style.display = 'flex';
  
  // Setup form handlers
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('registerName').value;
      const email = document.getElementById('registerEmail').value;
      const password = document.getElementById('registerPassword').value;
      
      try {
        const { signUpWithEmail } = await import('./core/auth.js');
        await signUpWithEmail(email, password, name);
        modal.style.display = 'none';
        alert(t('register') + ' başarılı! Giriş yapabilirsiniz.');
        window.location.reload();
      } catch (error) {
        alert(t('errorAuth') + ': ' + error.message);
      }
    });
  }
  
  const googleBtn = document.getElementById('googleRegisterBtn');
  if (googleBtn) {
    googleBtn.addEventListener('click', async () => {
      try {
        const { loginWithGoogle } = await import('./core/auth.js');
        await loginWithGoogle();
      } catch (error) {
        alert(t('errorAuth') + ': ' + error.message);
      }
    });
  }
  
  const switchBtn = document.getElementById('switchToLogin');
  if (switchBtn) {
    switchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.style.display = 'none';
      showLoginModal();
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
