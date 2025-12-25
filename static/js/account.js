/*------ account page ------*/
import { supabase, getLangBase } from './auth.js'

const emailEl = document.getElementById('account-email')
const pointsEl = document.getElementById('member-points')
const orderListEl = document.getElementById('order-list')

// 1. Listen for Auth State
supabase.auth.onAuthStateChange(async (event, session) => {
  if (session) {
    // User is logged in
    document.body.classList.add('is-auth')
    if (emailEl) emailEl.textContent = session.user.email

    // Load dynamic data (Mock for now)
    loadAccountData(session.user.id)
  } else {
    // No session -> redirect to login if we are still on account page
    // We wait a tiny bit to avoid flashing or race conditions on initial load
    setTimeout(() => {
      if (!window.localStorage.getItem('supabase.auth.token')) {
        window.location.href = getLangBase() + '/login/';
      }
    }, 1000);
  }
})

// 2. Fetch/Load Data
async function loadAccountData(userId) {
  // Mocking points (In future, fetch from 'profiles' table)
  if (pointsEl) pointsEl.textContent = "120";

  // Mocking orders (In future, fetch from 'orders' table)
  if (orderListEl) {
    // If there are orders, we would populate the list here.
    // For now, it stays as the default "No orders found" from HTML.
  }
}

// 3. Logout (Already handled in global-auth.js generally, but we keep local if needed)
// Actually, global-auth.js handles #logout-btn clicks. 
// We are good.
