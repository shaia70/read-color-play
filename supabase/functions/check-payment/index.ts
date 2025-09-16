
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

    const { user_id, service_type = 'flipbook' } = requestBody

    console.log('User ID received:', user_id)
    console.log('Service type:', service_type)
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

    console.log('Calling get_user_payments database function for service:', service_type)
    
    // Get payments for specific service type
    const { data: payments, error } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', user_id)
      .eq('service_type', service_type)
      .eq('status', 'success')
    
    console.log('Service-specific payments result:', { payments, error })

    // Also check service-specific access using the new function
    console.log('Checking service-specific access...')
    const { data: hasAccess, error: accessError } = await supabase.rpc('has_service_access', {
      user_id: user_id,
      service_name: service_type
    })
    
    console.log('Service access check:', { hasAccess, accessError })

    // Also check user service-specific fields for coupon redemptions
    console.log('Checking user service-specific status...')
    const serviceFields = service_type === 'flipbook' 
      ? 'paid_for_flipbook, flipbook_access_expires_at, registered_for_flipbook'
      : 'paid_for_bina, bina_access_expires_at, registered_for_bina'
      
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select(serviceFields + ', has_paid, access_expires_at')
      .eq('id', user_id)
      .single()
    
    console.log('User service data result:', { userData, userError })

    if (error && userError && accessError) {
      console.error('All payment checks failed:', { error, userError, accessError })
      
      return new Response(
        JSON.stringify({ 
          hasValidPayment: false,
          paymentCount: 0,
          error: 'Failed to check payment status',
          errorDetails: {
            paymentError: error?.message,
            userError: userError?.message,
            accessError: accessError?.message
          }
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Check service-specific access
    const hasPaymentRecord = payments && payments.length > 0
    const hasServiceAccess = hasAccess === true
    
    // Check service-specific paid status and expiration
    let hasServicePaidStatus = false
    if (service_type === 'flipbook') {
      hasServicePaidStatus = userData?.paid_for_flipbook && 
        (!userData?.flipbook_access_expires_at || new Date(userData.flipbook_access_expires_at) > new Date())
    } else if (service_type === 'bina') {
      hasServicePaidStatus = userData?.paid_for_bina && 
        (!userData?.bina_access_expires_at || new Date(userData.bina_access_expires_at) > new Date())
    }
    
    const hasValidAccess = hasPaymentRecord || hasServiceAccess || hasServicePaidStatus
    
    console.log('=== FINAL SERVICE-SPECIFIC RESULT ===')
    console.log('Service type:', service_type)
    console.log('Payments found:', payments?.length || 0)
    console.log('Has payment record:', hasPaymentRecord)
    console.log('Has service access (function):', hasServiceAccess)
    console.log('Has service paid status:', hasServicePaidStatus)
    console.log('Has valid access:', hasValidAccess)
    console.log('Payment data:', payments)

    return new Response(
      JSON.stringify({ 
        hasValidPayment: hasValidAccess,
        paymentCount: payments?.length || 0,
        payments: payments || [],
        serviceType: service_type,
        debugInfo: {
          accessMethod: 'service_specific_check',
          userIdReceived: user_id,
          serviceType: service_type,
          paymentsFound: payments?.length || 0,
          paymentsData: payments || [],
          hasServiceAccess: hasServiceAccess,
          hasServicePaidStatus: hasServicePaidStatus,
          hasPaymentRecord: hasPaymentRecord,
          userData: userData
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
