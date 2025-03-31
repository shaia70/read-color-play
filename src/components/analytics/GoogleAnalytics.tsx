
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface GoogleAnalyticsProps {
  measurementId: string;
}

const GoogleAnalytics: React.FC<GoogleAnalyticsProps> = ({ measurementId }) => {
  const location = useLocation();
  
  useEffect(() => {
    // Skip in development mode
    if (process.env.NODE_ENV !== 'production') {
      return;
    }
    
    // Create script elements
    const gtagScript = document.createElement('script');
    gtagScript.async = true;
    gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    
    const inlineScript = document.createElement('script');
    inlineScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${measurementId}', { 
        send_page_view: true,
        cookie_domain: 'shelley.co.il',
        cookie_flags: 'SameSite=None;Secure'
      });
    `;
    
    // Add scripts to head
    document.head.appendChild(gtagScript);
    document.head.appendChild(inlineScript);
    
    return () => {
      // Clean up
      document.head.removeChild(gtagScript);
      document.head.removeChild(inlineScript);
    };
  }, [measurementId]);
  
  // Track page views on route change
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !window.gtag) {
      return;
    }
    
    const pageView = () => {
      window.gtag && window.gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: location.pathname
      });
      console.log('Google Analytics page view:', location.pathname);
    };
    
    pageView();
  }, [location]);
  
  return null;
};

export default GoogleAnalytics;
