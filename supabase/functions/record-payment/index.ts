
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    console.log('=== DEBUGGING ENVIRONMENT ===')
    console.log('SUPABASE_URL exists:', !!supabaseUrl)
    console.log('SUPABASE_SERVICE_ROLE_KEY exists:', !!supabaseServiceKey)
    console.log('URL value:', supabaseUrl)
    console.log('Key prefix:', supabaseServiceKey?.substring(0, 20) + '...')

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing environment variables')
      return new Response(
        JSON.stringify({ error: 'Server configuration error - missing env vars' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Test direct table access
    console.log('=== TESTING DIRECT TABLE ACCESS ===')
    
    try {
      const testResponse = await fetch(`${supabaseUrl}/rest/v1/payments?select=count`, {
        headers: {
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': supabaseServiceKey,
          'Content-Type': 'application/json'
        }
      })
      
      console.log('Direct API test status:', testResponse.status)
      const testResult = await testResponse.text()
      console.log('Direct API test result:', testResult)
      
    } catch (directError) {
      console.error('Direct API test failed:', directError)
    }

    // Create supabase client with service role key
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

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

    console.log('=== RECORDING PAYMENT ===')
    console.log('Recording payment:', { user_id, transaction_id, amount })

    // Insert payment record using service role (bypasses RLS)
    const { data, error } = await supabaseAdmin
      .from('payments')
      .insert({
        user_id,
        paypal_transaction_id: transaction_id,
        amount: parseFloat(amount),
        currency: 'ILS',
        status: 'completed'
      })
      .select()
      .single()

    console.log('=== INSERT RESULTS ===')
    console.log('Insert error:', error)
    console.log('Insert data:', data)

    if (error) {
      console.error('Error inserting payment:', error)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to record payment', 
          details: error.message,
          code: error.code,
          hint: error.hint
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
        payment: data,
        debug: {
          user_id,
          transaction_id,
          amount,
          hasServiceKey: !!supabaseServiceKey,
          hasUrl: !!supabaseUrl
        }
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('=== UNEXPECTED ERROR ===')
    console.error('Error name:', error.name)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message,
        name: error.name
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
