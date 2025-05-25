
import { useState, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';

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
      
      console.log('=== CHECKING PAYMENT STATUS (Edge Function) ===');
      console.log('User ID to check:', userId);
      
      // Check if user came back from PayPal
      const urlParams = new URLSearchParams(window.location.search);
      const paymentStatus = urlParams.get('payment');
      
      if (paymentStatus === 'success') {
        console.log('PayPal success detected, recording payment...');
        
        // Record payment using edge function
        const recordResponse = await fetch('/functions/v1/record-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
            transaction_id: 'paypal_' + Date.now(),
            amount: 70
          })
        });

        if (recordResponse.ok) {
          const recordData = await recordResponse.json();
          console.log('Payment recorded via edge function:', recordData);
          setHasValidPayment(true);
          
          toast({
            title: language === 'he' ? 'תשלום בוצע בהצלחה' : 'Payment successful',
            description: language === 'he' ? 'יש לך גישה לתוכן' : 'You have access to content'
          });
        } else {
          console.error('Error recording payment via edge function');
        }
        
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      }

      // Check for existing payments using edge function
      console.log('Checking payments via edge function for user:', userId);
      const checkResponse = await fetch('/functions/v1/check-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId
        })
      });

      if (checkResponse.ok) {
        const checkData = await checkResponse.json();
        console.log('Payment check response:', checkData);
        
        if (checkData.hasValidPayment) {
          console.log('Found valid payment for user:', userId);
          setHasValidPayment(true);
          toast({
            title: language === 'he' ? 'תשלום נמצא במערכת' : 'Payment found in system',
            description: language === 'he' ? 'יש לך גישה לתוכן' : 'You have access to content'
          });
        } else {
          console.log('No payment found for user:', userId);
          setHasValidPayment(false);
        }
      } else {
        console.error('Error checking payment via edge function');
        setError(language === 'he' ? 'בעיה בבדיקת התשלום' : 'Payment check issue');
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
      console.log('=== RECORDING PAYMENT (Edge Function) ===');
      console.log('User ID for payment:', userId);
      console.log('Session ID:', sessionId);
      console.log('Amount:', amount);
      
      // Record payment using edge function
      const response = await fetch('/functions/v1/record-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          transaction_id: sessionId,
          amount: amount
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Payment recorded via edge function:', data);
        setHasValidPayment(true);
        
        toast({
          title: language === 'he' ? 'תשלום נרשם בהצלחה' : 'Payment recorded successfully',
          description: language === 'he' ? 'התשלום שלך נרשם' : 'Your payment has been recorded'
        });
      } else {
        console.error('Error recording payment via edge function');
        setError(language === 'he' ? 'בעיה ברישום התשלום' : 'Payment recording issue');
        
        toast({
          variant: "destructive",
          title: language === 'he' ? 'שגיאה' : 'Error',
          description: language === 'he' ? 'בעיה ברישום התשלום' : 'Payment recording issue'
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
