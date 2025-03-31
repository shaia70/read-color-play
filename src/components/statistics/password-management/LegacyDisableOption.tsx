
import React from "react";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";

interface LegacyDisableOptionProps {
  testKeyDisabled: boolean;
  productionKeyWorking: boolean;
  hasCustomProductionKey: boolean;
}

export const LegacyDisableOption: React.FC<LegacyDisableOptionProps> = ({
  testKeyDisabled,
  productionKeyWorking,
  hasCustomProductionKey
}) => {
  if (testKeyDisabled || !productionKeyWorking || !hasCustomProductionKey) {
    return null;
  }
  
  return (
    <div className="space-y-2">
      <h3 className="font-medium text-left text-amber-600">Legacy Option: Disable Test Key Permanently</h3>
      <p className="text-sm text-muted-foreground text-left">
        The toggle above is the recommended way to manage test key availability.
        This legacy option is kept for backward compatibility.
      </p>
      
      <div className="pt-2">
        <DialogTrigger asChild>
          <Button variant="outline" className="mt-2">
            <ShieldAlert className="mr-2 h-4 w-4" />
            Legacy: Disable Test Key
          </Button>
        </DialogTrigger>
      </div>
    </div>
  );
};

export default LegacyDisableOption;
