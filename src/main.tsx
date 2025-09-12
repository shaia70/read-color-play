
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx'
import './index.css'

// Register service worker for PWA support - simplified version
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { 
      scope: '/' 
    }).then(registration => {
      console.log('Service worker registered successfully');
    }).catch(err => {
      console.error('Service worker registration failed:', err);
    });
  });
}

// Ensure React is loaded correctly and the DOM is fully loaded before rendering
const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </StrictMode>
  );
}
