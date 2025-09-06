
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import Books from "./pages/Books";
import Technology from "./pages/Technology";
import Contact from "./pages/Contact";
import Concept from "./pages/Concept";
import Download from "./pages/Download";
import Gallery from "./pages/Gallery";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";
import Statistics from "./pages/Statistics";
import { AnimatePresence } from "framer-motion";
import { LanguageProvider } from "./contexts/LanguageContext";
import AnalyticsProvider from "./components/analytics/AnalyticsProvider";
import { AuthProvider } from "./components/auth/AuthProvider";
import Flipbook from "./pages/Flipbook";

// Scroll restoration and analytics tracking component
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

const App = () => {
  console.log('App component rendering...');
  
  return (
    <div style={{ padding: '20px', color: 'black', backgroundColor: 'white' }}>
      <h1>Hello World - בדיקה</h1>
      <p>If you can see this, the app is working!</p>
    </div>
  );
};

export default App;
