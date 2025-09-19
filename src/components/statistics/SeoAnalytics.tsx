
import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Download, Languages } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample data for demonstration - English keywords
const enKeywordRankingData = [
  { keyword: 'augmented reality children books', position: 3, change: '+2', volume: 1200 },
  { keyword: 'AR books for kids', position: 5, change: '-1', volume: 880 },
  { keyword: 'interactive children books', position: 8, change: '+4', volume: 2400 },
  { keyword: 'shelley books', position: 1, change: '0', volume: 320 },
  { keyword: 'AR reading for children', position: 12, change: '+6', volume: 720 },
];

// Sample data for demonstration - Hebrew keywords
const heKeywordRankingData = [
  { keyword: 'ספרי מציאות רבודה לילדים', position: 2, change: '+3', volume: 1450 },
  { keyword: 'ספרים אינטראקטיביים', position: 4, change: '+1', volume: 1800 },
  { keyword: 'שלי ספרים', position: 1, change: '0', volume: 580 },
  { keyword: 'AR לילדים', position: 6, change: '+2', volume: 960 },
  { keyword: 'ספרי ילדים עם טכנולוגיה', position: 7, change: '-1', volume: 720 },
  { keyword: 'דפי צביעה אינטראקטיביים', position: 5, change: '+4', volume: 1100 },
];

// Keep existing data definitions
const organicTrafficData = [
  { month: 'Jan', visitors: 1240 },
  { month: 'Feb', visitors: 1380 },
  { month: 'Mar', visitors: 1520 },
  { month: 'Apr', visitors: 1680 },
  { month: 'May', visitors: 1840 },
  { month: 'Jun', visitors: 2100 },
];

const backlinksData = [
  { domain: 'educationblog.com', authority: 76, links: 3 },
  { domain: 'parentreview.org', authority: 68, links: 2 },
  { domain: 'techforkids.net', authority: 72, links: 5 },
  { domain: 'primaryeducation.edu', authority: 81, links: 1 },
  { domain: 'armagazine.com', authority: 85, links: 4 },
];

const pageSpeedData = [
  { page: 'Home', mobile: 82, desktop: 94 },
  { page: 'Books', mobile: 78, desktop: 91 },
  { page: 'Technology', mobile: 85, desktop: 96 },
  { page: 'Download', mobile: 76, desktop: 89 },
  { page: 'Gallery', mobile: 73, desktop: 88 },
];

const chartConfig = {
  visitors: { label: 'Organic Visitors', theme: { light: '#8b5cf6', dark: '#8b5cf6' } },
  mobile: { label: 'Mobile Score', theme: { light: '#f43f5e', dark: '#f43f5e' } },
  desktop: { label: 'Desktop Score', theme: { light: '#10b981', dark: '#10b981' } }
};

export const SeoAnalytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-row justify-between items-center">
            <div>
              <CardTitle>Keyword Rankings</CardTitle>
              <CardDescription>Your position in search results for key terms</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="hebrew" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="hebrew" className="flex items-center gap-1">
                <Languages className="h-4 w-4" />
                עברית
              </TabsTrigger>
              <TabsTrigger value="english" className="flex items-center gap-1">
                <Languages className="h-4 w-4" />
                English
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="hebrew">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>מילת מפתח</TableHead>
                    <TableHead>מיקום</TableHead>
                    <TableHead>שינוי</TableHead>
                    <TableHead>נפח חיפוש</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {heKeywordRankingData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.keyword}</TableCell>
                      <TableCell>{item.position}</TableCell>
                      <TableCell>
                        <span 
                          className={
                            item.change.startsWith("+") 
                              ? "text-green-500" 
                              : item.change === "0" 
                                ? "text-gray-500" 
                                : "text-red-500"
                          }
                        >
                          {item.change}
                        </span>
                      </TableCell>
                      <TableCell>{item.volume}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="english">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Keyword</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Change</TableHead>
                    <TableHead>Search Volume</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enKeywordRankingData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.keyword}</TableCell>
                      <TableCell>{item.position}</TableCell>
                      <TableCell>
                        <span 
                          className={
                            item.change.startsWith("+") 
                              ? "text-green-500" 
                              : item.change === "0" 
                                ? "text-gray-500" 
                                : "text-red-500"
                          }
                        >
                          {item.change}
                        </span>
                      </TableCell>
                      <TableCell>{item.volume}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Organic Traffic Trend</CardTitle>
          <CardDescription>Visitors from search engines over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="aspect-[4/2]">
            <LineChart data={organicTrafficData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="visitors" 
                name="visitors" 
                stroke="var(--color-visitors)" 
                strokeWidth={2} 
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Backlinks</CardTitle>
            <CardDescription>Websites linking to your site</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Domain</TableHead>
                  <TableHead>Authority</TableHead>
                  <TableHead>Links</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {backlinksData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.domain}</TableCell>
                    <TableCell>{item.authority}</TableCell>
                    <TableCell>{item.links}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                        Visit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Page Speed Insights</CardTitle>
            <CardDescription>Performance scores by page</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="aspect-[4/3]">
              <LineChart 
                data={pageSpeedData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="page" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="mobile" 
                  name="mobile" 
                  stroke="var(--color-mobile)" 
                  strokeWidth={2} 
                />
                <Line 
                  type="monotone" 
                  dataKey="desktop" 
                  name="desktop" 
                  stroke="var(--color-desktop)" 
                  strokeWidth={2} 
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>SEO Recommendations</CardTitle>
          <CardDescription>Improvements to boost your search engine rankings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-md bg-green-50">
              <h3 className="font-medium">דפי מטא תיאור (Meta Description)</h3>
              <p className="text-sm text-muted-foreground">עדכון תיאורי מטא עבור דפי הספרים והגלריה כדי לכלול יותר מילות מפתח רלוונטיות בעברית.</p>
            </div>
            
            <div className="p-4 border rounded-md bg-amber-50">
              <h3 className="font-medium">אופטימיזציה למובייל</h3>
              <p className="text-sm text-muted-foreground">שיפור מהירות הטעינה במכשירים ניידים עבור דפי הגלריה וההורדה.</p>
            </div>
            
            <div className="p-4 border rounded-md bg-blue-50">
              <h3 className="font-medium">אסטרטגית תוכן</h3>
              <p className="text-sm text-muted-foreground">הוספת תוכן נוסף בעברית על טכנולוגיית AR לחינוך ילדים כדי למקד מילות מפתח בעלות ערך גבוה.</p>
            </div>
            
            <div className="flex justify-end mt-6">
              <Button>
                <Download className="h-4 w-4 mr-2" />
                יצוא דוח SEO מלא
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
