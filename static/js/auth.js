/* ---------- Supabase Client ---------- */
import { createClient } from 'https://esm.sh/@supabase/supabase-js'

export const supabase = createClient(
  'https://suxxspkxmpbxzvwdfdun.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1eHhzcGt4bXBieHp2d2RmZHVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1MDY1MjUsImV4cCI6MjA4MjA4MjUyNX0.jmkDz9wodOGTqXgeZ11fqurNDkKs9vJoosyyIkI9S7E'
)

/* ---------- OTP ---------- */
export async function sendOtp(email) {
  return await supabase.auth.signInWithOtp({ email })
}

export async function verifyOtp(email, token) {
  return await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email'
  })
}

/* ---------- Google ---------- */
export async function loginWithGoogle() {
  return await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      // Determine language prefix from current URL
      redirectTo: (function () {
        const path = window.location.pathname;
        const parts = path.split('/').filter(p => p);
        const lang = (parts.length > 0 && ['tb-hj', 'tb-poj', 'en'].includes(parts[0])) ? '/' + parts[0] : '/tb-poj';
        return window.location.origin + lang + '/account/';
      })()
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