
(function () {
  function initSnipcart() {
    if (typeof Snipcart === 'undefined') {
      document.addEventListener('snipcart.ready', initSnipcart);
      return;
    }

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
        "title": "Siu-kiāⁿ",
        "address": "Siu-kiāⁿ tē-chí"
      },
      "payment": {
        "title": "Kiat-siàu"
      },
      "billing": {
        "title": "Siàu-toaⁿ"
      }
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
    // Check URL path for language
    const path = window.location.pathname;
    if (path.includes('/tb-poj/')) {
      Snipcart.api.session.setLanguage('en', pojTranslations);
    } else if (path.includes('/tb-hj/')) {
      Snipcart.api.session.setLanguage('zh-TW', hjTranslations);
    }

    // 3. Sync Address Book from Supabase
    syncAddressWithSnipcart();
  }

  async function syncAddressWithSnipcart() {
    if (!window.supabase) return;
    const { data: { session } } = await window.supabase.auth.getSession();
    if (!session) return;

    const { data: address } = await window.supabase
      .from('address_book')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('is_default', true)
      .maybeSingle();

    if (address) {
      Snipcart.api.cart.setShippingAddress({
        name: address.recipient_name,
        address1: address.address,
        country: 'TW',
        city: 'Taiwan',
        province: 'TW',
        postalCode: '000'
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSnipcart);
  } else {
    initSnipcart();
  }
})();
