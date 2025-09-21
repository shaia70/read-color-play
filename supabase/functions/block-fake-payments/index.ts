import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Emergency function to block fake payments and revoke unauthorized access
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== BLOCK FAKE PAYMENTS FUNCTION ===');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

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
    
    // Find all unverified payments that granted access
    const { data: suspiciousPayments, error: queryError } = await supabase
      .from('payments')
      .select('id, user_id, paypal_transaction_id, amount, status')
      .eq('verified_with_paypal', false)
      .eq('status', 'success');

    if (queryError) {
      console.error('Query error:', queryError);
      return new Response(
        JSON.stringify({ error: 'Database query failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
      );
    }

    console.log('Found suspicious payments:', suspiciousPayments?.length || 0);

    if (suspiciousPayments && suspiciousPayments.length > 0) {
      // Mark suspicious payments as pending
      await supabase
        .from('payments')
        .update({ status: 'pending', requires_paypal_verification: true })
        .in('id', suspiciousPayments.map(p => p.id));

      // Revoke access for users with unverified payments
      const userIds = suspiciousPayments.map(p => p.user_id);
      await supabase
        .from('users')
        .update({
          paid_for_flipbook: false,
          flipbook_access_expires_at: null,
          has_paid: false
        })
        .in('id', userIds);

      // Log security incident
      await supabase.from('security_audit_log').insert({
        action: 'blocked_fake_payments_bulk',
        resource: 'payments',
        details: {
          incident: 'Blocked multiple unverified payments',
          count: suspiciousPayments.length,
          payment_ids: suspiciousPayments.map(p => p.paypal_transaction_id),
          action_taken: 'Revoked access, requires re-verification',
          severity: 'CRITICAL'
        }
      });
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        blocked_payments: suspiciousPayments?.length || 0,
        message: 'Security sweep completed - all fake payments blocked'
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