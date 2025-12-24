/* body.is-auth (Kui ê bāng-chām teng-ji̍p chōng-thài it-tì) */
import { supabase } from './auth.js'

supabase.auth.onAuthStateChange(async (_event, session) => {
  if (session) {
    document.body.classList.add('is-auth')

    // Update header email
    const emailEls = document.querySelectorAll('.member-email')
    emailEls.forEach(el => {
      el.textContent = session.user.email
    })
  } else {
    document.body.classList.remove('is-auth')
  }
})

// Check initial session
supabase.auth.getSession().then(({ data }) => {
  if (data.session) {
    document.body.classList.add('is-auth')
    const emailEls = document.querySelectorAll('.member-email')
    emailEls.forEach(el => {
      el.textContent = data.session.user.email
    })
  }
})

// Header Logout Button
import { logout } from './auth.js'
document.addEventListener('click', async (e) => {
  if (e.target.matches('#logout-btn, #logout-btn-header, .member-link-logout')) {
    await logout()
    window.location.href = '/'
  }
})
