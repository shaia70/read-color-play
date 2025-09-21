import { serve } from "https://deno.land/std@0.208.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log("=== UPDATE PAYMENT FROM PAYPAL ===");
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { transaction_id } = await req.json();
    console.log("Transaction ID received:", transaction_id);

    if (!transaction_id) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Transaction ID is required' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Initialize Supabase client with service role
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get PayPal credentials
    const clientId = Deno.env.get('PAYPAL_CLIENT_ID');
    const clientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET');

    if (!clientId || !clientSecret) {
      console.error("PayPal credentials not found");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'PayPal credentials not configured' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log("Getting PayPal access token...");

    // Get PayPal access token
    const authResponse = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials'
    });

    if (!authResponse.ok) {
      console.error("Failed to get PayPal access token:", authResponse.status);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to authenticate with PayPal' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const authData = await authResponse.json();
    console.log("PayPal access token obtained");

    // Get transaction details from PayPal API
    console.log(`Calling PayPal API for transaction: ${transaction_id}`);
    const transactionResponse = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${transaction_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authData.access_token}`,
        'Content-Type': 'application/json',
      }
    });

    console.log("PayPal API response status:", transactionResponse.status);

    if (!transactionResponse.ok) {
      const errorText = await transactionResponse.text();
      console.error("PayPal API error:", errorText);
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Transaction not found in PayPal',
          paypal_error: errorText,
          transaction_id: transaction_id
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const paypalData = await transactionResponse.json();
    console.log("PayPal response data:", JSON.stringify(paypalData, null, 2));

    // Extract useful information
    const sessionId = paypalData.id; // This is the session ID
    const payerEmail = paypalData.payer?.email_address;
    const payerId = paypalData.payer?.payer_id;
    const status = paypalData.status;
    const amount = paypalData.purchase_units?.[0]?.amount?.value;

    console.log("Extracted data:", {
      sessionId,
      payerEmail,
      payerId,
      status,
      amount
    });

    // Update payment record in database
    const { data: updateData, error: updateError } = await supabase
      .from('payments')
      .update({
        verified_with_paypal: true,
        paypal_verification_date: new Date().toISOString(),
        payer_email: payerEmail,
        payer_id: payerId,
        status: status === 'COMPLETED' ? 'success' : 'pending',
        updated_at: new Date().toISOString()
      })
      .eq('paypal_transaction_id', transaction_id)
      .select();

    if (updateError) {
      console.error("Failed to update payment:", updateError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to update payment record',
          details: updateError 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log("Payment updated successfully:", updateData);

    // If payment is completed, update user access
    if (status === 'COMPLETED') {
      const payment = updateData[0];
      if (payment?.user_id) {
        console.log("Granting service access to user:", payment.user_id);
        
        const { data: accessData, error: accessError } = await supabase.rpc('grant_service_access', {
          user_id: payment.user_id,
          service_name: payment.service_type || 'flipbook',
          duration_days: 30,
          amount: parseFloat(amount || '0')
        });

        if (accessError) {
          console.error("Failed to grant access:", accessError);
        } else {
          console.log("Access granted successfully");
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        session_id: sessionId,
        transaction_id: transaction_id,
        paypal_status: status,
        payer_email: payerEmail,
        payer_id: payerId,
        amount: amount,
        payment_updated: !!updateData?.length,
        paypal_data: paypalData
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in update-payment-from-paypal:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Internal server error',
        stack: error.stack
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});