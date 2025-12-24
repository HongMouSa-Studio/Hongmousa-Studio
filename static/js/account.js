/*------ account page ------*/
import { getSession, logout } from './auth.js'

const emailEl = document.getElementById('account-email')
const logoutBtn = document.getElementById('logout-btn')

const { data } = await getSession()

if (!data.session) {
  document.body.classList.remove('is-auth')
} else {
  document.body.classList.add('is-auth')
  emailEl.textContent = data.session.user.email
}

logoutBtn?.addEventListener('click', async () => {
  await logout()
  window.location.href = '/'
})
