
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  getPageViewsData, 
  getTimeSpentData, 
  getBounceRateData,
  PageViewData,
  TimeSpentData,
  BounceRateData
} from "@/services/analyticsService";
import { PerformanceTable } from "./page-performance/PerformanceTable";
import { TimeSpentChart } from "./page-performance/TimeSpentChart";
import { BounceRateChart } from "./page-performance/BounceRateChart";

const chartConfig = {
  views: { label: 'Page Views', theme: { light: '#0ea5e9', dark: '#0ea5e9' } },
  time: { label: 'Time Spent (seconds)', theme: { light: '#10b981', dark: '#10b981' } },
  rate: { label: 'Bounce Rate (%)', theme: { light: '#f43f5e', dark: '#f43f5e' } }
};

// Using named export to match the import in Statistics.tsx
export const PagePerformance: React.FC = () => {
  const [pageViewsData, setPageViewsData] = useState<PageViewData[]>([]);
  const [timeSpentData, setTimeSpentData] = useState<TimeSpentData[]>([]);
  const [bounceRateData, setBounceRateData] = useState<BounceRateData[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  useEffect(() => {
    const loadData = () => {
      const pageViews = getPageViewsData();
      const timeSpent = getTimeSpentData();
      const bounceRate = getBounceRateData();
      
      setPageViewsData(pageViews);
      setTimeSpentData(timeSpent);
      setBounceRateData(bounceRate);
      setLastUpdated(new Date());
    };
    
    loadData();
    
    const intervalId = setInterval(loadData, 60000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  const formatDateTime = (date: Date) => {
    return format(date, 'dd/MM/yyyy HH:mm');
  };
  
  const noDataAvailable = pageViewsData.length === 0;
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Page Performance Overview</CardTitle>
          <CardDescription>
            Detailed metrics for each page
            <div className="text-xs mt-1 text-muted-foreground">
              Data current as of: {formatDateTime(lastUpdated)}
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PerformanceTable 
            pageViewsData={pageViewsData}
            formatDateTime={formatDateTime}
            noDataAvailable={noDataAvailable}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Time Spent per Page</CardTitle>
            <CardDescription>
              Average time in seconds
              <div className="text-xs mt-1 text-muted-foreground">
                Last updated: {formatDateTime(lastUpdated)}
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TimeSpentChart 
              timeSpentData={timeSpentData}
              chartConfig={chartConfig}
              formatDateTime={formatDateTime}
              noDataAvailable={noDataAvailable}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bounce Rate by Page</CardTitle>
            <CardDescription>
              Percentage of visitors who navigate away
              <div className="text-xs mt-1 text-muted-foreground">
                Last updated: {formatDateTime(lastUpdated)}
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BounceRateChart 
              bounceRateData={bounceRateData}
              chartConfig={chartConfig}
              formatDateTime={formatDateTime}
              noDataAvailable={noDataAvailable}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Explicitly add the default export
export default PagePerformance;
