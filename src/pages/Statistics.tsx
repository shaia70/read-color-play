
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VisitorStats } from "@/components/statistics/VisitorStats";
import { PagePerformance } from "@/components/statistics/PagePerformance";
import { UserInteractions } from "@/components/statistics/UserInteractions";
import { SeoAnalytics } from "@/components/statistics/SeoAnalytics";
import { SimpleAuth } from "@/components/statistics/SimpleAuth";

const Statistics = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
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
        <h1 className="text-3xl font-bold">Shelley Books - Admin Statistics</h1>
        <p className="text-muted-foreground">
          This page provides analytics and statistics about website performance, visitor behavior, and SEO metrics.
        </p>
        
        <Tabs defaultValue="visitors" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="visitors">Visitors</TabsTrigger>
            <TabsTrigger value="pages">Page Performance</TabsTrigger>
            <TabsTrigger value="interactions">User Interactions</TabsTrigger>
            <TabsTrigger value="seo">SEO Analytics</TabsTrigger>
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
        </Tabs>
      </div>
    </div>
  );
};

export default Statistics;
