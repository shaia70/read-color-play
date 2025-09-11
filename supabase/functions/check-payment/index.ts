
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
    
    console.log('=== PAYMENT CHECK USING DATABASE FUNCTION ===')
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

    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    console.log('Calling get_user_payments database function...')
    
    // Use the database function instead of direct table access
    const { data: payments, error } = await supabase.rpc('get_user_payments', {
      p_user_id: user_id
    })
    
    console.log('Database function result:', { payments, error })

    // Also check user has_paid status for coupon redemptions
    console.log('Checking user has_paid status...')
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('has_paid, access_expires_at')
      .eq('id', user_id)
      .single()
    
    console.log('User data result:', { userData, userError })

    if (error && userError) {
      console.error('Both payment and user queries failed:', { error, userError })
      
      return new Response(
        JSON.stringify({ 
          hasValidPayment: false,
          paymentCount: 0,
          error: 'Failed to check payment status',
          errorDetails: {
            paymentError: error?.message,
            userError: userError?.message
          }
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Check if user has paid (either through payment or coupon)
    const hasPaymentRecord = payments && payments.length > 0
    const hasPaidStatus = userData?.has_paid && (!userData?.access_expires_at || new Date(userData.access_expires_at) > new Date())
    const hasValidAccess = hasPaymentRecord || hasPaidStatus
    
    console.log('=== FINAL RESULT ===')
    console.log('Payments found:', payments?.length || 0)
    console.log('Has payment record:', hasPaymentRecord)
    console.log('Has paid status:', hasPaidStatus)
    console.log('Access expires at:', userData?.access_expires_at)
    console.log('Has valid access:', hasValidAccess)
    console.log('Payment data:', payments)

    return new Response(
      JSON.stringify({ 
        hasValidPayment: hasValidAccess,
        paymentCount: payments?.length || 0,
        payments: payments || [],
        debugInfo: {
          accessMethod: 'database_function_get_user_payments',
          userIdReceived: user_id,
          paymentsFound: payments?.length || 0,
          paymentsData: payments || [],
          userHasPaid: userData?.has_paid,
          accessExpiresAt: userData?.access_expires_at,
          hasPaymentRecord: hasPaymentRecord,
          hasPaidStatus: hasPaidStatus
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
