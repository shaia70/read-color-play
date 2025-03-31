
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, LineChart, Line } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

// Sample data for demonstration
const pageViewsData = [
  { page: 'Home', views: 1240, avgTime: '02:15', bounceRate: '32%', lastUpdated: new Date(2025, 2, 28, 14, 30) },
  { page: 'Books', views: 968, avgTime: '03:45', bounceRate: '28%', lastUpdated: new Date(2025, 2, 28, 14, 30) },
  { page: 'Technology', views: 743, avgTime: '02:38', bounceRate: '35%', lastUpdated: new Date(2025, 2, 28, 10, 15) },
  { page: 'Download', views: 682, avgTime: '04:12', bounceRate: '22%', lastUpdated: new Date(2025, 2, 27, 18, 45) },
  { page: 'Concept', views: 521, avgTime: '01:58', bounceRate: '41%', lastUpdated: new Date(2025, 2, 27, 16, 20) },
  { page: 'Gallery', views: 489, avgTime: '03:25', bounceRate: '30%', lastUpdated: new Date(2025, 2, 27, 12, 10) },
  { page: 'Contact', views: 387, avgTime: '01:45', bounceRate: '45%', lastUpdated: new Date(2025, 2, 26, 22, 5) },
];

const timeSpentData = [
  { page: 'Home', time: 135, timestamp: new Date(2025, 2, 28, 14, 30) },
  { page: 'Books', time: 225, timestamp: new Date(2025, 2, 28, 14, 30) },
  { page: 'Technology', time: 158, timestamp: new Date(2025, 2, 28, 10, 15) },
  { page: 'Download', time: 252, timestamp: new Date(2025, 2, 27, 18, 45) },
  { page: 'Concept', time: 118, timestamp: new Date(2025, 2, 27, 16, 20) },
  { page: 'Gallery', time: 205, timestamp: new Date(2025, 2, 27, 12, 10) },
  { page: 'Contact', time: 105, timestamp: new Date(2025, 2, 26, 22, 5) },
];

const bounceRateData = [
  { page: 'Home', rate: 32, timestamp: new Date(2025, 2, 28, 14, 30) },
  { page: 'Books', rate: 28, timestamp: new Date(2025, 2, 28, 14, 30) },
  { page: 'Technology', rate: 35, timestamp: new Date(2025, 2, 28, 10, 15) },
  { page: 'Download', rate: 22, timestamp: new Date(2025, 2, 27, 18, 45) },
  { page: 'Concept', rate: 41, timestamp: new Date(2025, 2, 27, 16, 20) },
  { page: 'Gallery', rate: 30, timestamp: new Date(2025, 2, 27, 12, 10) },
  { page: 'Contact', rate: 45, timestamp: new Date(2025, 2, 26, 22, 5) },
];

const chartConfig = {
  views: { label: 'Page Views', theme: { light: '#0ea5e9', dark: '#0ea5e9' } },
  time: { label: 'Time Spent (seconds)', theme: { light: '#10b981', dark: '#10b981' } },
  rate: { label: 'Bounce Rate (%)', theme: { light: '#f43f5e', dark: '#f43f5e' } }
};

export const PagePerformance: React.FC = () => {
  const [selectedDate] = useState<Date>(new Date());
  
  const formatDateTime = (date: Date) => {
    return format(date, 'dd/MM/yyyy HH:mm');
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Page Performance Overview</CardTitle>
          <CardDescription>
            Detailed metrics for each page
            <div className="text-xs mt-1 text-muted-foreground">
              Data current as of: {formatDateTime(selectedDate)}
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Time Spent per Page</CardTitle>
            <CardDescription>
              Average time in seconds
              <div className="text-xs mt-1 text-muted-foreground">
                Last updated: {formatDateTime(timeSpentData[0].timestamp)}
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                    )
                  }
                  return null;
                }} />
                <Bar dataKey="time" name="time" fill="var(--color-time)" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bounce Rate by Page</CardTitle>
            <CardDescription>
              Percentage of visitors who navigate away
              <div className="text-xs mt-1 text-muted-foreground">
                Last updated: {formatDateTime(bounceRateData[0].timestamp)}
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                    )
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

