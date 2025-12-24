/*----- OTP + Google -----*/
import { sendOtp, verifyOtp, loginWithGoogle } from './auth.js'

const emailInput = document.getElementById('login-email')
const otpInput = document.getElementById('login-otp')

// Auto-redirect if already logged in
import { getSession } from './auth.js'
getSession().then(({ data }) => {
  if (data.session) {
    window.location.href = '/account/'
  }
})


document.getElementById('send-otp-btn')
  ?.addEventListener('click', async () => {
    const email = emailInput.value.trim()
    if (!email) return alert('Enter email')

    const { error } = await sendOtp(email)
    if (error) return alert(error.message)

    document.getElementById('step-email').classList.add('hidden')
    document.getElementById('step-otp').classList.remove('hidden')
  })

document.getElementById('verify-otp-btn')
  ?.addEventListener('click', async () => {
    const email = emailInput.value.trim()
    const token = otpInput.value.trim()

    const { error } = await verifyOtp(email, token)
    if (error) return alert(error.message)

    window.location.href = '/account/'
  })

// Fix: HTML id is 'google-login', but JS was selecting 'login-google-btn'
document.getElementById('google-login')
  ?.addEventListener('click', async () => {
    console.log('Google login clicked');
    const { error } = await loginWithGoogle();
    if (error) {
      console.error('Google login error:', error);
      alert('Google Login Error: ' + error.message);
    }
  })


/*----- Hun-pia̍t Register kap Login -----*/
const isRegister = window.location.pathname.startsWith('/register')

if (isRegister) {
  // register flow (Í-āu chiah siá)
} else {
  // login flow
}
