import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SessionRequest {
  action: 'create' | 'validate' | 'cleanup';
  user_id?: string;
  session_token?: string;
  ip_address?: string;
  user_agent?: string;
  device_fingerprint?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    console.log('=== SESSION SECURITY HANDLER ===')
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

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    const { action, user_id, session_token, ip_address, user_agent, device_fingerprint }: SessionRequest = await req.json()

    console.log('Session request:', { action, user_id: user_id?.substring(0, 8) + '...', has_token: !!session_token })

    if (action === 'create') {
      if (!user_id) {
        return new Response(
          JSON.stringify({ error: 'Missing user_id for session creation' }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      console.log('Creating new session for user:', user_id)

      const { data: newToken, error: createError } = await supabase.rpc('create_user_session', {
        p_user_id: user_id,
        p_ip_address: ip_address || null,
        p_user_agent: user_agent || null,
        p_device_fingerprint: device_fingerprint || null
      })

      if (createError) {
        console.error('Error creating session:', createError)
        return new Response(
          JSON.stringify({ 
            success: false,
            error: 'Session creation failed',
            details: createError.message
          }),
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      console.log('Session created successfully')

      return new Response(
        JSON.stringify({ 
          success: true,
          session_token: newToken,
          expires_in: 24 * 60 * 60 // 24 hours in seconds
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    if (action === 'validate') {
      if (!user_id || !session_token) {
        return new Response(
          JSON.stringify({ error: 'Missing user_id or session_token for validation' }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      console.log('Validating session for user:', user_id)

      const { data: validationResult, error: validateError } = await supabase.rpc('validate_user_session', {
        p_user_id: user_id,
        p_session_token: session_token,
        p_ip_address: ip_address || null,
        p_user_agent: user_agent || null
      })

      if (validateError) {
        console.error('Error validating session:', validateError)
        return new Response(
          JSON.stringify({ 
            is_valid: false,
            should_logout: true,
            error: 'Session validation failed'
          }),
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      const result = validationResult?.[0] || { 
        is_valid: false, 
        should_logout: true, 
        message: 'Invalid session',
        suspicious_activity: false 
      }

      console.log('Session validation result:', {
        is_valid: result.is_valid,
        suspicious_activity: result.suspicious_activity,
        message: result.message
      })

      return new Response(
        JSON.stringify(result),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    if (action === 'cleanup') {
      console.log('Cleaning up expired sessions')

      const { error: cleanupError } = await supabase.rpc('cleanup_expired_sessions')

      if (cleanupError) {
        console.error('Error cleaning sessions:', cleanupError)
        return new Response(
          JSON.stringify({ 
            success: false,
            error: 'Cleanup failed'
          }),
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'Sessions cleaned successfully'
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Unexpected error in session security:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Internal server error',
        details: error?.message
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})