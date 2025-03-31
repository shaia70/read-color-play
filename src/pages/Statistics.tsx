
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
import { format } from "date-fns";

const Statistics = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  
  useEffect(() => {
    // Update the last refreshed time when the component mounts
    setLastRefreshed(new Date());
  }, []);
  
  if (!isAuthenticated) {
    return <SimpleAuth onAuthenticate={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <Helmet>
        <title>Admin Statistics - Shelley Books</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
          <h1 className="text-3xl font-bold">Shelley Books - Admin Statistics</h1>
          <div className="text-sm text-muted-foreground">
            Last refreshed: {format(lastRefreshed, 'dd/MM/yyyy HH:mm:ss')}
          </div>
        </div>
        
        <p className="text-muted-foreground">
          This page provides analytics and statistics about website performance, visitor behavior, and SEO metrics.
        </p>
        
        <Tabs defaultValue="visitors" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="visitors">Visitors</TabsTrigger>
            <TabsTrigger value="pages">Page Performance</TabsTrigger>
            <TabsTrigger value="interactions">User Interactions</TabsTrigger>
            <TabsTrigger value="seo">SEO Analytics</TabsTrigger>
            <TabsTrigger value="pixels">Pixels Config</TabsTrigger>
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
                  <CardTitle>Pixel Usage Guide</CardTitle>
                  <CardDescription>How analytics pixels are used on your site</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-1">Page View Tracking</h3>
                      <p className="text-sm text-muted-foreground">
                        Both Google Analytics and Facebook Pixel track page views automatically on all site pages.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-1">Download Tracking</h3>
                      <p className="text-sm text-muted-foreground">
                        The Download page uses both pixels to track when users click on app store or Google Play links.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-1">Custom Events</h3>
                      <p className="text-sm text-muted-foreground">
                        Various user interactions are tracked as custom events across both analytics platforms.
                      </p>
                    </div>
                    
                    <div className="pt-2 border-t">
                      <p className="text-sm text-muted-foreground">
                        Note: Analytics tracking is only active in production mode and when valid tracking IDs are provided.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Statistics;
