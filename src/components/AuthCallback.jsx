import React, { useEffect, useState } from 'react';
import { supabase, canUseSupabase } from '../lib/supabase';
import { CheckCircle, XCircle } from 'lucide-react';

const AuthCallback = ({ onSuccess }) => {
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [error, setError] = useState('');

  useEffect(() => {
    const handleAuthCallback = async () => {
      if (!canUseSupabase()) {
        setStatus('error');
        setError('Authentication is not configured');
        return;
      }

      try {
        // Handle OAuth callback
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }

        if (session?.user) {
          setStatus('success');
          // Wait a bit then call onSuccess
          setTimeout(() => {
            onSuccess?.(session.user);
          }, 1000);
        } else {
          // Handle OAuth callback from URL
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const errorParam = hashParams.get('error');
          const errorDescription = hashParams.get('error_description');

          if (errorParam) {
            throw new Error(errorDescription || errorParam);
          }

          // Check if we have auth code in URL
          const code = hashParams.get('access_token') || new URLSearchParams(window.location.search).get('code');
          if (code) {
            // Session should be set automatically by Supabase
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (user && !userError) {
              setStatus('success');
              setTimeout(() => {
                onSuccess?.(user);
              }, 1000);
            } else {
              throw userError || new Error('Failed to get user');
            }
          } else {
            setStatus('error');
            setError('No authentication data found');
          }
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        setStatus('error');
        setError(error.message || 'Authentication failed');
      }
    };

    handleAuthCallback();
  }, [onSuccess]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {status === 'processing' && (
          <>
            <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xl font-bold text-cyan-400">Completing sign in...</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 mx-auto mb-4" style={{color: '#00CC00'}} />
            <p className="text-xl font-bold" style={{color: '#00CC00'}}>Sign in successful!</p>
            <p className="text-slate-400 mt-2">Redirecting...</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <XCircle className="w-16 h-16 mx-auto mb-4" style={{color: '#FF0000'}} />
            <p className="text-xl font-bold text-red-400">Sign in failed</p>
            <p className="text-slate-400 mt-2">{error}</p>
            <button
              onClick={() => window.location.href = '/'}
              className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
            >
              Go to Home
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
