
import * as React from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const recaptchaRef = React.useRef<ReCAPTCHA>(null);
  const isMobile = useIsMobile();
  
  React.useEffect(() => {
    // Reset captcha when key changes
    onVerify(null);
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
    }
  }, [siteKey, useTestKey, testKeyDisabled, onVerify]);
  
  // Listen for reCAPTCHA error messages
  React.useEffect(() => {
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
  React.useEffect(() => {
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
  
  return (
    <div className="flex justify-center py-2 overflow-hidden">
      <div className={isMobile ? "scale-[0.85] -ml-6" : ""}>
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={siteKey}
          onChange={onVerify}
          theme="light"
          size={isMobile ? "compact" : "normal"}
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
