
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface GoogleAnalyticsProps {
  measurementId: string;
}

const GoogleAnalytics: React.FC<GoogleAnalyticsProps> = ({ measurementId }) => {
  const location = useLocation();
  
  useEffect(() => {
    // Skip in development mode or if no measurement ID
    if (process.env.NODE_ENV !== 'production' || !measurementId || measurementId === 'G-XXXXXXXXXX') {
      return;
    }
    
    // Check if already loaded
    if (window.gtag) {
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
        anonymize_ip: true,
        cookie_domain: 'auto',
        cookie_flags: 'SameSite=Lax;Secure'
      });
    `;
    
    // Add scripts to head
    document.head.appendChild(gtagScript);
    document.head.appendChild(inlineScript);
    
    return () => {
      // Clean up only if elements exist
      try {
        if (document.head.contains(gtagScript)) {
          document.head.removeChild(gtagScript);
        }
        if (document.head.contains(inlineScript)) {
          document.head.removeChild(inlineScript);
        }
      } catch (error) {
        console.warn('Error cleaning up analytics scripts:', error);
      }
    };
  }, [measurementId]);
  
  // Track page views on route change
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !window.gtag) {
      return;
    }
    
    try {
      const pageView = () => {
        window.gtag && window.gtag('event', 'page_view', {
          page_title: document.title,
          page_location: window.location.href,
          page_path: location.pathname
        });
        console.log('Google Analytics page view:', location.pathname);
      };
      
      pageView();
    } catch (error) {
      console.warn('Google Analytics tracking error:', error);
    }
  }, [location]);
  
  return null;
};

export default GoogleAnalytics;
