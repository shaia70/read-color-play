
import React, { useState, useEffect } from "react";
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
}

export const RecaptchaKeySettings: React.FC<RecaptchaKeySettingsProps> = ({
  testKeyDisabled,
  useTestKey,
  setUseTestKey,
  productionSiteKey,
  testSiteKey
}) => {
  const [localProductionKey, setLocalProductionKey] = useState(
    productionSiteKey !== testSiteKey ? productionSiteKey : ''
  );
  
  const [keyStatus, setKeyStatus] = useState<'validating' | 'valid' | 'invalid' | 'idle'>('idle');
  const [validationTimeouts, setValidationTimeouts] = useState<{[key: string]: ReturnType<typeof setTimeout>}>({});
  
  useEffect(() => {
    // Don't save test key preference if it's disabled permanently
    if (!testKeyDisabled) {
      localStorage.setItem('shelley_use_test_recaptcha', useTestKey.toString());
    }
  }, [useTestKey, testKeyDisabled]);
  
  // Cleanup timeouts when component unmounts
  useEffect(() => {
    return () => {
      Object.values(validationTimeouts).forEach(timeout => clearTimeout(timeout));
    };
  }, [validationTimeouts]);
  
  const toggleReCaptchaMode = () => {
    if (!testKeyDisabled) {
      setUseTestKey(!useTestKey);
    }
  };
  
  const validateRecaptchaKey = (key: string) => {
    if (!key || key.length < 10) {
      setKeyStatus('idle');
      return;
    }
    
    setKeyStatus('validating');
    
    // Clear any existing timeout for this validation type
    if (validationTimeouts['standard']) {
      clearTimeout(validationTimeouts['standard']);
    }
    
    // Create a temporary script element
    const script = document.createElement('script');
    const scriptId = `recaptcha-script-${Date.now()}`;
    script.id = scriptId;
    script.src = `https://www.google.com/recaptcha/api.js?render=explicit&onload=validateRecaptchaCallback`;
    script.async = true;
    script.defer = true;
    
    // Set a timeout to handle the case where the script fails to load or execute properly
    const timeoutId = setTimeout(() => {
      setKeyStatus('invalid');
      localStorage.setItem('shelley_production_key_working', 'false');
      
      // Remove the script if it's still in the DOM
      const scriptElement = document.getElementById(scriptId);
      if (scriptElement) {
        document.body.removeChild(scriptElement);
      }
      
      // Remove the temporary container if it exists
      const container = document.getElementById('temp-recaptcha-container');
      if (container) {
        document.body.removeChild(container);
      }
      
      toast({
        variant: "destructive",
        title: "reCAPTCHA Validation Failed",
        description: "The site key could not be validated. Please check it and try again.",
        duration: 5000,
      });
      
      // Update the validation timeouts state
      setValidationTimeouts(prev => {
        const updated = {...prev};
        delete updated['standard'];
        return updated;
      });
    }, 10000); // 10 second timeout
    
    // Update the validation timeouts state
    setValidationTimeouts(prev => ({
      ...prev,
      'standard': timeoutId
    }));
    
    // Create a temporary container for the reCAPTCHA
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.visibility = 'hidden';
    container.id = 'temp-recaptcha-container';
    document.body.appendChild(container);
    
    // Set up a global callback function
    window.validateRecaptchaCallback = () => {
      try {
        // Clear the timeout since we've received a callback
        clearTimeout(timeoutId);
        setValidationTimeouts(prev => {
          const updated = {...prev};
          delete updated['standard'];
          return updated;
        });
        
        // Try to render the reCAPTCHA
        const widgetId = window.grecaptcha.render('temp-recaptcha-container', {
          sitekey: key,
          size: 'normal',
          callback: () => {}
        });
        
        // If it renders successfully without throwing an error, the key is valid
        setKeyStatus('valid');
        localStorage.setItem('shelley_recaptcha_key', key);
        localStorage.setItem('shelley_production_key_working', 'true');
        toast.success("reCAPTCHA Site Key Validated", {
          description: "Your site key has been validated and saved.",
          duration: 3000,
        });
        
        // Clean up
        window.grecaptcha.reset(widgetId);
      } catch (error) {
        console.error("reCAPTCHA key validation failed:", error);
        setKeyStatus('invalid');
        localStorage.setItem('shelley_production_key_working', 'false');
        toast.error("Invalid reCAPTCHA Site Key", {
          description: "The site key could not be validated. Please check it and try again.",
          duration: 5000,
        });
      } finally {
        // Clean up
        const container = document.getElementById('temp-recaptcha-container');
        if (container) {
          document.body.removeChild(container);
        }
        
        const scriptElement = document.getElementById(scriptId);
        if (scriptElement) {
          document.body.removeChild(scriptElement);
        }
        
        delete window.validateRecaptchaCallback;
      }
    };
    
    // Handle script load errors
    script.onerror = () => {
      clearTimeout(timeoutId);
      setValidationTimeouts(prev => {
        const updated = {...prev};
        delete updated['standard'];
        return updated;
      });
      
      console.error("Failed to load reCAPTCHA script");
      setKeyStatus('invalid');
      localStorage.setItem('shelley_production_key_working', 'false');
      
      toast.error("reCAPTCHA Script Failed to Load", {
        description: "Could not load the reCAPTCHA script. Please try again later.",
        duration: 5000,
      });
      
      // Clean up
      const container = document.getElementById('temp-recaptcha-container');
      if (container) {
        document.body.removeChild(container);
      }
      
      const scriptElement = document.getElementById(scriptId);
      if (scriptElement) {
        document.body.removeChild(scriptElement);
      }
    };
    
    // Add the script to the page
    document.body.appendChild(script);
  };
  
  const updateProductionKey = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.value;
    setLocalProductionKey(key);
    
    if (key && key.length > 10) { // Simple validation to ensure it looks like a key
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
      
      {(!useTestKey || testKeyDisabled) && (
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
            Enter your production reCAPTCHA v2 Checkbox site key
            {keyStatus === 'valid' && <span className="ml-1 text-green-500">(Key validated)</span>}
            {keyStatus === 'invalid' && <span className="ml-1 text-red-500">(Invalid key)</span>}
          </p>
        </div>
      )}
      
      <Alert className="mt-2 p-2 bg-blue-50 border-blue-200">
        <InfoIcon className="h-4 w-4 mr-2 text-blue-500" />
        <AlertDescription className="text-xs">
          {testKeyDisabled 
            ? "Using production reCAPTCHA key only" 
            : (useTestKey 
                ? "Using Google's test key - this will always pass verification" 
                : "You must register your domain in the Google reCAPTCHA console"
              )
          }
        </AlertDescription>
      </Alert>
      
      <p className="text-xs text-muted-foreground">
        {testKeyDisabled 
          ? "Using checkbox reCAPTCHA with production key only" 
          : (useTestKey 
              ? "Using Google's test key - this will always pass verification" 
              : "Using checkbox reCAPTCHA with production key"
            )
        }
      </p>
    </div>
  );
};

export default RecaptchaKeySettings;
