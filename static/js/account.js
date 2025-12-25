/*------ account page ------*/
import { supabase, getLangBase } from './auth.js'

// Elements - View
const emailEl = document.getElementById('account-email')
const pointsEl = document.getElementById('member-points')
const orderListEl = document.getElementById('order-list')
const displayNameVal = document.getElementById('display-name-val')
const phoneVal = document.getElementById('phone-val')
const contactEmailVal = document.getElementById('contact-email-val')
const addressItemsContainer = document.getElementById('address-items-container')
const addressEmpty = document.getElementById('address-empty')

// Elements - Edit Profile
const profileView = document.getElementById('profile-view')
const profileEdit = document.getElementById('profile-edit')
const editNameInput = document.getElementById('edit-name')
const editPhoneInput = document.getElementById('edit-phone')
const editContactEmailInput = document.getElementById('edit-contact-email')

// Buttons
const editProfileBtn = document.getElementById('edit-profile-btn')
const saveProfileBtn = document.getElementById('save-profile-btn')
const cancelEditBtn = document.getElementById('cancel-edit-btn')
const addAddressBtn = document.getElementById('add-address-btn')

// 1. Listen for Auth State
supabase.auth.onAuthStateChange(async (event, session) => {
  if (session) {
    document.body.classList.add('is-auth')
    if (emailEl) emailEl.textContent = session.user.email

    // Load dynamic data
    loadAccountData(session.user.id)
  } else {
    // If no session and specifically on account page, redirect
    if (window.location.pathname.includes('/account/')) {
      setTimeout(() => {
        if (!window.localStorage.getItem('supabase.auth.token')) {
          window.location.href = getLangBase() + '/login/';
        }
      }, 1000);
    }
  }
})

// 2. Fetch/Load Data
async function loadAccountData(userId) {
  // Mocking points
  if (pointsEl) pointsEl.textContent = "120";

  // Mocking Address Book
  const mockAddresses = [
    { name: 'Khó-lo-lân (Caroline)', addr: 'Tâi-pak-chhī Sìn-gī-khu...' },
    { name: 'A-it', addr: 'Ko-hiông-chhī Chó-êng-khu...' }
  ]

  if (addressItemsContainer && mockAddresses.length > 0) {
    if (addressEmpty) addressEmpty.classList.add('hidden')
    addressItemsContainer.innerHTML = mockAddresses.map(item => `
        <div class="address-item">
            <span class="recipient">${item.name}</span>
            <span class="addr-text">${item.addr}</span>
        </div>
      `).join('')
  }
}

// 3. Profile Edit Toggle
editProfileBtn?.addEventListener('click', () => {
  editNameInput.value = displayNameVal.textContent === '---' ? '' : displayNameVal.textContent
  editPhoneInput.value = phoneVal.textContent === '---' ? '' : phoneVal.textContent
  editContactEmailInput.value = contactEmailVal.textContent === '---' ? '' : contactEmailVal.textContent

  profileView.classList.add('hidden')
  profileEdit.classList.remove('hidden')
})

cancelEditBtn?.addEventListener('click', () => {
  profileView.classList.remove('hidden')
  profileEdit.classList.add('hidden')
})

saveProfileBtn?.addEventListener('click', async () => {
  const newName = editNameInput.value
  const newPhone = editPhoneInput.value
  const newEmail = editContactEmailInput.value

  // Update UI (Optimistic)
  displayNameVal.textContent = newName || '---'
  phoneVal.textContent = newPhone || '---'
  contactEmailVal.textContent = newEmail || '---'

  profileView.classList.remove('hidden')
  profileEdit.classList.add('hidden')
})

// 4. Address Book Actions
addAddressBtn?.addEventListener('click', () => {
  alert('Address Book Management coming soon!')
})
