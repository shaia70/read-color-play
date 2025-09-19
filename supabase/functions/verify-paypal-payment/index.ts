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

// Handle CORS preflight requests
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== PAYPAL PAYMENT VERIFICATION ===');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const paypalClientId = Deno.env.get('PAYPAL_CLIENT_ID');
    const paypalClientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET');

    console.log('Environment variables:');
    console.log('SUPABASE_URL:', supabaseUrl ? 'EXISTS' : 'NOT FOUND');
    console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'EXISTS' : 'NOT FOUND');
    console.log('PAYPAL_CLIENT_ID:', paypalClientId ? 'EXISTS' : 'NOT FOUND');
    console.log('PAYPAL_CLIENT_SECRET:', paypalClientSecret ? 'EXISTS' : 'NOT FOUND');

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
    
    const { user_id, payment_id, amount } = await req.json();
    
    console.log('Request body:', { user_id, payment_id, amount });
    
    if (!user_id || !payment_id || !amount) {
      console.error('Missing required fields');
      return new Response(
        JSON.stringify({ error: 'Missing required fields: user_id, payment_id, amount' }),
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

    // Step 2: Verify Payment with PayPal - using Orders API v2
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

    // Step 3: Validate Payment Details
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
    const expectedAmount = parseFloat(amount.toString());
    
    if (Math.abs(paymentAmount - expectedAmount) > 0.01) {
      console.error('Amount mismatch. Expected:', expectedAmount, 'Got:', paymentAmount);
      return new Response(
        JSON.stringify({ 
          error: 'Payment amount mismatch', 
          expected: expectedAmount,
          actual: paymentAmount,
          verified: false 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Step 4: Check if payment already recorded
    const { data: existingPayment } = await supabase
      .from('payments')
      .select('id')
      .eq('paypal_transaction_id', payment_id)
      .single();

    if (existingPayment) {
      console.log('Payment already recorded');
      return new Response(
        JSON.stringify({ 
          success: true, 
          verified: true,
          message: 'Payment already recorded',
          already_exists: true
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Step 5: Record Payment
    console.log('Recording verified payment...');
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: user_id,
        paypal_transaction_id: payment_id,
        amount: paymentAmount,
        currency: orderDetails.purchase_units[0].amount.currency_code,
        status: 'success',
        service_type: 'flipbook',
        payer_email: orderDetails.payer.email_address,
        payer_id: orderDetails.payer.payer_id
      })
      .select()
      .single();

    if (paymentError) {
      console.error('Payment insertion error:', paymentError);
      return new Response(
        JSON.stringify({ error: 'Failed to record payment', details: paymentError.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Payment recorded successfully:', payment);

    // Step 6: Grant Service Access
    console.log('Granting service access...');
    
    // Calculate access duration based on payment amount
    const duration_days = paymentAmount >= 60 ? 3650 : 30; // 10 years for 60+ ILS, 30 days for less
    console.log(`Granting ${duration_days} days access for payment of ${paymentAmount} ILS`);
    
    const { error: accessError } = await supabase.rpc('grant_service_access', {
      user_id: user_id,
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

    console.log('Access granted successfully for user:', user_id);

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
        message: 'Payment verified with PayPal and access granted successfully'
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