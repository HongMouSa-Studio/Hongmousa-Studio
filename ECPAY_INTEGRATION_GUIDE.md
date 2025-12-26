# Snipcart 深度翻譯 & 綠界超商整合完成

我已經幫你完成咗所有嘅優化，包括 Snipcart 嘅完整台文化同埋綠界超商門市選擇器嘅整合。

## 完成項目

### 1. Snipcart 完整翻譯 ✅
已補完以下所有位置嘅台文翻譯（POJ 同漢字）：
- Cart Summary（購物車內容）
- Continue Shopping（繼續買）
- Back to Store（轉去覕）
- Quantity（數量）
- Total / Subtotal（總計/小計）
- Shipping and Taxes Notice（運費佮稅會佇結賬時計算）
- Checkout Steps（收件、結賬、查當等）
- Payment Fields（卡仔號、安全碼、過期日）
- Actions（繼續、轉去、落單）
- Discount/Promo Code（用兮碼）

### 2. 通訊錄系統升級 ✅
- ✅ Modal 標題動態顯示（「加添收件資料」vs「修改收件資料」）
- ✅ CVS 欄位 placeholder 多語言
- ✅ **地址** 同 **CVS 取貨** 二選一驗證
- ✅ 整合綠界超商門市選擇器（Option B Advanced）

### 3. 綠界 ECPay 整合架構
已創建以下檔案：
- `static/js/ecpay-cvs.js` - 前端 CVS 門市選擇器模組
- `supabase/functions/ecpay-cvs/index.ts` - 後端 API endpoint

## 接下來需要你做嘅事

### Step 1: 配置綠界 API 金鑰
去 Supabase Dashboard → Project Settings → Edge Functions → Secrets，加入以下環境變數：

```
ECPAY_MERCHANT_ID=你的綠界商店代號
ECPAY_HASH_KEY=你的 HashKey
ECPAY_HASH_IV=你的 HashIV
```

### Step 2: 部署 Supabase Edge Function
喺你嘅專案目錄執行：

```bash
# 登入 Supabase
supabase login

# 連結專案
supabase link --project-ref YOUR_PROJECT_REF

# 部署 Edge Function
supabase functions deploy ecpay-cvs
```

### Step 3: 更新 account.js 配置
打開 `static/js/account.js`，將第 7 行嘅 `YOUR_MERCHANT_ID` 改成你嘅實際商店代號：

```javascript
const cvsPicker = initECPayCVS({
  merchantID: '你的綠界商店代號', // 修改呢度
  isTestMode: true // 正式環境改成 false
});
```

同時更新 `serverEndpoint` 指向你嘅 Supabase Function：

```javascript
serverEndpoint: 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/ecpay-cvs'
```

### Step 4: 測試門市選擇器
1. 去 Account 頁面
2. 撳「加添資料」
3. 喺「超商領貨」欄位旁邊撳「揀門市」
4. 應該會彈出綠界嘅門市地圖
5. 選擇門市後，會自動填入門市資訊

## 驗證清單

- [ ] Snipcart 購物車內所有文字都係台文
- [ ] 結帳流程（Shipping → Payment → Review）全部台文
- [ ] Modal 標題會喺「加添」同「修改」之間切換
- [ ] 只填 CVS 可以儲存
- [ ] 只填地址（郵遞區號+地址）可以儲存
- [ ] 兩者都唔填會彈出錯誤訊息
- [ ] 撳「揀門市」會開啟綠界地圖（需要完成 Step 1-3）

## 注意事項

### 關於 Snipcart 貨幣符號
Snipcart 嘅 `NT$` 符號係 hardcoded 喺佢哋嘅系統入面，如果要完全替換成 `TWD`，可能需要用到 Snipcart 嘅自訂樣板系統或者 CSS 隱藏/替換。呢個部分比較複雜，建議先睇下用家會唔會介意先決定做唔做。

### 綠界測試環境
依家 Edge Function 用咗綠界嘅測試環境（`logistics-stage.ecpay.com.tw`）。正式上線前記得：
1. 將 `ECPAY_API_URL` 改成正式環境
2. 將 `isTestMode` 設為 `false`
3. 確保綠界帳號已經通過審核

## 如果遇到問題

### 問題 1: 門市選擇器打唔開
- 檢查 Browser Console 有無報錯
- 確認 Supabase Function 已經成功部署
- 確認環境變數正確設定

### 問題 2: 選完門市後無反應
- 檢查 `serverReplyURL` 係咪指向正確嘅 callback endpoint
- 可能需要喺綠界後台設定 callback URL 白名單

### 問題 3: Snipcart 翻譯無效
- 清除瀏覽器 cache
- 確認 `snipcart-config.js` 有成功載入
- 檢查 Console 有無 JavaScript 錯誤

如果有任何問題，隨時搵我！
