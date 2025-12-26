// Supabase Edge Function: ecpay-cvs-callback
// 處理綠界門市選擇後的回傳，並透過 postMessage 傳回主視窗

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

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
    // ECPay sends data in application/x-www-form-urlencoded
    const formData = await req.formData()
    const data: Record<string, string> = {}
    for (const [key, value] of formData.entries()) {
      data[key] = value.toString()
    }

    console.log('ECPay Callback Data:', data)

    // Check if we have the minimum required data
    if (!data.CVSStoreID) {
      throw new Error('Missing CVSStoreID in callback data')
    }

    // Return an HTML page that posts message back to parent and closes
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Store Selected</title>
</head>
<body>
  <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; color: #333;">
    <div style="border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 40px; height: 40px; animation: spin 2s linear infinite;"></div>
    <p style="margin-top: 20px;">門市選擇成功，正在回到網頁...</p>
  </div>
  <style>
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  </style>
  <script>
    // Send data back to the main window
    const storeData = ${JSON.stringify({
      type: 'ECPAY_CVS_SELECTED',
      ...data
    })};
    
    if (window.opener) {
      window.opener.postMessage(storeData, '*');
      window.close();
    } else {
      document.body.innerHTML = '<p>門市選擇成功！請手動關閉此視窗。</p>';
    }
  </script>
</body>
</html>`

    return new Response(html, {
      headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' },
      status: 200,
    })
  } catch (error) {
    console.error('Callback Error:', error)
    return new Response(
      `<html><body><h1>Error</h1><p>${(error as Error).message}</p></body></html>`,
      {
        headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' },
        status: 500,
      }
    )
  }
})
