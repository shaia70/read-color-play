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

interface PayPalOrderDetails {
  id: string;
  intent: string;
  status: string;
  payment_source?: any;
  purchase_units: Array<{
    reference_id: string;
    amount: {
      currency_code: string;
      value: string;
    };
    payee?: {
      email_address: string;
      merchant_id: string;
    };
    description?: string;
    payments?: {
      captures: Array<{
        id: string;
        status: string;
        amount: {
          currency_code: string;
          value: string;
        };
        create_time: string;
        update_time: string;
      }>;
    };
  }>;
  payer?: {
    name?: {
      given_name: string;
      surname: string;
    };
    email_address: string;
    payer_id: string;
    address?: {
      country_code: string;
    };
  };
  create_time: string;
  update_time: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== VERIFYING TRANSACTION WITH PAYPAL ===');
    
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const paypalClientId = Deno.env.get('PAYPAL_CLIENT_ID');
    const paypalClientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET');

    console.log('Environment variables:');
    console.log('SUPABASE_URL:', supabaseUrl ? 'EXISTS' : 'MISSING');
    console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'EXISTS' : 'MISSING');
    console.log('PAYPAL_CLIENT_ID:', paypalClientId ? 'EXISTS' : 'MISSING');
    console.log('PAYPAL_CLIENT_SECRET:', paypalClientSecret ? 'EXISTS' : 'MISSING');

    if (!paypalClientId || !paypalClientSecret) {
      throw new Error('PayPal credentials not configured');
    }

    // Parse request body
    const { transaction_id } = await req.json();
    console.log('Transaction ID to verify:', transaction_id);

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

    // Verify the transaction with PayPal
    console.log('Verifying transaction with PayPal:', transaction_id);
    const orderResponse = await fetch(`https://api.paypal.com/v2/checkout/orders/${transaction_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('PayPal API Response Status:', orderResponse.status);

    if (!orderResponse.ok) {
      const errorText = await orderResponse.text();
      console.error('PayPal order verification failed:', errorText);
      
      return new Response(JSON.stringify({
        success: false,
        verified: false,
        error: 'Transaction not found in PayPal',
        details: errorText,
        transaction_id
      }), {
        status: 200, // Return 200 but with verification failure
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const orderDetails: PayPalOrderDetails = await orderResponse.json();
    console.log('PayPal order details:', JSON.stringify(orderDetails, null, 2));

    // Log to Supabase audit log
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    await supabase.from('security_audit_log').insert({
      action: 'paypal_transaction_verification',
      resource: 'payments',
      details: {
        transaction_id,
        paypal_status: orderDetails.status,
        verification_result: 'found',
        payer_email: orderDetails.payer?.email_address,
        amount: orderDetails.purchase_units[0]?.amount?.value,
        currency: orderDetails.purchase_units[0]?.amount?.currency_code,
        create_time: orderDetails.create_time,
        update_time: orderDetails.update_time
      }
    });

    return new Response(JSON.stringify({
      success: true,
      verified: true,
      transaction_details: {
        id: orderDetails.id,
        status: orderDetails.status,
        amount: orderDetails.purchase_units[0]?.amount,
        payer: orderDetails.payer,
        create_time: orderDetails.create_time,
        update_time: orderDetails.update_time,
        description: orderDetails.purchase_units[0]?.description
      },
      message: 'Transaction successfully verified with PayPal'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in verify-transaction-with-paypal:', error);
    
    return new Response(JSON.stringify({
      success: false,
      verified: false,
      error: error.message,
      details: 'Failed to verify transaction with PayPal'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});