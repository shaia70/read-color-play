
import React, { useRef, useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

interface RecaptchaVerificationProps {
  siteKey: string;
  onVerify: (token: string | null) => void;
  testKeyDisabled: boolean;
  useTestKey: boolean;
  onError?: () => void;
  isEnterpriseMode?: boolean;
}

export const RecaptchaVerification: React.FC<RecaptchaVerificationProps> = ({
  siteKey,
  onVerify,
  testKeyDisabled,
  useTestKey,
  onError,
  isEnterpriseMode = false
}) => {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(false);
  
  // For handling enterprise/v3 recaptcha
  useEffect(() => {
    if (isEnterpriseMode && !useTestKey && siteKey) {
      setIsLoading(true);
      
      // Check if script already exists to avoid duplicates
      const existingScript = document.querySelector(`script[src*="recaptcha/enterprise.js"]`);
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/enterprise.js?render=${siteKey}`;
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          if (window.grecaptcha && window.grecaptcha.enterprise) {
            window.grecaptcha.enterprise.ready(() => {
              try {
                window.grecaptcha.enterprise.execute(siteKey, { action: 'login' })
                  .then((token) => {
                    console.log("Enterprise token generated:", token ? "success" : "failed");
                    onVerify(token);
                    setIsLoading(false);
                  })
                  .catch((err) => {
                    console.error("Enterprise reCAPTCHA error:", err);
                    if (onError) onError();
                    setIsLoading(false);
                    toast.error("Failed to validate with reCAPTCHA Enterprise");
                  });
              } catch (error) {
                console.error("Enterprise execution error:", error);
                if (onError) onError();
                setIsLoading(false);
                toast.error("Failed to initialize reCAPTCHA Enterprise");
              }
            });
          } else {
            console.error("Enterprise reCAPTCHA not available after loading");
            if (onError) onError();
            setIsLoading(false);
            toast.error("reCAPTCHA Enterprise failed to initialize");
          }
        };
        
        script.onerror = () => {
          console.error("Failed to load Enterprise reCAPTCHA script");
          if (onError) onError();
          setIsLoading(false);
          toast.error("Failed to load reCAPTCHA Enterprise script");
        };
        
        document.head.appendChild(script);
        
        return () => {
          if (document.head.contains(script)) {
            document.head.removeChild(script);
          }
        };
      } else {
        // Script already exists, try to use it
        if (window.grecaptcha && window.grecaptcha.enterprise) {
          window.grecaptcha.enterprise.ready(() => {
            try {
              window.grecaptcha.enterprise.execute(siteKey, { action: 'login' })
                .then((token) => {
                  onVerify(token);
                  setIsLoading(false);
                })
                .catch(() => {
                  if (onError) onError();
                  setIsLoading(false);
                });
            } catch (error) {
              console.error("Enterprise execution error:", error);
              if (onError) onError();
              setIsLoading(false);
            }
          });
        } else {
          console.error("Enterprise reCAPTCHA not available");
          if (onError) onError();
          setIsLoading(false);
        }
      }
    }
  }, [siteKey, isEnterpriseMode, useTestKey, onVerify, onError]);
  
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
  
  // Don't render the component if using test key or enterprise mode
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
  
  if (isEnterpriseMode) {
    return (
      <div className="flex flex-col items-center py-2">
        <div className="bg-blue-50 border border-blue-200 p-2 rounded-md w-full">
          <p className="text-sm text-blue-700 text-center">
            {isLoading 
              ? "Verifying with reCAPTCHA Enterprise..." 
              : "Verified with reCAPTCHA Enterprise"}
          </p>
          {isLoading && (
            <div className="flex justify-center mt-2">
              <div className="h-5 w-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
            </div>
          )}
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
