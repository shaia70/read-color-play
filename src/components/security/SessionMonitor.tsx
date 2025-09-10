import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSessionSecurity } from '@/hooks/useSessionSecurity';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';

export const SessionMonitor: React.FC = () => {
  const { user } = useAuth();
  const { sessionData, validateSession } = useSessionSecurity();
  const { language } = useLanguage();

  // Monitor session security every 5 minutes
  useEffect(() => {
    if (!user?.id || !sessionData.sessionToken) return;

    const interval = setInterval(async () => {
      console.log('Session security monitor: validating session...');
      
      const isValid = await validateSession(user.id, true); // Force validation
      
      if (!isValid) {
        console.log('Session monitor detected invalid session');
        toast({
          variant: "destructive",
          title: language === 'he' ? 'הסשן פג תוקף' : 'Session expired',
          description: language === 'he' 
            ? 'הסשן שלך פג תוקף מסיבות אבטחה. נדרשת התחברות מחדש.'
            : 'Your session has expired for security reasons. Please log in again.'
        });
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [user?.id, sessionData.sessionToken, validateSession, language]);

  // Monitor for suspicious activity
  useEffect(() => {
    if (sessionData.suspiciousActivity) {
      console.warn('Suspicious session activity detected');
      
      toast({
        variant: "destructive",
        title: language === 'he' ? 'פעילות חשודה' : 'Suspicious Activity',
        description: language === 'he' 
          ? 'זוהתה פעילות חשודה בחשבון שלך. אנא ודא שאתה היחיד המשתמש בחשבון.'
          : 'Suspicious activity detected on your account. Please ensure you are the only one using this account.',
      });
    }
  }, [sessionData.suspiciousActivity, language]);

  return null; // This is a monitoring component, no UI needed
};