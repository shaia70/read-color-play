
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface PaymentData {
  id: string;
  user_id: string;
  stripe_session_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
}

export const usePaymentCheck = () => {
  const [hasValidPayment, setHasValidPayment] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();

  console.log('=== usePaymentCheck hook initialized ===');
  console.log('Using localStorage only - no Supabase dependency');

  const verifyPayment = async (userId: string) => {
    console.log('=== PAYMENT VERIFICATION START ===');
    console.log('Checking payment for user:', userId);
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Add small delay for UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const storageKey = `user_payment_${userId}`;
      const paymentData = localStorage.getItem(storageKey);
      
      console.log('Storage key:', storageKey);
      console.log('Payment data found:', paymentData);
      
      if (paymentData) {
        const parsed = JSON.parse(paymentData);
        const isValid = parsed.status === 'completed';
        
        console.log('Parsed data:', parsed);
        console.log('Payment is valid:', isValid);
        
        setHasValidPayment(isValid);
      } else {
        console.log('No payment data found');
        setHasValidPayment(false);
      }
    } catch (err) {
      console.error('Payment verification error:', err);
      const errorMessage = language === 'he' ? 'שגיאה בבדיקת התשלום' : 'Payment verification error';
      setError(errorMessage);
      setHasValidPayment(false);
    } finally {
      setIsLoading(false);
      console.log('=== PAYMENT VERIFICATION END ===');
    }
  };

  const savePayment = (userId: string, sessionId: string, amount: number) => {
    console.log('=== SAVING PAYMENT ===');
    console.log('User ID:', userId);
    console.log('Session ID:', sessionId);
    console.log('Amount:', amount);
    
    const paymentData: PaymentData = {
      id: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_id: userId,
      stripe_session_id: sessionId,
      amount: amount,
      status: 'completed',
      created_at: new Date().toISOString()
    };
    
    const storageKey = `user_payment_${userId}`;
    
    try {
      localStorage.setItem(storageKey, JSON.stringify(paymentData));
      setHasValidPayment(true);
      
      console.log('Payment saved successfully:', paymentData);
      console.log('Storage key used:', storageKey);
    } catch (saveError) {
      console.error('Failed to save payment:', saveError);
    }
  };

  return {
    hasValidPayment,
    isLoading,
    error,
    verifyPayment,
    savePayment
  };
};
