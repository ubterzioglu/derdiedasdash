import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if Supabase is configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

// Create Supabase client with auth support
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null

// Helper function to check if we can use Supabase
export const canUseSupabase = () => {
  return isSupabaseConfigured && supabase !== null
}

// Get current user
export const getCurrentUser = async () => {
  if (!canUseSupabase()) return null
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Get current session
export const getCurrentSession = async () => {
  if (!canUseSupabase()) return null
  const { data: { session } } = await supabase.auth.getSession()
  return session
}
