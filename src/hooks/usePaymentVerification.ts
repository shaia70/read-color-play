
import { useState, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

      // Check database first - this is the authoritative source
      console.log('Checking database for payments...');
      const { data: payments, error: dbError } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(1);

      if (dbError) {
        console.error('Database query error:', dbError);
        
        // Fallback to localStorage only if DB fails
        const hasLocalPayment = checkLocalPayment(userId);
        console.log('Database failed, using localStorage fallback:', hasLocalPayment);
        setHasValidPayment(hasLocalPayment);
        
        if (!hasLocalPayment) {
          const errorMsg = language === 'he' 
            ? 'לא ניתן לבדוק את סטטוס התשלום כרגע' 
            : 'Cannot check payment status at the moment';
          
          setError(errorMsg);
          
          toast({
            variant: "destructive",
            title: language === 'he' ? 'שגיאה' : 'Error',
            description: errorMsg
          });
        }
      } else {
        console.log('Database query result:', payments);
        const hasDbPayment = payments && payments.length > 0;
        
        // The database is the authoritative source
        setHasValidPayment(hasDbPayment);
        
        if (hasDbPayment) {
          // Sync with localStorage for faster future checks
          saveLocalPayment(userId);
          
          toast({
            title: language === 'he' ? 'תשלום נמצא במערכת' : 'Payment found in system',
            description: language === 'he' ? 'יש לך גישה לתוכן' : 'You have access to content'
          });
        } else {
          // No payment in database - clear any stale localStorage
          const paymentKey = `payment_completed_${userId}`;
          localStorage.removeItem(paymentKey);
          localStorage.removeItem(`payment_date_${userId}`);
          
          console.log('No payment found in database for this user');
        }
      }
      
    } catch (err) {
      console.error('=== PAYMENT CHECK ERROR ===');
      console.error('Error details:', err);
      
      // Only use localStorage as absolute last resort
      const hasLocalPayment = checkLocalPayment(userId);
      setHasValidPayment(hasLocalPayment);
      
      if (!hasLocalPayment) {
        const errorMsg = language === 'he' 
          ? 'לא ניתן לבדוק את סטטוס התשלום כרגע' 
          : 'Cannot check payment status at the moment';
        
        setError(errorMsg);
        
        toast({
          variant: "destructive",
          title: language === 'he' ? 'שגיאה' : 'Error',
          description: errorMsg
        });
      }
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
      
      // Save to database first
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
        console.error('Database insert error:', error);
        throw error;
      }
      
      console.log('Payment saved to database:', data);
      
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
