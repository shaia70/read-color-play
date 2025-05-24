
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

  console.log('usePaymentVerification hook initialized - no Supabase here!');

  const checkPaymentStatus = async (userId: string) => {
    console.log('=== PAYMENT CHECK START ===');
    console.log('User ID:', userId);
    
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Looking for payment in localStorage...');
      
      // Small delay to simulate loading
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Get payment from localStorage only
      const paymentKey = `payment_${userId}`;
      const storedPaymentData = localStorage.getItem(paymentKey);
      
      console.log('Payment key:', paymentKey);
      console.log('Stored payment data:', storedPaymentData);
      
      if (storedPaymentData) {
        try {
          const paymentInfo = JSON.parse(storedPaymentData);
          const isPaymentValid = paymentInfo.status === 'completed';
          
          console.log('Parsed payment info:', paymentInfo);
          console.log('Is payment valid:', isPaymentValid);
          
          setHasValidPayment(isPaymentValid);
        } catch (parseError) {
          console.error('Error parsing payment data:', parseError);
          setHasValidPayment(false);
        }
      } else {
        console.log('No payment found for this user');
        setHasValidPayment(false);
      }
    } catch (err) {
      console.error('Payment verification failed:', err);
      const errorMsg = language === 'he' ? 'שגיאה בבדיקת התשלום' : 'Payment verification failed';
      setError(errorMsg);
      setHasValidPayment(false);
    } finally {
      setIsLoading(false);
      console.log('=== PAYMENT CHECK END ===');
    }
  };

  const recordPayment = (userId: string, sessionId: string, amount: number) => {
    console.log('=== RECORDING PAYMENT ===');
    console.log('User:', userId, 'Session:', sessionId, 'Amount:', amount);
    
    const paymentRecord: PaymentRecord = {
      id: `payment_${Date.now()}_${Math.random()}`,
      user_id: userId,
      stripe_session_id: sessionId,
      amount: amount,
      status: 'completed',
      created_at: new Date().toISOString()
    };
    
    try {
      const paymentKey = `payment_${userId}`;
      const paymentJson = JSON.stringify(paymentRecord);
      
      localStorage.setItem(paymentKey, paymentJson);
      setHasValidPayment(true);
      
      console.log('Payment recorded successfully:', paymentRecord);
      console.log('Stored in localStorage with key:', paymentKey);
    } catch (storageError) {
      console.error('Failed to store payment:', storageError);
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
