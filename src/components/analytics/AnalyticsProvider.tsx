
import React, { useEffect, useState } from 'react';
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
  const [pixelConfig, setPixelConfig] = useState({
    googleAnalyticsId: 'G-XXXXXXXXXX', // Default placeholder
    facebookPixelId: 'XXXXXXXXXX'      // Default placeholder
  });
  
  useEffect(() => {
    // Get configuration from local storage if available
    const storedConfig = localStorage.getItem('analytics_pixel_config');
    if (storedConfig) {
      try {
        const parsedConfig = JSON.parse(storedConfig);
        setPixelConfig(parsedConfig);
      } catch (error) {
        console.error("Error parsing stored pixel configuration:", error);
      }
    }
  }, []);
  
  // Only render in production and when not disabled
  if (process.env.NODE_ENV !== 'production' || disabled) {
    return <>{children}</>;
  }
  
  // Skip tracking if using placeholder IDs
  const skipTracking = 
    pixelConfig.googleAnalyticsId === 'G-XXXXXXXXXX' &&
    pixelConfig.facebookPixelId === 'XXXXXXXXXX';
  
  if (skipTracking) {
    // Silently skip without warning in development
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
