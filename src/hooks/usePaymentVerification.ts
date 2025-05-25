
import { useState, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

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
      
      console.log('=== PAYMENT CHECK START (Direct DB) ===');
      console.log('Checking payment status for user:', userId);
      
      // Try direct database access first
      const { data: payments, error: dbError } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(10);

      if (dbError) {
        console.error('Direct DB error:', dbError);
        
        // If direct access fails, try Edge Function
        console.log('Trying Edge Function as fallback...');
        const { data: functionData, error: functionError } = await supabase.functions.invoke('check-payment', {
          body: { user_id: userId }
        });

        if (functionError) {
          console.error('Edge Function error:', functionError);
          const errorMsg = language === 'he' ? 'שגיאה בבדיקת התשלום' : 'Error checking payment';
          setError(errorMsg);
          toast({
            variant: "destructive",
            title: language === 'he' ? 'שגיאה' : 'Error',
            description: errorMsg + ': ' + (functionError.message || 'Unknown error')
          });
          setHasValidPayment(false);
          return;
        }

        const hasPayment = functionData?.hasValidPayment || false;
        setHasValidPayment(hasPayment);
        console.log('=== PAYMENT CHECK RESULT (Edge Function) ===');
        console.log('Has payment:', hasPayment);
        console.log('Number of payments found:', functionData?.payments?.length || 0);
      } else {
        // Direct DB access succeeded
        const hasPayment = payments && payments.length > 0;
        setHasValidPayment(hasPayment);
        
        console.log('=== PAYMENT CHECK RESULT (Direct DB) ===');
        console.log('Has payment:', hasPayment);
        console.log('Number of payments found:', payments?.length || 0);
        console.log('Payments:', payments);
      }
      
      console.log('=== PAYMENT CHECK END ===');
      
    } catch (err) {
      console.error('=== PAYMENT CHECK ERROR ===');
      console.error('Unexpected error during payment check:', err);
      const errorMsg = language === 'he' ? 'שגיאה בבדיקת התשלום' : 'Error checking payment';
      setError(errorMsg);
      toast({
        variant: "destructive",
        title: language === 'he' ? 'שגיאה' : 'Error',
        description: errorMsg + ': ' + (err instanceof Error ? err.message : 'Unknown error')
      });
      setHasValidPayment(false);
    } finally {
      setIsLoading(false);
    }
  }, [language, isLoading]);

  const recordPayment = async (userId: string, sessionId: string, amount: number) => {
    try {
      console.log('=== RECORDING PAYMENT ===');
      console.log('Recording payment for user:', userId);
      console.log('Session ID:', sessionId);
      console.log('Amount:', amount);
      
      // Try direct database insert first
      const { data: directData, error: directError } = await supabase
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

      if (directError) {
        console.error('Direct DB insert error:', directError);
        
        // If direct insert fails, try Edge Function
        console.log('Trying Edge Function for payment recording...');
        const { data: functionData, error: functionError } = await supabase.functions.invoke('record-payment', {
          body: {
            user_id: userId,
            transaction_id: sessionId,
            amount
          }
        });

        if (functionError) {
          console.error('Edge Function error:', functionError);
          const errorMsg = language === 'he' ? 'שגיאה ברישום התשלום' : 'Error recording payment';
          setError(errorMsg);
          toast({
            variant: "destructive",
            title: language === 'he' ? 'שגיאה' : 'Error',
            description: errorMsg + ': ' + (functionError.message || 'Unknown error')
          });
          return;
        }
        
        console.log('Payment recorded successfully via Edge Function:', functionData);
        toast({
          title: language === 'he' ? 'תשלום נרשם בהצלחה' : 'Payment recorded successfully',
          description: language === 'he' ? 'התשלום שלך נרשם במערכת' : 'Your payment has been recorded'
        });
      } else {
        console.log('Payment recorded successfully via direct DB:', directData);
        toast({
          title: language === 'he' ? 'תשלום נרשם בהצלחה' : 'Payment recorded successfully',
          description: language === 'he' ? 'התשלום שלך נרשם במערכת' : 'Your payment has been recorded'
        });
      }
      
      setHasValidPayment(true);
      
    } catch (err) {
      console.error('Unexpected error recording payment:', err);
      const errorMsg = language === 'he' ? 'שגיאה ברישום התשלום' : 'Error recording payment';
      setError(errorMsg);
      toast({
        variant: "destructive",
        title: language === 'he' ? 'שגיאה' : 'Error',
        description: errorMsg + ': ' + (err instanceof Error ? err.message : 'Unknown error')
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
