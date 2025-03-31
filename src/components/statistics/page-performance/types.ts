
import { PageViewData, TimeSpentData, BounceRateData } from "@/services/analyticsService";

// Updated to match the expected ChartConfig type with a string index signature
export interface ChartConfigType {
  [key: string]: { 
    label: string; 
    theme: { light: string; dark: string } 
  };
  views: { label: string; theme: { light: string; dark: string } };
  time: { label: string; theme: { light: string; dark: string } };
  rate: { label: string; theme: { light: string; dark: string } };
}

export interface TooltipProps {
  active?: boolean;
  payload?: any[];
}
