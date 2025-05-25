
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
    
    console.log('=== CHECKING PAYMENT STATUS (Direct Table Access) ===')
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

    // Direct table access using service role
    console.log('Querying payments table directly...')
    
    const { data: payments, error } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', user_id)
      .eq('status', 'success')
      .order('created_at', { ascending: false })
    
    console.log('Direct query result:', { payments, error })

    if (error) {
      console.error('Database Error:', error)
      
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
      paymentCount: payments?.length || 0,
      payments: payments 
    })

    return new Response(
      JSON.stringify({ 
        hasValidPayment: hasPayment,
        paymentCount: payments?.length || 0,
        payments: payments
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
