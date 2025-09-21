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
    console.log('=== FULL PAYPAL DETAILS EXTRACTION ===');
    
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
    console.log('Transaction ID for full details:', transaction_id);

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

    // Get complete order details from PayPal
    console.log('Getting complete PayPal order details:', transaction_id);
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

    const fullOrderDetails = await orderResponse.json();
    console.log('=== COMPLETE PAYPAL ORDER DETAILS ===');
    console.log(JSON.stringify(fullOrderDetails, null, 2));

    // Extract all possible IDs and details
    const extractedDetails = {
      // Main Order Information
      order_id: fullOrderDetails.id,
      intent: fullOrderDetails.intent,
      status: fullOrderDetails.status,
      create_time: fullOrderDetails.create_time,
      update_time: fullOrderDetails.update_time,
      
      // Payer Information
      payer: {
        payer_id: fullOrderDetails.payer?.payer_id,
        email_address: fullOrderDetails.payer?.email_address,
        name: fullOrderDetails.payer?.name,
        address: fullOrderDetails.payer?.address,
        phone: fullOrderDetails.payer?.phone
      },
      
      // Payment Source
      payment_source: fullOrderDetails.payment_source,
      
      // Purchase Units (contains capture details)
      purchase_units: fullOrderDetails.purchase_units?.map((unit: any) => ({
        reference_id: unit.reference_id,
        amount: unit.amount,
        payee: unit.payee,
        description: unit.description,
        custom_id: unit.custom_id,
        invoice_id: unit.invoice_id,
        soft_descriptor: unit.soft_descriptor,
        
        // Payments within purchase unit (IMPORTANT - contains capture IDs)
        payments: unit.payments ? {
          captures: unit.payments.captures?.map((capture: any) => ({
            id: capture.id, // THIS IS THE CAPTURE/TRANSACTION ID
            status: capture.status,
            amount: capture.amount,
            final_capture: capture.final_capture,
            seller_protection: capture.seller_protection,
            seller_receivable_breakdown: capture.seller_receivable_breakdown,
            create_time: capture.create_time,
            update_time: capture.update_time,
            processor_response: capture.processor_response
          })),
          authorizations: unit.payments.authorizations,
          refunds: unit.payments.refunds
        } : null,
        
        // Shipping information
        shipping: unit.shipping
      })),
      
      // Application Context
      application_context: fullOrderDetails.application_context,
      
      // Links
      links: fullOrderDetails.links,
      
      // Any additional fields
      debug_id: fullOrderDetails.debug_id,
      session_id: fullOrderDetails.session_id,
      processing_instruction: fullOrderDetails.processing_instruction
    };

    // Log to Supabase audit log
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    await supabase.from('security_audit_log').insert({
      action: 'full_paypal_details_extraction',
      resource: 'payments',
      details: {
        transaction_id,
        extracted_details: extractedDetails,
        raw_response_keys: Object.keys(fullOrderDetails),
        extraction_purpose: 'complete_transaction_analysis'
      }
    });

    console.log('=== EXTRACTED DETAILS SUMMARY ===');
    console.log('Order ID:', extractedDetails.order_id);
    console.log('Capture IDs:', extractedDetails.purchase_units?.[0]?.payments?.captures?.map(c => c.id));
    console.log('Payer Email:', extractedDetails.payer.email_address);
    console.log('Status:', extractedDetails.status);

    return new Response(JSON.stringify({
      success: true,
      transaction_id,
      extracted_details: extractedDetails,
      raw_paypal_response: fullOrderDetails,
      summary: {
        order_id: extractedDetails.order_id,
        capture_ids: extractedDetails.purchase_units?.[0]?.payments?.captures?.map(c => c.id) || [],
        payer_email: extractedDetails.payer.email_address,
        status: extractedDetails.status,
        amount: extractedDetails.purchase_units?.[0]?.amount,
        create_time: extractedDetails.create_time,
        update_time: extractedDetails.update_time
      },
      message: 'Complete PayPal details extracted successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in get-full-paypal-details:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      details: 'Failed to extract complete PayPal details'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});