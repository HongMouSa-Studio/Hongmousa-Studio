/*----- OTP + Google -----*/
import { sendOtp, verifyOtp, loginWithGoogle } from './auth.js'

const emailInput = document.getElementById('login-email')
const otpInput = document.getElementById('login-otp')

/*----- Helper to get current language base path -----*/
function getLangBase() {
  const path = window.location.pathname;
  const parts = path.split('/').filter(p => !!p);
  const lang = (parts.length > 0 && ['tb-hj', 'tb-poj', 'en'].includes(parts[0])) ? parts[0] : 'tb-poj';
  return '/' + lang;
}

// Auto-redirect if already logged in
import { getSession } from './auth.js'
getSession().then(({ data }) => {
  if (data.session) {
    window.location.href = getLangBase() + '/account/'
  }
})


document.getElementById('send-otp-btn')
  ?.addEventListener('click', async (e) => {
    e.preventDefault() // Prevent form submit refresh
    const email = emailInput.value.trim()
    if (!email) return alert('Enter email')

    const { error } = await sendOtp(email)
    if (error) return alert(error.message)

    // Show step 2
    document.getElementById('step-email').classList.add('hidden')
    document.getElementById('step-otp').classList.remove('hidden')
    document.getElementById('otp-message').textContent = "Login code sent! Please check your email inbox."
  })

document.getElementById('verify-otp-btn')
  ?.addEventListener('click', async () => {
    const email = emailInput.value.trim()
    const token = otpInput.value.trim()

    const { error } = await verifyOtp(email, token)
    if (error) return alert(error.message)

    window.location.href = getLangBase() + '/account/'
  })

// Google Login
document.getElementById('google-login')
  ?.addEventListener('click', async () => {
    const { error } = await loginWithGoogle();
    if (error) {
      alert('Google Login Error: ' + error.message);
    }
  })
