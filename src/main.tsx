
import React from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx'
import './index.css'

// Register service worker for PWA support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Force clear all caches
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          console.log('Clearing cache:', key);
          return caches.delete(key);
        })
      );
    }).then(() => {
      console.log('All caches cleared');
      
      // Force a page reload to get fresh assets
      if (performance.navigation.type !== performance.navigation.TYPE_RELOAD) {
        window.location.reload();
        return;
      }
    });

    // Unregister any existing service workers first
    navigator.serviceWorker.getRegistrations().then(registrations => {
      for(let registration of registrations) {
        registration.unregister();
        console.log('Unregistered old service worker');
      }
      
      // Register the new service worker with cache bust
      const swVersion = Date.now();
      navigator.serviceWorker.register(`/sw.js?v=${swVersion}`, { 
        scope: '/',
        updateViaCache: 'none'
      }).then(registration => {
        console.log('Service worker registered successfully:', registration);
        
        // Force update immediately
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content is available, refresh the page
                window.location.reload();
              }
            });
          }
        });
        
      }).catch(err => {
        console.error('Service worker registration failed:', err);
      });
    });
  });
}

// Ensure React is loaded correctly and the DOM is fully loaded before rendering
const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </React.StrictMode>
  );
}
