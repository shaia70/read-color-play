
import { useState, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
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

  const checkPaymentStatus = useCallback(async (userId: string) => {
    if (isLoading) {
      console.log('Payment check already in progress, skipping...');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log('=== TESTING EDGE FUNCTION CONNECTIVITY ===');
      console.log('User ID to check:', userId);
      
      // Test if edge functions are available by trying to invoke check-payment
      console.log('Attempting to call check-payment edge function...');
      
      const { data, error: functionError } = await supabase.functions.invoke('check-payment', {
        body: { user_id: userId }
      });

      console.log('=== EDGE FUNCTION RAW RESPONSE ===');
      console.log('Raw function data:', JSON.stringify(data, null, 2));
      console.log('Raw function error:', JSON.stringify(functionError, null, 2));

      if (functionError) {
        console.error('Edge function not available, falling back to direct DB access...');
        
        // Fallback: direct database access with service role simulation
        console.log('=== FALLBACK: DIRECT DB ACCESS ===');
        
        // Try direct access to payments table
        const { data: payments, error: dbError } = await supabase
          .from('payments')
          .select('*')
          .eq('user_id', userId)
          .eq('status', 'completed');

        console.log('Direct DB access result:', payments);
        console.log('Direct DB access error:', dbError);

        if (dbError) {
          // If direct access fails, let's try with a simple insert test
          console.log('=== TESTING TABLE ACCESS WITH TEMP RECORD ===');
          
          const testRecord = {
            user_id: userId,
            paypal_transaction_id: 'test_' + Date.now(),
            amount: 1,
            status: 'pending' as const,
            currency: 'ILS'
          };
          
          const { data: insertData, error: insertError } = await supabase
            .from('payments')
            .insert(testRecord)
            .select()
            .single();
            
          console.log('Test insert result:', insertData);
          console.log('Test insert error:', insertError);
          
          if (insertError) {
            throw new Error(`Database access failed: ${insertError.message}`);
          }
          
          // Clean up test record
          if (insertData) {
            await supabase.from('payments').delete().eq('id', insertData.id);
          }
        }

        const hasPayment = payments && payments.length > 0;
        setHasValidPayment(hasPayment);
        
        console.log('=== FALLBACK RESULT ===');
        console.log('Has valid payment (fallback):', hasPayment);
        
        return;
      }

      const hasPayment = data?.hasValidPayment || false;
      setHasValidPayment(hasPayment);
      
      console.log('=== EDGE FUNCTION SUCCESS ===');
      console.log('Has valid payment:', hasPayment);
      console.log('Payments found:', data?.payments?.length || 0);
      
      if (hasPayment) {
        toast({
          title: language === 'he' ? 'תשלום נמצא' : 'Payment found',
          description: language === 'he' ? 'יש לך גישה לתוכן' : 'You have access to content'
        });
      } else {
        console.log('No completed payments found for this user');
      }
      
    } catch (err) {
      console.error('=== PAYMENT CHECK ERROR ===');
      console.error('Error details:', err);
      
      const errorMsg = language === 'he' 
        ? 'לא ניתן לבדוק את סטטוס התשלום כרגע' 
        : 'Cannot check payment status at the moment';
      
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

  const recordPayment = async (userId: string, sessionId: string, amount: number) => {
    try {
      console.log('=== RECORDING PAYMENT - TESTING APPROACH ===');
      console.log('User ID for payment:', userId);
      console.log('Session ID:', sessionId);
      console.log('Amount:', amount);
      
      // First try edge function
      console.log('Trying edge function approach...');
      
      const { data, error: functionError } = await supabase.functions.invoke('record-payment', {
        body: {
          user_id: userId,
          transaction_id: sessionId,
          amount: amount
        }
      });

      console.log('Edge function result:', data);
      console.log('Edge function error:', functionError);

      if (functionError) {
        console.log('Edge function failed, trying direct insert...');
        
        // Fallback: direct insert
        const { data: insertData, error: insertError } = await supabase
          .from('payments')
          .insert({
            user_id: userId,
            paypal_transaction_id: sessionId,
            amount,
            currency: 'ILS',
            status: 'completed'
          })
          .select()
          .single();

        console.log('Direct insert result:', insertData);
        console.log('Direct insert error:', insertError);

        if (insertError) {
          throw new Error(`Payment recording failed: ${insertError.message}`);
        }
        
        console.log('Payment recorded successfully via direct insert:', insertData);
      } else {
        if (!data?.success) {
          throw new Error('Payment recording failed via edge function');
        }
        console.log('Payment recorded successfully via edge function:', data);
      }
      
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
