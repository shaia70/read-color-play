
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
      
      console.log('=== CHECKING PAYMENT STATUS (Supabase) ===');
      console.log('User ID to check:', userId);
      
      // Check if user came back from PayPal
      const urlParams = new URLSearchParams(window.location.search);
      const paymentStatus = urlParams.get('payment');
      
      if (paymentStatus === 'success') {
        console.log('PayPal success detected, recording payment...');
        
        // Record payment in Supabase
        const { data, error: insertError } = await supabase
          .from('payments')
          .insert({
            user_id: userId,
            paypal_transaction_id: 'paypal_' + Date.now(),
            amount: 70,
            currency: 'ILS',
            status: 'completed'
          })
          .select()
          .single();

        if (insertError) {
          console.error('Error recording payment:', insertError);
        } else {
          console.log('Payment recorded in Supabase:', data);
          setHasValidPayment(true);
          
          toast({
            title: language === 'he' ? 'תשלום בוצע בהצלחה' : 'Payment successful',
            description: language === 'he' ? 'יש לך גישה לתוכן' : 'You have access to content'
          });
        }
        
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      }

      // Check Supabase for existing payments
      console.log('Checking Supabase for payments for user:', userId);
      const { data: payments, error: fetchError } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(1);

      if (fetchError) {
        console.error('Error fetching payments:', fetchError);
        setError(language === 'he' ? 'בעיה בבדיקת התשלום' : 'Payment check issue');
        setHasValidPayment(false);
      } else if (payments && payments.length > 0) {
        console.log('Found payment in Supabase:', payments[0]);
        setHasValidPayment(true);
        toast({
          title: language === 'he' ? 'תשלום נמצא במערכת' : 'Payment found in system',
          description: language === 'he' ? 'יש לך גישה לתוכן' : 'You have access to content'
        });
      } else {
        console.log('No payment found for user:', userId);
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
      console.log('=== RECORDING PAYMENT (Supabase) ===');
      console.log('User ID for payment:', userId);
      console.log('Session ID:', sessionId);
      console.log('Amount:', amount);
      
      // Record payment in Supabase
      const { data, error } = await supabase
        .from('payments')
        .insert({
          user_id: userId,
          paypal_transaction_id: sessionId,
          amount: amount,
          currency: 'ILS',
          status: 'completed'
        })
        .select()
        .single();

      if (error) {
        console.error('Error recording payment:', error);
        setError(language === 'he' ? 'בעיה ברישום התשלום' : 'Payment recording issue');
        
        toast({
          variant: "destructive",
          title: language === 'he' ? 'שגיאה' : 'Error',
          description: language === 'he' ? 'בעיה ברישום התשלום' : 'Payment recording issue'
        });
      } else {
        console.log('Payment recorded in Supabase:', data);
        setHasValidPayment(true);
        
        toast({
          title: language === 'he' ? 'תשלום נרשם בהצלחה' : 'Payment recorded successfully',
          description: language === 'he' ? 'התשלום שלך נרשם' : 'Your payment has been recorded'
        });
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
    recordPayment
  };
};
