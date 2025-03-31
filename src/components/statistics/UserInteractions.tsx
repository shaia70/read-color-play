
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from "recharts";
import { format } from "date-fns";

// Sample data for demonstration
const clickData = [
  { element: 'Download App Button', clicks: 523, conversionRate: '12.5%', timestamp: new Date(2025, 2, 28, 17, 45) },
  { element: 'Navigation Menu Items', clicks: 487, conversionRate: '8.2%', timestamp: new Date(2025, 2, 28, 17, 45) },
  { element: 'Book Images', clicks: 345, conversionRate: '10.1%', timestamp: new Date(2025, 2, 28, 15, 30) },
  { element: 'AR Demo Video', clicks: 289, conversionRate: '15.3%', timestamp: new Date(2025, 2, 28, 12, 15) },
  { element: 'Contact Form Submit', clicks: 156, conversionRate: '4.2%', timestamp: new Date(2025, 2, 27, 23, 40) },
  { element: 'Gallery Thumbnails', clicks: 234, conversionRate: '7.8%', timestamp: new Date(2025, 2, 27, 18, 25) },
];

const navigationFlowData = [
  { from: 'Home', to: 'Books', count: 248, timestamp: new Date(2025, 2, 28, 17, 45) },
  { from: 'Home', to: 'Download', count: 215, timestamp: new Date(2025, 2, 28, 17, 45) },
  { from: 'Books', to: 'Download', count: 189, timestamp: new Date(2025, 2, 28, 15, 30) },
  { from: 'Technology', to: 'Download', count: 167, timestamp: new Date(2025, 2, 28, 12, 15) },
  { from: 'Gallery', to: 'Books', count: 124, timestamp: new Date(2025, 2, 27, 23, 40) },
  { from: 'Contact', to: 'Home', count: 98, timestamp: new Date(2025, 2, 27, 18, 25) },
];

const dropoffData = [
  { point: 'Initial Load', percentage: 100, timestamp: new Date(2025, 2, 28, 17, 45) },
  { point: 'Home Scroll', percentage: 85, timestamp: new Date(2025, 2, 28, 17, 45) },
  { point: 'Books View', percentage: 67, timestamp: new Date(2025, 2, 28, 17, 45) },
  { point: 'Download Page', percentage: 42, timestamp: new Date(2025, 2, 28, 17, 45) },
  { point: 'App Download Link Click', percentage: 23, timestamp: new Date(2025, 2, 28, 17, 45) },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const chartConfig = {
  clicks: { label: 'Click Count', theme: { light: '#0ea5e9', dark: '#0ea5e9' } },
  count: { label: 'Navigation Count', theme: { light: '#10b981', dark: '#10b981' } },
  percentage: { label: 'User Percentage', theme: { light: '#8b5cf6', dark: '#8b5cf6' } }
};

export const UserInteractions: React.FC = () => {
  const [lastUpdated] = useState<Date>(new Date(2025, 2, 28, 17, 45));
  
  const formatDateTime = (date: Date) => {
    return format(date, 'dd/MM/yyyy HH:mm');
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Most Clicked Elements</CardTitle>
          <CardDescription>
            What users are interacting with the most
            <div className="text-xs mt-1 text-muted-foreground">
              Last refreshed: {formatDateTime(lastUpdated)}
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Element</TableHead>
                <TableHead>Clicks</TableHead>
                <TableHead>Conversion Rate</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clickData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.element}</TableCell>
                  <TableCell>{item.clicks}</TableCell>
                  <TableCell>{item.conversionRate}</TableCell>
                  <TableCell>{formatDateTime(item.timestamp)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Navigation Flow</CardTitle>
            <CardDescription>
              How users move between pages
              <div className="text-xs mt-1 text-muted-foreground">
                Data current as of: {formatDateTime(lastUpdated)}
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Count</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {navigationFlowData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.from}</TableCell>
                    <TableCell>{item.to}</TableCell>
                    <TableCell>{item.count}</TableCell>
                    <TableCell>{formatDateTime(item.timestamp)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Journey Dropoff</CardTitle>
            <CardDescription>
              Where users stop in their journey
              <div className="text-xs mt-1 text-muted-foreground">
                Last updated: {formatDateTime(dropoffData[0].timestamp)}
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="aspect-[4/3]">
              <BarChart 
                data={dropoffData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="point" type="category" />
                <Tooltip content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="font-medium">{data.point}</div>
                          <div className="font-medium text-right">{data.percentage}%</div>
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
                <Bar 
                  dataKey="percentage" 
                  name="percentage" 
                  fill="var(--color-percentage)" 
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
