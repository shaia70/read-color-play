
import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { trackPixelEvent, PixelEvents, PixelType } from '../services/pixelService';

interface UsePixelTrackingProps {
  disabled?: boolean;
  pixels?: PixelType[];
}

export const usePixelTracking = (props?: UsePixelTrackingProps) => {
  const { disabled = false, pixels = ['google', 'facebook'] } = props || {};
  const location = useLocation();
  const currentPage = location.pathname.replace('/', '') || 'home';
  
  // Track page view when location changes
  React.useEffect(() => {
    if (disabled || process.env.NODE_ENV !== 'production') {
      return;
    }
    
    trackPixelEvent(PixelEvents.PAGE_VIEW, {
      page_title: document.title,
      page_location: window.location.href,
      page_path: location.pathname
    }, pixels);
  }, [location.pathname, disabled, pixels]);
  
  // Track element interactions
  const trackEvent = (
    eventName: string,
    elementName?: string,
    additionalParams?: Record<string, any>
  ) => {
    if (disabled || process.env.NODE_ENV !== 'production') {
      return;
    }
    
    trackPixelEvent(eventName, {
      element: elementName,
      page: currentPage,
      ...additionalParams
    }, pixels);
  };
  
  return {
    trackEvent,
    trackPageView: () => trackEvent(PixelEvents.PAGE_VIEW),
    trackClick: (elementName: string, additionalParams?: Record<string, any>) => 
      trackEvent(PixelEvents.CLICK, elementName, additionalParams),
    trackDownload: (contentName: string, additionalParams?: Record<string, any>) => 
      trackEvent(PixelEvents.DOWNLOAD, contentName, additionalParams),
    trackContact: (contactType: string, additionalParams?: Record<string, any>) => 
      trackEvent(PixelEvents.CONTACT, contactType, additionalParams)
  };
};

export default usePixelTracking;
