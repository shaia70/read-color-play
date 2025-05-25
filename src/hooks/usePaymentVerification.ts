
import { useState, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
      
      console.log('=== CHECKING PAYMENT STATUS (Edge Function Only) ===');
      console.log('User ID to check:', userId);
      
      // Check if user came back from PayPal
      const urlParams = new URLSearchParams(window.location.search);
      const paymentStatus = urlParams.get('payment');
      
      if (paymentStatus === 'success') {
        console.log('PayPal success detected, recording payment via Edge Function...');
        
        // Record payment using Edge Function
        const { data: recordResult, error: recordError } = await supabase.functions.invoke('record-payment', {
          body: {
            user_id: userId,
            transaction_id: 'paypal_success_' + Date.now(),
            amount: 70
          }
        });

        console.log('Record payment result:', { recordResult, recordError });

        if (recordError) {
          console.error('Error recording payment via Edge Function:', recordError);
          throw recordError;
        }

        console.log('Payment recorded successfully via Edge Function:', recordResult);
        setHasValidPayment(true);
        
        toast({
          title: language === 'he' ? 'תשלום בוצע בהצלחה' : 'Payment successful',
          description: language === 'he' ? 'יש לך גישה לתוכן' : 'You have access to content'
        });
        
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      }

      // Check payment status using Edge Function ONLY
      console.log('Calling check-payment Edge Function...');
      const { data: checkResult, error: checkError } = await supabase.functions.invoke('check-payment', {
        body: { user_id: userId }
      });

      console.log('Check payment Edge Function result:', { checkResult, checkError });

      if (checkError) {
        console.error('Error checking payment via Edge Function:', checkError);
        throw checkError;
      }

      console.log('Payment check result from Edge Function:', checkResult);
      
      if (checkResult?.hasValidPayment) {
        console.log('Valid payment found via Edge Function');
        setHasValidPayment(true);
        toast({
          title: language === 'he' ? 'תשלום נמצא' : 'Payment found',
          description: language === 'he' ? 'יש לך גישה לתוכן' : 'You have access to content'
        });
      } else {
        console.log('No valid payments found');
        setHasValidPayment(false);
      }
      
    } catch (err) {
      console.error('=== PAYMENT CHECK ERROR ===');
      console.error('Error details:', err);
      
      const errorMsg = language === 'he' 
        ? 'בעיה בבדיקת התשלום' 
        : 'Payment check issue';
      
      setError(errorMsg);
      setHasValidPayment(false);
      
      toast({
        variant: "destructive",
        title: language === 'he' ? 'התראה' : 'Notice',
        description: errorMsg
      });
    } finally {
      setIsLoading(false);
    }
  }, [language, isLoading]);

  const confirmPaymentCompletion = async (userId: string) => {
    try {
      setIsLoading(true);
      console.log('=== CONFIRMING PAYMENT COMPLETION ===');
      console.log('User ID:', userId);
      
      // SECURITY FIX: Check if payment already exists FIRST
      console.log('Checking for existing payment before allowing access...');
      const { data: checkResult, error: checkError } = await supabase.functions.invoke('check-payment', {
        body: { user_id: userId }
      });

      console.log('Existing payment check result:', { checkResult, checkError });

      if (checkError) {
        console.error('Error checking existing payment:', checkError);
        throw checkError;
      }

      if (checkResult?.hasValidPayment) {
        console.log('Valid payment already exists, granting access');
        setHasValidPayment(true);
        
        toast({
          title: language === 'he' ? 'תשלום נמצא במערכת' : 'Payment found in system',
          description: language === 'he' ? 'יש לך גישה לתוכן' : 'You have access to content'
        });
        return;
      }

      // SECURITY: If no payment exists, DO NOT create one automatically
      // This would be a security vulnerability
      console.log('No valid payment found - access denied');
      
      toast({
        variant: "destructive",
        title: language === 'he' ? 'לא נמצא תשלום' : 'No payment found',
        description: language === 'he' 
          ? 'לא נמצא תשלום תקף במערכת. אנא השלם תשלום דרך PayPal תחילה.'
          : 'No valid payment found in system. Please complete payment through PayPal first.'
      });
      
    } catch (err) {
      console.error('=== CONFIRM PAYMENT ERROR ===');
      console.error('Error details:', err);
      
      const errorMsg = language === 'he' 
        ? 'בעיה באישור התשלום' 
        : 'Payment confirmation issue';
      
      setError(errorMsg);
      
      toast({
        variant: "destructive",
        title: language === 'he' ? 'שגיאה' : 'Error',
        description: errorMsg
      });
    } finally {
      setIsLoading(false);
    }
  };

  const recordPayment = async (userId: string, sessionId: string, amount: number) => {
    try {
      console.log('=== RECORDING PAYMENT (Edge Function Only) ===');
      console.log('User ID for payment:', userId);
      console.log('Session ID:', sessionId);
      console.log('Amount:', amount);
      
      // Record payment using Edge Function ONLY
      const { data: result, error: insertError } = await supabase.functions.invoke('record-payment', {
        body: {
          user_id: userId,
          transaction_id: sessionId,
          amount: amount
        }
      });

      console.log('Record payment Edge Function result:', { result, insertError });

      if (insertError) {
        console.error('Error recording payment via Edge Function:', insertError);
        throw insertError;
      }

      console.log('Payment recorded successfully via Edge Function:', result);
      setHasValidPayment(true);
      
      toast({
        title: language === 'he' ? 'תשלום נרשם בהצלחה' : 'Payment recorded successfully',
        description: language === 'he' ? 'התשלום שלך נרשם' : 'Your payment has been recorded'
      });
      
    } catch (err) {
      console.error('=== RECORD PAYMENT ERROR ===');
      console.error('Error details:', err);
      
      const errorMsg = language === 'he' 
        ? 'בעיה ברישום התשלום' 
        : 'Payment recording issue';
      
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
    confirmPaymentCompletion,
    recordPayment
  };
};
