import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Handle CORS preflight requests
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== RECORD PAYMENT FUNCTION ===');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    console.log('Environment variables:');
    console.log('SUPABASE_URL:', supabaseUrl ? 'EXISTS' : 'NOT FOUND');
    console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? `EXISTS (length: ${supabaseServiceKey.length})` : 'NOT FOUND');

    if (!supabaseUrl || !supabaseServiceKey) {
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
    
    const { user_id, transaction_id, amount } = await req.json();
    
    console.log('Request body parsed:', { user_id, transaction_id, amount });
    
    if (!user_id || !transaction_id || !amount) {
      console.error('Missing required fields');
      return new Response(
        JSON.stringify({ error: 'Missing required fields: user_id, transaction_id, amount' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Recording payment:', { user_id, transaction_id, amount });

    // Insert payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: user_id,
        paypal_transaction_id: transaction_id,
        amount: amount,
        currency: 'ILS',
        status: 'success',
        service_type: 'flipbook'
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

    // Grant service access using RPC function
    console.log('Granting service access...');
    const { error: accessError } = await supabase.rpc('grant_service_access', {
      user_id: user_id,
      service_name: 'flipbook',
      duration_days: 30,
      amount: amount
    });

    if (accessError) {
      console.error('Access grant error:', accessError);
      return new Response(
        JSON.stringify({ error: 'Payment recorded but failed to grant access', details: accessError.message }),
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
        payment: payment,
        message: 'Payment recorded and access granted successfully'
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