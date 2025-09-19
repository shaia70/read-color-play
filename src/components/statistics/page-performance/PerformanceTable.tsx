
import * as React from "react";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageViewData } from "@/services/analyticsService";

interface PerformanceTableProps {
  pageViewsData: PageViewData[];
  formatDateTime: (date: Date) => string;
  noDataAvailable: boolean;
}

export const PerformanceTable: React.FC<PerformanceTableProps> = ({ 
  pageViewsData, 
  formatDateTime, 
  noDataAvailable 
}) => {
  if (noDataAvailable) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No analytics data available yet. Start browsing the site to generate data.</p>
      </div>
    );
  }

  return (
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
  );
};
