
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface PaymentRecord {
  id: string;
  user_id: string;
  stripe_session_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
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
      
      // Check localStorage for payment record
      const paymentKey = `payment_${userId}`;
      const savedPayment = localStorage.getItem(paymentKey);
      
      if (savedPayment) {
        const paymentData = JSON.parse(savedPayment);
        setHasValidPayment(paymentData.status === 'completed');
      } else {
        setHasValidPayment(false);
      }
      
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
      const paymentRecord: PaymentRecord = {
        id: `payment_${Date.now()}`,
        user_id: userId,
        stripe_session_id: sessionId,
        amount,
        status: 'completed',
        created_at: new Date().toISOString()
      };
      
      console.log('Recording payment:', paymentRecord);
      
      // Save to localStorage
      const paymentKey = `payment_${userId}`;
      localStorage.setItem(paymentKey, JSON.stringify(paymentRecord));
      
      console.log('Payment recorded successfully:', paymentRecord);
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
