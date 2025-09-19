
import * as React from "react";
import { toast } from "sonner";
import { ShieldAlert } from "lucide-react";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface TestKeyDisableDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDisable: () => void;
}

export const TestKeyDisableDialog: React.FC<TestKeyDisableDialogProps> = ({
  isOpen,
  onOpenChange,
  onDisable
}) => {
  const handleDisableTestKey = () => {
    try {
      onDisable();
      toast.success("Test reCAPTCHA key has been permanently disabled");
      onOpenChange(false);
    } catch (error) {
      console.error("Error disabling test key:", error);
      toast.error("Failed to disable test key");
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="text-left">Permanently Disable Test Key</DialogTitle>
        <DialogDescription className="text-left">
          This action cannot be undone. Are you sure you want to continue?
        </DialogDescription>
      </DialogHeader>
      
      <Alert variant="destructive" className="mt-4">
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>
          After disabling the test key, you will only be able to access the admin area with your production reCAPTCHA key.
          If your production key stops working, you will need to clear site data in your browser to reset this setting.
        </AlertDescription>
      </Alert>
      
      <DialogFooter className="mt-4">
        <Button 
          variant="outline" 
          onClick={() => onOpenChange(false)}
        >
          Cancel
        </Button>
        <Button 
          variant="destructive" 
          onClick={handleDisableTestKey}
        >
          Disable Test Key
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default TestKeyDisableDialog;
