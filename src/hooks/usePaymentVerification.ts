
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
      
      console.log('=== PAYMENT CHECK USING EDGE FUNCTION ===');
      console.log('User ID to check:', userId);
      
      // Use the edge function for payment checking
      const { data, error: functionError } = await supabase.functions.invoke('check-payment', {
        body: { user_id: userId }
      });

      console.log('=== EDGE FUNCTION RESPONSE ===');
      console.log('Function data:', data);
      console.log('Function error:', functionError);

      if (functionError) {
        console.error('Edge function error:', functionError);
        throw new Error(`Function error: ${functionError.message}`);
      }

      const hasPayment = data?.hasValidPayment || false;
      setHasValidPayment(hasPayment);
      
      console.log('=== FINAL PAYMENT CHECK RESULT ===');
      console.log('Has valid payment:', hasPayment);
      console.log('Payments found:', data?.payments?.length || 0);
      
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
      console.log('=== RECORDING PAYMENT USING EDGE FUNCTION ===');
      console.log('User ID for payment:', userId);
      console.log('Session ID:', sessionId);
      console.log('Amount:', amount);
      
      // Use the edge function for payment recording
      const { data, error: functionError } = await supabase.functions.invoke('record-payment', {
        body: {
          user_id: userId,
          transaction_id: sessionId,
          amount: amount
        }
      });

      console.log('=== EDGE FUNCTION RECORD RESULT ===');
      console.log('Function data:', data);
      console.log('Function error:', functionError);

      if (functionError) {
        console.error('Edge function error:', functionError);
        throw new Error(`Function error: ${functionError.message}`);
      }

      if (!data?.success) {
        throw new Error('Payment recording failed');
      }
      
      console.log('Payment recorded successfully via edge function:', data);
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
