
import React, { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

interface RecaptchaKeySettingsProps {
  testKeyDisabled: boolean;
  useTestKey: boolean;
  setUseTestKey: (useTestKey: boolean) => void;
  productionSiteKey: string;
  testSiteKey: string;
  isEnterpriseMode?: boolean;
  enterpriseSiteKey?: string;
}

export const RecaptchaKeySettings: React.FC<RecaptchaKeySettingsProps> = ({
  testKeyDisabled,
  useTestKey,
  setUseTestKey,
  productionSiteKey,
  testSiteKey,
  isEnterpriseMode = false,
  enterpriseSiteKey
}) => {
  const [devMode, setDevMode] = useState(() => {
    return localStorage.getItem('shelley_recaptcha_dev_mode') === 'true';
  });
  
  useEffect(() => {
    // Don't save test key preference if it's disabled permanently
    if (!testKeyDisabled) {
      localStorage.setItem('shelley_use_test_recaptcha', useTestKey.toString());
    }
  }, [useTestKey, testKeyDisabled]);
  
  useEffect(() => {
    localStorage.setItem('shelley_recaptcha_dev_mode', devMode.toString());
  }, [devMode]);
  
  const toggleReCaptchaMode = () => {
    if (!testKeyDisabled) {
      setUseTestKey(!useTestKey);
    }
  };
  
  const toggleDevMode = () => {
    setDevMode(!devMode);
    toast.info(
      !devMode 
        ? "Development mode enabled - domain checking bypassed" 
        : "Development mode disabled - normal domain verification"
    );
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
      
      {(!useTestKey || testKeyDisabled) && !isEnterpriseMode && (
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
      
      <div className="flex items-center justify-between mt-3">
        <div className="text-sm">
          <span className="text-muted-foreground">Development mode</span>
        </div>
        <Switch 
          checked={devMode} 
          onCheckedChange={toggleDevMode} 
          aria-label="Development mode"
        />
      </div>
      
      {devMode && (
        <Alert variant="warning" className="mt-2 p-2">
          <InfoIcon className="h-4 w-4 mr-2" />
          <AlertDescription className="text-xs">
            Development mode bypasses domain verification. Only use during development.
          </AlertDescription>
        </Alert>
      )}
      
      {isEnterpriseMode && (
        <Alert className="mt-2 p-2 bg-blue-50 border-blue-200">
          <InfoIcon className="h-4 w-4 mr-2 text-blue-500" />
          <AlertDescription className="text-xs">
            Using reCAPTCHA Enterprise with invisible verification
          </AlertDescription>
        </Alert>
      )}
      
      <p className="text-xs text-muted-foreground">
        {isEnterpriseMode 
          ? "Using reCAPTCHA Enterprise (invisible mode)"
          : (testKeyDisabled 
              ? "Using production reCAPTCHA key only" 
              : (useTestKey 
                ? "Using Google's test key - this will always pass verification" 
                : "Using production reCAPTCHA key"
              )
            )
        }
      </p>
    </div>
  );
};

export default RecaptchaKeySettings;
