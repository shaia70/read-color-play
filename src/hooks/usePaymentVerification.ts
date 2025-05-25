
import { useState, useCallback } from 'react';
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

  const checkPaymentStatus = useCallback(async (userId: string) => {
    // Prevent multiple simultaneous calls
    if (isLoading) {
      console.log('Payment check already in progress, skipping...');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log('=== PAYMENT CHECK START (Edge Function) ===');
      console.log('Checking payment status for user:', userId);
      
      const response = await fetch('/functions/v1/check-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ user_id: userId })
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Edge Function error:', result);
        setError(language === 'he' ? 'שגיאה בבדיקת התשלום' : 'Error checking payment');
        setHasValidPayment(false);
        return;
      }

      const hasPayment = result.hasValidPayment;
      setHasValidPayment(hasPayment);
      
      console.log('=== PAYMENT CHECK RESULT (Edge Function) ===');
      console.log('Has payment:', hasPayment);
      console.log('Number of payments found:', result.payments?.length || 0);
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
      console.log('=== RECORDING PAYMENT (Edge Function) ===');
      console.log('Recording payment for user:', userId);
      console.log('Session ID:', sessionId);
      console.log('Amount:', amount);
      
      const response = await fetch('/functions/v1/record-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          user_id: userId,
          transaction_id: sessionId,
          amount
        })
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Edge Function error:', result);
        setError(language === 'he' ? 'שגיאה ברישום התשלום' : 'Error recording payment');
        return;
      }
      
      console.log('Payment recorded successfully via Edge Function:', result);
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
