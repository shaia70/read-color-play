
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ReCAPTCHA from "react-google-recaptcha";
import { Shield } from "lucide-react";

interface SimpleAuthProps {
  onAuthenticate: () => void;
}

export const SimpleAuth: React.FC<SimpleAuthProps> = ({ onAuthenticate }) => {
  const [password, setPassword] = useState("");
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!captchaValue) {
      toast.error("Please complete the CAPTCHA");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Get stored password or use default if not set
      const storedPassword = localStorage.getItem('shelley_admin_password') || "ShelleyStats2024";
      
      if (password === storedPassword) {
        onAuthenticate();
        toast.success("Authentication successful");
      } else {
        toast.error("Invalid password");
        // Reset the CAPTCHA on failed login attempt
        setCaptchaValue(null);
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
  
  const handleCaptchaChange = (value: string | null) => {
    setCaptchaValue(value);
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <CardTitle>Admin Statistics</CardTitle>
          </div>
          <CardDescription>
            Enter the admin password to view statistics
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="admin-password"
                name="admin-password"
                autoComplete="current-password"
              />
              
              <div className="flex justify-center py-2">
                <ReCAPTCHA
                  sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" // This is Google's test key - replace with your actual key in production
                  onChange={handleCaptchaChange}
                  ref={recaptchaRef}
                />
              </div>
              
              <p className="text-xs text-muted-foreground text-center">
                This page is protected by reCAPTCHA to ensure you're not a robot.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting || !captchaValue}
            >
              {isSubmitting ? "Verifying..." : "Access Statistics"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
