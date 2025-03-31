
import React, { useState } from "react";
import { AuthCard } from "./auth/AuthCard";
import { AuthForm } from "./auth/AuthForm";
import { useIsMobile } from "@/hooks/use-mobile";

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
  
  const isMobile = useIsMobile();
  
  // Test key 
  const testSiteKey = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";
  // Production key (fallback to enterprise key if not set)
  const productionSiteKey = localStorage.getItem('shelley_recaptcha_key') || "6LeSSwUrAAAAAGyKh0S3aX4UWJljoUPMBlSi4I62";
  
  // Check if test key is permanently disabled
  const testKeyDisabled = localStorage.getItem('shelley_disable_test_recaptcha') === 'true';
  
  // The active site key based on the toggle and disabled state
  const activeSiteKey = (!testKeyDisabled && useTestKey) ? testSiteKey : productionSiteKey;
  
  return (
    <div className={`flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 ${isMobile ? 'p-4' : 'p-6'}`}>
      <AuthCard className={isMobile ? "w-full max-w-full" : ""}>
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

// Add a default export that points to the same component
export default SimpleAuth;
