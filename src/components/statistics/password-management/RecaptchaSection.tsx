
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Dialog } from "@/components/ui/dialog";
import RecaptchaStatusIndicator from "./RecaptchaStatusIndicator";
import TestKeyToggle from "./TestKeyToggle";
import LegacyDisableOption from "./LegacyDisableOption";
import TestKeyDisableDialog from "./TestKeyDisableDialog";
import DisabledTestKeyInfo from "./DisabledTestKeyInfo";

export const RecaptchaSection: React.FC = () => {
  const [isDisableTestKeyDialogOpen, setIsDisableTestKeyDialogOpen] = useState(false);
  
  const [productionKeyWorking, setProductionKeyWorking] = useState(() => {
    return localStorage.getItem('shelley_production_key_working') === 'true';
  });
  
  const [testKeyDisabled, setTestKeyDisabled] = useState(() => {
    return localStorage.getItem('shelley_disable_test_recaptcha') === 'true';
  });
  
  const productionKey = localStorage.getItem('shelley_recaptcha_key') || "";
  const isUsingTestKey = localStorage.getItem('shelley_use_test_recaptcha') === 'true';
  const testKey = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";
  const hasCustomProductionKey = productionKey && productionKey !== testKey;
  
  useEffect(() => {
    const workingKey = localStorage.getItem('shelley_production_key_working') === 'true';
    setProductionKeyWorking(workingKey);
    
    const disabled = localStorage.getItem('shelley_disable_test_recaptcha') === 'true';
    setTestKeyDisabled(disabled);
  }, []);
  
  const handleDisableTestKey = () => {
    localStorage.setItem('shelley_disable_test_recaptcha', 'true');
    localStorage.setItem('shelley_use_test_recaptcha', 'false');
    setTestKeyDisabled(true);
  };
  
  const toggleTestKeyAvailability = () => {
    try {
      if (testKeyDisabled) {
        localStorage.setItem('shelley_disable_test_recaptcha', 'false');
        setTestKeyDisabled(false);
      } else {
        localStorage.setItem('shelley_disable_test_recaptcha', 'true');
        localStorage.setItem('shelley_use_test_recaptcha', 'false');
        setTestKeyDisabled(true);
      }
    } catch (error) {
      console.error("Error toggling test key availability:", error);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-left">reCAPTCHA Settings</CardTitle>
        <CardDescription className="text-left">
          Manage reCAPTCHA security settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <RecaptchaStatusIndicator 
            hasCustomProductionKey={hasCustomProductionKey}
            isUsingTestKey={isUsingTestKey}
            testKeyDisabled={testKeyDisabled}
          />
          
          {productionKeyWorking && hasCustomProductionKey && (
            <>
              <Separator />
              
              <TestKeyToggle 
                testKeyDisabled={testKeyDisabled}
                onToggle={toggleTestKeyAvailability}
              />
            </>
          )}
          
          {!testKeyDisabled && productionKeyWorking && hasCustomProductionKey && (
            <>
              <Separator className="my-4" />
              
              <Dialog open={isDisableTestKeyDialogOpen} onOpenChange={setIsDisableTestKeyDialogOpen}>
                <LegacyDisableOption 
                  testKeyDisabled={testKeyDisabled}
                  productionKeyWorking={productionKeyWorking}
                  hasCustomProductionKey={hasCustomProductionKey}
                />
                
                <TestKeyDisableDialog 
                  isOpen={isDisableTestKeyDialogOpen}
                  onOpenChange={setIsDisableTestKeyDialogOpen}
                  onDisable={handleDisableTestKey}
                />
              </Dialog>
            </>
          )}
          
          {testKeyDisabled && (
            <DisabledTestKeyInfo productionKeyWorking={productionKeyWorking} />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecaptchaSection;
