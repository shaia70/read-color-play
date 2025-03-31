
import React, { useRef, useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";

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
  
  useEffect(() => {
    // Reset captcha when key changes
    onVerify(null);
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
    }
  }, [useTestKey, testKeyDisabled, onVerify]);
  
  return (
    <div className="flex justify-center py-2">
      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey={siteKey}
        onChange={onVerify}
        theme="light"
      />
    </div>
  );
};

export default RecaptchaVerification;
