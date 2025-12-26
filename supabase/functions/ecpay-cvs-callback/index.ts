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
    const data: Record<string, any> = {}
    for (const [key, value] of formData.entries()) {
      data[key] = value.toString()
    }

    console.log('ECPay Callback Data:', data)

    // Return an HTML page that posts message back to parent and closes automatically after a short delay
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="icon" href="data:,">
  <title>門市選擇成功</title>
  <style>
    body { 
      display: flex; flex-direction: column; align-items: center; justify-content: center; 
      height: 100vh; margin: 0; font-family: system-ui, sans-serif; background: #fff; color: #333;
    }
    .check-icon { 
      width: 60px; height: 60px; border-radius: 50%; background: #22c55e; color: white;
      display: flex; align-items: center; justify-content: center; font-size: 30px;
      margin-bottom: 20px; animation: scaleIn 0.3s ease-out;
    }
    @keyframes scaleIn { from { transform: scale(0); } to { transform: scale(1); } }
  </style>
</head>
<body>
  <div class="check-icon">✓</div>
  <div style="font-weight: bold; font-size: 1.2rem;">門市選擇成功</div>
  <p>正在返回網站...</p>

  <script>
    const storeData = ${JSON.stringify({
      type: 'ECPAY_CVS_SELECTED',
      ...data
    })};
    
    if (window.opener) {
      window.opener.postMessage(storeData, '*');
      // Delay slightly so user sees the success message
      setTimeout(() => {
        window.close();
      }, 1200);
    } else {
      document.body.innerHTML = '<h2>門市選擇成功！</h2><p>請手動關閉此視窗。</p>';
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
