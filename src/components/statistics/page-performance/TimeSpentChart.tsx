
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { TimeSpentData } from "@/services/analyticsService";
import { ChartConfigType, TooltipProps } from "./types";

interface TimeSpentChartProps {
  timeSpentData: TimeSpentData[];
  chartConfig: ChartConfigType;
  formatDateTime: (date: Date) => string;
  noDataAvailable: boolean;
}

export const TimeSpentChart: React.FC<TimeSpentChartProps> = ({ 
  timeSpentData, 
  chartConfig, 
  formatDateTime, 
  noDataAvailable 
}) => {
  if (noDataAvailable) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No time spent data available yet.</p>
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="aspect-[4/3]">
      <BarChart data={timeSpentData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="page" />
        <YAxis />
        <Tooltip content={({ active, payload }: TooltipProps) => {
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
  );
};
