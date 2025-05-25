
import { useState, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

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
      
      console.log('=== PAYMENT CHECK START (Supabase Functions) ===');
      console.log('Checking payment status for user:', userId);
      
      const { data, error } = await supabase.functions.invoke('check-payment', {
        body: { user_id: userId }
      });

      if (error) {
        console.error('Supabase function error:', error);
        setError(language === 'he' ? 'שגיאה בבדיקת התשלום' : 'Error checking payment');
        setHasValidPayment(false);
        return;
      }

      const hasPayment = data?.hasValidPayment || false;
      setHasValidPayment(hasPayment);
      
      console.log('=== PAYMENT CHECK RESULT (Supabase Functions) ===');
      console.log('Has payment:', hasPayment);
      console.log('Number of payments found:', data?.payments?.length || 0);
      console.log('=== PAYMENT CHECK END ===');
      
    } catch (err) {
      console.error('=== PAYMENT CHECK ERROR ===');
      console.error('Unexpected error during payment check:', err);
      setError(language === 'he' ? 'שגיאה בבדיקת התשלום' : 'Error checking payment');
      setHasValidPayment(false);
    } finally {
      setIsLoading(false);
    }
  }, [language, isLoading]);

  const recordPayment = async (userId: string, sessionId: string, amount: number) => {
    try {
      console.log('=== RECORDING PAYMENT (Supabase Functions) ===');
      console.log('Recording payment for user:', userId);
      console.log('Session ID:', sessionId);
      console.log('Amount:', amount);
      
      const { data, error } = await supabase.functions.invoke('record-payment', {
        body: {
          user_id: userId,
          transaction_id: sessionId,
          amount
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        setError(language === 'he' ? 'שגיאה ברישום התשלום' : 'Error recording payment');
        return;
      }
      
      console.log('Payment recorded successfully via Supabase Functions:', data);
      setHasValidPayment(true);
      
    } catch (err) {
      console.error('Unexpected error recording payment:', err);
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
