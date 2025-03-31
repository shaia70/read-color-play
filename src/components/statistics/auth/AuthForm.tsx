
import React, { useState, useEffect } from "react";
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import PasswordInput from "./PasswordInput";
import RecaptchaVerification from "./RecaptchaVerification";
import RecaptchaKeySettings from "./RecaptchaKeySettings";

interface AuthFormProps {
  onAuthenticate: () => void;
  activeSiteKey: string;
  testKeyDisabled: boolean;
  useTestKey: boolean;
  setUseTestKey: (useTestKey: boolean) => void;
  productionSiteKey: string;
  testSiteKey: string;
  isEnterpriseMode?: boolean;
  enterpriseSiteKey?: string;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  onAuthenticate,
  activeSiteKey,
  testKeyDisabled,
  useTestKey,
  setUseTestKey,
  productionSiteKey,
  testSiteKey,
  isEnterpriseMode = false,
  enterpriseSiteKey
}) => {
  const [password, setPassword] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  
  // Reset recaptcha token when key changes
  useEffect(() => {
    setRecaptchaToken(null);
  }, [activeSiteKey, useTestKey]);
  
  // For enterprise reCAPTCHA, load the script when component mounts
  useEffect(() => {
    if (isEnterpriseMode && typeof window !== 'undefined') {
      // Check if the script already exists
      const existingScript = document.querySelector(`script[src*="recaptcha/enterprise.js"]`);
      if (!existingScript && enterpriseSiteKey) {
        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/enterprise.js?render=${enterpriseSiteKey}`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
        
        // Clean up on unmount
        return () => {
          if (document.head.contains(script)) {
            document.head.removeChild(script);
          }
        };
      }
    }
  }, [isEnterpriseMode, enterpriseSiteKey]);
  
  const handleVerify = (token: string | null) => {
    console.log("reCAPTCHA token received:", token);
    setRecaptchaToken(token);
  };
  
  const executeEnterpriseRecaptcha = async () => {
    if (!isEnterpriseMode || !window.grecaptcha || !window.grecaptcha.enterprise || !enterpriseSiteKey) {
      return null;
    }
    
    try {
      // Make sure the enterprise API is ready
      return new Promise<string | null>((resolve) => {
        window.grecaptcha.enterprise.ready(async () => {
          try {
            const token = await window.grecaptcha.enterprise.execute(enterpriseSiteKey, {action: 'login'});
            console.log("Enterprise reCAPTCHA token:", token);
            resolve(token);
          } catch (error) {
            console.error("Enterprise reCAPTCHA error:", error);
            resolve(null);
          }
        });
      });
    } catch (error) {
      console.error("Enterprise reCAPTCHA error:", error);
      return null;
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password.trim()) {
      toast.error("Please enter the admin password");
      return;
    }
    
    // For test key, we'll accept the verification without requiring a token
    const isTestKeyActive = !testKeyDisabled && useTestKey;
    const isDevMode = localStorage.getItem('shelley_recaptcha_dev_mode') === 'true';
    
    // For non-test, non-dev, non-enterprise modes, require a token
    if (!isTestKeyActive && !isDevMode && !isEnterpriseMode && !recaptchaToken) {
      toast.error("Please complete the reCAPTCHA verification");
      return;
    }
    
    setIsAuthenticating(true);
    
    // If enterprise mode, execute the reCAPTCHA
    let enterpriseToken = null;
    if (isEnterpriseMode) {
      enterpriseToken = await executeEnterpriseRecaptcha();
      
      // In dev mode, we'll bypass the token check
      if (!enterpriseToken && !isDevMode) {
        toast.error("reCAPTCHA verification failed. Please try again.");
        setIsAuthenticating(false);
        return;
      }
    }
    
    // For demo purposes, check if the password is the test password
    // In a real app, this would make an API call to validate
    setTimeout(() => {
      const testPassword = "admin1234"; // This would normally be stored securely
      
      if (password === testPassword) {
        toast.success("Authentication successful");
        
        // Store authentication state in session storage
        sessionStorage.setItem('shelley_admin_authenticated', 'true');
        
        // Call the onAuthenticate callback
        onAuthenticate();
      } else {
        toast.error("Invalid password");
      }
      
      setIsAuthenticating(false);
    }, 1000);
  };
  
  return (
    <>
      <CardHeader>
        <CardTitle className="text-center flex items-center justify-center gap-2">
          <Lock className="h-5 w-5" />
          Admin Authentication
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} id="auth-form">
          <div className="space-y-4">
            <div className="space-y-2">
              <PasswordInput
                password={password}
                setPassword={setPassword}
              />
            </div>
            
            {!isEnterpriseMode && (
              <RecaptchaVerification
                siteKey={activeSiteKey}
                onVerify={handleVerify}
                testKeyDisabled={testKeyDisabled}
                useTestKey={useTestKey}
              />
            )}
            
            <RecaptchaKeySettings
              testKeyDisabled={testKeyDisabled}
              useTestKey={useTestKey}
              setUseTestKey={setUseTestKey}
              productionSiteKey={productionSiteKey}
              testSiteKey={testSiteKey}
              isEnterpriseMode={isEnterpriseMode}
              enterpriseSiteKey={enterpriseSiteKey}
            />
          </div>
        </form>
      </CardContent>
      
      <CardFooter>
        <Button 
          type="submit" 
          form="auth-form" 
          className="w-full" 
          disabled={isAuthenticating || (!useTestKey && localStorage.getItem('shelley_recaptcha_dev_mode') !== 'true' && !isEnterpriseMode && !recaptchaToken)}
        >
          {isAuthenticating ? "Authenticating..." : "Authenticate"}
        </Button>
      </CardFooter>
    </>
  );
};

export default AuthForm;
