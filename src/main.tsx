
import React from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx'
import './index.css'

// Clear all browser caches on startup
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
      console.log('All caches cleared successfully');
    });

    // Unregister any existing service workers
    navigator.serviceWorker.getRegistrations().then(registrations => {
      for(let registration of registrations) {
        registration.unregister();
        console.log('Unregistered service worker');
      }
      
      // Register fresh service worker
      navigator.serviceWorker.register('/sw.js?v=16', { 
        scope: '/' 
      }).then(registration => {
        console.log('New service worker registered:', registration);
      }).catch(err => {
        console.error('Service worker registration failed:', err);
      });
    });
  });
}

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
