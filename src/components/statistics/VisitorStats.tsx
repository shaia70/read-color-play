
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip, BarChart, Bar } from "recharts";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Sample data for demonstration
const visitorData = [
  { name: 'Jan', visitors: 400, newUsers: 240, returningUsers: 160 },
  { name: 'Feb', visitors: 500, newUsers: 300, returningUsers: 200 },
  { name: 'Mar', visitors: 600, newUsers: 350, returningUsers: 250 },
  { name: 'Apr', visitors: 800, newUsers: 450, returningUsers: 350 },
  { name: 'May', visitors: 1000, newUsers: 600, returningUsers: 400 },
  { name: 'Jun', visitors: 1200, newUsers: 700, returningUsers: 500 },
];

const deviceData = [
  { name: 'Mobile', value: 65 },
  { name: 'Desktop', value: 25 },
  { name: 'Tablet', value: 10 },
];

const referralData = [
  { source: 'Google', visits: 521, percentage: '42%' },
  { source: 'Direct', visits: 386, percentage: '31%' },
  { source: 'Social Media', visits: 248, percentage: '20%' },
  { source: 'Referrals', visits: 87, percentage: '7%' }
];

const chartConfig = {
  visitors: { label: 'Total Visitors', theme: { light: '#0ea5e9', dark: '#0ea5e9' } },
  newUsers: { label: 'New Users', theme: { light: '#10b981', dark: '#10b981' } },
  returningUsers: { label: 'Returning Users', theme: { light: '#f59e0b', dark: '#f59e0b' } }
};

export const VisitorStats: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Visitor Overview</CardTitle>
          <CardDescription>Visitor trends over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="aspect-[4/2]">
            <AreaChart data={visitorData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area 
                type="monotone" 
                dataKey="visitors" 
                name="visitors" 
                stroke="var(--color-visitors)" 
                fill="var(--color-visitors)" 
                fillOpacity={0.2} 
              />
              <Area 
                type="monotone" 
                dataKey="newUsers" 
                name="newUsers" 
                stroke="var(--color-newUsers)" 
                fill="var(--color-newUsers)" 
                fillOpacity={0.2} 
              />
              <Area 
                type="monotone" 
                dataKey="returningUsers" 
                name="returningUsers" 
                stroke="var(--color-returningUsers)" 
                fill="var(--color-returningUsers)" 
                fillOpacity={0.2} 
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Device Distribution</CardTitle>
            <CardDescription>Visitors by device type</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="aspect-[4/3]">
              <BarChart data={deviceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Where your visitors are coming from</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Source</TableHead>
                  <TableHead>Visits</TableHead>
                  <TableHead>Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referralData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.source}</TableCell>
                    <TableCell>{item.visits}</TableCell>
                    <TableCell>{item.percentage}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
