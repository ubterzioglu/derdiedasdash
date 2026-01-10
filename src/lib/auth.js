import { supabase, canUseSupabase } from './supabase'

/**
 * Sign in with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<{user: object, session: object, error: object}>}
 */
export async function signInWithEmailPassword(email, password) {
  if (!canUseSupabase()) {
    return { error: { message: 'Supabase is not configured' } }
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password
  })

  return { ...data, error }
}

/**
 * Sign up with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<{user: object, session: object, error: object}>}
 */
export async function signUpWithEmailPassword(email, password) {
  if (!canUseSupabase()) {
    return { error: { message: 'Supabase is not configured' } }
  }

  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`
    }
  })

  return { ...data, error }
}

/**
 * Sign in with Google OAuth
 * @returns {Promise<{error: object}>}
 */
export async function signInWithGoogle() {
  if (!canUseSupabase()) {
    return { error: { message: 'Supabase is not configured' } }
  }

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  })

  return { error }
}

/**
 * Sign out current user
 * @returns {Promise<{error: object}>}
 */
export async function signOut() {
  if (!canUseSupabase()) {
    return { error: { message: 'Supabase is not configured' } }
  }

  const { error } = await supabase.auth.signOut()
  return { error }
}

/**
 * Get current authenticated user
 * @returns {Promise<object|null>}
 */
export async function getCurrentUser() {
  if (!canUseSupabase()) {
    return null
  }

  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return null
  return user
}

/**
 * Get current session
 * @returns {Promise<object|null>}
 */
export async function getCurrentSession() {
  if (!canUseSupabase()) {
    return null
  }

  const { data: { session }, error } = await supabase.auth.getSession()
  if (error || !session) return null
  return session
}
