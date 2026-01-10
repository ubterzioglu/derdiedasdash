import React, { useState } from 'react';
import { supabase, canUseSupabase } from '../lib/supabase';
import { Mail, Lock, LogIn } from 'lucide-react';

const Login = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    if (!canUseSupabase()) {
      setError('Authentication is not configured. Please check your environment variables.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;
    } catch (error) {
      console.error('Google login error:', error);
      setError(error.message || 'Failed to sign in with Google');
      setLoading(false);
    }
  };

  const handleEmailPasswordLogin = async (e) => {
    e.preventDefault();
    
    if (!canUseSupabase()) {
      setError('Authentication is not configured. Please check your environment variables.');
      return;
    }

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // First, try to sign in
      let { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      // If sign in fails, try to sign up
      if (signInError) {
        // Check if it's an invalid credentials error
        if (signInError.message.includes('Invalid login credentials') || 
            signInError.message.includes('Email not confirmed') ||
            signInError.message.includes('User not found')) {
          
          // Attempt to sign up
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: email.trim(),
            password: password,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback`
            }
          });

          if (signUpError) {
            // Handle specific signup errors
            if (signUpError.message.includes('already registered')) {
              setError('This email is already registered. Please try signing in or use a different email.');
            } else if (signUpError.message.includes('Password should be')) {
              setError('Password is too weak. Please use at least 6 characters.');
            } else {
              setError(signUpError.message || 'Failed to create account');
            }
            setLoading(false);
            return;
          }

          // Sign up successful - user is logged in automatically if email confirmation is disabled
          // Otherwise, show success message
          if (signUpData.user && !signUpData.user.email_confirmed_at) {
            setError('Account created! Please check your email to confirm your account.');
            setLoading(false);
            return;
          }

          // If auto-confirmed, user is logged in
          if (signUpData.user) {
            onSuccess?.(signUpData.user);
            return;
          }
        } else {
          // Other sign in errors
          if (signInError.message.includes('Invalid login credentials')) {
            setError('Wrong email or password. Please try again.');
          } else {
            setError(signInError.message || 'Failed to sign in');
          }
          setLoading(false);
          return;
        }
      }

      // Sign in successful
      if (signInData?.user) {
        onSuccess?.(signInData.user);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <img 
            src="/logo.png" 
            alt="Der Die Das Dash" 
            className="w-32 h-32 mx-auto mb-4 animate-bounce"
            style={{
              filter: 'drop-shadow(0 0 30px rgba(255, 195, 0, 0.3))'
            }}
          />
          <h1 className="text-3xl font-black mb-2">
            <span style={{color: '#21A8FF'}}>der</span>{' '}
            <span style={{color: '#FF0000'}}>die</span>{' '}
            <span style={{color: '#FFC300'}}>das</span>!
          </h1>
          <p className="text-slate-400">Sign in to save your progress</p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/50 border-2 rounded-2xl p-8 backdrop-blur-sm" style={{borderColor: '#00CC00' + '30'}}>
          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 font-bold px-6 py-4 rounded-xl transition-all hover:scale-105 disabled:opacity-50 disabled:scale-100 mb-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-900 text-slate-400">Or continue with email</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailPasswordLogin}>
            <div className="space-y-4">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full bg-slate-800 border-2 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all"
                    style={{borderColor: '#21A8FF' + '50', '--tw-ring-color': '#21A8FF' + '20'}}
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-800 border-2 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all"
                    style={{borderColor: '#21A8FF' + '50', '--tw-ring-color': '#21A8FF' + '20'}}
                    disabled={loading}
                    required
                    minLength={6}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">At least 6 characters</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-900/30 border-2 border-red-500/50 rounded-xl p-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              {/* Continue Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 text-white font-black px-8 py-4 rounded-xl transition-all hover:scale-105 disabled:opacity-50 disabled:scale-100 shadow-lg"
                style={{backgroundImage: 'linear-gradient(to right, #00CC00, #00AA00)'}}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>Continue</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Info */}
        <p className="text-center text-sm text-slate-500 mt-6">
          By continuing, you agree to save your progress and compete on leaderboards.
        </p>
      </div>
    </div>
  );
};

export default Login;
