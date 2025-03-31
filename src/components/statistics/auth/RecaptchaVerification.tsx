
import React, { useRef, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

interface RecaptchaVerificationProps {
  siteKey: string;
  onVerify: (token: string | null) => void;
  testKeyDisabled: boolean;
  useTestKey: boolean;
  onError?: () => void;
}

export const RecaptchaVerification: React.FC<RecaptchaVerificationProps> = ({
  siteKey,
  onVerify,
  testKeyDisabled,
  useTestKey,
  onError
}) => {
  const isMobile = useIsMobile();
  
  // Reset verification when key changes
  useEffect(() => {
    onVerify(null);
  }, [siteKey, useTestKey, testKeyDisabled, onVerify]);
  
  // Listen for reCAPTCHA error messages
  useEffect(() => {
    const handleErrorMessages = (event: ErrorEvent) => {
      if (event.message && 
         (event.message.includes('Invalid domain for site key') || 
          event.message.includes('ERROR for site owner'))) {
        console.error("reCAPTCHA validation error detected:", event.message);
        if (onError) onError();
      }
    };
    
    window.addEventListener('error', handleErrorMessages);
    
    return () => {
      window.removeEventListener('error', handleErrorMessages);
    };
  }, [onError]);
  
  // For test key, we'll simulate a successful verification
  useEffect(() => {
    if (!testKeyDisabled && useTestKey) {
      // Automatically simulate verification
      const testToken = "test-captcha-token-123456789";
      onVerify(testToken);
    }
  }, [testKeyDisabled, useTestKey, onVerify]);
  
  // Set up reCAPTCHA v3
  useEffect(() => {
    if (testKeyDisabled || !useTestKey) {
      if (!siteKey) return;
      
      // Create a script element
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      
      // Execute reCAPTCHA v3
      script.onload = () => {
        if (window.grecaptcha) {
          window.grecaptcha.ready(() => {
            try {
              window.grecaptcha
                .execute(siteKey, { action: 'login' })
                .then((token: string) => {
                  console.log("reCAPTCHA v3 token received");
                  onVerify(token);
                })
                .catch((error: any) => {
                  console.error("reCAPTCHA execution error:", error);
                  if (onError) onError();
                });
            } catch (error) {
              console.error("reCAPTCHA initialization error:", error);
              if (onError) onError();
            }
          });
        }
      };
      
      script.onerror = () => {
        console.error("Error loading reCAPTCHA script");
        if (onError) onError();
      };
      
      return () => {
        // Clean up
        document.body.removeChild(script);
      };
    }
  }, [siteKey, onVerify, testKeyDisabled, useTestKey, onError]);
  
  // Don't render the component if using test key
  if (!testKeyDisabled && useTestKey) {
    return (
      <div className="flex flex-col items-center py-2">
        <div className="bg-amber-50 border border-amber-200 p-2 rounded-md w-full">
          <p className="text-sm text-amber-700 text-center">
            Using test reCAPTCHA key. Verification is automatic.
          </p>
        </div>
      </div>
    );
  }
  
  // If no production key is set, show a message
  if (!siteKey) {
    return (
      <Alert variant="destructive" className="my-2">
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          No reCAPTCHA site key configured. Please add a site key in the settings.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex justify-center py-2">
      <div className="bg-blue-50 border border-blue-200 p-3 rounded-md w-full">
        <p className="text-sm text-blue-700 text-center">
          reCAPTCHA v3 protection is active. No user interaction required.
        </p>
      </div>
    </div>
  );
};

export default RecaptchaVerification;
