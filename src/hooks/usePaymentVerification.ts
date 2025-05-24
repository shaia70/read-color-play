
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { createClient } from '@supabase/supabase-js';

interface PaymentRecord {
  id: string;
  user_id: string;
  stripe_session_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
}

// Check if Supabase environment variables are available
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialize Supabase client only if environment variables are valid and not empty
let supabase = null;

// Very strict validation to prevent any invalid createClient calls
const isValidSupabaseUrl = (url: any): url is string => {
  return (
    typeof url === 'string' &&
    url.length > 0 &&
    url !== 'undefined' &&
    url !== 'null' &&
    url !== '' &&
    (url.startsWith('https://') || url.startsWith('http://')) &&
    url.includes('.supabase.co')
  );
};

const isValidSupabaseKey = (key: any): key is string => {
  return (
    typeof key === 'string' &&
    key.length > 0 &&
    key !== 'undefined' &&
    key !== 'null' &&
    key !== '' &&
    key.length > 20 // Supabase keys are typically longer than 20 characters
  );
};

console.log('Environment validation:', {
  urlType: typeof supabaseUrl,
  keyType: typeof supabaseAnonKey,
  urlValue: supabaseUrl || 'NOT_SET',
  keyPresent: !!supabaseAnonKey,
  urlValid: isValidSupabaseUrl(supabaseUrl),
  keyValid: isValidSupabaseKey(supabaseAnonKey)
});

// Only initialize if BOTH values pass strict validation
if (isValidSupabaseUrl(supabaseUrl) && isValidSupabaseKey(supabaseAnonKey)) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('Supabase client initialized successfully');
  } catch (error) {
    console.warn('Failed to initialize Supabase client:', error);
    supabase = null;
  }
} else {
  console.log('Supabase environment variables not properly configured, using localStorage fallback');
  supabase = null;
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
      
      // If Supabase is not configured, fall back to localStorage
      if (!supabase) {
        console.log('Supabase not configured, checking localStorage for user:', userId);
        const localPayment = localStorage.getItem(`payment_${userId}`);
        setHasValidPayment(!!localPayment);
        return;
      }
      
      console.log('Checking payment status for user:', userId);
      
      // Query Supabase for payment records
      const { data: payments, error: dbError } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (dbError) {
        console.error('Supabase error:', dbError);
        throw new Error('Database error');
      }
      
      setHasValidPayment(payments && payments.length > 0);
      
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
      // If Supabase is not configured, fall back to localStorage
      if (!supabase) {
        console.log('Supabase not configured, saving to localStorage for user:', userId);
        localStorage.setItem(`payment_${userId}`, JSON.stringify({
          sessionId,
          amount,
          timestamp: new Date().toISOString()
        }));
        setHasValidPayment(true);
        return;
      }
      
      const paymentRecord: Omit<PaymentRecord, 'id' | 'created_at'> = {
        user_id: userId,
        stripe_session_id: sessionId,
        amount,
        status: 'completed'
      };
      
      console.log('Recording payment:', paymentRecord);
      
      const { data, error } = await supabase
        .from('payments')
        .insert([paymentRecord])
        .select()
        .single();
      
      if (error) {
        console.error('Error recording payment:', error);
        throw error;
      }
      
      console.log('Payment recorded successfully:', data);
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
