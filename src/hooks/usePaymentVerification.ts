
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
      
      console.log('=== CHECKING PAYMENT STATUS (Direct Client) ===');
      console.log('User ID to check:', userId);
      
      // Check if user came back from PayPal
      const urlParams = new URLSearchParams(window.location.search);
      const paymentStatus = urlParams.get('payment');
      
      if (paymentStatus === 'success') {
        console.log('PayPal success detected, recording payment...');
        
        // Get current user session to verify auth
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        console.log('Current authenticated user:', user?.id);
        console.log('User ID parameter:', userId);
        
        if (authError) {
          console.error('Auth error:', authError);
          throw authError;
        }
        
        if (!user || user.id !== userId) {
          console.error('User mismatch or not authenticated');
          throw new Error('Authentication mismatch');
        }
        
        // Record payment directly using client
        console.log('Attempting to insert payment record...');
        const paymentData = {
          user_id: userId,
          paypal_transaction_id: 'paypal_success_' + Date.now(),
          amount: 70,
          currency: 'ILS',
          status: 'success'
        };
        console.log('Payment data to insert:', paymentData);
        
        const { data: recordResult, error: recordError } = await supabase
          .from('payments')
          .insert(paymentData)
          .select();

        if (recordError) {
          console.error('Database insert error details:', recordError);
          console.error('Error code:', recordError.code);
          console.error('Error message:', recordError.message);
          console.error('Error details:', recordError.details);
          throw recordError;
        }

        console.log('Payment recorded successfully:', recordResult);
        setHasValidPayment(true);
        
        toast({
          title: language === 'he' ? 'תשלום בוצע בהצלחה' : 'Payment successful',
          description: language === 'he' ? 'יש לך גישה לתוכן' : 'You have access to content'
        });
        
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      }

      // Check payment status directly using client
      const { data: payments, error: checkError } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'success')
        .order('created_at', { ascending: false });

      if (checkError) {
        console.error('Error checking payment:', checkError);
        throw checkError;
      }

      console.log('Payment check result from direct client:', payments);
      
      if (payments && payments.length > 0) {
        console.log('Valid payment found via direct client');
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

  const recordPayment = async (userId: string, sessionId: string, amount: number) => {
    try {
      console.log('=== RECORDING PAYMENT (Direct Client) ===');
      console.log('User ID for payment:', userId);
      console.log('Session ID:', sessionId);
      console.log('Amount:', amount);
      
      // Get current user session to verify auth
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      console.log('Current authenticated user:', user?.id);
      console.log('User ID parameter:', userId);
      
      if (authError) {
        console.error('Auth error during payment recording:', authError);
        throw authError;
      }
      
      if (!user || user.id !== userId) {
        console.error('User mismatch or not authenticated during payment recording');
        throw new Error('Authentication mismatch during payment recording');
      }
      
      // Record payment directly using client
      console.log('Attempting to insert payment record...');
      const paymentData = {
        user_id: userId,
        paypal_transaction_id: sessionId,
        amount: amount,
        currency: 'ILS',
        status: 'success'
      };
      console.log('Payment data to insert:', paymentData);
      
      const { data: result, error: insertError } = await supabase
        .from('payments')
        .insert(paymentData)
        .select();

      if (insertError) {
        console.error('Database insert error details:', insertError);
        console.error('Error code:', insertError.code);
        console.error('Error message:', insertError.message);
        console.error('Error details:', insertError.details);
        throw insertError;
      }

      console.log('Payment recorded successfully via direct client:', result);
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
    recordPayment
  };
};
