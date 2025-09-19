import * as React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';

interface SessionData {
  sessionToken: string | null;
  isValid: boolean;
  suspiciousActivity: boolean;
  lastValidation: number;
}

const SESSION_STORAGE_KEY = 'flipbook_session';
const VALIDATION_INTERVAL = 5 * 60 * 1000; // 5 minutes

export const useSessionSecurity = () => {
  const [sessionData, setSessionData] = React.useState<SessionData>({
    sessionToken: null,
    isValid: false,
    suspiciousActivity: false,
    lastValidation: 0
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const { language } = useLanguage();

  // Get device fingerprint
  const getDeviceFingerprint = React.useCallback(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Device fingerprint', 2, 2);
    }
    
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      canvas.toDataURL()
    ].join('|');
    
    return btoa(fingerprint).substring(0, 32);
  }, []);

  // Get client IP (approximation using timezone and other data)
  const getClientInfo = React.useCallback(() => {
    return {
      userAgent: navigator.userAgent,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      deviceFingerprint: getDeviceFingerprint()
    };
  }, [getDeviceFingerprint]);

  // Load session from localStorage
  React.useEffect(() => {
    const stored = localStorage.getItem(SESSION_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSessionData(parsed);
      } catch (error) {
        console.error('Error parsing stored session:', error);
        localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    }
  }, []);

  // Save session to localStorage
  const saveSession = React.useCallback((data: SessionData) => {
    setSessionData(data);
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data));
  }, []);

  // Create new session
  const createSession = React.useCallback(async (userId: string) => {
    if (isLoading) return false;
    
    try {
      setIsLoading(true);
      console.log('Creating secure session for user:', userId);

      const clientInfo = getClientInfo();

      const { data: result, error } = await supabase.functions.invoke('session-security', {
        body: {
          action: 'create',
          user_id: userId,
          user_agent: clientInfo.userAgent,
          device_fingerprint: clientInfo.deviceFingerprint
        }
      });

      if (error) {
        console.error('Error creating session:', error);
        throw error;
      }

      if (result?.success && result?.session_token) {
        const newSessionData = {
          sessionToken: result.session_token,
          isValid: true,
          suspiciousActivity: false,
          lastValidation: Date.now()
        };

        saveSession(newSessionData);
        
        console.log('Secure session created successfully');

        toast({
          title: language === 'he' ? 'התחברת בהצלחה' : 'Login successful',
          description: language === 'he' ? 'הסשן מאובטח ופעיל' : 'Session is secure and active'
        });

        return true;
      } else {
        throw new Error('Failed to create session');
      }
    } catch (error) {
      console.error('Session creation failed:', error);
      
      toast({
        variant: "destructive",
        title: language === 'he' ? 'שגיאה באימות' : 'Authentication error',
        description: language === 'he' ? 'בעיה ביצירת סשן מאובטח' : 'Problem creating secure session'
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, language, getClientInfo, saveSession]);

  // Validate session
  const validateSession = React.useCallback(async (userId: string, forceValidation = false) => {
    if (!sessionData.sessionToken) return false;
    if (isLoading) return sessionData.isValid;

    const now = Date.now();
    const timeSinceLastValidation = now - sessionData.lastValidation;
    
    // Skip validation if recent (unless forced)
    if (!forceValidation && timeSinceLastValidation < VALIDATION_INTERVAL) {
      return sessionData.isValid;
    }

    try {
      setIsLoading(true);
      console.log('Validating session security for user:', userId);

      const clientInfo = getClientInfo();

      const { data: result, error } = await supabase.functions.invoke('session-security', {
        body: {
          action: 'validate',
          user_id: userId,
          session_token: sessionData.sessionToken,
          user_agent: clientInfo.userAgent
        }
      });

      if (error) {
        console.error('Error validating session:', error);
        throw error;
      }

      const isValid = result?.is_valid === true;
      const suspicious = result?.suspicious_activity === true;
      const shouldLogout = result?.should_logout === true;

      const updatedSessionData = {
        ...sessionData,
        isValid,
        suspiciousActivity: suspicious,
        lastValidation: now
      };

      saveSession(updatedSessionData);

      if (suspicious) {
        toast({
          variant: "destructive",
          title: language === 'he' ? 'פעילות חשודה' : 'Suspicious activity',
          description: language === 'he' 
            ? 'זוהתה פעילות חשודה. ייתכן שמישהו אחר משתמש בחשבון שלך'
            : 'Suspicious activity detected. Someone else might be using your account'
        });
      }

      if (shouldLogout) {
        console.log('Session validation failed - logout required');
        await destroySession();
        
        toast({
          variant: "destructive",
          title: language === 'he' ? 'הסשן פג תוקף' : 'Session expired',
          description: language === 'he' 
            ? 'נדרשת התחברות מחדש מסיבות אבטחה'
            : 'Re-login required for security reasons'
        });
        
        return false;
      }

      console.log('Session validation result:', {
        isValid,
        suspicious,
        message: result?.message
      });

      return isValid;
    } catch (error) {
      console.error('Session validation failed:', error);
      
      // On validation error, assume session is invalid
      const updatedSessionData = {
        ...sessionData,
        isValid: false,
        lastValidation: now
      };
      
      saveSession(updatedSessionData);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [sessionData, isLoading, language, getClientInfo, saveSession]);

  // Destroy session
  const destroySession = React.useCallback(async () => {
    console.log('Destroying secure session');
    
    const emptySession = {
      sessionToken: null,
      isValid: false,
      suspiciousActivity: false,
      lastValidation: 0
    };

    saveSession(emptySession);
    localStorage.removeItem(SESSION_STORAGE_KEY);
  }, [saveSession]);

  // Auto-validate session periodically
  React.useEffect(() => {
    if (!sessionData.sessionToken || !sessionData.isValid) return;

    const interval = setInterval(() => {
      // We can't call validateSession here without userId
      // This will be called manually from the auth hook
      console.log('Session validation interval triggered');
    }, VALIDATION_INTERVAL);

    return () => clearInterval(interval);
  }, [sessionData.sessionToken, sessionData.isValid]);

  return {
    sessionData,
    isLoading,
    createSession,
    validateSession,
    destroySession,
    hasValidSession: sessionData.isValid && !!sessionData.sessionToken
  };
};