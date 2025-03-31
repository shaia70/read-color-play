
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VisitorStats } from "@/components/statistics/VisitorStats";
import { PagePerformance } from "@/components/statistics/PagePerformance";
import { UserInteractions } from "@/components/statistics/UserInteractions";
import { SeoAnalytics } from "@/components/statistics/SeoAnalytics";
import { SimpleAuth } from "@/components/statistics/SimpleAuth";
import { PixelManagement } from "@/components/statistics/PixelManagement";
import { PasswordManagement } from "@/components/statistics/PasswordManagement";
import { format } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";

const Statistics = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Update the last refreshed time when the component mounts
    setLastRefreshed(new Date());
  }, []);
  
  if (!isAuthenticated) {
    return <SimpleAuth onAuthenticate={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="container px-4 py-4 md:py-8 mx-auto">
      <Helmet>
        <title>Admin Statistics - Shelley Books</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
          <h1 className="text-2xl md:text-3xl font-bold text-left">Shelley Books - Admin Statistics</h1>
          <div className="text-sm text-muted-foreground text-left">
            Last refreshed: {format(lastRefreshed, 'dd/MM/yyyy HH:mm:ss')}
          </div>
        </div>
        
        <p className="text-muted-foreground text-left text-sm md:text-base">
          This page provides analytics and statistics about website performance, visitor behavior, and SEO metrics.
        </p>
        
        <Tabs defaultValue="visitors" className="w-full">
          <TabsList className={`grid w-full ${isMobile ? 'grid-cols-3 mb-2' : 'grid-cols-6'}`}>
            <TabsTrigger value="visitors">Visitors</TabsTrigger>
            <TabsTrigger value="pages">Pages</TabsTrigger>
            <TabsTrigger value="interactions">Users</TabsTrigger>
            {isMobile ? (
              <>
                <TabsTrigger value="seo">SEO</TabsTrigger>
                <TabsTrigger value="pixels">Pixels</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </>
            ) : (
              <>
                <TabsTrigger value="seo">SEO Analytics</TabsTrigger>
                <TabsTrigger value="pixels">Pixels Config</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </>
            )}
          </TabsList>
          
          <TabsContent value="visitors" className="mt-4">
            <VisitorStats />
          </TabsContent>
          
          <TabsContent value="pages" className="mt-4">
            <PagePerformance />
          </TabsContent>
          
          <TabsContent value="interactions" className="mt-4">
            <UserInteractions />
          </TabsContent>
          
          <TabsContent value="seo" className="mt-4">
            <SeoAnalytics />
          </TabsContent>
          
          <TabsContent value="pixels" className="mt-4">
            <div className="grid grid-cols-1 gap-6">
              <PixelManagement />
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-left">Pixel Usage Guide</CardTitle>
                  <CardDescription className="text-left">How analytics pixels are used on your site</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-1 text-left">Page View Tracking</h3>
                      <p className="text-sm text-muted-foreground text-left">
                        Both Google Analytics and Facebook Pixel track page views automatically on all site pages.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-1 text-left">Download Tracking</h3>
                      <p className="text-sm text-muted-foreground text-left">
                        The Download page uses both pixels to track when users click on app store or Google Play links.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-1 text-left">Custom Events</h3>
                      <p className="text-sm text-muted-foreground text-left">
                        Various user interactions are tracked as custom events across both analytics platforms.
                      </p>
                    </div>
                    
                    <div className="pt-2 border-t">
                      <p className="text-sm text-muted-foreground text-left">
                        Note: Analytics tracking is only active in production mode and when valid tracking IDs are provided.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="mt-4">
            <div className="grid grid-cols-1 gap-6">
              <PasswordManagement />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Statistics;
