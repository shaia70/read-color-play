
import React, { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
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
  
  const [localEnterpriseKey, setLocalEnterpriseKey] = useState(
    enterpriseSiteKey || ''
  );
  
  const [keyStatus, setKeyStatus] = useState<'validating' | 'valid' | 'invalid' | 'idle'>('idle');
  const [enterpriseKeyStatus, setEnterpriseKeyStatus] = useState<'validating' | 'valid' | 'invalid' | 'idle'>('idle');
  const [validationTimeouts, setValidationTimeouts] = useState<{[key: string]: ReturnType<typeof setTimeout>}>({});
  
  useEffect(() => {
    // Don't save test key preference if it's disabled permanently
    if (!testKeyDisabled) {
      localStorage.setItem('shelley_use_test_recaptcha', useTestKey.toString());
    }
  }, [useTestKey, testKeyDisabled]);
  
  useEffect(() => {
    localStorage.setItem('shelley_recaptcha_dev_mode', devMode.toString());
  }, [devMode]);
  
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
  
  const toggleDevMode = () => {
    setDevMode(!devMode);
    toast({
      title: devMode ? "Development Mode Disabled" : "Development Mode Enabled",
      description: !devMode 
        ? "Domain checking bypassed for testing" 
        : "Normal domain verification restored",
      duration: 3000,
    });
  };
  
  const validateRecaptchaKey = (key: string, isEnterprise: boolean = false) => {
    if (!key || key.length < 10) {
      if (isEnterprise) {
        setEnterpriseKeyStatus('idle');
      } else {
        setKeyStatus('idle');
      }
      return;
    }
    
    if (isEnterprise) {
      setEnterpriseKeyStatus('validating');
    } else {
      setKeyStatus('validating');
    }
    
    // Clear any existing timeout for this validation type
    if (validationTimeouts[isEnterprise ? 'enterprise' : 'standard']) {
      clearTimeout(validationTimeouts[isEnterprise ? 'enterprise' : 'standard']);
    }
    
    // Create a temporary script element
    const script = document.createElement('script');
    const scriptId = `recaptcha-script-${Date.now()}`;
    script.id = scriptId;
    script.src = isEnterprise 
      ? `https://www.google.com/recaptcha/enterprise.js?render=${key}`
      : `https://www.google.com/recaptcha/api.js?render=explicit&onload=validateRecaptchaCallback`;
    script.async = true;
    script.defer = true;
    
    // Set a timeout to handle the case where the script fails to load or execute properly
    const timeoutId = setTimeout(() => {
      if (isEnterprise) {
        setEnterpriseKeyStatus('invalid');
        localStorage.setItem('shelley_enterprise_key_working', 'false');
      } else {
        setKeyStatus('invalid');
        localStorage.setItem('shelley_production_key_working', 'false');
      }
      
      // Remove the script if it's still in the DOM
      const scriptElement = document.getElementById(scriptId);
      if (scriptElement) {
        document.body.removeChild(scriptElement);
      }
      
      // Remove the temporary container if it exists (for standard reCAPTCHA)
      const container = document.getElementById('temp-recaptcha-container');
      if (container) {
        document.body.removeChild(container);
      }
      
      toast({
        variant: "destructive",
        title: `${isEnterprise ? "Enterprise" : "Standard"} reCAPTCHA Validation Failed`,
        description: "The site key could not be validated. Please check it and try again.",
        duration: 5000,
      });
      
      // Update the validation timeouts state
      setValidationTimeouts(prev => {
        const updated = {...prev};
        delete updated[isEnterprise ? 'enterprise' : 'standard'];
        return updated;
      });
    }, 10000); // 10 second timeout
    
    // Update the validation timeouts state
    setValidationTimeouts(prev => ({
      ...prev,
      [isEnterprise ? 'enterprise' : 'standard']: timeoutId
    }));
    
    // For standard reCAPTCHA
    if (!isEnterprise) {
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
            size: 'invisible',
            callback: () => {}
          });
          
          // If it renders successfully without throwing an error, the key is valid
          setKeyStatus('valid');
          localStorage.setItem('shelley_recaptcha_key', key);
          localStorage.setItem('shelley_production_key_working', 'true');
          toast({
            title: "reCAPTCHA Site Key Validated",
            description: "Your site key has been validated and saved.",
            duration: 3000,
          });
          
          // Clean up
          window.grecaptcha.reset(widgetId);
        } catch (error) {
          console.error("reCAPTCHA key validation failed:", error);
          setKeyStatus('invalid');
          localStorage.setItem('shelley_production_key_working', 'false');
          toast({
            variant: "destructive",
            title: "Invalid reCAPTCHA Site Key",
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
        
        toast({
          variant: "destructive",
          title: "reCAPTCHA Script Failed to Load",
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
    } 
    // For Enterprise reCAPTCHA
    else {
      // Set up load and error handlers
      script.onload = () => {
        try {
          // Clear the timeout since the script loaded
          clearTimeout(timeoutId);
          setValidationTimeouts(prev => {
            const updated = {...prev};
            delete updated['enterprise'];
            return updated;
          });
          
          // Check if the enterprise object is available
          if (window.grecaptcha && window.grecaptcha.enterprise) {
            try {
              window.grecaptcha.enterprise.ready(() => {
                try {
                  // Attempt to execute with the key to verify it
                  const executePromise = window.grecaptcha.enterprise.execute(key, { action: 'validate' });
                  
                  // Handle both Promise and non-Promise implementations
                  if (executePromise && typeof executePromise.then === 'function') {
                    executePromise.then(() => {
                      // If execution succeeds, the key is valid
                      setEnterpriseKeyStatus('valid');
                      localStorage.setItem('shelley_enterprise_key', key);
                      localStorage.setItem('shelley_enterprise_key_working', 'true');
                      toast({
                        title: "reCAPTCHA Enterprise Key Validated",
                        description: "Your Enterprise site key has been validated and saved.",
                        duration: 3000,
                      });
                    }).catch((error: any) => {
                      console.error("reCAPTCHA Enterprise execution failed:", error);
                      setEnterpriseKeyStatus('invalid');
                      localStorage.setItem('shelley_enterprise_key_working', 'false');
                      toast({
                        variant: "destructive",
                        title: "Invalid reCAPTCHA Enterprise Key",
                        description: "The Enterprise site key could not be validated. Please check it and try again.",
                        duration: 5000,
                      });
                    });
                  } else {
                    // Handle older versions of reCAPTCHA Enterprise that don't return a Promise
                    console.log("reCAPTCHA Enterprise does not return a Promise, considering valid");
                    setEnterpriseKeyStatus('valid');
                    localStorage.setItem('shelley_enterprise_key', key);
                    localStorage.setItem('shelley_enterprise_key_working', 'true');
                    toast({
                      title: "reCAPTCHA Enterprise Key Saved",
                      description: "Your Enterprise site key has been saved. Validation was skipped due to API limitations.",
                      duration: 3000,
                    });
                  }
                } catch (error) {
                  console.error("reCAPTCHA Enterprise execute failed:", error);
                  setEnterpriseKeyStatus('invalid');
                  localStorage.setItem('shelley_enterprise_key_working', 'false');
                  toast({
                    variant: "destructive",
                    title: "Invalid reCAPTCHA Enterprise Key",
                    description: "The Enterprise site key could not be validated. Please check it and try again.",
                    duration: 5000,
                  });
                } finally {
                  // Clean up
                  const scriptElement = document.getElementById(scriptId);
                  if (scriptElement) {
                    document.body.removeChild(scriptElement);
                  }
                }
              });
            } catch (error) {
              console.error("reCAPTCHA Enterprise ready failed:", error);
              setEnterpriseKeyStatus('invalid');
              localStorage.setItem('shelley_enterprise_key_working', 'false');
              toast({
                variant: "destructive",
                title: "Invalid reCAPTCHA Enterprise Key",
                description: "Could not initialize reCAPTCHA Enterprise with the provided key.",
                duration: 5000,
              });
              
              // Clean up
              const scriptElement = document.getElementById(scriptId);
              if (scriptElement) {
                document.body.removeChild(scriptElement);
              }
            }
          } else {
            setEnterpriseKeyStatus('invalid');
            localStorage.setItem('shelley_enterprise_key_working', 'false');
            toast({
              variant: "destructive",
              title: "Invalid reCAPTCHA Enterprise Setup",
              description: "The reCAPTCHA Enterprise object could not be found. Please check your key.",
              duration: 5000,
            });
            
            // Clean up
            const scriptElement = document.getElementById(scriptId);
            if (scriptElement) {
              document.body.removeChild(scriptElement);
            }
          }
        } catch (error) {
          console.error("reCAPTCHA Enterprise key validation failed:", error);
          setEnterpriseKeyStatus('invalid');
          localStorage.setItem('shelley_enterprise_key_working', 'false');
          toast({
            variant: "destructive",
            title: "reCAPTCHA Enterprise Validation Failed",
            description: "An error occurred while validating your Enterprise site key.",
            duration: 5000,
          });
          
          // Clean up
          const scriptElement = document.getElementById(scriptId);
          if (scriptElement) {
            document.body.removeChild(scriptElement);
          }
        }
      };
      
      script.onerror = () => {
        clearTimeout(timeoutId);
        setValidationTimeouts(prev => {
          const updated = {...prev};
          delete updated['enterprise'];
          return updated;
        });
        
        console.error("Failed to load reCAPTCHA Enterprise script");
        setEnterpriseKeyStatus('invalid');
        localStorage.setItem('shelley_enterprise_key_working', 'false');
        
        toast({
          variant: "destructive",
          title: "reCAPTCHA Enterprise Script Failed",
          description: "Could not load the reCAPTCHA Enterprise script. Please try again later.",
          duration: 5000,
        });
        
        // Clean up
        const scriptElement = document.getElementById(scriptId);
        if (scriptElement) {
          document.body.removeChild(scriptElement);
        }
      };
      
      // Add the script to the page
      document.body.appendChild(script);
    }
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
  
  const updateEnterpriseKey = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.value;
    setLocalEnterpriseKey(key);
    
    if (key && key.length > 10) { // Simple validation to ensure it looks like a key
      validateRecaptchaKey(key, true);
    } else {
      setEnterpriseKeyStatus('idle');
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
      
      {isEnterpriseMode && (
        <div className="mt-2">
          <div className="relative">
            <Input
              type="text"
              placeholder="Enter reCAPTCHA Enterprise site key"
              value={localEnterpriseKey}
              onChange={updateEnterpriseKey}
              className="text-xs pr-8"
            />
            {enterpriseKeyStatus === 'validating' && (
              <div className="absolute right-2 top-2">
                <div className="h-4 w-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
              </div>
            )}
            {enterpriseKeyStatus === 'valid' && (
              <CheckCircle className="absolute right-2 top-2 h-4 w-4 text-green-500" />
            )}
            {enterpriseKeyStatus === 'invalid' && (
              <XCircle className="absolute right-2 top-2 h-4 w-4 text-red-500" />
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1 flex items-center">
            Enter your reCAPTCHA Enterprise site key
            {enterpriseKeyStatus === 'valid' && <span className="ml-1 text-green-500">(Key validated)</span>}
            {enterpriseKeyStatus === 'invalid' && <span className="ml-1 text-red-500">(Invalid key)</span>}
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
