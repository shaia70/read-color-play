
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import PasswordManagement from "./PasswordManagement";
import PixelManagement from "./PixelManagement";
import { Settings } from "lucide-react";

export const AdminSettings: React.FC = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = React.useState("password");
  
  // If on mobile, use simplified version without nested tabs
  if (isMobile) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Settings</h2>
          <Settings className="h-5 w-5 text-muted-foreground" />
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant={activeTab === "password" ? "default" : "outline"}
            onClick={() => setActiveTab("password")}
            className="flex-1"
          >
            Password
          </Button>
          <Button
            variant={activeTab === "pixels" ? "default" : "outline"}
            onClick={() => setActiveTab("pixels")}
            className="flex-1"
          >
            Analytics
          </Button>
        </div>
        
        <div className="mt-4">
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
