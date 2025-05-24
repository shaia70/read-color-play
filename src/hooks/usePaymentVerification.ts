
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
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check localStorage for payment record
      const paymentRecord = localStorage.getItem(`payment_${userId}`);
      if (paymentRecord) {
        const payment = JSON.parse(paymentRecord);
        setHasValidPayment(payment.status === 'completed');
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

  const recordPayment = (userId: string, sessionId: string, amount: number) => {
    const paymentRecord: PaymentRecord = {
      id: `payment_${Date.now()}`,
      user_id: userId,
      stripe_session_id: sessionId,
      amount,
      status: 'completed',
      created_at: new Date().toISOString()
    };
    
    localStorage.setItem(`payment_${userId}`, JSON.stringify(paymentRecord));
    setHasValidPayment(true);
    console.log('Payment recorded successfully:', paymentRecord);
  };

  return {
    hasValidPayment,
    isLoading,
    error,
    checkPaymentStatus,
    recordPayment
  };
};
