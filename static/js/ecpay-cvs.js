/**
 * ECPay CVS (Convenience Store) Map Integration
 * 綠界超商門市選擇器整合
 */

export class ECPayCVSPicker {
  constructor(options = {}) {
    this.merchantID = options.merchantID || '';
    this.hashKey = options.hashKey || '';
    this.hashIV = options.hashIV || '';
    this.serverEndpoint = options.serverEndpoint || '/api/ecpay-cvs';
    this.callback = options.onStoreSelected || null;
    this.isTestMode = options.isTestMode !== false; // Default to test mode
  }

  serverEndpoint = 'https://suxxspkxmpbxzvwdfdun.supabase.co/functions/v1/ecpay-cvs'

  /**
   * Open ECPay CVS store selection map
   * @param {Object} params - Additional parameters
   */
  async openStoreMap(params = {}) {
    const {
      isCollection = 'Y', // 是否為取貨 (Y/N)
      storeType = '01', // 01=統一超商(7-11), 02=全家
      extraData = ''
    } = params;

    try {
      // Step 1: Get ECPay CVS map URL from our backend
      const response = await fetch(this.serverEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchantID: this.merchantID,
          isCollection,
          storeType,
          extraData,
          serverReplyURL: window.location.origin + '/api/ecpay-cvs-callback'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to initiate ECPay CVS map');
      }

      const data = await response.json();

      // Step 2: Open ECPay map in a popup window
      const width = 800;
      const height = 600;
      const left = (screen.width - width) / 2;
      const top = (screen.height - height) / 2;

      const popup = window.open(
        data.mapURL,
        'ECPayCVSMap',
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
      );

      if (!popup) {
        throw new Error('Popup blocked. Please allow popups for this site.');
      }

      // Step 3: Listen for the callback from ECPay
      return this._waitForCallback();
    } catch (error) {
      console.error('ECPay CVS Map Error:', error);
      throw error;
    }
  }

  /**
   * Wait for ECPay callback with store selection data
   */
  _waitForCallback() {
    return new Promise((resolve, reject) => {
      const handleMessage = (event) => {
        // Validate origin for security
        if (event.origin !== window.location.origin) return;

        const data = event.data;
        if (data.type === 'ECPAY_CVS_SELECTED') {
          window.removeEventListener('message', handleMessage);

          const storeInfo = {
            storeName: data.CVSStoreName || '',
            storeID: data.CVSStoreID || '',
            storeAddress: data.CVSAddress || '',
            storeTelephone: data.CVSTelephone || '',
            storeType: data.LogisticsSubType || '01',
            extraData: data.ExtraData || ''
          };

          if (this.callback) {
            this.callback(storeInfo);
          }

          resolve(storeInfo);
        }
      };

      window.addEventListener('message', handleMessage);

      // Timeout after 10 minutes
      setTimeout(() => {
        window.removeEventListener('message', handleMessage);
        reject(new Error('CVS selection timed out'));
      }, 600000);
    });
  }

  /**
   * Format store info for display
   */
  formatStoreInfo(storeInfo) {
    const storeTypeMap = {
      '01': '7-11',
      '02': '全家',
      'FAMI': '全家',
      'UNIMART': '7-11'
    };
    const typeName = storeTypeMap[storeInfo.storeType] || 'CVS';
    return `${typeName} ${storeInfo.storeName} (${storeInfo.storeID})`;
  }
}

// Singleton instance for easy global access
let cvsPickerInstance = null;

export function initECPayCVS(config) {
  cvsPickerInstance = new ECPayCVSPicker(config);
  return cvsPickerInstance;
}

export function getECPayCVS() {
  if (!cvsPickerInstance) {
    console.warn('ECPay CVS Picker not initialized. Call initECPayCVS() first.');
  }
  return cvsPickerInstance;
}
