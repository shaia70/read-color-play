
/// <reference types="vite/client" />

// Global type definitions for analytics scripts
interface Window {
  gtag?: (...args: any[]) => void;
  dataLayer?: any[];
  fbq?: (...args: any[]) => void;
  _fbq?: any;
}

