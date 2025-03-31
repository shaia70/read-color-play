
import React, { useState, useEffect } from "react";
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
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check if user is authenticated via session storage
    return sessionStorage.getItem('shelley_admin_authenticated') === 'true';
  });
  const [activeTab, setActiveTab] = useState("visitors");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const handleAuthenticate = () => {
    // Store authentication state in session storage
    sessionStorage.setItem('shelley_admin_authenticated', 'true');
    setIsAuthenticated(true);
  };
  
  // If not authenticated, show the auth screen
  if (!isAuthenticated) {
    return <SimpleAuth onAuthenticate={handleAuthenticate} />;
  }
  
  // Mobile view with drawer navigation
  if (isMobile) {
    return (
      <div className="container mx-auto p-4 space-y-6 bg-background min-h-[100vh]">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Button 
            variant="outline" 
            onClick={() => {
              sessionStorage.removeItem('shelley_admin_authenticated');
              setIsAuthenticated(false);
            }}
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
              <span className="text-xs text-muted-foreground ml-2">Select Tab</span>
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant={activeTab === "visitors" ? "default" : "outline"}
                  onClick={() => {
                    setActiveTab("visitors");
                    setIsDrawerOpen(false);
                  }}
                  className="w-full"
                >
                  Visitors
                </Button>
                <Button 
                  variant={activeTab === "interactions" ? "default" : "outline"}
                  onClick={() => {
                    setActiveTab("interactions");
                    setIsDrawerOpen(false);
                  }}
                  className="w-full"
                >
                  Interactions
                </Button>
                <Button 
                  variant={activeTab === "performance" ? "default" : "outline"}
                  onClick={() => {
                    setActiveTab("performance");
                    setIsDrawerOpen(false);
                  }}
                  className="w-full"
                >
                  Performance
                </Button>
                <Button 
                  variant={activeTab === "seo" ? "default" : "outline"}
                  onClick={() => {
                    setActiveTab("seo");
                    setIsDrawerOpen(false);
                  }}
                  className="w-full"
                >
                  SEO
                </Button>
                <Button 
                  variant={activeTab === "settings" ? "default" : "outline"}
                  onClick={() => {
                    setActiveTab("settings");
                    setIsDrawerOpen(false);
                  }}
                  className="w-full col-span-2"
                >
                  Settings
                </Button>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
        
        <div className="space-y-4 bg-background">
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
    <div className="container mx-auto py-6 px-4 md:px-6 space-y-6 bg-background min-h-[100vh]">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Button 
          variant="outline" 
          onClick={() => {
            sessionStorage.removeItem('shelley_admin_authenticated');
            setIsAuthenticated(false);
          }}
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
        <TabsContent value="visitors" className="bg-background">
          <VisitorStats />
        </TabsContent>
        <TabsContent value="interactions" className="bg-background">
          <UserInteractions />
        </TabsContent>
        <TabsContent value="performance" className="bg-background">
          <PagePerformance />
        </TabsContent>
        <TabsContent value="seo" className="bg-background">
          <SeoAnalytics />
        </TabsContent>
        <TabsContent value="settings" className="bg-background">
          <AdminSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Statistics;
