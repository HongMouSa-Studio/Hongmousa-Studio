/*----- OTP + Google -----*/
import { sendOtp, verifyOtp, loginWithGoogle, getLangBase } from './auth.js'

const emailInput = document.getElementById('login-email')
const otpInput = document.getElementById('login-otp')
const msgEl = document.getElementById('otp-message')

// Helper function to translate Supabase errors
function translateError(errorMsg) {
  if (!errorMsg) return msgEl?.getAttribute('data-error-generic');

  const msg = errorMsg.toLowerCase();
  if (msg.includes('security') || msg.includes('seconds')) {
    return msgEl?.getAttribute('data-error-rate-limit');
  }
  if (msg.includes('invalid') || msg.includes('expired')) {
    return msgEl?.getAttribute('data-error-invalid-otp');
  }
  return msgEl?.getAttribute('data-error-generic') || errorMsg;
}

// Auto-redirect if already logged in
import { getSession } from './auth.js'
getSession().then(({ data }) => {
  if (data.session) {
    window.location.href = getLangBase() + '/'
  }
})


document.getElementById('send-otp-btn')
  ?.addEventListener('click', async (e) => {
    e.preventDefault() // Prevent form submit refresh
    const email = emailInput.value.trim()
    if (!email) {
      return alert(msgEl?.getAttribute('data-alert-enter-email') || 'Enter email');
    }

    const { error } = await sendOtp(email)
    if (error) return alert(translateError(error.message))

    // Show step 2
    document.getElementById('step-email').classList.add('hidden')
    document.getElementById('step-otp').classList.remove('hidden')

    // Get i18n message from data attribute
    if (msgEl) {
      msgEl.textContent = msgEl.getAttribute('data-success-msg') || "Check your inbox!"
    }
  })

document.getElementById('verify-otp-btn')
  ?.addEventListener('click', async () => {
    const email = emailInput.value.trim()
    const token = otpInput.value.trim()

    const { error } = await verifyOtp(email, token)
    if (error) return alert(translateError(error.message))

    window.location.href = getLangBase() + '/'
  })

// Google Login
document.getElementById('google-login')
  ?.addEventListener('click', async () => {
    const { error } = await loginWithGoogle();
    if (error) {
      alert(translateError(error.message));
    }
  })
