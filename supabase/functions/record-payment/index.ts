
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    console.log('=== RECORDING FLIPBOOK PAYMENT ===')
    console.log('Environment check:', {
      hasUrl: !!supabaseUrl,
      hasServiceKey: !!supabaseServiceKey
    })

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing environment variables')
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    const { user_id, transaction_id, amount, service_type = 'flipbook' } = await req.json()

    if (!user_id || !transaction_id || !amount) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: user_id, transaction_id, amount' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Recording payment:', { user_id, transaction_id, amount, service_type })

    // Record payment in payments table
    console.log('Inserting payment into table...')
    
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: user_id,
        paypal_transaction_id: transaction_id,
        amount: parseFloat(amount),
        currency: 'ILS',
        status: 'success',
        service_type: service_type
      })
      .select()
      .single()
    
    console.log('Payment insert result:', { payment, paymentError })

    if (paymentError) {
      console.error('Payment insert error:', paymentError)
      throw paymentError;
    }

    // Grant service-specific access using the new function
    console.log('Granting flipbook access...')
    
    const { error: accessError } = await supabase.rpc('grant_service_access', {
      user_id: user_id,
      service_name: service_type,
      duration_days: 30,
      amount: parseFloat(amount)
    })

    if (accessError) {
      console.error('Access grant error:', accessError)
      // Don't fail the payment recording if access grant fails
      console.log('Payment recorded but access grant failed - manual intervention may be needed')
    } else {
      console.log('Flipbook access granted successfully')
    }

    console.log('Payment and access recorded successfully:', payment)

    return new Response(
      JSON.stringify({ 
        success: true, 
        payment: payment,
        service_type: service_type
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Internal server error'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
