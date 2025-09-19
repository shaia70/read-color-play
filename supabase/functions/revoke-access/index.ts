import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
    
    console.log('=== REVOKE ACCESS FUNCTION ===')
    console.log('Environment variables:')
    console.log('SUPABASE_URL:', supabaseUrl ? 'EXISTS' : 'MISSING')
    console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'EXISTS' : 'MISSING')

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

    const { user_id, service_type } = requestBody

    console.log('User ID received:', user_id)
    console.log('Service type:', service_type)

    if (!user_id || !service_type) {
      console.error('Missing user_id or service_type in request')
      return new Response(
        JSON.stringify({ error: 'Missing user_id or service_type' }),
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

    console.log('Revoking access for service:', service_type)
    
    // Update user based on service type
    let updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (service_type === 'flipbook') {
      updateData = {
        ...updateData,
        paid_for_flipbook: false,
        flipbook_access_expires_at: null,
        flipbook_access_granted_at: null
      }
    } else if (service_type === 'bina') {
      updateData = {
        ...updateData,
        paid_for_bina: false,
        bina_access_expires_at: null,
        bina_access_granted_at: null
      }
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid service_type. Must be flipbook or bina' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const { data: userData, error: updateError } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', user_id)
      .select('name, email, paid_for_flipbook, paid_for_bina, flipbook_access_expires_at, bina_access_expires_at')
      .single()
    
    console.log('Update result:', { userData, updateError })

    if (updateError) {
      console.error('Failed to revoke access:', updateError)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to revoke access',
          details: updateError.message
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('=== ACCESS REVOKED SUCCESSFULLY ===')
    console.log('User:', userData?.name)
    console.log('Service:', service_type)

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Access revoked for ${service_type}`,
        user: userData
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
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error?.message
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})