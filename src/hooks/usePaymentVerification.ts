
import { useState } from 'react';
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
    console.log('Starting payment verification check for user:', userId);
    
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Checking localStorage for payment record...');
      
      // Add small delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check localStorage for payment record
      const storedPayment = localStorage.getItem(`payment_${userId}`);
      console.log('Retrieved payment data from localStorage:', storedPayment);
      
      if (storedPayment) {
        const paymentData = JSON.parse(storedPayment);
        const isValid = paymentData.status === 'completed';
        setHasValidPayment(isValid);
        console.log('Payment validation result:', isValid, paymentData);
      } else {
        setHasValidPayment(false);
        console.log('No payment record found for user:', userId);
      }
    } catch (err) {
      console.error('Payment verification error:', err);
      setError(language === 'he' ? 'שגיאה בבדיקת התשלום' : 'Payment verification failed');
      setHasValidPayment(false);
    } finally {
      setIsLoading(false);
      console.log('Payment verification completed');
    }
  };

  const recordPayment = (userId: string, sessionId: string, amount: number) => {
    console.log('Recording new payment:', { userId, sessionId, amount });
    
    const newPayment: PaymentRecord = {
      id: `payment_${Date.now()}`,
      user_id: userId,
      stripe_session_id: sessionId,
      amount,
      status: 'completed',
      created_at: new Date().toISOString()
    };
    
    localStorage.setItem(`payment_${userId}`, JSON.stringify(newPayment));
    setHasValidPayment(true);
    console.log('Payment recorded successfully:', newPayment);
  };

  return {
    hasValidPayment,
    isLoading,
    error,
    checkPaymentStatus,
    recordPayment
  };
};
