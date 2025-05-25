
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
    
    console.log('=== RECORDING PAYMENT (Updated with RLS) ===')
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

    // Create Supabase client with service role key for RLS bypass
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    const { user_id, transaction_id, amount } = await req.json()

    if (!user_id || !transaction_id || !amount) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: user_id, transaction_id, amount' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Recording payment:', { user_id, transaction_id, amount })

    // Try RPC first
    console.log('Attempting RPC call to record payment...')
    
    const { data: rpcResult, error: rpcError } = await supabase
      .rpc('create_payment', { 
        p_user_id: user_id,
        p_transaction_id: transaction_id,
        p_amount: parseFloat(amount)
      })
    
    if (rpcError) {
      console.log('RPC failed:', rpcError.message)
      console.log('Trying direct table insert with service role...')
      
      // Fallback to direct table insert with service role
      const paymentData = {
        user_id,
        paypal_transaction_id: transaction_id,
        amount: parseFloat(amount),
        currency: 'ILS',
        status: 'success'
      }

      const { data, error } = await supabase
        .from('payments')
        .insert(paymentData)
        .select()

      console.log('Direct insert result:', { data, error })

      if (error) {
        console.error('Database Error:', error)
        
        return new Response(
          JSON.stringify({ 
            success: false,
            error: 'Payment recording failed'
          }),
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      console.log('Payment recorded successfully:', data)

      return new Response(
        JSON.stringify({ 
          success: true, 
          payment: data?.[0] || data
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // RPC succeeded
    console.log('Payment recorded via RPC:', rpcResult)

    return new Response(
      JSON.stringify({ 
        success: true, 
        payment: rpcResult
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
