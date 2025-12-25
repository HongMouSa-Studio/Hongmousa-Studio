/* ---------- Supabase Client ---------- */
import { createClient } from 'https://esm.sh/@supabase/supabase-js'

export const supabase = createClient(
  'https://suxxspkxmpbxzvwdfdun.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1eHhzcGt4bXBieHp2d2RmZHVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1MDY1MjUsImV4cCI6MjA4MjA4MjUyNX0.jmkDz9wodOGTqXgeZ11fqurNDkKs9vJoosyyIkI9S7E'
)

/* ---------- Helper to get current language base path ---------- */
export function getLangBase() {
  const path = window.location.pathname;
  const parts = path.split('/').filter(p => !!p);
  const lang = (parts.length > 0 && ['tb-hj', 'tb-poj', 'en'].includes(parts[0])) ? parts[0] : 'tb-poj';
  return '/' + lang;
}

/* ---------- OTP ---------- */
export async function sendOtp(email) {
  const langBase = getLangBase();
  return await supabase.auth.signInWithOtp({
    email,
    options: {
      // Redirect to home after magic link
      emailRedirectTo: window.location.origin + langBase + '/'
    }
  })
}

export async function verifyOtp(email, token) {
  // 1. Try 'email' (standard for existing users)
  let result = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email'
  })

  // 2. If it fails (likely a NEW user), try 'signup' type
  if (result.error && (result.error.message.includes('expired') || result.error.message.includes('invalid'))) {
    console.log('OTP (email) failed, trying (signup) type for new user...');
    const signupResult = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'signup'
    })
    if (!signupResult.error) return signupResult;

    // 3. Fallback to magiclink type just in case
    const mlResult = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'magiclink'
    })
    if (!mlResult.error) return mlResult;
  }

  return result
}

/* ---------- Google ---------- */
export async function loginWithGoogle() {
  const langBase = getLangBase();
  return await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + langBase + '/'
    }
  })
}

/* ---------- Logout ---------- */
export async function logout() {
  return await supabase.auth.signOut()
}

/* ---------- Session ---------- */
export async function getSession() {
  return await supabase.auth.getSession()
}