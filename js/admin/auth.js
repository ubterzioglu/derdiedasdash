/* ============================================
   DER DIE DAS SPACE - ADMIN AUTH
   Admin panel authentication
   ============================================ */

import { getSupabase } from '../core/supabase.js';

const ADMIN_KEY_STORAGE = 'admin_api_key';

/**
 * Admin login with API key
 */
export async function adminLogin(apiKey) {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase not initialized');
  }

  try {
    // Verify key with Supabase
    const { data, error } = await supabase
      .from('admin_keys')
      .select('*')
      .eq('api_key', apiKey)
      .eq('is_active', true)
      .single();
    
    if (error || !data) {
      throw new Error('Invalid API key');
    }
    
    // Update last used
    await supabase
      .from('admin_keys')
      .update({ last_used: new Date().toISOString() })
      .eq('api_key', apiKey);
    
    // Store in sessionStorage (not localStorage for security)
    sessionStorage.setItem(ADMIN_KEY_STORAGE, apiKey);
    
    return true;
  } catch (error) {
    console.error('Admin login error:', error);
    throw error;
  }
}

/**
 * Check if admin is authenticated
 */
export function isAdminAuthenticated() {
  return !!sessionStorage.getItem(ADMIN_KEY_STORAGE);
}

/**
 * Admin logout
 */
export function adminLogout() {
  sessionStorage.removeItem(ADMIN_KEY_STORAGE);
  window.location.href = '/admin/index.html';
}

/**
 * Get admin API key
 */
export function getAdminKey() {
  return sessionStorage.getItem(ADMIN_KEY_STORAGE);
}

/**
 * Require admin auth (redirect if not authenticated)
 */
export function requireAdminAuth() {
  if (!isAdminAuthenticated()) {
    window.location.href = '/admin/index.html';
    return false;
  }
  return true;
}

// Auto-check on admin pages
if (window.location.pathname.includes('/admin/') && 
    !window.location.pathname.includes('/admin/index.html')) {
  requireAdminAuth();
}
