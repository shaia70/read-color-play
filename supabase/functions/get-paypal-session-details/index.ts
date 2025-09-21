import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PayPalTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== GETTING PAYPAL SESSION DETAILS ===');
    
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const paypalClientId = Deno.env.get('PAYPAL_CLIENT_ID');
    const paypalClientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET');

    console.log('Environment variables:');
    console.log('SUPABASE_URL:', supabaseUrl ? 'EXISTS' : 'MISSING');
    console.log('PAYPAL_CLIENT_ID:', paypalClientId ? 'EXISTS' : 'MISSING');

    if (!paypalClientId || !paypalClientSecret) {
      throw new Error('PayPal credentials not configured');
    }

    // Parse request body
    const { transaction_id } = await req.json();
    console.log('Transaction ID for session details:', transaction_id);

    if (!transaction_id) {
      throw new Error('Transaction ID is required');
    }

    // Get PayPal access token
    console.log('Getting PayPal access token...');
    const tokenResponse = await fetch('https://api.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${paypalClientId}:${paypalClientSecret}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!tokenResponse.ok) {
      const tokenError = await tokenResponse.text();
      console.error('PayPal token error:', tokenError);
      throw new Error(`Failed to get PayPal access token: ${tokenError}`);
    }

    const tokenData: PayPalTokenResponse = await tokenResponse.json();
    console.log('PayPal token obtained successfully');

    // Get detailed transaction information from PayPal
    console.log('Getting detailed transaction info from PayPal:', transaction_id);
    const orderResponse = await fetch(`https://api.paypal.com/v2/checkout/orders/${transaction_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!orderResponse.ok) {
      const errorText = await orderResponse.text();
      console.error('PayPal order query failed:', errorText);
      
      return new Response(JSON.stringify({
        success: false,
        error: 'Transaction not found in PayPal',
        details: errorText,
        transaction_id
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const orderDetails = await orderResponse.json();
    console.log('Full PayPal order details:', JSON.stringify(orderDetails, null, 2));

    // Extract all relevant session and payment information
    const sessionInfo = {
      paypal_transaction_id: orderDetails.id,
      status: orderDetails.status,
      intent: orderDetails.intent,
      create_time: orderDetails.create_time,
      update_time: orderDetails.update_time,
      payer_info: orderDetails.payer,
      payment_source: orderDetails.payment_source,
      purchase_units: orderDetails.purchase_units,
      links: orderDetails.links,
      // Look for session-related fields
      session_id: orderDetails.session_id || null,
      debug_id: orderDetails.debug_id || null,
      application_context: orderDetails.application_context || null,
    };

    // Check if there are any session identifiers in the response
    console.log('Extracted session info:', JSON.stringify(sessionInfo, null, 2));

    // Log to Supabase audit log
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    await supabase.from('security_audit_log').insert({
      action: 'paypal_session_details_lookup',
      resource: 'payments',
      details: {
        transaction_id,
        session_info: sessionInfo,
        email_requested: 'see.marketing70@gmail.com',
        search_purpose: 'find_session_id'
      }
    });

    return new Response(JSON.stringify({
      success: true,
      transaction_id,
      session_info: sessionInfo,
      message: 'PayPal session details retrieved successfully',
      note: 'Session ID may be in session_id, debug_id, or application_context fields'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in get-paypal-session-details:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      details: 'Failed to get PayPal session details'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});