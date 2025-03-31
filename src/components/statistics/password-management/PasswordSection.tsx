
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import PasswordChangeDialog from "./PasswordChangeDialog";

export const PasswordSection: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  return (
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
        <PasswordChangeDialog 
          isOpen={isDialogOpen} 
          onOpenChange={setIsDialogOpen} 
        />
        <DialogTrigger asChild onClick={() => setIsDialogOpen(true)}>
          <Button className="w-full">Change Password</Button>
        </DialogTrigger>
      </CardFooter>
    </Card>
  );
};

export default PasswordSection;
