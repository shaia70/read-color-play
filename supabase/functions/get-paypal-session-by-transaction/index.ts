import { serve } from "https://deno.land/std@0.208.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PayPalTransaction {
  id: string;
  status: string;
  intent: string;
  payer?: {
    email_address?: string;
    payer_id?: string;
  };
  purchase_units?: Array<{
    amount: {
      currency_code: string;
      value: string;
    };
    payments?: {
      captures?: Array<{
        id: string;
        status: string;
        amount: {
          currency_code: string;
          value: string;
        };
      }>;
    };
  }>;
  links?: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}

serve(async (req) => {
  console.log("=== GET PAYPAL SESSION BY TRANSACTION ===");
  
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

    console.log("PayPal credentials found, getting access token...");

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
      console.error("Failed to get PayPal access token:", authResponse.status, await authResponse.text());
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

    // Get transaction details from PayPal
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
          details: errorText,
          transaction_id: transaction_id
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const transactionData: PayPalTransaction = await transactionResponse.json();
    console.log("PayPal transaction data received:", JSON.stringify(transactionData, null, 2));

    // Extract session information
    const sessionInfo = {
      order_id: transactionData.id,
      status: transactionData.status,
      intent: transactionData.intent,
      payer_email: transactionData.payer?.email_address,
      payer_id: transactionData.payer?.payer_id,
      amount: transactionData.purchase_units?.[0]?.amount?.value,
      currency: transactionData.purchase_units?.[0]?.amount?.currency_code,
      captures: transactionData.purchase_units?.[0]?.payments?.captures,
      links: transactionData.links
    };

    console.log("Extracted session info:", JSON.stringify(sessionInfo, null, 2));

    return new Response(
      JSON.stringify({
        success: true,
        session_info: sessionInfo,
        raw_data: transactionData
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in get-paypal-session-by-transaction:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});