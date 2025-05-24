
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

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
      
      // Dynamically import the client getter to avoid immediate initialization
      const { getSupabaseClient } = await import('@/integrations/supabase/client');
      console.log('Imported getSupabaseClient, creating client...');
      
      const supabase = getSupabaseClient();
      console.log('Supabase client created, querying payments...');
      
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
        setError(language === 'he' ? 'שגיאה בבדיקת התשלום' : 'Error checking payment');
        setHasValidPayment(false);
        return;
      }
      
      const hasPayment = payments && payments.length > 0;
      console.log('Payment found:', hasPayment);
      setHasValidPayment(hasPayment);
      
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
      const paymentRecord = {
        user_id: userId,
        paypal_transaction_id: sessionId,
        amount,
        status: 'completed' as const,
        currency: 'ILS'
      };
      
      console.log('Recording payment:', paymentRecord);
      
      // Dynamically import the client getter to avoid immediate initialization
      const { getSupabaseClient } = await import('@/integrations/supabase/client');
      console.log('Imported getSupabaseClient for recording payment...');
      
      const supabase = getSupabaseClient();
      console.log('Supabase client created for recording, inserting payment...');
      
      const { data, error } = await supabase
        .from('payments')
        .insert([paymentRecord])
        .select()
        .single();
      
      if (error) {
        console.error('Error recording payment:', error);
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
