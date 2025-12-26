/*------ account page ------*/
import { supabase, getLangBase } from './auth.js'
import { initECPayCVS } from './ecpay-cvs.js'

// Initialize ECPay CVS Picker (configure with your credentials)
const cvsPicker = initECPayCVS({
  merchantID: '3408671',
  serverEndpoint: 'https://suxxspkxmpbxzvwdfdun.supabase.co/functions/v1/ecpay-cvs',
  isTestMode: true // Khai-hoat sî iōng true, chèng-sek khoân-kéng kái-chò false
});

// Get i18n strings from data attributes
function getI18n(key) {
  const container = document.querySelector('[data-i18n-modal-title-add]');
  if (!container) return key;
  return container.dataset[`i18n${key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}`] || key;
}

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
const closeProfileModalBtn = document.getElementById('close-profile-modal')
const addAddressBtn = document.getElementById('add-address-btn')

// Elements - Profile Modal
const profileModal = document.getElementById('profile-modal')

// Elements - Address Modal
const addressModal = document.getElementById('address-modal')
const modalTitle = document.getElementById('modal-title')
const addressIdInput = document.getElementById('edit-address-id')
const addressNameInput = document.getElementById('address-name')
const addressPhoneInput = document.getElementById('address-phone')
const addressPostalInput = document.getElementById('address-postal')
const addressValInput = document.getElementById('address-val')
const addressCvsInput = document.getElementById('address-cvs')
const addressDefaultInput = document.getElementById('address-default')
const saveAddressBtn = document.getElementById('save-address-btn')
const closeAddressModalBtn = document.getElementById('close-address-modal')

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
    .maybeSingle()

  if (profile) {
    if (pointsEl) pointsEl.textContent = profile.points || "0";
    if (displayNameVal) displayNameVal.textContent = profile.display_name || '---';
    if (phoneVal) phoneVal.textContent = profile.phone || '---';
    if (contactEmailVal) contactEmailVal.textContent = profile.contact_email || profile.email || '---';
  }

  // Fetch Address Book
  renderAddresses(userId)

  // Fetch Orders
  renderOrders(userId)
}

async function renderAddresses(userId) {
  const { data: addresses, error: aError } = await supabase
    .from('address_book')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false })

  // Get i18n strings from HTML
  const deliveryMailLabel = document.querySelector('[data-i18n-delivery-mail]')?.dataset.i18nDeliveryMail || 'Mail Delivery';
  const deliveryCvsLabel = document.querySelector('[data-i18n-delivery-cvs]')?.dataset.i18nDeliveryCvs || 'CVS Pickup';
  const confirmDeleteMsg = document.querySelector('[data-i18n-confirm-delete]')?.dataset.i18nConfirmDelete || 'Are you sure?';
  const defaultLabel = document.querySelector('[data-i18n-default]')?.dataset.i18nDefault || 'Default';
  const editLabel = document.querySelector('[data-i18n-edit]')?.dataset.i18nEdit || 'Edit';
  const deleteLabel = document.querySelector('[data-i18n-delete]')?.dataset.i18nDelete || 'Delete';

  if (addresses && addresses.length > 0) {
    if (addressEmpty) addressEmpty.classList.add('hidden')
    if (addressItemsContainer) {
      addressItemsContainer.innerHTML = addresses.map(item => {
        // Determine delivery method
        const hasCVS = item.cvs_store;
        const hasAddress = item.address;
        const deliveryMethod = hasCVS ? deliveryCvsLabel : (hasAddress ? deliveryMailLabel : '-');

        // Build address lines
        const addressLine = hasAddress ? `${item.postal_code || ''} ${item.address || ''}`.trim() : '';
        const cvsLine = hasCVS ? item.cvs_store : '';
        const phoneLine = item.phone || '';

        return `
          <div class="address-item" data-id="${item.id}">
              <div class="address-main">
                <span class="recipient">${item.recipient_name} ${item.is_default ? '<small style="color: #10b981;">(' + defaultLabel + ')</small>' : ''}</span>
                <span class="delivery-method" style="font-size: 0.85rem; color: #6b7280; margin-left: 0.5rem;">${deliveryMethod}</span>
              </div>
              <div class="address-details" style="font-size: 0.9rem; color: #555; line-height: 1.6; margin: 0.5rem 0;">
                ${phoneLine ? `<div style="color: #888;"><i class="fa-solid fa-phone" style="width: 1rem; margin-right: 0.4rem; font-size: 0.75rem;"></i>${phoneLine}</div>` : ''}
                ${addressLine ? `<div><i class="fa-solid fa-location-dot" style="width: 1rem; margin-right: 0.4rem; font-size: 0.75rem; color: #888;"></i>${addressLine}</div>` : ''}
                ${cvsLine ? `<div><i class="fa-solid fa-store" style="width: 1rem; margin-right: 0.4rem; font-size: 0.75rem; color: #888;"></i>${cvsLine}</div>` : ''}
              </div>
              <div class="address-actions">
                <button class="edit-addr-btn" data-id="${item.id}">${editLabel}</button>
                <button class="delete-addr-btn" data-id="${item.id}" data-confirm="${confirmDeleteMsg}" style="color: #ef4444;">${deleteLabel}</button>
              </div>
          </div>
        `;
      }).join('')

      // Attach listeners
      document.querySelectorAll('.edit-addr-btn').forEach(btn => {
        btn.addEventListener('click', () => openAddressModal(addresses.find(a => a.id === btn.dataset.id)))
      })
      document.querySelectorAll('.delete-addr-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          if (confirm(btn.dataset.confirm || 'Are you sure?')) {
            deleteAddress(btn.dataset.id);
          }
        })
      })
    }
  } else {
    if (addressEmpty) addressEmpty.classList.remove('hidden')
    if (addressItemsContainer) addressItemsContainer.innerHTML = ''
  }
}

