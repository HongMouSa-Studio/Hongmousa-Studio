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

    // Load real data from Supabase
    loadAccountData(session.user.id)
  } else {
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
  // Fetch Profile (Points, Name, Phone, Contact Email)
  const { data: profile, error: pError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (profile) {
    if (pointsEl) pointsEl.textContent = profile.points || "0";
    if (displayNameVal) displayNameVal.textContent = profile.display_name || '---';
    if (phoneVal) phoneVal.textContent = profile.phone || '---';
    if (contactEmailVal) contactEmailVal.textContent = profile.contact_email || profile.email || '---';
  }

  // Fetch Address Book
  const { data: addresses, error: aError } = await supabase
    .from('address_book')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false })

  if (addresses && addresses.length > 0) {
    if (addressEmpty) addressEmpty.classList.add('hidden')
    if (addressItemsContainer) {
      addressItemsContainer.innerHTML = addresses.map(item => `
        <div class="address-item">
            <span class="recipient">${item.recipient_name} ${item.is_default ? '<small>(預設)</small>' : ''}</span>
            <span class="addr-text">${item.address}</span>
        </div>
      `).join('')
    }
  }

  // Fetch Orders
  const { data: orders, error: oError } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (orders && orders.length > 0) {
    if (orderListEl) {
      const labels = orderListEl.dataset
      orderListEl.classList.remove('empty-state')
      orderListEl.innerHTML = `
        <div class="order-table-wrapper">
          <table class="order-table">
            <thead>
              <tr>
                <th>${labels.labelId}</th>
                <th>${labels.labelDate}</th>
                <th>${labels.labelTotal}</th>
                <th>${labels.labelStatus}</th>
              </tr>
            </thead>
            <tbody>
              ${orders.map(order => `
                <tr>
                  <td>${order.snipcart_id.substring(0, 8)}...</td>
                  <td>${new Date(order.created_at).toLocaleDateString()}</td>
                  <td>${labels.currencyFormat.replace('%v', order.total_price)}</td>
                  <td><span class="status-pill ${order.status.toLowerCase()}">${order.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `
    }
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
  const user = (await supabase.auth.getUser()).data.user
  if (!user) return

  const newName = editNameInput.value
  const newPhone = editPhoneInput.value
  const newEmail = editContactEmailInput.value

  const { error } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      display_name: newName,
      phone: newPhone,
      contact_email: newEmail,
      updated_at: new Date().toISOString()
    })

  if (!error) {
    displayNameVal.textContent = newName || '---'
    phoneVal.textContent = newPhone || '---'
    contactEmailVal.textContent = newEmail || '---'

    profileView.classList.remove('hidden')
    profileEdit.classList.add('hidden')
  } else {
    alert('Error updating profile: ' + error.message)
  }
})

// 4. Address Book Actions
addAddressBtn?.addEventListener('click', () => {
  alert('Address Book Management coming soon! 我哋將會支援新增、修改同刪除多個收件地址。')
})
