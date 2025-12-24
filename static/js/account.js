/*------ account page ------*/
import { getSession, logout } from './auth.js'

const emailEl = document.getElementById('account-email')
const logoutBtn = document.getElementById('logout-btn')

// 1. Check Session
const { data } = await getSession()

if (!data.session) {
  // Bô session -> Tī 1 bjo chìn-chêng (UX) ut khì login
  // Lâi-goân language prefix
  const path = window.location.pathname;
  const parts = path.split('/').filter(p => p);
  const lang = (parts.length > 0 && ['tb-hj', 'tb-poj', 'en'].includes(parts[0])) ? '/' + parts[0] : '';

  window.location.href = lang + '/login/';
} else {
  // Ū session -> Show UI
  document.body.classList.add('is-auth')
  if (emailEl) emailEl.textContent = data.session.user.email
}

// 2. Logout Logic
logoutBtn?.addEventListener('click', async () => {
  const { error } = await logout()
  if (error) alert(error.message)

  // Logout liáu-āu tò-tńg khì Home
  const path = window.location.pathname;
  const parts = path.split('/').filter(p => p);
  const lang = (parts.length > 0 && ['tb-hj', 'tb-poj', 'en'].includes(parts[0])) ? '/' + parts[0] + '/' : '/';

  window.location.href = lang
})
