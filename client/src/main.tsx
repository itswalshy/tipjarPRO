import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "next-themes";
import { Router } from "wouter";
import { useState, useEffect, useCallback } from "react";

// For GitHub Pages deployment
const basePath = process.env.NODE_ENV === 'production' ? '/tipjarPRO' : '';
const useHashLocation = () => {
  const [hash, setHash] = useState(window.location.hash.replace('#', '') || '/');

  useEffect(() => {
    const handleHashChange = () => setHash(window.location.hash.replace('#', '') || '/');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = useCallback((to: string) => {
    window.location.hash = to;
  }, []);

  return [hash, navigate] as [string, (to: string) => void];
};

createRoot(document.getElementById("root")!).render(
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
    <Router hook={useHashLocation}>
      <App />
    </Router>
  </ThemeProvider>
);
