
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
        "summary": "Kò͘-bu̍t-chhia lāi-iông",
        "checkout": "Lâi-khì kiat-siàu",
        "continue_shopping": "Kè-sio̍k bé",
        "empty": "Lí ê kò͘-bu̍t-chhia sī khang--ê.",
        "subtotal": "Sió-kè",
        "total": "Chóng-kè",
        "quantity": "Sò͘-liōng",
        "remove": "The̍h tiāu",
        "back_to_store": "Tńg-khì thia̍h",
        "shipping_taxes_notice": "Ūn-hùi kap sòe ē tī kiat-siàu sî kè-sǹg."
      },
      "header": {
        "title": "Kò͘-bu̍t-chhia"
      },
      "item": {
        "quantity": "Sò͘-liōng",
        "total_price": "Kè-kin",
        "unit_price": "Tan-kè"
      },
      "shipping": {
        "title": "Siu-kiāⁿ",
        "address": "Siu-kiāⁿ tē-chí",
        "methods": "Ūn-sàng hong-sek",
        "continue_to_payment": "Kè-sio̍k khì pe̍h-khoan"
      },
      "payment": {
        "title": "Kiat-siàu",
        "type": "Pe̍h-khoan hong-sek",
        "bill_me_later": "Āu-lâi chài pe̍h",
        "card_number": "Ka-á hō",
        "card_cvv": "An-choân má",
        "card_expiry": "Kò͘-kî"
      },
      "billing": {
        "title": "Siàu-toaⁿ",
        "continue_to_review": "Kám-cha siàu-toaⁿ"
      },
      "review": {
        "title": "Cha̍p-tàng",
        "confirm_order": "Khak-jīn lo̍h-toaⁿ"
      },
      "customer_inputs": {
        "phone": "Tiān-ōe",
        "email": "Tiān-chú-phoe-tháng",
        "name": "Miâ-sèⁿ",
        "full_name": "Choân-miâ"
      },
      "actions": {
        "continue_to_shipping": "Khì siu-kiāⁿ",
        "continue_to_payment": "Khì kiat-siàu",
        "place_order": "Lo̍h-toaⁿ",
        "continue": "Kè-sio̍k",
        "back": "Tńg-khì"
      },
      "discount": {
        "promo_code": "Ìⁿ-hoē má",
        "apply": "Ēng",
        "remove": "Chhú tiāu"
      }
    };

    const hjTranslations = {
      "cart": {
        "title": "購物車",
        "summary": "購物車內容",
        "checkout": "來去結賬",
        "continue_shopping": "繼續買",
        "empty": "汝兮購物車是空兮。",
        "subtotal": "小計",
        "total": "總計",
        "quantity": "數量",
        "remove": "提掉",
        "back_to_store": "轉去覕",
        "shipping_taxes_notice": "運費佮稅會佇結賬時計算。"
      },
      "header": {
        "title": "購物車"
      },
      "item": {
        "quantity": "數量",
        "total_price": "價銀",
        "unit_price": "單價"
      },
      "shipping": {
        "title": "收件",
        "address": "收件地址",
        "methods": "運送方式",
        "continue_to_payment": "繼續去付款"
      },
      "payment": {
        "title": "結賬",
        "type": "付款方式",
        "bill_me_later": "後來才付",
        "card_number": "卡仔號",
        "card_cvv": "安全碼",
        "card_expiry": "過期"
      },
      "billing": {
        "title": "賬單",
        "continue_to_review": "檢查賬單"
      },
      "review": {
        "title": "查當",
        "confirm_order": "確認落單"
      },
      "customer_inputs": {
        "phone": "電話",
        "email": "電子批桶",
        "name": "名姓",
        "full_name": "全名"
      },
      "actions": {
        "continue_to_shipping": "去收件",
        "continue_to_payment": "去結賬",
        "place_order": "落單",
        "continue": "繼續",
        "back": "轉去"
      },
      "discount": {
        "promo_code": "用兮碼",
        "apply": "用",
        "remove": "除掉"
      }
    };

    // 2. Apply based on current language
    const path = window.location.pathname;
    let currencySymbol = 'TWD';

    if (path.includes('/tb-poj/')) {
      Snipcart.api.session.setLanguage('en', pojTranslations);
      currencySymbol = 'TWD';
    } else if (path.includes('/tb-hj/')) {
      Snipcart.api.session.setLanguage('zh-TW', hjTranslations);
      currencySymbol = 'TWD';
    } else {
      currencySymbol = 'TWD';
    }

    // 3. Replace currency symbols in the DOM
    replaceCurrencySymbols(currencySymbol);

    // 4. Sync Address Book from Supabase
    syncAddressWithSnipcart();

    // 5. Cart Toggle Logic
    setupCartToggle();
  }

  /**
   * Replace NT$ with localized currency symbol
   */
  function replaceCurrencySymbols(symbol) {
    let attempts = 0;
    const maxAttempts = 5;

    function performReplacement() {
      attempts++;

      // Broader set of selectors to catch all Snipcart money displays
      const selectors = [
        '.snipcart',
        '.snipcart-cart-summary',
        '.snipcart-cart-summary-item',
        '.snipcart__cart-summary',
        '.snipcart__total',
        '.snipcart__box--badge',
        '.snipcart-item-quantity',
        '.snipcart__font--secondary',
        '.snipcart__font--subtitle',
        '[class*="snipcart"]'
      ];

      selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => replaceTextContent(el, symbol));
      });

      // Continue trying for a few more times to catch lazy-loaded content
      if (attempts < maxAttempts) {
        setTimeout(performReplacement, 1000);
      }
    }

    // First attempt after a short delay
    setTimeout(() => {
      performReplacement();

      // Use MutationObserver to catch dynamically added content
      const observer = new MutationObserver(() => {
        const elements = document.querySelectorAll('[class*="snipcart"]');
        elements.forEach(el => replaceTextContent(el, symbol));
      });

      const snipcartContainer = document.querySelector('#snipcart');
      if (snipcartContainer) {
        observer.observe(snipcartContainer, {
          childList: true,
          subtree: true,
          characterData: true
        });
      }
    }, 500);
  }

  function replaceTextContent(element, symbol) {
    // Only process text nodes
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    let node;
    const nodesToUpdate = [];

    while (node = walker.nextNode()) {
      if (node.textContent.includes('NT$') || /\$\s*\d/.test(node.textContent)) {
        nodesToUpdate.push(node);
      }
    }

    // Update all collected nodes
    nodesToUpdate.forEach(node => {
      node.textContent = node.textContent
        .replace(/NT\$/g, symbol + ' ')
        .replace(/\$(\s*\d)/g, `${symbol} $1`);
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
