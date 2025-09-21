import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== CALLING PAYPAL SESSION CHECK ===');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Call the get-paypal-session-details function
    const { data, error } = await supabase.functions.invoke('get-paypal-session-details', {
      body: { transaction_id: '41970465SM2782405' }
    });

    console.log('Function response data:', JSON.stringify(data, null, 2));
    console.log('Function response error:', error);

    if (error) {
      console.error('Error calling function:', error);
      throw new Error(`Function call failed: ${error.message}`);
    }

    return new Response(JSON.stringify({
      success: true,
      result: data,
      message: 'Successfully retrieved PayPal session details'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in call-paypal-session-check:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});