/*------ account page ------*/
import { supabase, getLangBase } from './auth.js'

// Elements - View
const emailEl = document.getElementById('account-email')
const pointsEl = document.getElementById('member-points')
const orderListEl = document.getElementById('order-list')
const displayNameVal = document.getElementById('display-name-val')
const phoneVal = document.getElementById('phone-val')
const addressVal = document.getElementById('address-val')

// Elements - Edit
const profileView = document.getElementById('profile-view')
const profileEdit = document.getElementById('profile-edit')
const editNameInput = document.getElementById('edit-name')
const editPhoneInput = document.getElementById('edit-phone')
const editAddressInput = document.getElementById('edit-address')

// Buttons
const editBtn = document.getElementById('edit-profile-btn')
const saveBtn = document.getElementById('save-profile-btn')
const cancelBtn = document.getElementById('cancel-edit-btn')

// 1. Listen for Auth State
supabase.auth.onAuthStateChange(async (event, session) => {
  if (session) {
    document.body.classList.add('is-auth')
    if (emailEl) emailEl.textContent = session.user.email

    // Load dynamic data
    loadAccountData(session.user.id)
  } else {
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

  // TODO: Fetch real profile from Supabase 'profiles' table
  // const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
  // if (data) {
  //    displayNameVal.textContent = data.display_name || '---'
  //    phoneVal.textContent = data.phone || '---'
  //    addressVal.textContent = data.address || '---'
  // }

  // For now, use local storage or just keep placeholders
}

// 3. Profile Edit Toggle
editBtn?.addEventListener('click', () => {
  editNameInput.value = displayNameVal.textContent === '---' ? '' : displayNameVal.textContent
  editPhoneInput.value = phoneVal.textContent === '---' ? '' : phoneVal.textContent
  editAddressInput.value = addressVal.textContent === '---' ? '' : addressVal.textContent

  profileView.classList.add('hidden')
  profileEdit.classList.remove('hidden')
})

cancelBtn?.addEventListener('click', () => {
  profileView.classList.remove('hidden')
  profileEdit.classList.add('hidden')
})

saveBtn?.addEventListener('click', async () => {
  const newName = editNameInput.value
  const newPhone = editPhoneInput.value
  const newAddress = editAddressInput.value

  // TODO: Update Supabase 'profiles' table
  // const { error } = await supabase.from('profiles').upsert({ 
  //    id: (await supabase.auth.getUser()).data.user.id,
  //    display_name: newName,
  //    phone: newPhone,
  //    address: newAddress
  // })

  // Update UI immediately (Optimistic update)
  displayNameVal.textContent = newName || '---'
  phoneVal.textContent = newPhone || '---'
  addressVal.textContent = newAddress || '---'

  profileView.classList.remove('hidden')
  profileEdit.classList.add('hidden')
})
