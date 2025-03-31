
import React, { useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface RecaptchaKeySettingsProps {
  testKeyDisabled: boolean;
  useTestKey: boolean;
  setUseTestKey: (useTestKey: boolean) => void;
  productionSiteKey: string;
  testSiteKey: string;
}

export const RecaptchaKeySettings: React.FC<RecaptchaKeySettingsProps> = ({
  testKeyDisabled,
  useTestKey,
  setUseTestKey,
  productionSiteKey,
  testSiteKey
}) => {
  
  useEffect(() => {
    // Don't save test key preference if it's disabled permanently
    if (!testKeyDisabled) {
      localStorage.setItem('shelley_use_test_recaptcha', useTestKey.toString());
    }
  }, [useTestKey, testKeyDisabled]);
  
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
  );
};

export default RecaptchaKeySettings;
