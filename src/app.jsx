import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import DerDiedasDash from './DerDiedasDash';
import Login from './components/Login';
import AuthCallback from './components/AuthCallback';
import ErrorBoundary from './components/ErrorBoundary';
import { supabase, canUseSupabase } from './lib/supabase';
import { Globe } from 'lucide-react';

// Language Selector Component
const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();
  const languages = [
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative group">
        <button
          className="bg-slate-800/80 hover:bg-slate-700/80 border-2 border-cyan-500/30 rounded-xl px-4 py-2 flex items-center gap-2 text-white font-bold transition-all backdrop-blur-sm shadow-lg"
        >
          <Globe className="w-4 h-4" />
          <span>{languages.find(l => l.code === language)?.flag}</span>
          <span className="text-sm">{languages.find(l => l.code === language)?.name}</span>
        </button>
        <div className="absolute bottom-full right-0 mb-2 bg-slate-800/95 border-2 border-cyan-500/30 rounded-xl overflow-hidden backdrop-blur-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all min-w-[150px]">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-slate-700/80 transition-colors ${
                language === lang.code ? 'bg-cyan-500/20 text-cyan-400' : 'text-white'
              }`}
            >
              <span>{lang.flag}</span>
              <span className="font-semibold">{lang.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main App Content with Auth
const AppContent = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for existing session
    checkUser();

    // Listen for auth changes
    if (canUseSupabase()) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user && location.pathname === '/') {
          navigate('/');
        }
      });

      return () => subscription.unsubscribe();
    }
  }, [location.pathname, navigate]);

  const checkUser = async () => {
    if (!canUseSupabase()) {
      setLoading(false);
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    } catch (error) {
      console.error('Error checking session:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    navigate('/');
  };

  const handleLogout = async () => {
    if (canUseSupabase()) {
      await supabase.auth.signOut();
    }
    setUser(null);
    navigate('/login');
  };

  const handleAuthCallbackSuccess = (userData) => {
    setUser(userData);
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-cyan-400 text-2xl font-bold animate-pulse">LOADING...</div>
      </div>
    );
  }

  return (
    <>
      {/* Show language selector on all routes except login/auth callback */}
      {location.pathname !== '/login' && location.pathname !== '/auth/callback' && (
        <LanguageSelector />
      )}

      <Routes>
        {/* Auth Callback Route */}
        <Route
          path="/auth/callback"
          element={<AuthCallback onSuccess={handleAuthCallbackSuccess} />}
        />

        {/* Login Route */}
        <Route
          path="/login"
          element={<Login onSuccess={handleLoginSuccess} />}
        />

        {/* Main Game Route - Direct access (no login required for demo) */}
        <Route
          path="/"
          element={
            <DerDiedasDash
              authUser={user}
              onLogout={handleLogout}
            />
          }
        />
      </Routes>
    </>
  );
};

// Main App Component
function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <Router>
          <AppContent />
        </Router>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
