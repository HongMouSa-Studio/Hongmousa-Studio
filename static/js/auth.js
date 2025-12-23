console.log('auth.js loaded')

import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const supabase = createClient(
  'https://suxxspkxmpbxzvwdfdun.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1eHhzcGt4bXBieHp2d2RmZHVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1MDY1MjUsImV4cCI6MjA4MjA4MjUyNX0.jmkDz9wodOGTqXgeZ11fqurNDkKs9vJoosyyIkI9S7E'
)

window.addEventListener('DOMContentLoaded', async () => {
  const loginBtn = document.getElementById('login-btn')
  const logoutBtn = document.getElementById('logout-btn')

  // ===== login =====
  loginBtn?.addEventListener('click', async () => {
    const email = prompt('Enter your email')
    if (!email) return

    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) alert(error.message)
    else alert('Check your email!')
  })

  // ===== logout =====
  logoutBtn?.addEventListener('click', async () => {
    await supabase.auth.signOut()
    location.reload()
  })

  // ===== session =====
  const { data: { session } } = await supabase.auth.getSession()
  if (session) {
    document.body.classList.add('is-auth')
  }
})
