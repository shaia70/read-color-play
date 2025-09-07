import React from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx'
import './index.css'

console.log('Main.tsx loading...');

const rootElement = document.getElementById("root");
if (rootElement) {
  console.log('Root element found, rendering app...');
  createRoot(rootElement).render(
    <React.StrictMode>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </React.StrictMode>
  );
} else {
  console.error('Root element not found!');
}