/* ============================================
   DER DIE DAS SPACE - AUTH UI
   Shared login/register modal + auth menu toggle
   ============================================ */

import { t } from '../core/i18n.js';
import {
  onAuthStateChange,
  getCurrentUser,
  loginWithEmail,
  loginWithGoogle,
  signUpWithEmail,
  logout
} from '../core/auth.js';

const LOGIN_MODAL_ID = 'loginModal';
const REDIRECT_KEY = 'redirectAfterLogin';

function ensureLoginModalContainer() {
  let modal = document.getElementById(LOGIN_MODAL_ID);
  if (modal) return modal;

  modal = document.createElement('div');
  modal.id = LOGIN_MODAL_ID;
  modal.className = 'modal-overlay';
  modal.style.display = 'none';
  document.body.appendChild(modal);
  return modal;
}

function getOrLabel() {
  const value = t('or');
  return value === 'or' ? 'veya' : value;
}

function clearShowLoginParam() {
  const url = new URL(window.location.href);
  if (url.searchParams.has('showLogin')) {
    url.searchParams.delete('showLogin');
    window.history.replaceState({}, document.title, url.toString());
  }
}

function consumeRedirectAfterLogin() {
  const redirectTo = localStorage.getItem(REDIRECT_KEY);
  if (redirectTo) {
    localStorage.removeItem(REDIRECT_KEY);
  }
  return redirectTo;
}

function handleLoginRedirectIfNeeded() {
  const redirectTo = localStorage.getItem(REDIRECT_KEY);
  if (!redirectTo) return;

  if (redirectTo === window.location.pathname) {
    localStorage.removeItem(REDIRECT_KEY);
    return;
  }

  localStorage.removeItem(REDIRECT_KEY);
  window.location.href = redirectTo;
}

function updateAuthUi(user) {
  const authButtons = document.getElementById('authButtons');
  const userMenu = document.getElementById('userMenu');
  const welcomeSection = document.getElementById('welcomeSection');
  const stickyCta = document.getElementById('stickyCta');

  if (user) {
    if (authButtons) authButtons.style.display = 'none';
    if (userMenu) {
      userMenu.style.display = 'flex';
      const userNameEl = document.getElementById('userName');
      if (userNameEl) {
        userNameEl.textContent = `?? ${user.user_metadata?.display_name || user.email || 'User'}`;
      }
    }
    if (welcomeSection) welcomeSection.style.display = 'block';
    if (stickyCta) stickyCta.style.display = 'none';

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn && !logoutBtn.dataset.bound) {
      logoutBtn.dataset.bound = 'true';
      logoutBtn.addEventListener('click', async () => {
        await logout();
      });
    }
  } else {
    if (authButtons) authButtons.style.display = 'flex';
    if (userMenu) userMenu.style.display = 'none';
    if (welcomeSection) welcomeSection.style.display = 'none';
    if (stickyCta) stickyCta.style.display = 'block';
  }
}

function showLoginModal() {
  const modal = ensureLoginModalContainer();
  if (!modal) return;

  modal.innerHTML = `
    <div class="modal">
      <button class="modal-close" onclick="this.closest('.modal-overlay').style.display='none'">x</button>
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

        <div class="divider">${getOrLabel()}</div>

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

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;

      try {
        await loginWithEmail(email, password);
        modal.style.display = 'none';
        clearShowLoginParam();

        const redirectTo = consumeRedirectAfterLogin();
        if (redirectTo && redirectTo !== window.location.pathname) {
          window.location.href = redirectTo;
        } else {
          window.location.reload();
        }
      } catch (error) {
        alert(t('errorAuth') + ': ' + error.message);
      }
    });
  }

  const googleBtn = document.getElementById('googleLoginBtn');
  if (googleBtn) {
    googleBtn.addEventListener('click', async () => {
      try {
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

function showRegisterModal() {
  const modal = ensureLoginModalContainer();
  if (!modal) return;

  modal.innerHTML = `
    <div class="modal">
      <button class="modal-close" onclick="this.closest('.modal-overlay').style.display='none'">x</button>
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

        <div class="divider">${getOrLabel()}</div>

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

  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('registerName').value;
      const email = document.getElementById('registerEmail').value;
      const password = document.getElementById('registerPassword').value;

      try {
        await signUpWithEmail(email, password, name);
        modal.style.display = 'none';
        alert(t('register') + ' basarili! Giris yapabilirsiniz.');
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

function bindAuthButtons() {
  const loginBtn = document.getElementById('loginBtn');
  const registerBtn = document.getElementById('registerBtn');
  const loginBtnSticky = document.getElementById('loginBtnSticky');
  const registerBtnSticky = document.getElementById('registerBtnSticky');

  [loginBtn, loginBtnSticky].forEach(btn => {
    if (!btn) return;
    btn.addEventListener('click', () => showLoginModal());
  });

  [registerBtn, registerBtnSticky].forEach(btn => {
    if (!btn) return;
    btn.addEventListener('click', () => showRegisterModal());
  });
}

async function maybeOpenLoginModal() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('showLogin') !== 'true') return;

  const user = await getCurrentUser();
  if (!user) {
    showLoginModal();
  } else {
    clearShowLoginParam();
  }
}

async function maybeRedirectAfterLogin() {
  const user = await getCurrentUser();
  if (user) {
    handleLoginRedirectIfNeeded();
  }
}

function initAuthUi() {
  bindAuthButtons();
  onAuthStateChange((user) => {
    updateAuthUi(user);
  });
  maybeOpenLoginModal();
  maybeRedirectAfterLogin();
}

document.addEventListener('DOMContentLoaded', initAuthUi);

export { showLoginModal, showRegisterModal, initAuthUi };
