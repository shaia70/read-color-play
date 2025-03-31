
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PixelConfig {
  googleAnalyticsId: string;
  facebookPixelId: string;
}

export const PixelManagement: React.FC = () => {
  const [pixelConfig, setPixelConfig] = useState<PixelConfig>({
    googleAnalyticsId: "",
    facebookPixelId: ""
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  // Load existing configuration on component mount
  useEffect(() => {
    const storedConfig = localStorage.getItem('analytics_pixel_config');
    if (storedConfig) {
      try {
        const parsedConfig = JSON.parse(storedConfig);
        setPixelConfig(parsedConfig);
      } catch (error) {
        console.error("Error parsing stored pixel configuration:", error);
      }
    } else {
      // Try to get from current values if they exist in the Analytics Provider
      // This is a fallback for the initial setup
      const googleId = document.querySelector('meta[name="google-analytics-id"]')?.getAttribute('content') || '';
      const fbId = document.querySelector('meta[name="facebook-pixel-id"]')?.getAttribute('content') || '';
      
      if (googleId || fbId) {
        setPixelConfig({
          googleAnalyticsId: googleId,
          facebookPixelId: fbId
        });
      }
    }
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPixelConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSave = () => {
    setIsLoading(true);
    
    try {
      // Save to local storage
      localStorage.setItem('analytics_pixel_config', JSON.stringify(pixelConfig));
      
      // Update meta tags for current session
      let googleMeta = document.querySelector('meta[name="google-analytics-id"]');
      if (!googleMeta) {
        googleMeta = document.createElement('meta');
        googleMeta.setAttribute('name', 'google-analytics-id');
        document.head.appendChild(googleMeta);
      }
      googleMeta.setAttribute('content', pixelConfig.googleAnalyticsId);
      
      let fbMeta = document.querySelector('meta[name="facebook-pixel-id"]');
      if (!fbMeta) {
        fbMeta = document.createElement('meta');
        fbMeta.setAttribute('name', 'facebook-pixel-id');
        document.head.appendChild(fbMeta);
      }
      fbMeta.setAttribute('content', pixelConfig.facebookPixelId);
      
      toast.success("Analytics configuration saved successfully");
      
      // Inform the user that changes will take effect on page reload
      toast.info("Refresh the page for changes to take effect", {
        duration: 5000,
      });
    } catch (error) {
      console.error("Error saving pixel configuration:", error);
      toast.error("Failed to save configuration");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-left">Analytics Pixels Configuration</CardTitle>
        <CardDescription className="text-left">
          Configure your analytics tracking pixels for all site pages
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="googleAnalyticsId" className="text-left">Google Analytics Measurement ID</Label>
            <Input
              id="googleAnalyticsId"
              name="googleAnalyticsId"
              placeholder="G-XXXXXXXXXX"
              value={pixelConfig.googleAnalyticsId}
              onChange={handleInputChange}
              className="dir-ltr"
            />
            <p className="text-sm text-muted-foreground text-left">
              Enter your Google Analytics 4 Measurement ID (starts with G-)
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="facebookPixelId" className="text-left">Facebook Pixel ID</Label>
            <Input
              id="facebookPixelId"
              name="facebookPixelId"
              placeholder="XXXXXXXXXX"
              value={pixelConfig.facebookPixelId}
              onChange={handleInputChange}
              className="dir-ltr"
            />
            <p className="text-sm text-muted-foreground text-left">
              Enter your Facebook Pixel ID (numeric value)
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSave} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Saving..." : "Save Configuration"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PixelManagement;
