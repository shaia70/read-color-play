
import React from "react";

interface RecaptchaStatusIndicatorProps {
  hasCustomProductionKey: boolean;
  isUsingTestKey: boolean;
  testKeyDisabled: boolean;
}

export const RecaptchaStatusIndicator: React.FC<RecaptchaStatusIndicatorProps> = ({
  hasCustomProductionKey,
  isUsingTestKey,
  testKeyDisabled
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-medium text-left">Current reCAPTCHA Status</h3>
        <p className="text-sm text-muted-foreground text-left">
          {testKeyDisabled 
            ? "Test key is permanently disabled" 
            : isUsingTestKey 
              ? "Using test key (always passes verification)" 
              : "Using production key"
          }
        </p>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className={`h-3 w-3 rounded-full ${hasCustomProductionKey ? "bg-green-500" : "bg-yellow-500"}`}></div>
        <span className="text-sm">{hasCustomProductionKey ? "Production key set" : "No production key"}</span>
      </div>
    </div>
  );
};

export default RecaptchaStatusIndicator;
