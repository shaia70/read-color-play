
import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { BounceRateData } from "@/services/analyticsService";
import { ChartConfigType, TooltipProps } from "./types";

interface BounceRateChartProps {
  bounceRateData: BounceRateData[];
  chartConfig: ChartConfigType;
  formatDateTime: (date: Date) => string;
  noDataAvailable: boolean;
}

export const BounceRateChart: React.FC<BounceRateChartProps> = ({ 
  bounceRateData, 
  chartConfig, 
  formatDateTime, 
  noDataAvailable 
}) => {
  if (noDataAvailable) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No bounce rate data available yet.</p>
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="aspect-[4/3]">
      <LineChart data={bounceRateData}>
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
  );
};
