import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || ""
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ""

serve(async (req) => {
  try {
    const payload = await req.json()
    const eventName = payload.eventName

    // We only care about order.completed
    if (eventName !== 'order.completed') {
      return new Response(JSON.stringify({ message: 'Ignored event' }), { status: 200 })
    }

    const order = payload.content
    const userEmail = order.email
    const totalAmount = order.total // This is the total in NT$
    const snipcartId = order.token

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // 1. Find the user in auth.users by email
    // Note: We use contact_email or the email from the auth system
    const { data: profile, error: userError } = await supabase
      .from('profiles')
      .select('id, points')
      .eq('contact_email', userEmail)
      .single()

    if (userError || !profile) {
      console.error('User not found in profiles:', userEmail)
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 })
    }

    const userId = profile.id
    const currentPoints = profile.points || 0

    // 2. Save the order to public.orders
    const { error: orderError } = await supabase
      .from('orders')
      .upsert({
        user_id: userId,
        snipcart_id: snipcartId,
        total_price: totalAmount,
        status: 'COMPLETED',
        items: order.items,
        created_at: new Date(order.completionDate || new Date()).toISOString()
      })

    if (orderError) {
      console.error('Error saving order:', orderError)
      return new Response(JSON.stringify({ error: 'Sync failed' }), { status: 500 })
    }

    // 3. Update Points: 1 point per NT$100 spent
    const pointsToAdd = Math.floor(totalAmount / 100)

    if (pointsToAdd > 0) {
      const { error: pointError } = await supabase
        .from('profiles')
        .update({
          points: currentPoints + pointsToAdd,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (pointError) {
        console.error('Error updating points:', pointError)
      }
    }

    return new Response(JSON.stringify({ success: true, pointsAdded: pointsToAdd }), { status: 200 })

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400 })
  }
})
