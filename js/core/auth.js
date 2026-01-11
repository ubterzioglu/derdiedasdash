/* ============================================
   DER DIE DAS SPACE - AUTHENTICATION
   Login, register, logout, session management
   ============================================ */

import { getSupabase } from './supabase.js';
import { t } from './i18n.js';

// Auth state
let currentUser = null;
let authListeners = [];

// Initialize auth listener
export async function initAuth() {
  const supabase = getSupabase();
  if (!supabase) return;
  
  // Check existing session
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    currentUser = session.user;
    notifyAuthListeners();
  }
  
  // Listen for auth changes
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
      currentUser = session?.user || null;
      if (currentUser) {
        updateLastLogin(currentUser.id);
        updateLoginStreak(currentUser.id);
      }
      notifyAuthListeners();
    } else if (event === 'SIGNED_OUT') {
      currentUser = null;
      notifyAuthListeners();
    }
  });
}

// Login with Google OAuth
export async function loginWithGoogle() {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error(t('errorNetwork'));
  }
  
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Google login error:', error);
    throw error;
  }
}

// Login with email/password
export async function loginWithEmail(email, password) {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error(t('errorNetwork'));
  }
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    
    // Update last_login
    if (data.user) {
      await updateLastLogin(data.user.id);
      await updateLoginStreak(data.user.id);
    }
    
    return data;
  } catch (error) {
    console.error('Email login error:', error);
    throw error;
  }
}

// Register with email/password
export async function signUpWithEmail(email, password, displayName) {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error(t('errorNetwork'));
  }
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName
        }
      }
    });
    
    if (error) throw error;
    
    // Create user record
    if (data.user) {
      await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email: email,
          display_name: displayName,
          auth_provider: 'supabase'
        });
    }
    
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

// Logout
export async function logout() {
  const supabase = getSupabase();
  if (!supabase) return;
  
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    currentUser = null;
    notifyAuthListeners();
    window.location.href = '/';
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}

// Get current user
export async function getCurrentUser() {
  const supabase = getSupabase();
  if (!supabase) return null;
  
  if (currentUser) return currentUser;
  
  const { data: { user } } = await supabase.auth.getUser();
  currentUser = user;
  return user;
}

// Check if user is authenticated
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}

// Update last login timestamp
async function updateLastLogin(userId) {
  const supabase = getSupabase();
  if (!supabase) return;
  
  try {
    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', userId);
  } catch (error) {
    console.error('Update last login error:', error);
  }
}

// Update login streak
async function updateLoginStreak(userId) {
  const supabase = getSupabase();
  if (!supabase) return;
  
  try {
    await supabase.rpc('update_login_streak', { p_user_id: userId });
  } catch (error) {
    console.error('Update login streak error:', error);
  }
}

// Auth state change listener
export function onAuthStateChange(callback) {
  authListeners.push(callback);
  // Immediately call with current state
  if (currentUser !== null) {
    callback(currentUser);
  }
}

function notifyAuthListeners() {
  authListeners.forEach(callback => {
    try {
      callback(currentUser);
    } catch (error) {
      console.error('Auth listener error:', error);
    }
  });
}

// Require authentication (redirect to login if not authenticated)
export async function requireAuth() {
  const isAuth = await isAuthenticated();
  if (!isAuth) {
    // Store intended destination
    localStorage.setItem('redirectAfterLogin', window.location.pathname);
    // Show login modal or redirect
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
      loginBtn.click();
    } else {
      window.location.href = '/index.html?showLogin=true';
    }
    return false;
  }
  return true;
}

// Initialize on module load
if (typeof window !== 'undefined') {
  initAuth();
}
