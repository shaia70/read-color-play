import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8'

// Manual verification for the specific payment issue
// This is a one-time fix for the 5XE03844WW957952U transaction

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== MANUAL VERIFY PAYMENT 5XE03844WW957952U ===');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const paypalClientId = Deno.env.get('PAYPAL_CLIENT_ID');
    const paypalClientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET');

    if (!supabaseUrl || !supabaseServiceKey || !paypalClientId || !paypalClientSecret) {
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const paymentId = '5XE03844WW957952U';
    
    console.log('Verifying PayPal payment:', paymentId);

    // Get PayPal Access Token
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
        JSON.stringify({ error: 'Failed to get PayPal token', details: tokenError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
      );
    }

    const tokenData = await tokenResponse.json();
    console.log('Got PayPal token successfully');

    // Verify Payment with PayPal
    const paymentResponse = await fetch(`https://api.paypal.com/v2/checkout/orders/${paymentId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json'
      }
    });

    const paymentData = await paymentResponse.json();
    console.log('PayPal verification result:', JSON.stringify(paymentData, null, 2));

    if (paymentResponse.ok && paymentData.status === 'COMPLETED') {
      const amount = parseFloat(paymentData.purchase_units[0].amount.value);
      const currency = paymentData.purchase_units[0].amount.currency_code;
      const payerEmail = paymentData.payer.email_address;
      const payerId = paymentData.payer.payer_id;

      console.log('Payment verified:', { amount, currency, payerEmail, payerId });

      // Update the payment record
      const { data: payment, error: updateError } = await supabase
        .from('payments')
        .update({
          verified_with_paypal: true,
          paypal_verification_date: new Date().toISOString(),
          status: 'success',
          payer_email: payerEmail,
          payer_id: payerId,
          requires_paypal_verification: false
        })
        .eq('paypal_transaction_id', paymentId)
        .select()
        .single();

      if (updateError) {
        console.error('Payment update error:', updateError);
        return new Response(
          JSON.stringify({ error: 'Failed to update payment', details: updateError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
        );
      }

      console.log('Payment updated successfully');

      // Grant service access
      const durationDays = amount >= 60 ? 3650 : 30;
      const { error: accessError } = await supabase.rpc('grant_service_access', {
        user_id: payment.user_id,
        service_name: 'flipbook',
        duration_days: durationDays,
        amount: amount
      });

      if (accessError) {
        console.error('Access grant error:', accessError);
        return new Response(
          JSON.stringify({ error: 'Payment verified but failed to grant access', details: accessError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
        );
      }

      console.log('Access granted successfully');

      // Log the successful resolution
      await supabase.from('security_audit_log').insert({
        action: 'payment_issue_resolved',
        resource: 'payments',
        details: {
          payment_id: paymentId,
          user_id: payment.user_id,
          amount: amount,
          currency: currency,
          payer_email: payerEmail,
          resolution: 'Payment verified via PayPal API and access granted',
          duration_granted_days: durationDays
        }
      });

      return new Response(
        JSON.stringify({ 
          success: true,
          verified: true,
          payment_details: {
            id: paymentId,
            amount: amount,
            currency: currency,
            payer_email: payerEmail,
            status: 'COMPLETED'
          },
          access_granted: true,
          duration_days: durationDays,
          message: 'Payment successfully verified and access granted'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
      );

    } else {
      console.error('Payment verification failed:', paymentData);
      return new Response(
        JSON.stringify({ 
          error: 'Payment verification failed',
          paypal_response: paymentData,
          verified: false 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
      );
    }

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
    );
  }
});