async function renderOrders(userId) {
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

// 3. Profile Edit Modal
editProfileBtn?.addEventListener('click', () => {
  editNameInput.value = displayNameVal.textContent === '---' ? '' : displayNameVal.textContent
  editPhoneInput.value = phoneVal.textContent === '---' ? '' : phoneVal.textContent
  editContactEmailInput.value = contactEmailVal.textContent === '---' ? '' : contactEmailVal.textContent
  profileModal.classList.remove('hidden')
})

closeProfileModalBtn?.addEventListener('click', () => {
  profileModal.classList.add('hidden')
})

// Close profile modal on ESC or click outside
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !profileModal.classList.contains('hidden')) {
    profileModal.classList.add('hidden')
  }
})
profileModal?.addEventListener('click', (e) => {
  if (e.target === profileModal) {
    profileModal.classList.add('hidden')
  }
})

saveProfileBtn?.addEventListener('click', async () => {
  const { data: { user } } = await supabase.auth.getUser()
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
    profileModal.classList.add('hidden')
  } else {
    alert('Error: ' + error.message)
  }
})

// 4. Address Book Logic
let isFormDirty = false;
let initialFormState = {};

function captureInitialState() {
  initialFormState = {
    name: addressNameInput.value,
    phone: addressPhoneInput.value,
    postal: addressPostalInput.value,
    address: addressValInput.value,
    cvs: addressCvsInput.value,
    isDefault: addressDefaultInput.checked
  };
  isFormDirty = false;
}

function checkFormDirty() {
  if (!addressModal.classList.contains('hidden')) {
    const currentState = {
      name: addressNameInput.value,
      phone: addressPhoneInput.value,
      postal: addressPostalInput.value,
      address: addressValInput.value,
      cvs: addressCvsInput.value,
      isDefault: addressDefaultInput.checked
    };

    isFormDirty = JSON.stringify(initialFormState) !== JSON.stringify(currentState);
  }
}

// Track form changes
[addressNameInput, addressPhoneInput, addressPostalInput, addressValInput, addressCvsInput].forEach(input => {
  input?.addEventListener('input', checkFormDirty);
});
addressDefaultInput?.addEventListener('change', checkFormDirty);

function openAddressModal(address = null) {
  // Get i18n title from HTML data attributes
  const modalContainer = document.getElementById('address-modal');
  const titleAdd = modalContainer?.dataset.titleAdd || 'Add Shipping Information';
  const titleEdit = modalContainer?.dataset.titleEdit || 'Edit Shipping Information';

  if (address) {
    modalTitle.textContent = titleEdit;
    addressIdInput.value = address.id;
    addressNameInput.value = address.recipient_name || '';
    addressPhoneInput.value = address.phone || '';
    addressPostalInput.value = address.postal_code || '';
    addressValInput.value = address.address || '';
    addressCvsInput.value = address.cvs_store || '';
    addressDefaultInput.checked = address.is_default;
  } else {
    modalTitle.textContent = titleAdd;
    addressIdInput.value = '';
    addressNameInput.value = '';
    addressPhoneInput.value = '';
    addressPostalInput.value = '';
    addressValInput.value = '';
    addressCvsInput.value = '';
    addressDefaultInput.checked = false;
  }

  addressModal.classList.remove('hidden');
  captureInitialState();
}

