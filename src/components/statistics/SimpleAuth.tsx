
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { PasswordInput } from "./auth/PasswordInput";
import { RecaptchaVerification } from "./auth/RecaptchaVerification";
import { RecaptchaKeySettings } from "./auth/RecaptchaKeySettings";

interface SimpleAuthProps {
  onAuthenticate: () => void;
}

export const SimpleAuth: React.FC<SimpleAuthProps> = ({ onAuthenticate }) => {
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useTestKey, setUseTestKey] = useState(() => {
    // Check if test key is permanently disabled
    if (localStorage.getItem('shelley_disable_test_recaptcha') === 'true') {
      return false;
    }
    return localStorage.getItem('shelley_use_test_recaptcha') === 'true';
  });
  
  // Test key (Google's test key that always validates)
  const testSiteKey = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";
  // Production key (this would be the actual site key from reCAPTCHA)
  const productionSiteKey = localStorage.getItem('shelley_recaptcha_key') || testSiteKey;
  
  // Check if test key is permanently disabled
  const testKeyDisabled = localStorage.getItem('shelley_disable_test_recaptcha') === 'true';
  
  // The active site key based on the toggle and disabled state
  const activeSiteKey = (!testKeyDisabled && useTestKey) ? testSiteKey : productionSiteKey;
  
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      <Card className="w-full max-w-md shadow-lg border-blue-100">
        <CardHeader className="text-center">
          <div className="flex items-center gap-2 justify-center">
            <Shield className="h-6 w-6 text-primary" />
            <CardTitle>Admin Statistics</CardTitle>
          </div>
          <CardDescription className="text-center">
            Enter the admin password to view statistics
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
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
      </Card>
    </div>
  );
};

export default SimpleAuth;
