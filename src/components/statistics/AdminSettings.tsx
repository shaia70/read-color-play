
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import PasswordManagement from "./PasswordManagement";
import PixelManagement from "./PixelManagement";

export const AdminSettings: React.FC = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = React.useState("password");
  const [open, setOpen] = React.useState(false);
  
  // If on mobile, use drawer component
  if (isMobile) {
    return (
      <div className="container mx-auto py-4 px-4">
        <h1 className="text-2xl font-bold mb-4 text-left">Admin Settings</h1>
        <div className="space-y-4">
          <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                {activeTab === "password" && "Password Management"}
                {activeTab === "pixels" && "Analytics Pixels"}
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="p-4">
                <TabsList className="w-full mb-4">
                  <TabsTrigger
                    className="flex-1"
                    value="password"
                    onClick={() => {
                      setActiveTab("password");
                      setOpen(false);
                    }}
                  >
                    Password
                  </TabsTrigger>
                  <TabsTrigger
                    className="flex-1"
                    value="pixels"
                    onClick={() => {
                      setActiveTab("pixels");
                      setOpen(false);
                    }}
                  >
                    Analytics
                  </TabsTrigger>
                </TabsList>
              </div>
            </DrawerContent>
          </Drawer>
          
          {activeTab === "password" && <PasswordManagement />}
          {activeTab === "pixels" && <PixelManagement />}
        </div>
      </div>
    );
  }
  
  // Desktop view with tabs
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <h1 className="text-2xl font-bold mb-6 text-left">Admin Settings</h1>
      <Tabs defaultValue="password" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="password">Password Management</TabsTrigger>
          <TabsTrigger value="pixels">Analytics Pixels</TabsTrigger>
        </TabsList>
        <TabsContent value="password">
          <PasswordManagement />
        </TabsContent>
        <TabsContent value="pixels">
          <PixelManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
