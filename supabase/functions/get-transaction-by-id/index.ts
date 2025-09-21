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
    console.log('=== TRANSACTION SEARCH BY ID ===');
    
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const paypalClientId = Deno.env.get('PAYPAL_CLIENT_ID');
    const paypalClientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET');

    console.log('Environment variables:');
    console.log('PAYPAL_CLIENT_ID:', paypalClientId ? 'EXISTS' : 'MISSING');
    console.log('PAYPAL_CLIENT_SECRET:', paypalClientSecret ? 'EXISTS' : 'MISSING');

    if (!paypalClientId || !paypalClientSecret) {
      throw new Error('PayPal credentials not configured');
    }

    // Parse request body
    const { transaction_id } = await req.json();
    console.log('Transaction ID to search:', transaction_id);

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

    // Search for transaction using Transaction Search API
    console.log('Searching for transaction using Transaction Search API...');
    const searchUrl = `https://api.paypal.com/v1/reporting/transactions?transaction_id=${transaction_id}`;
    
    const searchResponse = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      console.error('PayPal transaction search failed:', errorText);
      
      return new Response(JSON.stringify({
        success: false,
        error: 'Transaction not found in PayPal Transaction Search API',
        details: errorText,
        transaction_id,
        search_url: searchUrl
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const transactionData = await searchResponse.json();
    console.log('=== TRANSACTION SEARCH RESULTS ===');
    console.log(JSON.stringify(transactionData, null, 2));

    // Extract transaction details
    const transactions = transactionData.transaction_details || [];
    const foundTransaction = transactions.find((t: any) => 
      t.transaction_info?.transaction_id === transaction_id
    );

    let extractedDetails = null;

    if (foundTransaction) {
      extractedDetails = {
        // Transaction Information
        transaction_id: foundTransaction.transaction_info?.transaction_id,
        paypal_reference_id: foundTransaction.transaction_info?.paypal_reference_id,
        paypal_reference_id_type: foundTransaction.transaction_info?.paypal_reference_id_type,
        transaction_event_code: foundTransaction.transaction_info?.transaction_event_code,
        transaction_initiation_date: foundTransaction.transaction_info?.transaction_initiation_date,
        transaction_updated_date: foundTransaction.transaction_info?.transaction_updated_date,
        transaction_amount: foundTransaction.transaction_info?.transaction_amount,
        fee_amount: foundTransaction.transaction_info?.fee_amount,
        transaction_status: foundTransaction.transaction_info?.transaction_status,
        transaction_subject: foundTransaction.transaction_info?.transaction_subject,
        ending_balance: foundTransaction.transaction_info?.ending_balance,
        available_balance: foundTransaction.transaction_info?.available_balance,
        invoice_id: foundTransaction.transaction_info?.invoice_id,
        custom_field: foundTransaction.transaction_info?.custom_field,
        protection_eligibility: foundTransaction.transaction_info?.protection_eligibility,
        
        // Payer Information
        payer_info: foundTransaction.payer_info ? {
          account_id: foundTransaction.payer_info.account_id,
          email_address: foundTransaction.payer_info.email_address,
          address_status: foundTransaction.payer_info.address_status,
          payer_status: foundTransaction.payer_info.payer_status,
          payer_name: foundTransaction.payer_info.payer_name,
          country_code: foundTransaction.payer_info.country_code
        } : null,
        
        // Shipping Information
        shipping_info: foundTransaction.shipping_info,
        
        // Cart Information
        cart_info: foundTransaction.cart_info,
        
        // Store Information
        store_info: foundTransaction.store_info,
        
        // Auction Information
        auction_info: foundTransaction.auction_info,
        
        // Incentive Information
        incentive_info: foundTransaction.incentive_info
      };

      console.log('=== EXTRACTED TRANSACTION DETAILS ===');
      console.log('Transaction ID:', extractedDetails.transaction_id);
      console.log('PayPal Reference ID:', extractedDetails.paypal_reference_id);
      console.log('Payer Email:', extractedDetails.payer_info?.email_address);
      console.log('Amount:', extractedDetails.transaction_amount);
      console.log('Status:', extractedDetails.transaction_status);
    }

    // Log to Supabase audit log
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    await supabase.from('security_audit_log').insert({
      action: 'paypal_transaction_search_by_id',
      resource: 'payments',
      details: {
        transaction_id,
        search_url: searchUrl,
        found_transaction: !!foundTransaction,
        extracted_details: extractedDetails,
        full_search_results: transactionData,
        search_purpose: 'find_transaction_by_dashboard_id'
      }
    });

    return new Response(JSON.stringify({
      success: true,
      transaction_id,
      found: !!foundTransaction,
      transaction_details: extractedDetails,
      full_search_results: transactionData,
      summary: foundTransaction ? {
        transaction_id: extractedDetails?.transaction_id,
        paypal_reference_id: extractedDetails?.paypal_reference_id,
        payer_email: extractedDetails?.payer_info?.email_address,
        amount: extractedDetails?.transaction_amount,
        status: extractedDetails?.transaction_status,
        date: extractedDetails?.transaction_initiation_date
      } : null,
      message: foundTransaction 
        ? 'Transaction found successfully' 
        : 'Transaction not found in search results'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in get-transaction-by-id:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      details: 'Failed to search for transaction by ID'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});