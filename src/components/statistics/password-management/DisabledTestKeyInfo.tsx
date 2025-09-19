
import * as React from "react";
import { ShieldAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DisabledTestKeyInfoProps {
  productionKeyWorking: boolean;
}

export const DisabledTestKeyInfo: React.FC<DisabledTestKeyInfoProps> = ({
  productionKeyWorking
}) => {
  if (productionKeyWorking) return null;
  
  return (
    <Alert className="mt-4">
      <ShieldAlert className="h-4 w-4" />
      <AlertTitle>Test Key Disabled</AlertTitle>
      <AlertDescription>
        The test reCAPTCHA key has been permanently disabled. You can only use your production key to access the admin area.
        To reset this setting, you will need to clear site data in your browser settings.
      </AlertDescription>
    </Alert>
  );
};

export default DisabledTestKeyInfo;
