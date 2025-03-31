
import React, { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, CheckCircle, XCircle } from "lucide-react";

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
  
  const [localProductionKey, setLocalProductionKey] = useState(
    productionSiteKey !== testSiteKey ? productionSiteKey : ''
  );
  
  const [keyStatus, setKeyStatus] = useState<'validating' | 'valid' | 'invalid' | 'idle'>('idle');
  
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
  
  const validateRecaptchaKey = (key: string) => {
    if (!key || key.length < 10) {
      setKeyStatus('idle');
      return;
    }
    
    setKeyStatus('validating');
    
    // Create a temporary script element
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=explicit&onload=validateRecaptchaCallback`;
    script.async = true;
    script.defer = true;
    
    // Create a temporary container for the reCAPTCHA
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.visibility = 'hidden';
    container.id = 'temp-recaptcha-container';
    document.body.appendChild(container);
    
    // Set up a global callback function
    window.validateRecaptchaCallback = () => {
      try {
        // Try to render the reCAPTCHA
        const widgetId = window.grecaptcha.render('temp-recaptcha-container', {
          sitekey: key,
          size: 'invisible',
          callback: () => {}
        });
        
        // If it renders successfully, the key is valid
        setKeyStatus('valid');
        localStorage.setItem('shelley_production_key_working', 'true');
        toast.success("reCAPTCHA site key validated successfully");
        
        // Clean up
        window.grecaptcha.reset(widgetId);
      } catch (error) {
        console.error("reCAPTCHA key validation failed:", error);
        setKeyStatus('invalid');
        localStorage.setItem('shelley_production_key_working', 'false');
        toast.error("Invalid reCAPTCHA site key");
      } finally {
        // Clean up
        document.body.removeChild(container);
        document.body.removeChild(script);
        delete window.validateRecaptchaCallback;
      }
    };
    
    // Add the script to the page
    document.body.appendChild(script);
  };
  
  const updateProductionKey = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.value;
    setLocalProductionKey(key);
    
    if (key && key.length > 10) { // Simple validation to ensure it looks like a key
      localStorage.setItem('shelley_recaptcha_key', key);
      validateRecaptchaKey(key);
    } else {
      setKeyStatus('idle');
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
          <div className="relative">
            <Input
              type="text"
              placeholder="Enter production reCAPTCHA site key"
              value={localProductionKey}
              onChange={updateProductionKey}
              className="text-xs pr-8"
            />
            {keyStatus === 'validating' && (
              <div className="absolute right-2 top-2">
                <div className="h-4 w-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
              </div>
            )}
            {keyStatus === 'valid' && (
              <CheckCircle className="absolute right-2 top-2 h-4 w-4 text-green-500" />
            )}
            {keyStatus === 'invalid' && (
              <XCircle className="absolute right-2 top-2 h-4 w-4 text-red-500" />
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1 flex items-center">
            Enter your production reCAPTCHA v2 site key
            {keyStatus === 'valid' && <span className="ml-1 text-green-500">(Key validated)</span>}
            {keyStatus === 'invalid' && <span className="ml-1 text-red-500">(Invalid key)</span>}
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
