
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
      
      console.log('=== ENHANCED PAYMENT DEBUG ===');
      console.log('User ID to check:', userId);
      console.log('User ID type:', typeof userId);
      console.log('User ID length:', userId?.length);
      
      // Check if user came back from PayPal
      const urlParams = new URLSearchParams(window.location.search);
      const paymentStatus = urlParams.get('payment');
      
      if (paymentStatus === 'success') {
        console.log('PayPal success detected, recording payment...');
        
        const { data: recordResult, error: recordError } = await supabase.functions.invoke('record-payment', {
          body: {
            user_id: userId,
            transaction_id: 'paypal_success_' + Date.now(),
            amount: 70
          }
        });

        console.log('Record payment result:', { recordResult, recordError });

        if (recordError) {
          console.error('Error recording payment:', recordError);
          throw recordError;
        }

        if (recordResult?.success) {
          console.log('Payment recorded successfully:', recordResult);
          setHasValidPayment(true);
          
          toast({
            title: language === 'he' ? 'תשלום בוצע בהצלחה' : 'Payment successful',
            description: language === 'he' ? 'יש לך גישה לתוכן' : 'You have access to content'
          });
          
          window.history.replaceState({}, document.title, window.location.pathname);
          return;
        }
      }

      // First, let's see ALL payments in the table (for debugging)
      console.log('=== CHECKING ALL PAYMENTS FOR DEBUG ===');
      
      const { data: allPayments, error: allPaymentsError } = await supabase
        .from('payments')
        .select('*');
      
      console.log('All payments in table:', allPayments);
      console.log('All payments error:', allPaymentsError);
      
      // Now check specific user payments
      console.log('=== CHECKING USER SPECIFIC PAYMENTS ===');
      
      const { data: userPayments, error: userPaymentsError } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', userId);
      
      console.log('User payments (all statuses):', userPayments);
      console.log('User payments error:', userPaymentsError);
      
      // Check successful payments only
      console.log('=== CHECKING SUCCESSFUL PAYMENTS ===');
      
      const { data: successfulPayments, error: successfulError } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'success');
      
      console.log('Successful payments:', successfulPayments);
      console.log('Successful payments error:', successfulError);

      // Check current user info
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      console.log('Current auth user:', user);
      console.log('Auth user error:', userError);
      console.log('Auth user ID matches?', user?.id === userId);

      if (successfulError) {
        console.error('=== PAYMENT QUERY ERROR ===');
        console.error('Error details:', successfulError);
        throw successfulError;
      }

      const hasPayment = successfulPayments && successfulPayments.length > 0;
      
      if (hasPayment) {
        console.log('✅ Valid payment found!');
        setHasValidPayment(true);
        toast({
          title: language === 'he' ? 'תשלום נמצא' : 'Payment found',
          description: language === 'he' ? 'יש לך גישה לתוכן' : 'You have access to content'
        });
      } else {
        console.log('❌ No valid payment found');
        console.log('Total payments for user:', userPayments?.length || 0);
        console.log('Successful payments for user:', successfulPayments?.length || 0);
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
        title: language === 'he' ? 'שגיאה' : 'Error',
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
      
      // Use direct client query instead of edge function
      const { data: payments, error: paymentError } = await supabase
        .from('payments')
        .select('id, user_id, amount, currency, status, created_at')
        .eq('user_id', userId)
        .eq('status', 'success')
        .order('created_at', { ascending: false });

      console.log('Direct payment check result:', { payments, paymentError });

      if (paymentError) {
        console.error('Error checking existing payment:', paymentError);
        throw paymentError;
      }

      const hasPayment = payments && payments.length > 0;

      if (hasPayment) {
        console.log('Valid payment already exists, granting access');
        setHasValidPayment(true);
        
        toast({
          title: language === 'he' ? 'תשלום נמצא במערכת' : 'Payment found in system',
          description: language === 'he' ? 'יש לך גישה לתוכן' : 'You have access to content'
        });
        return;
      }

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
      console.log('=== RECORDING PAYMENT ===');
      console.log('User ID for payment:', userId);
      console.log('Session ID:', sessionId);
      console.log('Amount:', amount);
      
      const { data: result, error: insertError } = await supabase.functions.invoke('record-payment', {
        body: {
          user_id: userId,
          transaction_id: sessionId,
          amount: amount
        }
      });

      console.log('Record payment function result:', { result, insertError });

      if (insertError) {
        console.error('Error recording payment:', insertError);
        throw insertError;
      }

      if (result?.success) {
        console.log('Payment recorded successfully:', result);
        setHasValidPayment(true);
        
        toast({
          title: language === 'he' ? 'תשלום נרשם בהצלחה' : 'Payment recorded successfully',
          description: language === 'he' ? 'התשלום שלך נרשם' : 'Your payment has been recorded'
        });
      } else {
        throw new Error('Payment recording failed');
      }
      
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
