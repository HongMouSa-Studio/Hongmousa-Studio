
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
        "empty": "Lí ê kò͘-bu̍t-chhia sī khang--ê.",
        "subtotal": "Sió-kè"
      },
      "header": {
        "title": "Kò͘-bu̍t-chhia"
      },
      "shipping": {
        "title": "Siu-kiāⁿ",
        "address": "Siu-kiāⁿ tē-chí",
        "methods": "Ūn-sàng hong-sek"
      },
      "payment": {
        "title": "Kiat-siàu",
        "type": "Pe̍h-khoan hong-sek"
      },
      "billing": {
        "title": "Siàu-toaⁿ"
      },
      "customer_inputs": {
        "phone": "Tiān-ōe",
        "email": "Tiān-chú-phoe-tháng",
        "name": "Miâ-sèⁿ"
      },
      "actions": {
        "continue_to_shipping": "Khì siu-kiāⁿ",
        "continue_to_payment": "Khì kiat-siàu",
        "place_order": "Lo̍h-toaⁿ"
      }
    };

    const hjTranslations = {
      "cart": {
        "title": "購物車",
        "checkout": "來去結賬",
        "empty": "汝兮購物車是空兮。",
        "subtotal": "小計"
      },
      "header": {
        "title": "購物車"
      },
      "shipping": {
        "title": "收件",
        "address": "收件地址",
        "methods": "運送方式"
      },
      "payment": {
        "title": "結賬",
        "type": "付款方式"
      },
      "billing": {
        "title": "賬單"
      },
      "customer_inputs": {
        "phone": "電話",
        "email": "電子批桶",
        "name": "名姓"
      },
      "actions": {
        "continue_to_shipping": "去收件",
        "continue_to_payment": "去結賬",
        "place_order": "落單"
      }
    };

    // 2. Apply based on current language
    const path = window.location.pathname;
    if (path.includes('/tb-poj/')) {
      Snipcart.api.session.setLanguage('en', pojTranslations);
    } else if (path.includes('/tb-hj/')) {
      Snipcart.api.session.setLanguage('zh-TW', hjTranslations);
    }

    // 3. Sync Address Book from Supabase
    syncAddressWithSnipcart();

    // 4. Cart Toggle Logic
    setupCartToggle();
  }

  function setupCartToggle() {
    const cartBtn = document.querySelector('.snipcart-checkout');
    if (!cartBtn) return;

    cartBtn.addEventListener('click', (e) => {
      const isVisible = document.querySelector('.snipcart-modal__container');
      if (isVisible) {
        Snipcart.api.theme.cart.close();
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    });
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
