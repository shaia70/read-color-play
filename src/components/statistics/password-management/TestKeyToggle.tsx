
import * as React from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface TestKeyToggleProps {
  testKeyDisabled: boolean;
  onToggle: () => void;
}

export const TestKeyToggle: React.FC<TestKeyToggleProps> = ({
  testKeyDisabled,
  onToggle
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-left">Test Key Availability</h3>
          <p className="text-sm text-muted-foreground text-left">
            {testKeyDisabled 
              ? "Test key is permanently disabled. Toggle to re-enable it." 
              : "Permanently disable the test key for enhanced security."}
          </p>
        </div>
        <Switch 
          checked={!testKeyDisabled} 
          onCheckedChange={onToggle} 
          aria-label="Toggle test key availability"
        />
      </div>
      
      <Alert variant={testKeyDisabled ? "default" : "warning"} className="mt-2">
        {testKeyDisabled ? (
          <>
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Enhanced Security</AlertTitle>
            <AlertDescription>
              Test reCAPTCHA key is disabled. Only your production key will be used for verification.
            </AlertDescription>
          </>
        ) : (
          <>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Security Notice</AlertTitle>
            <AlertDescription>
              The test reCAPTCHA key is currently enabled. For production environments, 
              we recommend disabling it to enforce proper verification.
            </AlertDescription>
          </>
        )}
      </Alert>
    </div>
  );
};

export default TestKeyToggle;
