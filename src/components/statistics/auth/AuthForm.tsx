
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
}

export const AuthForm: React.FC<AuthFormProps> = ({
  onAuthenticate,
  activeSiteKey,
  testKeyDisabled,
  useTestKey,
  setUseTestKey,
  productionSiteKey,
  testSiteKey
}) => {
  const [password, setPassword] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [domainError, setDomainError] = useState(false);
  const [keyTypeError, setKeyTypeError] = useState(false);
  
  // Reset recaptcha token when key changes
  useEffect(() => {
    setRecaptchaToken(null);
    setDomainError(false);
    setKeyTypeError(false);
  }, [activeSiteKey, useTestKey]);
  
  // Listen for reCAPTCHA errors in window.console messages
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const originalConsoleError = console.error;
      
      console.error = function(...args) {
        const errorMessage = args.join(' ');
        if (errorMessage.includes('Invalid domain for site key')) {
          setDomainError(true);
        }
        if (errorMessage.includes('Invalid key type') || 
            errorMessage.includes('ERROR for site owner')) {
          setKeyTypeError(true);
        }
        originalConsoleError.apply(console, args);
      };
      
      // Clean up
      return () => {
        console.error = originalConsoleError;
      };
    }
  }, []);
  
  const handleVerify = (token: string | null) => {
    console.log("reCAPTCHA token received:", token);
    setRecaptchaToken(token);
    // If we got a token, we know the domain is valid
    if (token) {
      setDomainError(false);
      setKeyTypeError(false);
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
    if ((domainError || keyTypeError) && !isTestKeyActive) {
      toast.error(keyTypeError 
        ? "Invalid reCAPTCHA key type. Make sure you're using a reCAPTCHA v2 Checkbox key." 
        : "reCAPTCHA domain validation error. Please check your site key configuration.", {
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
        {(domainError || keyTypeError) && !useTestKey && (
          <Alert variant="destructive" className="mb-4">
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {keyTypeError ? (
                <>
                  <strong>Invalid Key Type Error:</strong> You're using an incompatible reCAPTCHA key. 
                  Please make sure you're using a <strong>reCAPTCHA v2 Checkbox</strong> site key, not v3 or invisible.
                </>
              ) : (
                <>
                  <strong>Domain Validation Error:</strong> Your reCAPTCHA site key isn't authorized for this domain. 
                  Either switch to the test key or add this domain in your Google reCAPTCHA console.
                </>
              )}
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
              onError={() => {
                setDomainError(true);
                setKeyTypeError(true);
              }}
            />
            
            <RecaptchaKeySettings
              testKeyDisabled={testKeyDisabled}
              useTestKey={useTestKey}
              setUseTestKey={setUseTestKey}
              productionSiteKey={productionSiteKey}
              testSiteKey={testSiteKey}
            />
          </div>
        </form>
      </CardContent>
      
      <CardFooter>
        <Button 
          type="submit" 
          form="auth-form" 
          className="w-full" 
          disabled={isAuthenticating || ((domainError || keyTypeError) && !useTestKey) || (!useTestKey && !recaptchaToken)}
        >
          {isAuthenticating ? "Authenticating..." : "Authenticate"}
        </Button>
      </CardFooter>
    </>
  );
};

export default AuthForm;
