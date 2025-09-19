
import * as React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { sendPaymentConfirmationEmail } from '@/services/emailService';

export const usePaymentVerification = () => {
  const [hasValidPayment, setHasValidPayment] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { language } = useLanguage();

  // SECURITY: Reset payment state on hook initialization
  React.useEffect(() => {
    setHasValidPayment(false);
    setError(null);
  }, []); // Empty dependency array - runs once on mount

  const checkPaymentStatus = React.useCallback(async (userId: string) => {
    if (isLoading) {
      console.log('Payment check already in progress, skipping...');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setHasValidPayment(false); // SECURITY: Reset payment state before check
      
      console.log('=== PAYMENT CHECK VIA EDGE FUNCTION ===');
      console.log('User ID to check:', userId);
      
      // Use Edge Function to check payment status
      console.log('Checking flipbook payment status via Edge Function...');
      
      const { data: result, error: checkError } = await supabase.functions.invoke('check-payment', {
        body: { 
          user_id: userId,
          service_type: 'flipbook' // Check specifically for flipbook payments
        }
      });

      console.log('Edge Function result:', { result, checkError });

      if (checkError) {
        console.error('Error calling check-payment function:', checkError);
        throw checkError;
      }

      // SECURITY: Strict boolean verification to prevent undefined bypass
      const hasPayment = Boolean(result?.hasValidPayment === true);
      
      if (hasPayment) {
        console.log('✅ Valid flipbook payment found via Edge Function!');
        console.log('Payment count:', result?.paymentCount || 0);
        setHasValidPayment(true);
        
        toast({
          title: language === 'he' ? 'תשלום נמצא' : 'Payment found',
          description: language === 'he' ? 'יש לך גישה לתוכן' : 'You have access to content'
        });
      } else {
        console.log('❌ No valid flipbook payment found');
        console.log('Payment count:', result?.paymentCount || 0);
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
        title: language === 'he' ? 'שגיאה' : 'Error',
        description: errorMsg
      });
    } finally {
      setIsLoading(false);
    }
  }, [language, isLoading]);

  const confirmPaymentCompletion = async (userId: string) => {
    try {
      setIsLoading(true);
      setHasValidPayment(false); // SECURITY: Reset payment state before check
      console.log('=== CONFIRMING PAYMENT VIA EDGE FUNCTION ===');
      console.log('User ID:', userId);
      
      // Use Edge Function for payment confirmation
      const { data: result, error: checkError } = await supabase.functions.invoke('check-payment', {
        body: { 
          user_id: userId,
          service_type: 'flipbook' // Check specifically for flipbook access
        }
      });

      console.log('Payment confirmation result:', { result, checkError });

      if (checkError) {
        console.error('Error confirming payment:', checkError);
        throw checkError;
      }

      // SECURITY: Strict boolean verification to prevent undefined bypass
      const hasPayment = Boolean(result?.hasValidPayment === true);

      if (hasPayment) {
        console.log('Valid payment confirmed via Edge Function');
        setHasValidPayment(true);
        
        toast({
          title: language === 'he' ? 'תשלום נמצא במערכת' : 'Payment found in system',
          description: language === 'he' ? 'יש לך גישה לתוכן' : 'You have access to content'
        });
        return;
      }

      console.log('No valid payment found - access denied');
      
      toast({
        variant: "destructive",
        title: language === 'he' ? 'לא נמצא תשלום' : 'No payment found',
        description: language === 'he' 
          ? 'לא נמצא תשלום תקף במערכת. אנא השלם תשלום דרך כרטיס אשראי או PayPal.'
          : 'No valid payment found in system. Please complete payment through Credit Card or PayPal first.'
      });
      
    } catch (err) {
      console.error('=== CONFIRM PAYMENT ERROR ===');
      console.error('Error details:', err);
      
      const errorMsg = language === 'he' 
        ? 'בעיה באישור התשלום' 
        : 'Payment confirmation issue';
      
      setError(errorMsg);
      
      toast({
        variant: "destructive",
        title: language === 'he' ? 'שגיאה' : 'Error',
        description: errorMsg
      });
    } finally {
      setIsLoading(false);
    }
  };

  const recordPayment = async (userId: string, sessionId: string, amount: number) => {
    try {
      console.log('=== RECORDING PAYMENT VIA EDGE FUNCTION ===');
      console.log('User ID for payment:', userId);
      console.log('Session ID:', sessionId);
      console.log('Amount:', amount);
      
      const { data: result, error: insertError } = await supabase.functions.invoke('record-payment', {
        body: {
          user_id: userId,
          transaction_id: sessionId,
          amount: amount
        }
      });

      console.log('Record payment function result:', { result, insertError });

      if (insertError) {
        console.error('Error recording payment:', insertError);
        throw insertError;
      }

      if (result?.success) {
        console.log('Payment recorded successfully:', result);
        setHasValidPayment(true);
        
        // Send payment confirmation email
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await sendPaymentConfirmationEmail({
              name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
              email: user.email || '',
            }, language);
            
            console.log('Payment confirmation email sent successfully');
          }
        } catch (emailError) {
          console.error('Error sending payment confirmation email:', emailError);
          // Don't block the payment success flow
        }
        
        toast({
          title: language === 'he' ? 'תשלום נרשם בהצלחה' : 'Payment recorded successfully',
          description: language === 'he' ? 'התשלום שלך נרשם' : 'Your payment has been recorded'
        });
      } else {
        throw new Error('Payment recording failed');
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

  const verifyPayPalPayment = async (userId: string, paymentId: string, amount: number) => {
    try {
      setIsLoading(true);
      console.log('=== VERIFYING PAYPAL PAYMENT ===');
      console.log('User ID:', userId);
      console.log('Payment ID:', paymentId);
      console.log('Amount:', amount);
      
      const { data: result, error: verifyError } = await supabase.functions.invoke('verify-paypal-payment', {
        body: {
          user_id: userId,
          payment_id: paymentId,
          amount: amount
        }
      });

      console.log('PayPal verification result:', { result, verifyError });

      if (verifyError) {
        console.error('Error verifying PayPal payment:', verifyError);
        throw verifyError;
      }

      if (result?.success && result?.verified) {
        console.log('PayPal payment verified successfully:', result);
        setHasValidPayment(true);
        
        // Send payment confirmation email
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await sendPaymentConfirmationEmail({
              name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
              email: user.email || '',
            }, language);
            
            console.log('Payment confirmation email sent successfully');
          }
        } catch (emailError) {
          console.error('Error sending payment confirmation email:', emailError);
          // Don't block the payment success flow
        }
        
        toast({
          title: language === 'he' ? 'תשלום אומת בהצלחה' : 'Payment verified successfully',
          description: language === 'he' ? 'התשלום שלך אומת מול PayPal' : 'Your payment has been verified with PayPal'
        });
        
        return true;
      } else {
        console.log('PayPal payment verification failed:', result);
        
        toast({
          variant: "destructive",
          title: language === 'he' ? 'אימות התשלום נכשל' : 'Payment verification failed',
          description: result?.error || (language === 'he' ? 'לא ניתן לאמת את התשלום מול PayPal' : 'Could not verify payment with PayPal')
        });
        
        return false;
      }
      
    } catch (err) {
      console.error('=== PAYPAL VERIFICATION ERROR ===');
      console.error('Error details:', err);
      
      const errorMsg = language === 'he' 
        ? 'בעיה באימות התשלום מול PayPal' 
        : 'PayPal payment verification issue';
      
      setError(errorMsg);
      
      toast({
        variant: "destructive",
        title: language === 'he' ? 'שגיאה' : 'Error',
        description: errorMsg
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    hasValidPayment,
    isLoading,
    error,
    checkPaymentStatus,
    confirmPaymentCompletion,
    recordPayment,
    verifyPayPalPayment
  };
};
