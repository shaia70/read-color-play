import { serve } from "https://deno.land/std@0.208.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log("=== FIX PAYMENT STATUS ===");
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { payment_id, transaction_id } = await req.json();
    console.log("Fixing payment:", { payment_id, transaction_id });

    // Initialize Supabase with service role
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Update payment status to success
    const { data: paymentData, error: paymentError } = await supabase
      .from('payments')
      .update({
        status: 'success',
        verified_with_paypal: true,
        paypal_verification_date: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', payment_id)
      .select();

    if (paymentError) {
      console.error("Payment update error:", paymentError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to update payment status',
          details: paymentError 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log("Payment status updated:", paymentData);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Payment status updated to success',
        payment_data: paymentData,
        payment_id: payment_id,
        transaction_id: transaction_id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in fix-payment-status:', error);
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