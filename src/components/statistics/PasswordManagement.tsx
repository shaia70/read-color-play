import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye, EyeOff, KeyRound, ShieldAlert, CheckCircle2, AlertTriangle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const PasswordManagement: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
  
  const resetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };
  
  const handleChangePassword = () => {
    setIsLoading(true);
    
    try {
      const storedPassword = localStorage.getItem('shelley_admin_password') || "ShelleyStats2024";
      
      if (currentPassword !== storedPassword) {
        toast.error("Current password is incorrect");
        setIsLoading(false);
        return;
      }
      
      if (newPassword.length < 8) {
        toast.error("New password must be at least 8 characters");
        setIsLoading(false);
        return;
      }
      
      if (newPassword !== confirmPassword) {
        toast.error("New passwords do not match");
        setIsLoading(false);
        return;
      }
      
      localStorage.setItem('shelley_admin_password', newPassword);
      
      toast.success("Password changed successfully");
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDisableTestKey = () => {
    try {
      localStorage.setItem('shelley_disable_test_recaptcha', 'true');
      localStorage.setItem('shelley_use_test_recaptcha', 'false');
      
      setTestKeyDisabled(true);
      toast.success("Test reCAPTCHA key has been permanently disabled");
      setIsDisableTestKeyDialogOpen(false);
    } catch (error) {
      console.error("Error disabling test key:", error);
      toast.error("Failed to disable test key");
    }
  };
  
  const toggleTestKeyAvailability = () => {
    try {
      if (testKeyDisabled) {
        localStorage.setItem('shelley_disable_test_recaptcha', 'false');
        setTestKeyDisabled(false);
        toast.success("Test key re-enabled");
      } else {
        localStorage.setItem('shelley_disable_test_recaptcha', 'true');
        localStorage.setItem('shelley_use_test_recaptcha', 'false');
        setTestKeyDisabled(true);
        toast.success("Test key permanently disabled");
      }
    } catch (error) {
      console.error("Error toggling test key availability:", error);
      toast.error("Failed to update test key settings");
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-left">Admin Password Management</CardTitle>
          <CardDescription className="text-left">
            Change your admin password for accessing statistics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground text-left">
              Your admin password is used to access the statistics dashboard. 
              It is stored securely in your browser and not shared with any third parties.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">Change Password</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-left">Change Admin Password</DialogTitle>
                <DialogDescription className="text-left">
                  Update your password for accessing the statistics dashboard.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="current-password" className="text-left">Current Password</Label>
                  <div className="flex items-center">
                    <div className="flex-1">
                      <Input
                        id="current-password"
                        type={showCurrentPassword ? "text" : "password"}
                        autoComplete="current-password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="text-left dir-ltr"
                      />
                    </div>
                    <button 
                      type="button"
                      className="ml-2 p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      tabIndex={-1}
                      aria-label={showCurrentPassword ? "Hide current password" : "Show current password"}
                    >
                      {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="new-password" className="text-left">New Password</Label>
                  <div className="flex items-center">
                    <div className="flex-1">
                      <Input
                        id="new-password"
                        type={showNewPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="text-left dir-ltr"
                      />
                    </div>
                    <button 
                      type="button"
                      className="ml-2 p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      tabIndex={-1}
                      aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                    >
                      {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirm-password" className="text-left">Confirm New Password</Label>
                  <div className="flex items-center">
                    <div className="flex-1">
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="text-left dir-ltr"
                      />
                    </div>
                    <button 
                      type="button"
                      className="ml-2 p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      tabIndex={-1}
                      aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  onClick={handleChangePassword}
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Password"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-left">reCAPTCHA Settings</CardTitle>
          <CardDescription className="text-left">
            Manage reCAPTCHA security settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
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
            
            {productionKeyWorking && hasCustomProductionKey && (
              <>
                <Separator />
                
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
                      onCheckedChange={() => toggleTestKeyAvailability()} 
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
              </>
            )}
            
            {!testKeyDisabled && productionKeyWorking && hasCustomProductionKey && (
              <>
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <h3 className="font-medium text-left text-amber-600">Legacy Option: Disable Test Key Permanently</h3>
                  <p className="text-sm text-muted-foreground text-left">
                    The toggle above is the recommended way to manage test key availability.
                    This legacy option is kept for backward compatibility.
                  </p>
                  
                  <div className="pt-2">
                    <Dialog open={isDisableTestKeyDialogOpen} onOpenChange={setIsDisableTestKeyDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="mt-2">
                          <ShieldAlert className="mr-2 h-4 w-4" />
                          Legacy: Disable Test Key
                        </Button>
                      </DialogTrigger>
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
                            onClick={() => setIsDisableTestKeyDialogOpen(false)}
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
                    </Dialog>
                  </div>
                </div>
              </>
            )}
            
            {testKeyDisabled && !productionKeyWorking && (
              <Alert className="mt-4">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>Test Key Disabled</AlertTitle>
                <AlertDescription>
                  The test reCAPTCHA key has been permanently disabled. You can only use your production key to access the admin area.
                  To reset this setting, you will need to clear site data in your browser settings.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PasswordManagement;
