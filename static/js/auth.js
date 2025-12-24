import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const supabase = createClient(
  'https://suxxspkxmpbxzvwdfdun.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1eHhzcGt4bXBieHp2d2RmZHVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1MDY1MjUsImV4cCI6MjA4MjA4MjUyNX0.jmkDz9wodOGTqXgeZ11fqurNDkKs9vJoosyyIkI9S7E'
)

window.addEventListener('DOMContentLoaded', async () => {

  const loginBtn = document.getElementById('login-btn')
  const logoutBtn = document.getElementById('logout-btn')
  const memberEmail = document.querySelector('.member-email')
  const memberDropdown = document.querySelector('.member-dropdown')
  const memberToggle = memberDropdown?.querySelector('.member-toggle')

  /* ---------- login ---------- */
  loginBtn?.addEventListener('click', async () => {
    const email = prompt('Enter your email')
    if (!email) return

    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) alert(error.message)
    else alert('Check your email to log in!')
  })

  /* ---------- dropdown ---------- */
  memberToggle?.addEventListener('click', (e) => {
    e.stopPropagation()
    memberDropdown.classList.toggle('open')
  })

  document.addEventListener('click', () => {
    memberDropdown?.classList.remove('open')
  })

  /* ---------- logout ---------- */
  logoutBtn?.addEventListener('click', async () => {
    await supabase.auth.signOut()
    document.body.classList.remove('is-auth')
  })

  /* ---------- initial session ---------- */
  const { data } = await supabase.auth.getSession()
  if (data.session) {
    document.body.classList.add('is-auth')
    memberEmail.textContent = data.session.user.email
  }

  /* ---------- auth change ---------- */
  supabase.auth.onAuthStateChange((_event, session) => {
    if (session) {
      document.body.classList.add('is-auth')
      memberEmail.textContent = session.user.email
    } else {
      document.body.classList.remove('is-auth')
      memberEmail.textContent = ''
    }
  })
})
