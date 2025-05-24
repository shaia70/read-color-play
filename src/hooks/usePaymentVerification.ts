
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

console.log('=== usePaymentVerification: Starting module load ===');

interface PaymentRecord {
  id: string;
  user_id: string;
  paypal_transaction_id: string | null;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  currency: string;
  timestamp: number;
}

const PAYMENT_STORAGE_KEY = 'shelley_payments';

export const usePaymentVerification = () => {
  const [hasValidPayment, setHasValidPayment] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();

  const getStoredPayments = (): PaymentRecord[] => {
    try {
      const stored = localStorage.getItem(PAYMENT_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.error('Error reading payments from localStorage:', err);
      return [];
    }
  };

  const savePayment = (payment: PaymentRecord): void => {
    try {
      const existingPayments = getStoredPayments();
      const updatedPayments = [...existingPayments, payment];
      localStorage.setItem(PAYMENT_STORAGE_KEY, JSON.stringify(updatedPayments));
      console.log('Payment saved to localStorage:', payment);
    } catch (err) {
      console.error('Error saving payment to localStorage:', err);
    }
  };

  const checkPaymentStatus = async (userId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Checking payment status for user:', userId);
      
      // Get payments from localStorage
      const payments = getStoredPayments();
      
      // Find completed payments for this user
      const userCompletedPayments = payments.filter(
        payment => payment.user_id === userId && payment.status === 'completed'
      );
      
      const hasPayment = userCompletedPayments.length > 0;
      console.log('Payment found in localStorage:', hasPayment);
      console.log('User completed payments:', userCompletedPayments);
      
      setHasValidPayment(hasPayment);
      
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
        id: `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        user_id: userId,
        paypal_transaction_id: sessionId,
        amount,
        status: 'completed' as const,
        currency: 'ILS',
        timestamp: Date.now()
      };
      
      console.log('Recording payment:', paymentRecord);
      
      // Save to localStorage
      savePayment(paymentRecord);
      
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
