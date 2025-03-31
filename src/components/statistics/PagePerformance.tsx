
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, LineChart, Line } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { 
  getPageViewsData, 
  getTimeSpentData, 
  getBounceRateData,
  PageViewData,
  TimeSpentData,
  BounceRateData
} from "@/services/analyticsService";

const chartConfig = {
  views: { label: 'Page Views', theme: { light: '#0ea5e9', dark: '#0ea5e9' } },
  time: { label: 'Time Spent (seconds)', theme: { light: '#10b981', dark: '#10b981' } },
  rate: { label: 'Bounce Rate (%)', theme: { light: '#f43f5e', dark: '#f43f5e' } }
};

export const PagePerformance: React.FC = () => {
  const [pageViewsData, setPageViewsData] = useState<PageViewData[]>([]);
  const [timeSpentData, setTimeSpentData] = useState<TimeSpentData[]>([]);
  const [bounceRateData, setBounceRateData] = useState<BounceRateData[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  useEffect(() => {
    // Load real analytics data
    const loadData = () => {
      const pageViews = getPageViewsData();
      const timeSpent = getTimeSpentData();
      const bounceRate = getBounceRateData();
      
      setPageViewsData(pageViews);
      setTimeSpentData(timeSpent);
      setBounceRateData(bounceRate);
      setLastUpdated(new Date());
    };
    
    // Load data immediately
    loadData();
    
    // Then refresh data every 60 seconds
    const intervalId = setInterval(loadData, 60000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  const formatDateTime = (date: Date) => {
    return format(date, 'dd/MM/yyyy HH:mm');
  };
  
  // If no data is available yet, show sample data message
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
          {noDataAvailable ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No analytics data available yet. Start browsing the site to generate data.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Page</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Avg. Time Spent</TableHead>
                  <TableHead>Bounce Rate</TableHead>
                  <TableHead>Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageViewsData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.page}</TableCell>
                    <TableCell>{item.views}</TableCell>
                    <TableCell>{item.avgTime}</TableCell>
                    <TableCell>{item.bounceRate}</TableCell>
                    <TableCell>{formatDateTime(item.lastUpdated)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
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
            {noDataAvailable ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No time spent data available yet.</p>
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="aspect-[4/3]">
                <BarChart data={timeSpentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="page" />
                  <YAxis />
                  <Tooltip content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="font-medium">{data.page}</div>
                            <div className="font-medium text-right">{data.time}s</div>
                            <div className="text-xs text-muted-foreground">Updated</div>
                            <div className="text-xs text-right text-muted-foreground">
                              {formatDateTime(data.timestamp)}
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }} />
                  <Bar dataKey="time" name="time" fill="var(--color-time)" />
                </BarChart>
              </ChartContainer>
            )}
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
            {noDataAvailable ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No bounce rate data available yet.</p>
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="aspect-[4/3]">
                <LineChart data={bounceRateData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="page" />
                  <YAxis />
                  <Tooltip content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="font-medium">{data.page}</div>
                            <div className="font-medium text-right">{data.rate}%</div>
                            <div className="text-xs text-muted-foreground">Updated</div>
                            <div className="text-xs text-right text-muted-foreground">
                              {formatDateTime(data.timestamp)}
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }} />
                  <Line 
                    type="monotone" 
                    dataKey="rate" 
                    name="rate" 
                    stroke="var(--color-rate)" 
                    strokeWidth={2} 
                  />
                </LineChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
