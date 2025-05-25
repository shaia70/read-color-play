
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
    
    console.log('=== PAYMENT CHECK WITH DATABASE FUNCTION ===')
    console.log('Environment variables:')
    console.log('SUPABASE_URL:', supabaseUrl ? 'EXISTS' : 'MISSING')
    console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'EXISTS (length: ' + supabaseServiceKey.length + ')' : 'MISSING')

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

    // Parse request body
    let requestBody;
    try {
      requestBody = await req.json()
      console.log('Request body parsed:', requestBody)
    } catch (e) {
      console.error('Failed to parse request body:', e)
      return new Response(
        JSON.stringify({ error: 'Invalid request body' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const { user_id } = requestBody

    console.log('User ID received:', user_id)
    console.log('User ID type:', typeof user_id)

    if (!user_id) {
      console.error('Missing user_id in request')
      return new Response(
        JSON.stringify({ error: 'Missing user_id' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Create Supabase client with service role
    console.log('Creating Supabase client with service role...')
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
    console.log('Supabase client created successfully')

    // Use the database function instead of direct table access
    console.log('Calling get_user_payments function...')
    console.log('Function parameters:')
    console.log('- p_user_id:', user_id)
    
    const { data: payments, error } = await supabase.rpc('get_user_payments', {
      p_user_id: user_id
    })
    
    console.log('=== FUNCTION CALL RESULTS ===')
    console.log('Error:', error)
    console.log('Data:', payments)
    console.log('Payments array length:', payments ? payments.length : 'null/undefined')
    
    if (payments && payments.length > 0) {
      console.log('=== INDIVIDUAL PAYMENTS ===')
      payments.forEach((payment, index) => {
        console.log(`Payment ${index + 1}:`, {
          id: payment.id,
          user_id: payment.user_id,
          amount: payment.amount,
          status: payment.status,
          created_at: payment.created_at
        })
      })
    }

    if (error) {
      console.error('=== DATABASE FUNCTION ERROR ===')
      console.error('Error code:', error.code)
      console.error('Error message:', error.message)
      console.error('Error details:', error.details)
      console.error('Error hint:', error.hint)
      console.error('Full error object:', JSON.stringify(error, null, 2))
      
      return new Response(
        JSON.stringify({ 
          hasValidPayment: false,
          paymentCount: 0,
          error: 'Payment check failed',
          errorDetails: {
            code: error.code,
            message: error.message,
            details: error.details
          }
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const hasPayment = payments && payments.length > 0
    const paymentCount = payments?.length || 0

    console.log('=== FINAL RESULT ===')
    console.log('Has payment:', hasPayment)
    console.log('Payment count:', paymentCount)

    return new Response(
      JSON.stringify({ 
        hasValidPayment: hasPayment,
        paymentCount: paymentCount,
        payments: payments,
        debugInfo: {
          functionUsed: 'get_user_payments',
          userIdReceived: user_id,
          totalRecordsFound: paymentCount
        }
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('=== UNEXPECTED ERROR ===')
    console.error('Error type:', typeof error)
    console.error('Error message:', error?.message)
    console.error('Error stack:', error?.stack)
    console.error('Full error:', JSON.stringify(error, null, 2))
    
    return new Response(
      JSON.stringify({ 
        hasValidPayment: false,
        paymentCount: 0,
        error: 'Internal server error',
        errorType: typeof error,
        errorMessage: error?.message
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
