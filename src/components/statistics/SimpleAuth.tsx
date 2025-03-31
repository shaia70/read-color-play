
import React, { useState } from "react";
import { AuthCard } from "./auth/AuthCard";
import { AuthForm } from "./auth/AuthForm";

interface SimpleAuthProps {
  onAuthenticate: () => void;
}

export const SimpleAuth: React.FC<SimpleAuthProps> = ({ onAuthenticate }) => {
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
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      <AuthCard>
        <AuthForm 
          onAuthenticate={onAuthenticate}
          activeSiteKey={activeSiteKey}
          testKeyDisabled={testKeyDisabled}
          useTestKey={useTestKey}
          setUseTestKey={setUseTestKey}
          productionSiteKey={productionSiteKey}
          testSiteKey={testSiteKey}
        />
      </AuthCard>
    </div>
  );
};

export default SimpleAuth;
