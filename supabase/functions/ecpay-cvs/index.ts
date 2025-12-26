// Supabase Edge Function: ecpay-cvs
// 綠界超商門市地圖 API 整合

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createHmac } from 'https://deno.land/std@0.168.0/node/crypto.ts'

const ECPAY_API_URL = 'https://logistics-stage.ecpay.com.tw/Express/map' // Test environment
// Production: https://logistics.ecpay.com.tw/Express/map

serve(async (req) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { merchantID, isCollection, storeType, extraData, serverReplyURL } = await req.json()

    // Get ECPay credentials from environment variables
    const MERCHANT_ID = Deno.env.get('ECPAY_MERCHANT_ID') || merchantID
    const HASH_KEY = Deno.env.get('ECPAY_HASH_KEY') || ''
    const HASH_IV = Deno.env.get('ECPAY_HASH_IV') || ''

    if (!MERCHANT_ID || !HASH_KEY || !HASH_IV) {
      throw new Error('Missing ECPay credentials')
    }

    // Build ECPay CVS Map parameters
    const timestamp = Math.floor(Date.now() / 1000).toString()
    const params = {
      MerchantID: MERCHANT_ID,
      MerchantTradeNo: `CVS${timestamp}`, // Unique trade number
      LogisticsType: 'CVS',
      LogisticsSubType: storeType || '01', // 01=UNIMART(7-11), 02=FAMI(全家)
      IsCollection: isCollection || 'Y',
      ServerReplyURL: serverReplyURL,
      ExtraData: extraData || '',
      Device: '0' // 0=PC, 1=Mobile
    }

    // Generate CheckMacValue (ECPay signature)
    const checkMacValue = generateCheckMacValue(params, HASH_KEY, HASH_IV)
    params.CheckMacValue = checkMacValue

    // Build the ECPay map URL with parameters
    const urlParams = new URLSearchParams(params)
    const mapURL = `${ECPAY_API_URL}?${urlParams.toString()}`

    return new Response(
      JSON.stringify({ mapURL, merchantTradeNo: params.MerchantTradeNo }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

/**
 * Generate ECPay CheckMacValue
 */
function generateCheckMacValue(params, hashKey, hashIV) {
  // Step 1: Sort parameters by key (case-insensitive)
  const sorted = Object.keys(params)
    .filter(key => key !== 'CheckMacValue')
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
    .map(key => `${key}=${params[key]}`)
    .join('&')

  // Step 2: Add HashKey and HashIV
  const raw = `HashKey=${hashKey}&${sorted}&HashIV=${hashIV}`

  // Step 3: URL encode
  const encoded = encodeURIComponent(raw)
    .replace(/%20/g, '+')
    .replace(/%2d/g, '-')
    .replace(/%5f/g, '_')
    .replace(/%2e/g, '.')
    .replace(/%21/g, '!')
    .replace(/%2a/g, '*')
    .replace(/%28/g, '(')
    .replace(/%29/g, ')')

  // Step 4: Lowercase and SHA256
  const lowercased = encoded.toLowerCase()
  const hash = createHmac('sha256', hashKey)
    .update(lowercased)
    .digest('hex')
    .toUpperCase()

  return hash
}
