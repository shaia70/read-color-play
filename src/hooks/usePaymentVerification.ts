
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
      
      console.log('=== SIMPLIFIED PAYMENT CHECK ===');
      console.log('Checking payment status for user:', userId);
      
      // Simple direct database access with better error handling
      const { data: payments, error: dbError } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'completed');

      console.log('Database response:', { payments, dbError });

      if (dbError) {
        console.error('Database error details:', dbError);
        throw new Error(`Database error: ${dbError.message}`);
      }

      const hasPayment = payments && payments.length > 0;
      setHasValidPayment(hasPayment);
      
      console.log('=== PAYMENT CHECK RESULT ===');
      console.log('Has payment:', hasPayment);
      console.log('Number of payments found:', payments?.length || 0);
      
      if (hasPayment) {
        toast({
          title: language === 'he' ? 'תשלום נמצא' : 'Payment found',
          description: language === 'he' ? 'יש לך גישה לתוכן' : 'You have access to content'
        });
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
      console.log('=== RECORDING PAYMENT ===');
      console.log('User ID:', userId);
      console.log('Session ID:', sessionId);
      console.log('Amount:', amount);
      
      // Simple direct database insert
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

      console.log('Insert response:', { data, error });

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
