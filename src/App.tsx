
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ThemeProvider } from "next-themes";
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
  // Create a new QueryClient instance within the component
  const queryClient = new QueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <LanguageProvider>
          <AuthProvider>
            <BrowserRouter>
              <AnalyticsProvider>
                <ScrollToTop />
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/books" element={<Books />} />
                    <Route path="/technology" element={<Technology />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/concept" element={<Concept />} />
                    <Route path="/download" element={<Download />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/flipbook" element={<Flipbook />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/admin-statistics" element={<Statistics />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AnimatePresence>
              </AnalyticsProvider>
            </BrowserRouter>
            <Toaster />
            <Sonner />
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
