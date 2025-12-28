(function () {
  function initSnipcart() {
    if (typeof Snipcart === 'undefined') {
      document.addEventListener('snipcart.ready', initSnipcart);
      return;
    }

    /**
     * Correct Snipcart v3 Localization Keys
     * These replace incorrect 'cart' or 'item' top-level keys
     */
    const pojTranslations = {
      "header": {
        "title_cart_summary": "Kò͘-bu̍t-chhia Tek-iàu",
        "loading": "Tng teh chún-pī..."
      },
      "cart": {
        "loading": "Tng teh chún-pī lí ê kò͘-bu̍t-chhia...",
        "summary": "Chù-bûn Tek-iàu",
        "shipping_taxes_calculated_at_checkout": "Ūn-hùi kap sòe ē tī thê-kiong tē-chí liáu-āu kè-sǹg.",
        "view_detailed_cart": "Khòaⁿ kò͘-bu̍t-chhia siông-sè chu-sìn",
        "secured_by": "Iû Snipcart pó-pì"
      },
      "actions": {
        "checkout": "Lâi-khì kiat-siàu",
        "continue_shopping": "Se̍h bô kàu-khùi",
        "back_to_store": "Tò-tńg-khì kang-chok-sek",
        "close_cart": "Koaiⁿ--khí-lâi",
        "continue_to_shipping": "Thiⁿ-siá siu-kiāⁿ chu-sìn",
        "continue_to_payment": "Khì kiat-siàu",
        "place_order": "Chù-bûn",
        "edit": "Siu-kái"
      },
      "cart_summary": {
        "title": "Kò͘-bu̍t-chhia Tek-iàu",
        "subtotal": "Sió sǹg",
        "total": "Kè-kiōng"
      },
      "item": {
        "quantity": "Sò͘-liōng",
        "remove_item": "Bô beh ti̍h"
      },
      "checkout": {
        "shipping_taxes_calculated_when_address_provided": "Ūn-hùi kap sòe ē tī thê-kiong tē-chí liáu-āu kè-sǹg."
      },
      "billing": {
        "title": "Siàu-toaⁿ",
        "address": "Siàu-toaⁿ tē-chí",
        "continue_to_shipping": "Thiⁿ-siá siu-kiāⁿ chu-sìn",
        "use_different_shipping_address": "Sú-iōng bô-kāng ê siu-kiāⁿ tē-chí"
      }
    };

    const hjTranslations = {
      "header": {
        "title_cart_summary": "購物車摘要",
        "loading": "當塊準備..."
      },
      "cart": {
        "loading": "當塊準備汝兮購物車...",
        "summary": "注文摘要",
        "shipping_taxes_calculated_at_checkout": "運費甲稅會在提供地址了後計算。",
        "view_detailed_cart": "看購物車詳細資訊",
        "secured_by": "由 Snipcart 保庇"
      },
      "actions": {
        "checkout": "來去結賬",
        "continue_shopping": "迺無到氣",
        "back_to_store": "倒返去工作室",
        "close_cart": "關起來",
        "continue_to_shipping": "添寫收件資訊",
        "continue_to_payment": "去結賬",
        "place_order": "注文",
        "edit": "修改"
      },
      "cart_summary": {
        "title": "購物車摘要",
        "subtotal": "小算",
        "total": "總計"
      },
      "item": {
        "quantity": "數量",
        "remove_item": "無愛"
      },
      "checkout": {
        "shipping_taxes_calculated_when_address_provided": "運費甲稅會在提供地址了後計算。"
      },
      "billing": {
        "title": "賬單",
        "address": "賬單地址",
        "continue_to_shipping": "添寫收件資訊",
        "use_different_shipping_address": "使用無仝兮收件地址"
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

    // 5. Instant Auto-Open on Click
    document.addEventListener('click', (e) => {
      const addBtn = e.target.closest('.snipcart-add-item');
      if (addBtn) {
        console.log('Snipcart: Add to cart clicked, opening cart instantly');
        if (Snipcart.api && Snipcart.api.theme && Snipcart.api.theme.cart) {
          Snipcart.api.theme.cart.open();
        }
      }
    });

    // Secondary safety
    Snipcart.events.on('item.added', (item) => {
      if (Snipcart.api && Snipcart.api.theme && Snipcart.api.theme.cart) {
        Snipcart.api.theme.cart.open();
      }
    });
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

    try {
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
    } catch (err) {
      console.warn('Sync address error:', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSnipcart);
  } else {
    initSnipcart();
  }
})();
