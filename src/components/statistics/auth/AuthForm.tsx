
import React, { useState } from "react";
import { CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { PasswordInput } from "./PasswordInput";
import { RecaptchaVerification } from "./RecaptchaVerification";
import { RecaptchaKeySettings } from "./RecaptchaKeySettings";

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
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!captchaToken) {
      import('sonner').then(({ toast }) => {
        toast.error("Please complete the CAPTCHA verification");
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Get stored password or use default if not set
      const storedPassword = localStorage.getItem('shelley_admin_password') || "ShelleyStats2024";
      
      if (password === storedPassword) {
        // Only track successful production key login if:
        // 1. Not using test key
        // 2. Production key is different from test key
        // 3. We're actually using the production key for verification
        if (!useTestKey && productionSiteKey !== testSiteKey) {
          localStorage.setItem('shelley_production_key_working', 'true');
        }
        
        onAuthenticate();
        import('sonner').then(({ toast }) => {
          toast.success("Authentication successful");
        });
      } else {
        import('sonner').then(({ toast }) => {
          toast.error("Invalid password");
        });
        // Reset the CAPTCHA on failed login attempt
        setCaptchaToken(null);
      }
    } catch (error) {
      console.error("Login error:", error);
      import('sonner').then(({ toast }) => {
        toast.error("An error occurred during login");
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <CardHeader className="text-center">
        <div className="flex items-center gap-2 justify-center">
          <Shield className="h-6 w-6 text-primary" />
          <CardTitle>Admin Statistics</CardTitle>
        </div>
        <CardDescription className="text-center">
          Enter the admin password to view statistics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <PasswordInput 
            password={password} 
            setPassword={setPassword} 
          />
          
          <RecaptchaVerification
            siteKey={activeSiteKey}
            onVerify={setCaptchaToken}
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
      </CardContent>
      <CardFooter>
        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting || !captchaToken}
        >
          {isSubmitting ? "Verifying..." : "Access Statistics"}
        </Button>
      </CardFooter>
    </form>
  );
};

export default AuthForm;
