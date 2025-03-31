
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
  // Only render in production and when not disabled
  if (process.env.NODE_ENV !== 'production' || disabled) {
    return <>{children}</>;
  }
  
  // Replace these with your actual IDs
  const googleAnalyticsId = 'G-XXXXXXXXXX'; // Replace with your Google Analytics measurement ID
  const facebookPixelId = 'XXXXXXXXXX';    // Replace with your Facebook Pixel ID
  
  return (
    <>
      <GoogleAnalytics measurementId={googleAnalyticsId} />
      <FacebookPixel pixelId={facebookPixelId} />
      {children}
    </>
  );
};

export default AnalyticsProvider;
