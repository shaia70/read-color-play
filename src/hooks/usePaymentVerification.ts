
import { useState, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
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

  // Helper function to check localStorage for payment
  const checkLocalPayment = (userId: string): boolean => {
    try {
      const paymentKey = `payment_completed_${userId}`;
      const paymentData = localStorage.getItem(paymentKey);
      return paymentData === 'true';
    } catch (err) {
      console.error('Error checking localStorage:', err);
      return false;
    }
  };

  // Helper function to save payment to localStorage
  const saveLocalPayment = (userId: string): void => {
    try {
      const paymentKey = `payment_completed_${userId}`;
      localStorage.setItem(paymentKey, 'true');
      localStorage.setItem(`payment_date_${userId}`, new Date().toISOString());
    } catch (err) {
      console.error('Error saving to localStorage:', err);
    }
  };

  // Helper function to clear payment from localStorage
  const clearLocalPayment = (userId: string): void => {
    try {
      const paymentKey = `payment_completed_${userId}`;
      localStorage.removeItem(paymentKey);
      localStorage.removeItem(`payment_date_${userId}`);
    } catch (err) {
      console.error('Error clearing localStorage:', err);
    }
  };

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
        console.log('PayPal success detected, recording payment...');
        saveLocalPayment(userId);
        setHasValidPayment(true);
        
        toast({
          title: language === 'he' ? 'תשלום בוצע בהצלחה' : 'Payment successful',
          description: language === 'he' ? 'יש לך גישה לתוכן' : 'You have access to content'
        });
        
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      }

      // Use Edge Function to check payment status
      console.log('Checking payment via Edge Function for user:', userId);
      
      const response = await fetch('https://pahqikhckqjujbhvqnyb.supabase.co/functions/v1/check-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhaHFpa2hja3FqdWpiaHZxbnliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwODkzNzMsImV4cCI6MjA2MzY2NTM3M30.zVNZAEFgwaVRPFHFYA-XN1kqcUeXl-24kj6fnsLQDH8`
        },
        body: JSON.stringify({ user_id: userId })
      });

      if (!response.ok) {
        console.error('Edge Function response not ok:', response.status, response.statusText);
        throw new Error(`Edge Function error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Edge Function response:', data);

      if (data.error) {
        console.error('Edge Function returned error:', data.error);
        throw new Error(data.error);
      }

      const hasDbPayment = data.hasValidPayment;
      console.log('Has payment for this user via Edge Function:', hasDbPayment);
      
      if (hasDbPayment) {
        // User has valid payment - sync with localStorage and grant access
        saveLocalPayment(userId);
        setHasValidPayment(true);
        
        toast({
          title: language === 'he' ? 'תשלום נמצא במערכת' : 'Payment found in system',
          description: language === 'he' ? 'יש לך גישה לתוכן' : 'You have access to content'
        });
      } else {
        // No payment found for this user - clear localStorage and deny access
        clearLocalPayment(userId);
        setHasValidPayment(false);
        
        console.log('No payment found via Edge Function for user:', userId);
      }
      
    } catch (err) {
      console.error('=== PAYMENT CHECK ERROR ===');
      console.error('Error details:', err);
      
      // When there's an error, DENY access and clear localStorage
      clearLocalPayment(userId);
      setHasValidPayment(false);
      
      const errorMsg = language === 'he' 
        ? 'שגיאה בבדיקת התשלום. אנא נסה שוב מאוחר יותר' 
        : 'Error checking payment. Please try again later';
      
      setError(errorMsg);
      
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
      console.log('User ID for payment:', userId);
      console.log('Session ID:', sessionId);
      console.log('Amount:', amount);
      
      // Use Edge Function to record payment
      const response = await fetch('https://pahqikhckqjujbhvqnyb.supabase.co/functions/v1/record-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhaHFpa2hja3FqdWpiaHZxbnliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwODkzNzMsImV4cCI6MjA2MzY2NTM3M30.zVNZAEFgwaVRPFHFYA-XN1kqcUeXl-24kj6fnsLQDH8`
        },
        body: JSON.stringify({
          user_id: userId,
          transaction_id: sessionId,
          amount: amount
        })
      });

      if (!response.ok) {
        console.error('Edge Function response not ok:', response.status, response.statusText);
        throw new Error(`Edge Function error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Payment recorded via Edge Function:', data);

      if (data.error) {
        console.error('Edge Function returned error:', data.error);
        throw new Error(data.error);
      }
      
      // Save to localStorage for faster access
      saveLocalPayment(userId);
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
