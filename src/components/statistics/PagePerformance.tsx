
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, LineChart, Line } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Sample data for demonstration
const pageViewsData = [
  { page: 'Home', views: 1240, avgTime: '02:15', bounceRate: '32%' },
  { page: 'Books', views: 968, avgTime: '03:45', bounceRate: '28%' },
  { page: 'Technology', views: 743, avgTime: '02:38', bounceRate: '35%' },
  { page: 'Download', views: 682, avgTime: '04:12', bounceRate: '22%' },
  { page: 'Concept', views: 521, avgTime: '01:58', bounceRate: '41%' },
  { page: 'Gallery', views: 489, avgTime: '03:25', bounceRate: '30%' },
  { page: 'Contact', views: 387, avgTime: '01:45', bounceRate: '45%' },
];

const timeSpentData = [
  { page: 'Home', time: 135 },
  { page: 'Books', time: 225 },
  { page: 'Technology', time: 158 },
  { page: 'Download', time: 252 },
  { page: 'Concept', time: 118 },
  { page: 'Gallery', time: 205 },
  { page: 'Contact', time: 105 },
];

const bounceRateData = [
  { page: 'Home', rate: 32 },
  { page: 'Books', rate: 28 },
  { page: 'Technology', rate: 35 },
  { page: 'Download', rate: 22 },
  { page: 'Concept', rate: 41 },
  { page: 'Gallery', rate: 30 },
  { page: 'Contact', rate: 45 },
];

const chartConfig = {
  views: { label: 'Page Views', theme: { light: '#0ea5e9', dark: '#0ea5e9' } },
  time: { label: 'Time Spent (seconds)', theme: { light: '#10b981', dark: '#10b981' } },
  rate: { label: 'Bounce Rate (%)', theme: { light: '#f43f5e', dark: '#f43f5e' } }
};

export const PagePerformance: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Page Performance Overview</CardTitle>
          <CardDescription>Detailed metrics for each page</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Page</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Avg. Time Spent</TableHead>
                <TableHead>Bounce Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageViewsData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.page}</TableCell>
                  <TableCell>{item.views}</TableCell>
                  <TableCell>{item.avgTime}</TableCell>
                  <TableCell>{item.bounceRate}</TableCell>
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
            <CardDescription>Average time in seconds</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="aspect-[4/3]">
              <BarChart data={timeSpentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="page" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="time" name="time" fill="var(--color-time)" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bounce Rate by Page</CardTitle>
            <CardDescription>Percentage of visitors who navigate away</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="aspect-[4/3]">
              <LineChart data={bounceRateData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="page" />
                <YAxis />
                <Tooltip />
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
