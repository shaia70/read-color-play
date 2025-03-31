
import React, { useState, useEffect } from "react";
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Info } from "lucide-react";
import { toast } from "sonner";
import PasswordInput from "./PasswordInput";
import RecaptchaVerification from "./RecaptchaVerification";
import RecaptchaKeySettings from "./RecaptchaKeySettings";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const [domainError, setDomainError] = useState(false);
  
  // Reset recaptcha token when key changes
  useEffect(() => {
    setRecaptchaToken(null);
    setDomainError(false);
  }, [activeSiteKey, useTestKey]);
  
  const handleVerify = (token: string | null) => {
    console.log("reCAPTCHA token received:", token ? "valid token" : "no token");
    setRecaptchaToken(token);
    // If we got a token, we know the domain is valid
    if (token) {
      setDomainError(false);
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
    
    // Don't continue if there's a domain error and we're not in test mode
    if (domainError && !isTestKeyActive) {
      toast.error("reCAPTCHA domain validation error. Please check your site key configuration.", {
        duration: 8000,
      });
      return;
    }
    
    // For non-test modes, require a token
    if (!isTestKeyActive && !recaptchaToken) {
      toast.error("Please complete the reCAPTCHA verification");
      return;
    }
    
    setIsAuthenticating(true);
    
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
        {domainError && !useTestKey && (
          <Alert variant="destructive" className="mb-4">
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Domain Validation Error:</strong> Your reCAPTCHA site key isn't authorized for this domain. 
              Either switch to the test key or add this domain in your Google reCAPTCHA console.
            </AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} id="auth-form">
          <div className="space-y-4">
            <div className="space-y-2">
              <PasswordInput
                password={password}
                setPassword={setPassword}
              />
            </div>
            
            <RecaptchaVerification
              siteKey={activeSiteKey}
              onVerify={handleVerify}
              testKeyDisabled={testKeyDisabled}
              useTestKey={useTestKey}
              onError={() => setDomainError(true)}
              isEnterpriseMode={isEnterpriseMode}
            />
            
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
          disabled={isAuthenticating || (domainError && !useTestKey) || (!useTestKey && !recaptchaToken)}
        >
          {isAuthenticating ? "Authenticating..." : "Authenticate"}
        </Button>
      </CardFooter>
    </>
  );
};

export default AuthForm;
