
// Defines available analytics pixels
export type PixelType = 'google' | 'facebook';

// Google Analytics event tracking
export const trackGoogleEvent = (
  eventName: string,
  eventParams?: Record<string, any>
): void => {
  try {
    if (typeof window !== 'undefined' && 'gtag' in window) {
      const gtag = (window as any).gtag;
      gtag('event', eventName, eventParams);
      console.log('Google Analytics event tracked:', eventName, eventParams);
    }
  } catch (error) {
    console.error('Error tracking Google Analytics event:', error);
  }
};

// Facebook Pixel event tracking
export const trackFacebookEvent = (
  eventName: string,
  eventParams?: Record<string, any>
): void => {
  try {
    if (typeof window !== 'undefined' && 'fbq' in window) {
      const fbq = (window as any).fbq;
      fbq('track', eventName, eventParams);
      console.log('Facebook Pixel event tracked:', eventName, eventParams);
    }
  } catch (error) {
    console.error('Error tracking Facebook Pixel event:', error);
  }
};

// Track event across all pixels
export const trackPixelEvent = (
  eventName: string,
  eventParams?: Record<string, any>,
  pixels?: PixelType[]
): void => {
  const allPixels: PixelType[] = pixels || ['google', 'facebook'];
  
  allPixels.forEach(pixel => {
    switch (pixel) {
      case 'google':
        trackGoogleEvent(eventName, eventParams);
        break;
      case 'facebook':
        trackFacebookEvent(eventName, eventParams);
        break;
    }
  });
};

// Standard events that work across platforms
export const PixelEvents = {
  PAGE_VIEW: 'page_view',
  VIEW_CONTENT: 'view_content',
  ADD_TO_CART: 'add_to_cart',
  DOWNLOAD: 'download',
  CLICK: 'click',
  SEARCH: 'search',
  CONTACT: 'contact',
  COMPLETE_REGISTRATION: 'complete_registration'
};
