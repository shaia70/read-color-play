
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface FacebookPixelProps {
  pixelId: string;
}

const FacebookPixel: React.FC<FacebookPixelProps> = ({ pixelId }) => {
  const location = useLocation();
  
  useEffect(() => {
    // Skip in development mode
    if (process.env.NODE_ENV !== 'production') {
      return;
    }
    
    // Initialize Facebook Pixel
    const script = document.createElement('script');
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${pixelId}');
      fbq('track', 'PageView');
    `;
    
    // Add Facebook Pixel base code
    document.head.appendChild(script);
    
    // Add Facebook Pixel noscript fallback
    const noscript = document.createElement('noscript');
    const img = document.createElement('img');
    img.height = 1;
    img.width = 1;
    img.style.display = 'none';
    img.src = `https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`;
    noscript.appendChild(img);
    document.head.appendChild(noscript);
    
    return () => {
      // Clean up safely
      try {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
        if (document.head.contains(noscript)) {
          document.head.removeChild(noscript);
        }
      } catch (error) {
        console.warn('Error cleaning up Facebook Pixel scripts:', error);
      }
    };
  }, [pixelId]);
  
  // Track page views on route change
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !window.fbq) {
      return;
    }
    
    try {
      window.fbq && window.fbq('track', 'PageView', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: location.pathname
      });
      console.log('Facebook Pixel page view:', location.pathname);
    } catch (error) {
      console.warn('Facebook Pixel tracking error:', error);
    }
  }, [location]);
  
  return null;
};

export default FacebookPixel;
