
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

console.log('=== usePaymentVerification: Starting module load ===');

interface PaymentRecord {
  id: string;
  user_id: string;
  paypal_transaction_id: string | null;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  currency: string;
}

export const usePaymentVerification = () => {
  const [hasValidPayment, setHasValidPayment] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();

  const checkPaymentStatus = async (userId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Checking payment status for user:', userId);
      
      if (!supabase) {
        console.error('Supabase client not available');
        const localPayment = localStorage.getItem(`payment_${userId}`);
        setHasValidPayment(!!localPayment);
        return;
      }
      
      // Query Supabase for payment records
      const { data: payments, error: dbError } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'completed')
        .order('id', { ascending: false })
        .limit(1);
      
      if (dbError) {
        console.error('Supabase error:', dbError);
        // Fall back to localStorage if database query fails
        const localPayment = localStorage.getItem(`payment_${userId}`);
        setHasValidPayment(!!localPayment);
        return;
      }
      
      setHasValidPayment(payments && payments.length > 0);
      
    } catch (err) {
      console.error('Error checking payment:', err);
      setError(language === 'he' ? 'שגיאה בבדיקת התשלום' : 'Error checking payment');
      
      // Fall back to localStorage
      const localPayment = localStorage.getItem(`payment_${userId}`);
      setHasValidPayment(!!localPayment);
    } finally {
      setIsLoading(false);
    }
  };

  const recordPayment = async (userId: string, sessionId: string, amount: number) => {
    try {
      const paymentRecord = {
        user_id: userId,
        paypal_transaction_id: sessionId,
        amount,
        status: 'completed' as const,
        currency: 'ILS'
      };
      
      console.log('Recording payment:', paymentRecord);
      
      if (!supabase) {
        console.error('Supabase client not available, using localStorage fallback');
        localStorage.setItem(`payment_${userId}`, JSON.stringify({
          sessionId,
          amount,
          timestamp: new Date().toISOString()
        }));
        setHasValidPayment(true);
        return;
      }
      
      const { data, error } = await supabase
        .from('payments')
        .insert([paymentRecord])
        .select()
        .single();
      
      if (error) {
        console.error('Error recording payment:', error);
        // Fall back to localStorage
        localStorage.setItem(`payment_${userId}`, JSON.stringify({
          sessionId,
          amount,
          timestamp: new Date().toISOString()
        }));
      } else {
        console.log('Payment recorded successfully:', data);
      }
      
      setHasValidPayment(true);
      
    } catch (err) {
      console.error('Error recording payment:', err);
      setError(language === 'he' ? 'שגיאה ברישום התשלום' : 'Error recording payment');
      
      // Fall back to localStorage
      localStorage.setItem(`payment_${userId}`, JSON.stringify({
        sessionId,
        amount,
        timestamp: new Date().toISOString()
      }));
      setHasValidPayment(true);
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
