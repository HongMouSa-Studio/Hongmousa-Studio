(function () {
  function initSnipcart() {
    if (typeof Snipcart === 'undefined') {
      document.addEventListener('snipcart.ready', initSnipcart);
      return;
    }

    const pojTranslations = {
      "header": {
        "title": "Ka-chì-tē-á Tek-iàu",
        "title_cart_summary": "Ka-chì-tē-á Tek-iàu",
        "loading": "Tng teh chún-pī..."
      },
      "cart": {
        "summary": "Chù-bûn Tek-iàu",
        "title": "Ka-chì-tē-á Tek-iàu",
        "loading": "Tng teh chún-pī lí ê Ka-chì-tē-á...",
        "loading_cart": "Tng teh chún-pī lí ê Ka-chì-tē-á...",
        "preparing_cart": "Tng teh chún-pī lí ê Ka-chì-tē-á...",
        "shipping_taxes_calculated_at_checkout": "Ūn-hùi kap sòe ē tī thê-kiong tē-chí liáu-āu kè-sǹg.",
        "view_detailed_cart": "Khòaⁿ Ka-chì-tē-á siông-sè chu-sìn",
        "secured_by": "Iû Snipcart pó-pì",
        "empty": "Lí ê Ka-chì-tē-á iáu khang-khang,\nbô pòaⁿ-hāng mi̍h."
      },
      "loading": "Tng teh chún-pī...",
      "initial_loading": "Tng teh chún-pī...",
      "font": "Jī-thé Soán-te̍k",
      "font_selection": "Jī-thé Soán-te̍k",
      "item_option_font": "Jī-thé Soán-te̍k",
      "conversion": "Phing-im Choán-oân",
      "material": "Châi-chit",
      "engraving": "Eng-kh刻 Hong-sek",
      "actions": {
        "checkout": "Lâi-khì kiat-siàu", "continue_shopping": "Se̍h bô kàu-khùi", "back_to_store": "Tò-tńg-khì kang-chok-sek",
        "close_cart": "Koaiⁿ--khí-lâi", "continue_to_shipping": "Thiⁿ-siá siu-kiāⁿ chu-sìn", "continue_to_payment": "Khì kiat-siàu",
        "place_order": "Chù-bûn", "edit": "Siu-kái"
      },
      "cart_summary": { "title": "Ka-chì-tē-á Tek-iàu", "subtotal": "Sió sǹg", "total": "Kè-kiōng" },
      "item": {
        "font": "Jī-thé Soán-te̍k",
        "Font": "Jī-thé Soán-te̍k",
        "material": "Châi-chit",
        "Material": "Châi-chit",
        "conversion": "Phing-im Choán-oân",
        "engraving": "Eng-kh刻 Hong-sek",
        "quantity": "Sò͘-liōng",
        "remove_item": "Bô beh ti̍h"
      },
      "checkout": { "shipping_taxes_calculated_when_address_provided": "Ūn-hùi kap sòe ē tī thê-kiong tē-chí liáu-āu kè-sǹg." },
      "billing": { "title": "Siàu-toaⁿ", "address": "Siàu-toaⁿ tē-chí", "continue_to_shipping": "Thiⁿ-siá siu-kiāⁿ chu-sìn", "use_different_shipping_address": "Sú-iōng bô-kāng ê siu-kiāⁿ tē-chí" },
      "shipping": { "title": "Siu-kiāⁿ", "address": "Siu-kiāⁿ tē-chí", "method": "Ūn-sàng hong-sek" },
      "address_form": {
        "name": "Miâ-sèⁿ", "email": "Tiān-chú-phoe-tháng", "city": "Hiong/Tìn/Chhī/Khu", "country": "Kok-ka",
        "phone": "Tiān-ōe", "postalCode": "Iû-piān-hoan-hō", "province": "Koān/Chhī", "address1": "Tē-chí", "address2": "Pī-chù", "dont_see_address": ""
      },
      "customer_addresses": { "title": "Thong-sìn-lo̍k", "use_this_address": "Sú-iōng chit-ê tē-chí", "add_new_address": "Ke-thiⁿ sin tē-chí" },
      "custom_fields": {
        "font": "Jī-thé Soán-te̍k",
        "item_option_font": "Jī-thé Soán-te̍k",
        "font_selection": "Jī-thé Soán-te̍k",
        "Font": "Jī-thé Soán-te̍k",
        "Font Selection": "Jī-thé Soán-te̍k",
        "conversion": "Phing-im Choán-oân",
        "item_option_conversion": "Phing-im Choán-oân",
        "Conversion": "Phing-im Choán-oân",
        "Phing-im Choán-oân": "Phing-im Choán-oân",
        "material": "Châi-chit",
        "item_option_material": "Châi-chit",
        "Material": "Châi-chit",
        "Châi-chit": "Châi-chit",
        "engraving": "Eng-kh刻 Hong-sek",
        "item_option_engraving": "Eng-kh刻 Hong-sek",
        "Engraving": "Eng-kh刻 Hong-sek",
        "Eng-kh刻 Hong-sek": "Eng-kh刻 Hong-sek",
        // Fallbacks for raw English strings
        "font": "Jī-thé Soán-te̍k",
        "material": "Châi-chit",
        "engraving": "Eng-kh刻 Hong-sek",
        "conversion": "Phing-im Choán-oân"
      }
    };

    const hjTranslations = {
      "header": {
        "title": "茄荎袋仔摘要",
        "title_cart_summary": "茄荎袋仔摘要",
        "loading": "當塊準備..."
      },
      "cart": {
        "summary": "注文摘要",
        "title": "茄荎袋仔摘要",
        "loading": "當塊準備汝兮茄荎袋仔...",
        "loading_cart": "當塊準備汝兮茄荎袋仔...",
        "preparing_cart": "當塊準備汝兮茄荎袋仔...",
        "shipping_taxes_calculated_at_checkout": "運費甲稅會在提供地址了後計算。",
        "view_detailed_cart": "看茄荎袋仔詳細資訊", "secured_by": "由 Snipcart 保庇", "empty": "汝兮茄荎袋仔夭空空，無半項物。"
      },
      "loading": "當塊準備...",
      "initial_loading": "當塊準備...",
      "font": "字體選擇",
      "font_selection": "字體選擇",
      "item_option_font": "字體選擇",
      "conversion": "拼音轉換",
      "material": "材質",
      "engraving": "刻印方式",
      "actions": {
        "checkout": "來去結賬", "continue_shopping": "倒返迺工作室", "back_to_store": "倒返去工作室",
        "close_cart": "關起來", "continue_to_shipping": "添寫收件資訊", "continue_to_payment": "去結賬",
        "place_order": "注文", "edit": "修改"
      },
      "cart_summary": { "title": "茄荎袋仔摘要", "subtotal": "小算", "total": "總計" },
      "item": {
        "font": "字體選擇",
        "Font": "字體選擇",
        "material": "材質",
        "Material": "材質",
        "conversion": "拼音轉換",
        "engraving": "刻印方式",
        "quantity": "數量",
        "remove_item": "無愛"
      },
      "checkout": { "shipping_taxes_calculated_when_address_provided": "運費甲稅會在提供地址了後計算。" },
      "billing": { "title": "賬單", "address": "賬單地址", "continue_to_shipping": "添寫收件資訊", "use_different_shipping_address": "使用無仝兮收件地址" },
      "shipping": { "title": "收件", "address": "收件地址", "method": "運送方式" },
      "address_form": {
        "name": "名姓", "email": "電子批桶", "city": "鄉鎮市區", "country": "國家", "phone": "電話",
        "postalCode": "郵便番號", "province": "縣/市", "address1": "地址", "address2": "備註", "dont_see_address": ""
      },
      "customer_addresses": { "title": "通訊錄", "use_this_address": "使用這个地址", "add_new_address": "加添新地址" },
      "custom_fields": {
        "font": "字體選擇",
        "item_option_font": "字體選擇",
        "font_selection": "字體選擇",
        "Font": "字體選擇",
        "Font Selection": "字體選擇",
        "conversion": "拼音轉換",
        "item_option_conversion": "拼音轉換",
        "Conversion": "拼音轉換",
        "拼音轉換": "拼音轉換",
        "material": "材質",
        "item_option_material": "材質",
        "Material": "材質",
        "材質": "材質",
        "engraving": "刻印方式",
        "item_option_engraving": "刻印方式",
        "Engraving": "刻印方式",
        "刻印方式": "刻印方式",
        // Fallbacks for raw English strings
        "font": "字體選擇",
        "material": "材質",
        "engraving": "刻印方式",
        "conversion": "拼音轉換"
      }
    };

    const enTranslations = {
      "header": {
        "title": "Ka-chi bag summary",
        "title_cart_summary": "Ka-chi bag summary"
      },
      "cart": {
        "title": "Ka-chi bag summary",
        "loading": "Loading your ka-chi bag...",
        "loading_cart": "Loading your ka-chi bag...",
        "preparing_cart": "Preparing your ka-chi bag...",
        "view_detailed_cart": "View detailed ka-chi bag",
        "empty": "Your ka-chi bag is empty"
      },
      "actions": {
        "continue_shopping": "Continue shopping",
        "back_to_store": "Back to studio"
      }
    };

    const path = window.location.pathname;
    if (path.includes('/tb-poj/')) {
      try {
        const p = Snipcart.api.session.setLanguage('en', pojTranslations);
        if (p && typeof p.catch === 'function') {
          p.catch(err => console.warn('[Antigravity] Snipcart setLanguage (POJ) failed/timed out:', err));
        }
      } catch (e) {
        console.warn('[Antigravity] Snipcart setLanguage (POJ) threw error:', e);
      }
    } else if (path.includes('/tb-hj/')) {
      try {
        const p = Snipcart.api.session.setLanguage('zh-TW', hjTranslations);
        if (p && typeof p.catch === 'function') {
          p.catch(err => console.warn('[Antigravity] Snipcart setLanguage (HJ) failed/timed out:', err));
        }
      } catch (e) {
        console.warn('[Antigravity] Snipcart setLanguage (HJ) threw error:', e);
      }
    } else {
      // Default: English -> Use ka-chi bag overrides
      try {
        const p = Snipcart.api.session.setLanguage('en', enTranslations);
        if (p && typeof p.catch === 'function') {
          p.catch(err => console.warn('[Antigravity] Snipcart setLanguage (EN) failed/timed out:', err));
        }
      } catch (e) {
        console.warn('[Antigravity] Snipcart setLanguage (EN) threw error:', e);
      }
    }

    syncAddressWithSnipcart();
    setupCartToggle();

    Snipcart.events.on('item.added', (item) => {
      if (window.Snipcart && Snipcart.api && Snipcart.api.theme && Snipcart.api.theme.cart) {
        const state = Snipcart.store.getState();
        // If cart is already open, don't trigger open() to avoid NavigationDuplicated
        if (!state.cart.display) {
          Snipcart.api.theme.cart.open();
        }
      }
    });
  }

  function setupCartToggle() {
    // 1. Handle main cart button toggle
    const cartBtn = document.querySelector('.snipcart-checkout');
    if (cartBtn) {
      cartBtn.addEventListener('click', (e) => {
        const state = Snipcart.store.getState();
        if (state.cart.display) {
          Snipcart.api.theme.cart.close();
          e.preventDefault();
          e.stopImmediatePropagation();
        }
      });
    }

    // 2. Handle "Continue Shopping" / Back behavior within Snipcart
    document.addEventListener('click', (e) => {
      if (e.target.closest('.snipcart-cart-header__close-button') || e.target.closest('.snipcart-modal__header-buttons')) {
        Snipcart.api.theme.cart.close();
      }
    });

    // 3. Handle ESC key (Robust & Simplified)
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        const state = Snipcart.store.getState();
        if (state.cart.display) {
          console.log('[Antigravity] ESC pressed. Closing Snipcart.');
          window.Snipcart.api.theme.cart.close();
          e.preventDefault();
          e.stopPropagation();
        }
      }
    }, { capture: true });

    // 4. Unified Mutation Observer (Translations + Injection)
    const observer = new MutationObserver((mutations) => {
      const isPoj = window.location.pathname.includes('/tb-poj/');
      const isHj = window.location.pathname.includes('/tb-hj/');

      // A. Inject Confirm Button in Side Cart (Edit Mode Only)
      const sidePanel = document.querySelector('.snipcart-layout__content--side');
      if (sidePanel) {
        // Check if we are in "Edit Item" mode.
        // .snipcart-item-custom-fields is typical for editing options.
        // CRITICAL: We must ensure we are NOT in the Cart Summary view.
        // Cart Summary usually implies the presence of the checkout button or summary specific classes.
        const hasCustomFields = sidePanel.querySelector('.snipcart-item-custom-fields') ||
          sidePanel.querySelector('.snipcart-form');

        const isCartSummary = sidePanel.querySelector('.snipcart-cart-summary') ||
          sidePanel.querySelector('.snipcart-checkout') ||
          sidePanel.querySelector('.snipcart-cart__footer-buttons'); // Checkout button container

        // Only inject if it has custom fields AND is NOT the summary view
        const isEditMode = hasCustomFields && !isCartSummary;

        const existingBtn = sidePanel.querySelector('.antigravity-confirm-btn');

        if (isEditMode) {
          if (!existingBtn) {
            console.log('[Antigravity] Edit Mode detected. Injecting Confirm Button.');
            const btn = document.createElement('button');
            let btnText = isPoj ? 'Khak-tēng' : '確定';

            btn.innerText = btnText;
            btn.className = 'snipcart-button-primary snipcart-base-button is-icon-right antigravity-confirm-btn';

            // Note: Visual styles (position fixed, size, etc.) are now handled in 20-components.css
            // under the .antigravity-confirm-btn class for better responsive control.
            btn.style.cursor = 'pointer';

            btn.onclick = (e) => {
              console.log('[Antigravity] Confirm Button Clicked -> Force Navigating to #/checkout');
              e.preventDefault();
              e.stopPropagation();

              // Strategy: Double-step navigation
              // 1. Jump to #/cart first to ensure Side Panel closes cleanly (router state reset)
              window.location.hash = '#/cart';

              // 2. Short delay then jump to #/checkout (Address/Shipping)
              setTimeout(() => {
                console.log('[Antigravity] Jumping to #/checkout');
                window.location.hash = '#/checkout';
              }, 200);
            }; sidePanel.appendChild(btn);
          }
        } else {
          // Not in edit mode, remove button if it exists (cleanup)
          if (existingBtn) {
            console.log('[Antigravity] Not in Edit Mode. Removing Confirm Button.');
            existingBtn.remove();
          }
        }
      }

      // B. Translation Logic (Only if localized path)
      if (!isPoj && !isHj) return;

      const translations = isPoj ? {
        'Font': 'Jī-thé Soán-te̍k', 'font': 'Jī-thé Soán-te̍k',
        'Material': 'Châi-chit', 'material': 'Châi-chit',
        'Engraving': 'Eng-kh刻 Hong-sek', 'engraving': 'Eng-kh刻 Hong-sek',
        'Conversion': 'Phing-im Choán-oân', 'conversion': 'Phing-im Choán-oân'
      } : {
        'Font': '字體選擇', 'font': '字體選擇',
        'Material': '材質', 'material': '材質',
        'Engraving': '刻印方式', 'engraving': '刻印方式',
        'Conversion': '拼音轉換', 'conversion': '拼音轉換'
      };

      document.querySelectorAll('.snipcart-item-line__variant-name, .snipcart-item-custom-fields__field label').forEach(el => {
        let text = el.innerText.trim();
        for (const [key, value] of Object.entries(translations)) {
          if (text === key || text === key + ':') {
            if (el.innerText !== value) el.innerText = value;
            return;
          }
          if (text.startsWith(key + ':')) {
            const newText = text.replace(key + ':', value + ':');
            if (el.innerText !== newText) el.innerText = newText;
            return;
          }
        }
      });
    });

    const snipcartEl = document.getElementById('snipcart');
    if (snipcartEl) {
      observer.observe(snipcartEl, { childList: true, subtree: true, characterData: true });
    } else {
      document.addEventListener('snipcart.ready', () => {
        const el = document.getElementById('snipcart');
        if (el) observer.observe(el, { childList: true, subtree: true, characterData: true });
      });
    }
  }

  async function syncAddressWithSnipcart() {
    if (!window.supabase) return;
    const { data: { session } } = await window.supabase.auth.getSession();
    if (!session) return;
    try {
      const { data: address } = await window.supabase
        .from('address_book').select('*').eq('user_id', session.user.id).eq('is_default', true).maybeSingle();
      if (address) {
        const addrData = {
          name: address.recipient_name,
          address1: address.address || address.cvs_store || '',
          address2: address.address && address.cvs_store ? address.cvs_store : '',
          country: 'TW',
          city: address.city || 'Taiwan',
          province: address.province || 'TW',
          postalCode: address.postal_code || '000',
          phone: address.phone || ''
        };
        Snipcart.api.cart.setShippingAddress(addrData);
        Snipcart.api.cart.setBillingAddress(addrData);
      }
    } catch (err) { console.warn('Sync address error:', err); }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSnipcart);
  } else {
    initSnipcart();
  }
})();
