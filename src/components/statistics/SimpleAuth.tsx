
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ReCAPTCHA from "react-google-recaptcha";
import { Shield, Eye, EyeOff, KeyRound } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface SimpleAuthProps {
  onAuthenticate: () => void;
}

export const SimpleAuth: React.FC<SimpleAuthProps> = ({ onAuthenticate }) => {
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [useTestKey, setUseTestKey] = useState(() => {
    // Check if test key is permanently disabled
    if (localStorage.getItem('shelley_disable_test_recaptcha') === 'true') {
      return false;
    }
    return localStorage.getItem('shelley_use_test_recaptcha') === 'true';
  });
  
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  
  // Test key (Google's test key that always validates)
  const testSiteKey = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";
  // Production key (this would be the actual site key from reCAPTCHA)
  const productionSiteKey = localStorage.getItem('shelley_recaptcha_key') || testSiteKey;
  
  // Check if test key is permanently disabled
  const testKeyDisabled = localStorage.getItem('shelley_disable_test_recaptcha') === 'true';
  
  // The active site key based on the toggle and disabled state
  const activeSiteKey = (!testKeyDisabled && useTestKey) ? testSiteKey : productionSiteKey;
  
  useEffect(() => {
    // Don't save test key preference if it's disabled permanently
    if (!testKeyDisabled) {
      localStorage.setItem('shelley_use_test_recaptcha', useTestKey.toString());
    }
    // Reset captcha when key changes
    setCaptchaToken(null);
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
    }
  }, [useTestKey, testKeyDisabled]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!captchaToken) {
      toast.error("Please complete the CAPTCHA verification");
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
        toast.success("Authentication successful");
      } else {
        toast.error("Invalid password");
        // Reset the CAPTCHA on failed login attempt
        setCaptchaToken(null);
        if (recaptchaRef.current) {
          recaptchaRef.current.reset();
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const toggleReCaptchaMode = () => {
    if (!testKeyDisabled) {
      setUseTestKey(!useTestKey);
    }
  };
  
  const updateProductionKey = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.value;
    if (key && key.length > 10) { // Simple validation to ensure it looks like a key
      localStorage.setItem('shelley_recaptcha_key', key);
      toast.success("reCAPTCHA site key updated");
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
              <div className="relative flex items-center">
                <div className="absolute left-3 text-gray-400">
                  <KeyRound size={18} />
                </div>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  id="admin-password"
                  name="admin-password"
                  autoComplete="current-password"
                  className="text-left dir-ltr pl-10 pr-10"
                />
                <button 
                  type="button"
                  className="absolute right-2 p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={togglePasswordVisibility}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              <div className="flex justify-center py-2">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={activeSiteKey}
                  onChange={handleCaptchaChange}
                  theme="light"
                />
              </div>
              
              <div className="space-y-2 border-t pt-3">
                {!testKeyDisabled && (
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Use test reCAPTCHA key</span>
                    </div>
                    <Switch 
                      checked={useTestKey} 
                      onCheckedChange={toggleReCaptchaMode} 
                      aria-label="Use test reCAPTCHA key"
                    />
                  </div>
                )}
                
                {(!useTestKey || testKeyDisabled) && (
                  <div className="mt-2">
                    <Input
                      type="text"
                      placeholder="Enter production reCAPTCHA site key"
                      defaultValue={productionSiteKey !== testSiteKey ? productionSiteKey : ''}
                      onChange={updateProductionKey}
                      className="text-xs"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter your production reCAPTCHA v2 site key
                    </p>
                  </div>
                )}
                
                <p className="text-xs text-muted-foreground">
                  {testKeyDisabled 
                    ? "Using production reCAPTCHA key only" 
                    : (useTestKey 
                      ? "Using Google's test key - this will always pass verification" 
                      : "Using production reCAPTCHA key"
                    )
                  }
                </p>
              </div>
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
