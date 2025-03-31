
import React, { useRef, useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useIsMobile } from "@/hooks/use-mobile";

interface RecaptchaVerificationProps {
  siteKey: string;
  onVerify: (token: string | null) => void;
  testKeyDisabled: boolean;
  useTestKey: boolean;
}

export const RecaptchaVerification: React.FC<RecaptchaVerificationProps> = ({
  siteKey,
  onVerify,
  testKeyDisabled,
  useTestKey
}) => {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const isMobile = useIsMobile();
  const isDevMode = localStorage.getItem('shelley_recaptcha_dev_mode') === 'true';
  
  useEffect(() => {
    // Reset captcha when key changes
    onVerify(null);
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
    }
  }, [siteKey, useTestKey, testKeyDisabled, onVerify]);
  
  // For test key or dev mode, we'll simulate a successful verification
  useEffect(() => {
    if ((!testKeyDisabled && useTestKey) || isDevMode) {
      // Automatically simulate verification
      const testToken = "test-captcha-token-123456789";
      onVerify(testToken);
    }
  }, [testKeyDisabled, useTestKey, onVerify, isDevMode]);
  
  // Don't render the component if using test key or in dev mode
  if ((!testKeyDisabled && useTestKey) || isDevMode) {
    return (
      <div className="flex flex-col items-center py-2">
        <div className="bg-amber-50 border border-amber-200 p-2 rounded-md w-full">
          <p className="text-sm text-amber-700 text-center">
            {isDevMode ? "Development mode enabled. Verification is automatic." : 
             "Using test reCAPTCHA key. Verification is automatic."}
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
        />
      </div>
    </div>
  );
};

export default RecaptchaVerification;
