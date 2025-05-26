
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
    
    console.log('=== PAYMENT CHECK FROM USERS TABLE ===')
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

    console.log('Checking has_paid field in users table...')
    
    // Check the has_paid field in users table
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, has_paid')
      .eq('id', user_id)
      .single()
    
    console.log('Users table query result:', { user, error })

    if (error) {
      console.error('Users Table Query Error:', error)
      
      return new Response(
        JSON.stringify({ 
          hasValidPayment: false,
          paymentCount: 0,
          error: 'Failed to check user payment status',
          errorDetails: {
            code: error.code,
            message: error.message
          }
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const hasPayment = user?.has_paid === true
    
    console.log('=== FINAL RESULT ===')
    console.log('User found:', !!user)
    console.log('Has payment:', hasPayment)
    console.log('User data:', user)

    return new Response(
      JSON.stringify({ 
        hasValidPayment: hasPayment,
        paymentCount: hasPayment ? 1 : 0,
        user: user,
        debugInfo: {
          accessMethod: 'users_table_has_paid_field',
          userIdReceived: user_id,
          userFound: !!user,
          hasPaidValue: user?.has_paid
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
