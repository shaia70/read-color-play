
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye, EyeOff } from "lucide-react";

export const PasswordManagement: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
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
      // Get stored password or use default if not set
      const storedPassword = localStorage.getItem('shelley_admin_password') || "ShelleyStats2024";
      
      // Verify current password
      if (currentPassword !== storedPassword) {
        toast.error("Current password is incorrect");
        setIsLoading(false);
        return;
      }
      
      // Validate new password
      if (newPassword.length < 8) {
        toast.error("New password must be at least 8 characters");
        setIsLoading(false);
        return;
      }
      
      // Confirm passwords match
      if (newPassword !== confirmPassword) {
        toast.error("New passwords do not match");
        setIsLoading(false);
        return;
      }
      
      // Save new password
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
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Password Management</CardTitle>
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
              <DialogTitle>Change Admin Password</DialogTitle>
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
                      className="text-right dir-ltr"
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
                      className="text-right dir-ltr"
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
                      className="text-right dir-ltr"
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
  );
};

export default PasswordManagement;
