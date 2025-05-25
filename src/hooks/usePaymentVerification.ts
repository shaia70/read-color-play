
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

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

  const checkPaymentStatus = async (userId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Checking payment status for user:', userId);
      
      // Import supabase client
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { data: payments, error: paymentError } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(1);

      if (paymentError) {
        console.error('Error fetching payments:', paymentError);
        setError(language === 'he' ? 'שגיאה בבדיקת התשלום' : 'Error checking payment');
        setHasValidPayment(false);
        return;
      }

      const hasPayment = payments && payments.length > 0;
      setHasValidPayment(hasPayment);
      
      console.log('Payment status:', hasPayment ? 'found' : 'not found', payments);
      
    } catch (err) {
      console.error('Error checking payment:', err);
      setError(language === 'he' ? 'שגיאה בבדיקת התשלום' : 'Error checking payment');
      setHasValidPayment(false);
    } finally {
      setIsLoading(false);
    }
  };

  const recordPayment = async (userId: string, sessionId: string, amount: number) => {
    try {
      console.log('Recording payment for user:', userId);
      
      // Import supabase client
      const { supabase } = await import('@/integrations/supabase/client');
      
      const paymentData = {
        user_id: userId,
        paypal_transaction_id: sessionId,
        amount,
        status: 'completed' as const,
        currency: 'ILS'
      };
      
      const { data, error: recordError } = await supabase
        .from('payments')
        .insert(paymentData)
        .select()
        .single();
      
      if (recordError) {
        console.error('Error recording payment:', recordError);
        setError(language === 'he' ? 'שגיאה ברישום התשלום' : 'Error recording payment');
        return;
      }
      
      console.log('Payment recorded successfully:', data);
      setHasValidPayment(true);
      
    } catch (err) {
      console.error('Error recording payment:', err);
      setError(language === 'he' ? 'שגיאה ברישום התשלום' : 'Error recording payment');
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
