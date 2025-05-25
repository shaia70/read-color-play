
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
    
    console.log('=== CHECKING PAYMENT STATUS (Updated with RLS) ===')
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

    const { user_id } = await req.json()

    if (!user_id) {
      return new Response(
        JSON.stringify({ error: 'Missing user_id' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Checking payment status for user:', user_id)

    // Use RPC function first
    console.log('Attempting RPC call to check payments...')
    
    const { data: rpcResult, error: rpcError } = await supabase
      .rpc('get_user_payments', { p_user_id: user_id })
    
    if (rpcError) {
      console.log('RPC failed:', rpcError.message)
      console.log('Trying direct table access with service role...')
      
      // Fallback to direct table access with service role
      const { data: payments, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user_id)
        .eq('status', 'success')
        .order('created_at', { ascending: false })

      console.log('Direct table query result:', { payments, error })

      if (error) {
        console.error('Database Error:', error)
        
        // Return false instead of mock success
        return new Response(
          JSON.stringify({ 
            hasValidPayment: false,
            paymentCount: 0,
            error: 'Payment check failed'
          }),
          { 
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      const hasPayment = payments && payments.length > 0

      console.log('Payment check result:', { 
        hasPayment, 
        paymentCount: payments?.length || 0 
      })

      return new Response(
        JSON.stringify({ 
          hasValidPayment: hasPayment,
          paymentCount: payments?.length || 0
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // RPC succeeded
    const hasPayment = rpcResult && rpcResult.length > 0
    console.log('RPC Payment check result:', { 
      hasPayment, 
      paymentCount: rpcResult?.length || 0 
    })

    return new Response(
      JSON.stringify({ 
        hasValidPayment: hasPayment,
        paymentCount: rpcResult?.length || 0
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
        hasValidPayment: false,
        paymentCount: 0,
        error: 'Internal server error' 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
