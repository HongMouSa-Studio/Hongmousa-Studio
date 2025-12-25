/*------ account page ------*/
import { getSession, logout, getLangBase } from './auth.js'

const emailEl = document.getElementById('account-email')
const logoutBtn = document.getElementById('logout-btn')

// 1. Check Session
const { data } = await getSession()

if (!data.session) {
  // Bô session -> redirect to login
  window.location.href = getLangBase() + '/login/';
} else {
  // Ū session -> Show UI
  document.body.classList.add('is-auth')
  if (emailEl) emailEl.textContent = data.session.user.email
}

// 2. Logout Logic
logoutBtn?.addEventListener('click', async () => {
  const { error } = await logout()
  if (error) alert(error.message)

  // Logout -> stay on homepage of current language
  window.location.href = getLangBase() + '/'
})
