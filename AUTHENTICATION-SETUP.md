# Authentication Setup Guide

## Overview
This app now uses Supabase Auth with both Google OAuth and Email/Password authentication.

## Files Created/Modified

### New Files:
1. **src/App.jsx** - Main app wrapper that handles authentication routing
2. **src/components/Login.jsx** - Login component with Google OAuth and Email/Password
3. **src/components/AuthCallback.jsx** - Handles OAuth callback redirects
4. **src/lib/auth.js** - Authentication helper functions
5. **src/lib/scores.js** - Best score management functions
6. **supabase-auth-schema.sql** - Database schema for scores table

### Modified Files:
1. **src/lib/supabase.js** - Updated to support auth with session persistence
2. **src/main.jsx** - Updated to use App.jsx instead of app.jsx directly
3. **src/app.jsx** - Needs to be updated to accept `authUser` and `onLogout` props

## Environment Variables Required

Add these to your `.env.local` file (or Vercel environment variables):

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Supabase Setup Steps

### 1. Enable Authentication in Supabase
- Go to your Supabase project dashboard
- Navigate to Authentication > Providers
- Enable **Email** provider
- Enable **Google** provider and configure OAuth credentials

### 2. Set up Google OAuth (for Google login)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Go to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth 2.0 Client ID"
5. Configure authorized redirect URIs:
   - Add: `https://your-project-id.supabase.co/auth/v1/callback`
6. Copy Client ID and Client Secret
7. Add them to Supabase Dashboard > Authentication > Providers > Google

### 3. Run SQL Schema
1. Go to Supabase Dashboard > SQL Editor
2. Copy and paste the entire contents of `supabase-auth-schema.sql`
3. Run the query
4. Verify tables and policies are created

### 4. Configure Site URL
- Go to Authentication > URL Configuration
- Set Site URL to your production URL (e.g., `https://your-domain.com`)
- Add redirect URLs:
  - `http://localhost:5173/auth/callback` (for local dev)
  - `https://your-domain.com/auth/callback` (for production)

## How It Works

### Authentication Flow:
1. User visits app → **App.jsx** checks for auth session
2. If not authenticated → Shows **Login.jsx**
3. User can:
   - Click "Continue with Google" → Redirects to Google OAuth
   - Enter email/password → Tries sign in, falls back to sign up
4. OAuth callback → **AuthCallback.jsx** handles redirect
5. On success → User redirected to main game (**app.jsx**)

### Score Saving:
- Best scores are saved to `scores` table
- Only increases if new score > current best
- Uses `upsert_best_score()` function for atomic updates
- RLS policies ensure users can only access their own scores

## Next Steps for app.jsx Integration

The main game file (`src/app.jsx`) needs to be updated to:

1. Accept `authUser` and `onLogout` props:
```javascript
const DerDiedasDash = ({ authUser, onLogout }) => {
```

2. Load best score on mount:
```javascript
useEffect(() => {
  if (authUser?.id) {
    const loadScore = async () => {
      const score = await getBestScore(authUser.id);
      setBestScore(score);
    };
    loadScore();
  }
}, [authUser]);
```

3. Save best score after race:
```javascript
const finishRace = async () => {
  // ... existing code ...
  if (authUser?.id) {
    await upsertBestScore(authUser.id, score);
  }
};
```

4. Add logout button to welcome screen (optional)

## Testing

1. **Local Development:**
   - Make sure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
   - Run `npm run dev`
   - Test email/password signup
   - Test email/password sign in
   - Test Google OAuth (may need to add localhost redirect URL)

2. **Production:**
   - Set environment variables in Vercel
   - Update redirect URLs in Supabase
   - Test all auth flows

## Troubleshooting

- **"Authentication is not configured"** → Check env vars are set
- **OAuth redirect fails** → Check redirect URL in Supabase matches your site
- **Scores not saving** → Check RLS policies are enabled and correct
- **Session not persisting** → Check Supabase client config in `lib/supabase.js`
