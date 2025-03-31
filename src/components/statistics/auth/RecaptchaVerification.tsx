
import React, { useRef, useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";
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
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Reset captcha when key changes
    onVerify(null);
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
    }
  }, [siteKey, useTestKey, testKeyDisabled, onVerify]);
  
  // Listen for reCAPTCHA error messages
  useEffect(() => {
    const handleErrorMessages = (event: ErrorEvent) => {
      if (event.message && 
         (event.message.includes('Invalid domain for site key') || 
          event.message.includes('ERROR for site owner'))) {
        console.error("reCAPTCHA domain validation error detected:", event.message);
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
    <div className="flex justify-center py-2 overflow-hidden">
      <div className={isMobile ? "scale-[0.85] -ml-6" : ""}>
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={siteKey}
          onChange={onVerify}
          theme="light"
          size="normal"
          onErrored={() => {
            console.error("reCAPTCHA widget encountered an error");
            if (onError) onError();
          }}
        />
      </div>
    </div>
  );
};

export default RecaptchaVerification;
