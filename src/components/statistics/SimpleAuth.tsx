
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Turnstile } from "turnstile-react";
import { Shield, Eye, EyeOff } from "lucide-react";

interface SimpleAuthProps {
  onAuthenticate: () => void;
}

export const SimpleAuth: React.FC<SimpleAuthProps> = ({ onAuthenticate }) => {
  const [password, setPassword] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!turnstileToken) {
      toast.error("Please complete the Turnstile verification");
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
        // Reset the Turnstile on failed login attempt
        setTurnstileToken(null);
        // The Turnstile widget automatically resets after verification
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleTurnstileVerify = (token: string) => {
    setTurnstileToken(token);
  };
  
  const handleTurnstileError = () => {
    toast.error("Turnstile verification failed. Please try again.");
    setTurnstileToken(null);
  };
  
  const handleTurnstileExpire = () => {
    toast.warning("Verification expired. Please verify again.");
    setTurnstileToken(null);
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
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
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  id="admin-password"
                  name="admin-password"
                  autoComplete="current-password"
                  className="text-left dir-ltr pr-10" // Added padding-right for the icon
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
                <Turnstile
                  siteKey="1x00000000000000000000AA" // This is Cloudflare's test key - replace with your actual key in production
                  onVerify={handleTurnstileVerify}
                  onError={handleTurnstileError}
                  onExpire={handleTurnstileExpire}
                  theme="light"
                />
              </div>
              
              <p className="text-xs text-muted-foreground text-center">
                This page is protected by Cloudflare Turnstile to ensure you're not a robot.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting || !turnstileToken}
            >
              {isSubmitting ? "Verifying..." : "Access Statistics"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
