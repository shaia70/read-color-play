
import React, { useState } from "react";
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
  
  const handleVerify = (token: string | null) => {
    setRecaptchaToken(token);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recaptchaToken) {
      toast.error("Please complete the reCAPTCHA verification");
      return;
    }
    
    if (!password.trim()) {
      toast.error("Please enter the admin password");
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
          disabled={isAuthenticating || !recaptchaToken}
        >
          {isAuthenticating ? "Authenticating..." : "Authenticate"}
        </Button>
      </CardFooter>
    </>
  );
};

export default AuthForm;
