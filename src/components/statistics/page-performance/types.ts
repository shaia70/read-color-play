
import { PageViewData, TimeSpentData, BounceRateData } from "@/services/analyticsService";

export interface ChartConfigType {
  views: { label: string; theme: { light: string; dark: string } };
  time: { label: string; theme: { light: string; dark: string } };
  rate: { label: string; theme: { light: string; dark: string } };
}

export interface TooltipProps {
  active?: boolean;
  payload?: any[];
}
