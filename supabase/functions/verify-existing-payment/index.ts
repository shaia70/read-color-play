import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PayPalTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface PayPalOrderDetails {
  id: string;
  status: string;
  purchase_units: [{
    amount: {
      currency_code: string;
      value: string;
    };
  }];
  payer: {
    email_address: string;
    payer_id: string;
  };
}

// Function to verify existing payments that were recorded incorrectly
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== VERIFY EXISTING PAYMENT ===');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const paypalClientId = Deno.env.get('PAYPAL_CLIENT_ID');
    const paypalClientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET');

    if (!supabaseUrl || !supabaseServiceKey || !paypalClientId || !paypalClientSecret) {
      console.error('Missing environment variables');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { payment_id } = await req.json();
    
    console.log('Verifying payment ID:', payment_id);
    
    if (!payment_id) {
      return new Response(
        JSON.stringify({ error: 'Missing payment_id' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Step 1: Get PayPal Access Token
    console.log('Getting PayPal access token...');
    const tokenResponse = await fetch('https://api.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-Language': 'en_US',
        'Authorization': `Basic ${btoa(`${paypalClientId}:${paypalClientSecret}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });

    if (!tokenResponse.ok) {
      const tokenError = await tokenResponse.text();
      console.error('PayPal token error:', tokenError);
      return new Response(
        JSON.stringify({ error: 'Failed to get PayPal access token', details: tokenError }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const tokenData: PayPalTokenResponse = await tokenResponse.json();
    console.log('PayPal token obtained successfully');

    // Step 2: Verify Payment with PayPal
    console.log('Verifying payment with PayPal:', payment_id);
    const paymentResponse = await fetch(`https://api.paypal.com/v2/checkout/orders/${payment_id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!paymentResponse.ok) {
      const paymentError = await paymentResponse.text();
      console.error('PayPal payment verification error:', paymentError);
      return new Response(
        JSON.stringify({ error: 'Failed to verify payment with PayPal', details: paymentError }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const orderDetails: PayPalOrderDetails = await paymentResponse.json();
    console.log('PayPal order details:', orderDetails);

    // Step 3: Validate Payment Status
    if (orderDetails.status !== 'COMPLETED') {
      console.error('Payment not completed. Status:', orderDetails.status);
      return new Response(
        JSON.stringify({ 
          error: 'Payment not completed', 
          status: orderDetails.status,
          verified: false 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const paymentAmount = parseFloat(orderDetails.purchase_units[0].amount.value);
    console.log('Payment verified successfully:', {
      id: orderDetails.id,
      amount: paymentAmount,
      currency: orderDetails.purchase_units[0].amount.currency_code,
      payer_email: orderDetails.payer.email_address
    });

    // Step 4: Update existing payment record
    const { data: payment, error: updateError } = await supabase
      .from('payments')
      .update({
        verified_with_paypal: true,
        paypal_verification_date: new Date().toISOString(),
        status: 'success',
        payer_email: orderDetails.payer.email_address,
        payer_id: orderDetails.payer.payer_id,
        requires_paypal_verification: false
      })
      .eq('paypal_transaction_id', payment_id)
      .select()
      .single();

    if (updateError) {
      console.error('Payment update error:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update payment', details: updateError.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Payment updated successfully:', payment);

    // Step 5: Grant Service Access
    console.log('Granting service access...');
    const duration_days = paymentAmount >= 60 ? 3650 : 30;
    
    const { error: accessError } = await supabase.rpc('grant_service_access', {
      user_id: payment.user_id,
      service_name: 'flipbook',
      duration_days: duration_days,
      amount: paymentAmount
    });

    if (accessError) {
      console.error('Access grant error:', accessError);
      return new Response(
        JSON.stringify({ error: 'Payment verified but failed to grant access', details: accessError.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Access granted successfully for user:', payment.user_id);

    // Log successful verification
    await supabase.from('security_audit_log').insert({
      action: 'payment_verified_and_corrected',
      resource: 'payments',
      details: {
        payment_id: payment_id,
        user_id: payment.user_id,
        amount: paymentAmount,
        currency: orderDetails.purchase_units[0].amount.currency_code,
        payer_email: orderDetails.payer.email_address,
        duration_granted: duration_days,
        status: 'SUCCESS'
      }
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        verified: true,
        payment: payment,
        paypal_details: {
          id: orderDetails.id,
          status: orderDetails.status,
          amount: orderDetails.purchase_units[0].amount,
          payer_email: orderDetails.payer.email_address
        },
        message: 'Payment verified and access granted successfully'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});