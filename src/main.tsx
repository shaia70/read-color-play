
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Register service worker for PWA support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Force a hard refresh of browser caches
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          return caches.delete(key);
        })
      );
    }).then(() => {
      console.log('All caches cleared');
    });

    // Unregister any existing service workers first
    navigator.serviceWorker.getRegistrations().then(registrations => {
      for(let registration of registrations) {
        registration.unregister();
        console.log('Unregistered old service worker');
      }
      
      // Register the new service worker with updated version
      navigator.serviceWorker.register('/sw.js?v=15', { 
        scope: '/' 
      }).then(registration => {
        console.log('Service worker registered successfully:', registration);
        
        // Check for updates every hour
        setInterval(() => {
          registration.update();
          console.log('Checking for service worker updates');
        }, 60 * 60 * 1000);
        
      }).catch(err => {
        console.error('Service worker registration failed:', err);
      });
    });
  });
}

// Ensure the DOM is fully loaded before rendering
document.addEventListener('DOMContentLoaded', () => {
  createRoot(document.getElementById("root")!).render(<App />);
});
