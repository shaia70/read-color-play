
import React, { useState } from "react";
import SimpleAuth from "@/components/statistics/SimpleAuth";
import AdminSettings from "@/components/statistics/AdminSettings";
import { VisitorStats } from "@/components/statistics/VisitorStats";
import { UserInteractions } from "@/components/statistics/UserInteractions";
import { PagePerformance } from "@/components/statistics/PagePerformance";
import { SeoAnalytics } from "@/components/statistics/SeoAnalytics";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

const Statistics: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("visitors");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const handleAuthenticate = () => {
    setIsAuthenticated(true);
  };
  
  // If not authenticated, show the auth screen
  if (!isAuthenticated) {
    return <SimpleAuth onAuthenticate={handleAuthenticate} />;
  }
  
  // Mobile view with drawer navigation
  if (isMobile) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Button 
            variant="outline" 
            onClick={() => setIsAuthenticated(false)}
            size="sm"
          >
            Logout
          </Button>
        </div>
        
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              {activeTab === "visitors" && "Visitor Statistics"}
              {activeTab === "interactions" && "User Interactions"}
              {activeTab === "performance" && "Page Performance"}
              {activeTab === "seo" && "SEO Analytics"}
              {activeTab === "settings" && "Settings"}
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="p-4">
              <TabsList className="grid grid-cols-2 gap-2">
                <TabsTrigger 
                  value="visitors" 
                  onClick={() => {
                    setActiveTab("visitors");
                    setIsDrawerOpen(false);
                  }}
                >
                  Visitors
                </TabsTrigger>
                <TabsTrigger 
                  value="interactions" 
                  onClick={() => {
                    setActiveTab("interactions");
                    setIsDrawerOpen(false);
                  }}
                >
                  Interactions
                </TabsTrigger>
                <TabsTrigger 
                  value="performance" 
                  onClick={() => {
                    setActiveTab("performance");
                    setIsDrawerOpen(false);
                  }}
                >
                  Performance
                </TabsTrigger>
                <TabsTrigger 
                  value="seo" 
                  onClick={() => {
                    setActiveTab("seo");
                    setIsDrawerOpen(false);
                  }}
                >
                  SEO
                </TabsTrigger>
                <TabsTrigger 
                  value="settings" 
                  onClick={() => {
                    setActiveTab("settings");
                    setIsDrawerOpen(false);
                  }}
                  className="col-span-2"
                >
                  Settings
                </TabsTrigger>
              </TabsList>
            </div>
          </DrawerContent>
        </Drawer>
        
        <div className="space-y-4">
          {activeTab === "visitors" && <VisitorStats />}
          {activeTab === "interactions" && <UserInteractions />}
          {activeTab === "performance" && <PagePerformance />}
          {activeTab === "seo" && <SeoAnalytics />}
          {activeTab === "settings" && <AdminSettings />}
        </div>
      </div>
    );
  }
  
  // Desktop view with tabs
  return (
    <div className="container mx-auto py-6 px-4 md:px-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Button 
          variant="outline" 
          onClick={() => setIsAuthenticated(false)}
        >
          Logout
        </Button>
      </div>
      
      <Tabs defaultValue="visitors" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="visitors">Visitor Statistics</TabsTrigger>
          <TabsTrigger value="interactions">User Interactions</TabsTrigger>
          <TabsTrigger value="performance">Page Performance</TabsTrigger>
          <TabsTrigger value="seo">SEO Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="visitors">
          <VisitorStats />
        </TabsContent>
        <TabsContent value="interactions">
          <UserInteractions />
        </TabsContent>
        <TabsContent value="performance">
          <PagePerformance />
        </TabsContent>
        <TabsContent value="seo">
          <SeoAnalytics />
        </TabsContent>
        <TabsContent value="settings">
          <AdminSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Statistics;
