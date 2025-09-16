import React from 'react';
import GoogleAnalytics from './GoogleAnalytics';
import FacebookPixel from './FacebookPixel';

interface AnalyticsProviderProps {
  children: React.ReactNode;
  disabled?: boolean;
}

const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ 
  children,
  disabled = false
}) => {
  // For now, just return children to avoid React hook issues
  // TODO: Re-implement state management after React issues are resolved
  
  // Only render in production and when not disabled
  if (process.env.NODE_ENV !== 'production' || disabled) {
    return <>{children}</>;
  }

  // Get configuration from local storage synchronously
  let pixelConfig = {
    googleAnalyticsId: 'G-XXXXXXXXXX', // Default placeholder
    facebookPixelId: 'XXXXXXXXXX'      // Default placeholder
  };
  
  try {
    const storedConfig = localStorage.getItem('analytics_pixel_config');
    if (storedConfig) {
      pixelConfig = JSON.parse(storedConfig);
    }
  } catch (error) {
    console.error("Error parsing stored pixel configuration:", error);
  }
  
  // Skip tracking if using placeholder IDs
  const skipTracking = 
    pixelConfig.googleAnalyticsId === 'G-XXXXXXXXXX' &&
    pixelConfig.facebookPixelId === 'XXXXXXXXXX';
  
  if (skipTracking) {
    return <>{children}</>;
  }
  
  return (
    <>
      {pixelConfig.googleAnalyticsId && pixelConfig.googleAnalyticsId !== 'G-XXXXXXXXXX' && (
        <GoogleAnalytics measurementId={pixelConfig.googleAnalyticsId} />
      )}
      
      {pixelConfig.facebookPixelId && pixelConfig.facebookPixelId !== 'XXXXXXXXXX' && (
        <FacebookPixel pixelId={pixelConfig.facebookPixelId} />
      )}
      
      {children}
    </>
  );
};

export default AnalyticsProvider;