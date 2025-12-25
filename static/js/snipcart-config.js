
document.addEventListener('snipcart.ready', () => {
  // 1. Define custom translations
  const pojTranslations = {
    "cart": {
      "title": "Kò͘-bu̍t-chhia",
      "checkout": "Lâi-khì kiat-siàu",
      "empty": "Lí ê kò͘-bu̍t-chhia sī khang--ê."
    },
    "header": {
      "title": "Kò͘-bu̍t-chhia"
    },
    "shipping": {
      "title": "Ūn-sàng",
      "address": "Siu-kiāⁿ tē-chí"
    },
    "payment": {
      "title": "Kiat-siàu"
    },
    "billing": {
      "title": "Siàu-toaⁿ"
    }
    // We can add more strings here as needed
  };

  const hjTranslations = {
    "cart": {
      "title": "購物車",
      "checkout": "來去結賬",
      "empty": "汝兮購物車是空兮。"
    },
    "header": {
      "title": "購物車"
    },
    "shipping": {
      "title": "運送",
      "address": "收件地址"
    }
  };

  // 2. Apply based on current language
  const currentLang = document.documentElement.lang; // Should be 'en' (POJ) or 'zh-TW' (HJ)

  if (window.location.pathname.includes('/tb-poj/')) {
    Snipcart.api.session.setLanguage('en', pojTranslations);
  } else if (window.location.pathname.includes('/tb-hj/')) {
    Snipcart.api.session.setLanguage('zh-TW', hjTranslations);
  }

  // 3. Sync Address Book from Supabase (Integration)
  syncAddressWithSnipcart();
});

async function syncAddressWithSnipcart() {
  // Use the globalAuth.js to check if logged in
  if (!window.supabase) return;

  const { data: { session } } = await window.supabase.auth.getSession();
  if (!session) return;

  // Fetch default address
  const { data: addresses, error } = await window.supabase
    .from('address_book')
    .select('*')
    .eq('user_id', session.user.id)
    .eq('is_default', true)
    .single();

  if (addresses && !error) {
    console.log('Syncing saved address to Snipcart...');
    // Push to Snipcart
    Snipcart.api.cart.setShippingAddress({
      name: addresses.recipient_name,
      address1: addresses.address,
      country: 'TW',
      city: '--', // Snipcart requires city/country usually
      province: '--',
      postalCode: '000'
    });
  }
}
