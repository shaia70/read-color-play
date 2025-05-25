
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
      
      console.log('=== CHECKING PAYMENT STATUS ===');
      console.log('User ID to check:', userId);
      
      // Check if user came back from PayPal
      const urlParams = new URLSearchParams(window.location.search);
      const paymentStatus = urlParams.get('payment');
      
      if (paymentStatus === 'success') {
        console.log('PayPal success detected, marking as paid...');
        setHasValidPayment(true);
        
        toast({
          title: language === 'he' ? 'תשלום בוצע בהצלחה' : 'Payment successful',
          description: language === 'he' ? 'יש לך גישה לתוכן' : 'You have access to content'
        });
        
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      }

      // Try to check for existing payments using edge function
      console.log('Trying to check payments via edge function...');
      
      try {
        const { data: checkData, error: checkError } = await supabase.functions.invoke('check-payment', {
          body: { user_id: userId }
        });

        if (!checkError && checkData && checkData.hasValidPayment) {
          console.log('Payment found via edge function');
          setHasValidPayment(true);
          toast({
            title: language === 'he' ? 'תשלום נמצא במערכת' : 'Payment found in system',
            description: language === 'he' ? 'יש לך גישה לתוכן' : 'You have access to content'
          });
        } else {
          console.log('No payment found or edge function error:', checkError);
          
          // Check localStorage as fallback
          const localPayment = localStorage.getItem(`payment_${userId}`);
          if (localPayment) {
            console.log('Found payment in localStorage');
            setHasValidPayment(true);
            toast({
              title: language === 'he' ? 'תשלום נמצא' : 'Payment found',
              description: language === 'he' ? 'יש לך גישה לתוכן' : 'You have access to content'
            });
          } else {
            console.log('No payment found anywhere');
            setHasValidPayment(false);
          }
        }
      } catch (edgeFunctionError) {
        console.error('Edge function call failed:', edgeFunctionError);
        
        // Fallback to localStorage
        const localPayment = localStorage.getItem(`payment_${userId}`);
        if (localPayment) {
          console.log('Using localStorage fallback');
          setHasValidPayment(true);
          toast({
            title: language === 'he' ? 'תשלום נמצא' : 'Payment found',
            description: language === 'he' ? 'יש לך גישה לתוכן' : 'You have access to content'
          });
        } else {
          setHasValidPayment(false);
        }
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
      console.log('=== RECORDING PAYMENT ===');
      console.log('User ID for payment:', userId);
      console.log('Session ID:', sessionId);
      console.log('Amount:', amount);
      
      // Try edge function first
      try {
        const { data, error } = await supabase.functions.invoke('record-payment', {
          body: {
            user_id: userId,
            transaction_id: sessionId,
            amount: amount
          }
        });

        if (!error && data && data.success) {
          console.log('Payment recorded via edge function:', data);
          setHasValidPayment(true);
          
          // Also store in localStorage as backup
          localStorage.setItem(`payment_${userId}`, JSON.stringify({
            sessionId,
            amount,
            timestamp: Date.now()
          }));
          
          toast({
            title: language === 'he' ? 'תשלום נרשם בהצלחה' : 'Payment recorded successfully',
            description: language === 'he' ? 'התשלום שלך נרשם' : 'Your payment has been recorded'
          });
          return;
        } else {
          throw new Error('Edge function failed');
        }
      } catch (edgeFunctionError) {
        console.error('Edge function recording failed:', edgeFunctionError);
        
        // Fallback to localStorage
        console.log('Using localStorage fallback for recording payment');
        localStorage.setItem(`payment_${userId}`, JSON.stringify({
          sessionId,
          amount,
          timestamp: Date.now()
        }));
        
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
