/* ============================================
   DER DIE DAS SPACE - SUPABASE CLIENT
   Supabase initialization and configuration
   ============================================ */

// Supabase CDN - Add this script to HTML: 
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

// Configuration - Supabase credentials
const SUPABASE_URL = 'https://zacsokxnytyfisagshlb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphY3Nva3hueXR5ZmlzYWdzaGxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwNTI4OTYsImV4cCI6MjA4MzYyODg5Nn0._1WR5u-WKhUPZ6-IeuIyWWOka1QHB9HoEOkcpprK0KA';

// Initialize Supabase client
let supabaseClient = null;

export function initSupabase() {
  if (typeof supabase === 'undefined') {
    console.error('Supabase library not loaded. Add this to HTML:');
    console.error('<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>');
    return null;
  }
  
  if (!SUPABASE_URL || SUPABASE_URL === 'YOUR_SUPABASE_URL_HERE') {
    console.warn('Supabase URL not configured. Please set SUPABASE_URL in js/core/supabase.js');
    return null;
  }
  
  if (!SUPABASE_ANON_KEY || SUPABASE_ANON_KEY === 'YOUR_SUPABASE_ANON_KEY_HERE') {
    console.warn('Supabase Anon Key not configured. Please set SUPABASE_ANON_KEY in js/core/supabase.js');
    return null;
  }
  
  try {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    return supabaseClient;
  } catch (error) {
    console.error('Error initializing Supabase:', error);
    return null;
  }
}

export function getSupabase() {
  if (!supabaseClient) {
    return initSupabase();
  }
  return supabaseClient;
}

// Auto-initialize on module load
initSupabase();
