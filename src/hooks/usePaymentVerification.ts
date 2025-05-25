
import { useState, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface PaymentRecord {
  id: string;
  user_id: string;
  paypal_transaction_id?: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
}

export const usePaymentVerification = () => {
  const [hasValidPayment, setHasValidPayment] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();

  const checkPaymentStatus = useCallback(async (userId: string) => {
    if (isLoading) {
      console.log('Payment check already in progress, skipping...');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log('=== PAYMENT CHECK WITH DEBUG ===');
      console.log('User ID to check:', userId);
      
      // First, let's check what's in the session
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Current session user ID:', session?.user?.id);
      console.log('Session user email:', session?.user?.email);
      
      // Simple direct database access with detailed logging
      const { data: payments, error: dbError } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'completed');

      console.log('=== DATABASE QUERY RESULT ===');
      console.log('Query error:', dbError);
      console.log('Query result:', payments);
      console.log('Number of payments found:', payments?.length || 0);
      
      // Let's also try to fetch ALL payments for this user (without status filter) to see if there are any
      const { data: allPayments, error: allError } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', userId);
      
      console.log('=== ALL PAYMENTS FOR USER ===');
      console.log('All payments query error:', allError);
      console.log('All payments:', allPayments);
      console.log('Total payments for user:', allPayments?.length || 0);

      if (dbError) {
        console.error('Database error details:', dbError);
        throw new Error(`Database error: ${dbError.message}`);
      }

      const hasPayment = payments && payments.length > 0;
      setHasValidPayment(hasPayment);
      
      console.log('=== FINAL PAYMENT CHECK RESULT ===');
      console.log('Has valid payment:', hasPayment);
      
      if (hasPayment) {
        toast({
          title: language === 'he' ? 'תשלום נמצא' : 'Payment found',
          description: language === 'he' ? 'יש לך גישה לתוכן' : 'You have access to content'
        });
      } else {
        console.log('No completed payments found for this user');
      }
      
    } catch (err) {
      console.error('=== PAYMENT CHECK ERROR ===');
      console.error('Error details:', err);
      
      const errorMsg = language === 'he' 
        ? 'לא ניתן לבדוק את סטטוס התשלום כרגע' 
        : 'Cannot check payment status at the moment';
      
      setError(errorMsg);
      setHasValidPayment(false);
      
      toast({
        variant: "destructive",
        title: language === 'he' ? 'שגיאה' : 'Error',
        description: errorMsg
      });
    } finally {
      setIsLoading(false);
    }
  }, [language, isLoading]);

  const recordPayment = async (userId: string, sessionId: string, amount: number) => {
    try {
      console.log('=== RECORDING PAYMENT WITH DEBUG ===');
      console.log('User ID for payment:', userId);
      console.log('Session ID:', sessionId);
      console.log('Amount:', amount);
      
      // Check current session again
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Current session during payment recording:', session?.user?.id);
      console.log('Session matches user ID:', session?.user?.id === userId);
      
      // Simple direct database insert with detailed logging
      const { data, error } = await supabase
        .from('payments')
        .insert({
          user_id: userId,
          paypal_transaction_id: sessionId,
          amount,
          currency: 'ILS',
          status: 'completed'
        })
        .select()
        .single();

      console.log('=== INSERT PAYMENT RESULT ===');
      console.log('Insert data:', data);
      console.log('Insert error:', error);

      if (error) {
        console.error('Insert error details:', error);
        throw new Error(`Insert error: ${error.message}`);
      }
      
      console.log('Payment recorded successfully:', data);
      setHasValidPayment(true);
      
      toast({
        title: language === 'he' ? 'תשלום נרשם בהצלחה' : 'Payment recorded successfully',
        description: language === 'he' ? 'התשלום שלך נרשם במערכת' : 'Your payment has been recorded'
      });
      
    } catch (err) {
      console.error('=== RECORD PAYMENT ERROR ===');
      console.error('Error details:', err);
      
      const errorMsg = language === 'he' 
        ? 'לא ניתן לרשום את התשלום כרגע' 
        : 'Cannot record payment at the moment';
      
      setError(errorMsg);
      
      toast({
        variant: "destructive",
        title: language === 'he' ? 'שגיאה' : 'Error',
        description: errorMsg
      });
    }
  };

  return {
    hasValidPayment,
    isLoading,
    error,
    checkPaymentStatus,
    recordPayment
  };
};