function closeAddressModal() {
  const modalContainer = document.getElementById('address-modal');
  const warningMsg = modalContainer?.dataset.unsavedWarning || 'You have unsaved changes. Are you sure you want to cancel?';

  if (isFormDirty && !confirm(warningMsg)) {
    return;
  }

  addressModal.classList.add('hidden');
  isFormDirty = false;
}

closeAddressModalBtn.addEventListener('click', closeAddressModal);

// ESC key to close
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !addressModal.classList.contains('hidden')) {
    closeAddressModal();
  }
});

// Click outside to close
addressModal.addEventListener('click', (e) => {
  if (e.target === addressModal) {
    closeAddressModal();
  }
});

addAddressBtn?.addEventListener('click', () => openAddressModal());

// CVS Store Picker Integration
const cvsPickerBtn = document.getElementById('cvs-picker-btn');
if (cvsPickerBtn && cvsPicker) {
  cvsPickerBtn.addEventListener('click', async () => {
    try {
      const storeInfo = await cvsPicker.openStoreMap({
        isCollection: 'Y',
        storeType: '01' // Default to 7-11
      });

      // Auto-fill the CVS input with formatted store info
      addressCvsInput.value = cvsPicker.formatStoreInfo(storeInfo);

      // Store the raw store data for later use
      addressCvsInput.dataset.storeId = storeInfo.storeID;
      addressCvsInput.dataset.storeName = storeInfo.storeName;
      addressCvsInput.dataset.storeType = storeInfo.storeType;
    } catch (error) {
      console.error('CVS Picker Error:', error);
      const modalContainer = document.getElementById('address-modal');
      const errorMsg = modalContainer?.dataset.errorCvsPicker || 'Unable to open store selector. Please enter store information manually.';
      alert(errorMsg);
    }
  });
}

saveAddressBtn?.addEventListener('click', async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const id = addressIdInput.value;
  const name = addressNameInput.value;
  const phone = addressPhoneInput.value;
  const postal = addressPostalInput.value;
  const addr = addressValInput.value;
  const cvs = addressCvsInput.value;
  const isDefault = addressDefaultInput.checked;

  // Validation: Must fill name
  if (!name) {
    const modalContainer = document.getElementById('address-modal');
    const errorMsg = modalContainer?.dataset.errorMissingName || 'Please fill in recipient name';
    return alert(errorMsg);
  }

  // Validation: Must choose either (Postal + Address) OR CVS
  const hasAddress = postal && addr;
  const hasCVS = cvs;

  if (!hasAddress && !hasCVS) {
    const modalContainer = document.getElementById('address-modal');
    const errorMsg = modalContainer?.dataset.errorMissingAddressOrCvs || 'Please fill in address OR select CVS pickup';
    return alert(errorMsg);
  }

  // If setting as default, unset others first
  if (isDefault) {
    await supabase.from('address_book').update({ is_default: false }).eq('user_id', user.id);
  }

  const payload = {
    user_id: user.id,
    recipient_name: name,
    phone: phone,
    postal_code: postal,
    address: addr,
    cvs_store: cvs,
    is_default: isDefault
  };

  let res;
  if (id) {
    res = await supabase.from('address_book').update(payload).eq('id', id);
  } else {
    res = await supabase.from('address_book').insert(payload);
  }

  if (res.error) {
    alert('Error saving address: ' + res.error.message + '\n(Make sure your database has the new columns: phone, postal_code, cvs_store)');
  } else {
    addressModal.classList.add('hidden');
    renderAddresses(user.id);
  }
});

async function deleteAddress(id) {
  const { error } = await supabase.from('address_book').delete().eq('id', id);
  if (error) alert(error.message);
  else {
    const { data: { user } } = await supabase.auth.getUser();
    renderAddresses(user.id);
  }
}
