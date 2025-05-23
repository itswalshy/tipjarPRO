import React from 'react';
import type { AppProps } from 'next/app';
import { ThemeProvider } from "next-themes";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../client/src/lib/queryClient";
import { TooltipProvider } from "../client/src/components/ui/tooltip";
import { Toaster } from "../client/src/components/ui/toaster";
import { TipContextProvider } from "../client/src/context/TipContext";
import '../client/src/index.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <TooltipProvider>
          <TipContextProvider>
            <div className="flex-grow w-full bg-gradient-to-br from-[#2F4F4F] via-[#2a4545] to-[#364949] text-[#f5f5f5] min-h-screen flex flex-col">
              <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex-grow">
                <div className="flex-grow">
                  <Component {...pageProps} />
                </div>
              </main>
              <footer className="w-full border-t border-[#3A5F5F]/50 mt-12 py-6 bg-gradient-to-r from-[#1e3535] to-[#243a3a]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
                  <div className="font-semibold text-[#f5f5f5] mb-1">Made by William Walsh</div>
                  <div className="text-[#9fd6e9] text-sm opacity-75">Starbucks Store# 69600</div>
                  <div className="mt-3 flex items-center justify-center space-x-2 text-xs text-[#9fd6e9] opacity-60">
                    <span>TipJar Pro</span>
                    <span>•</span>
                    <span>Tip Distribution Calculator</span>
                  </div>
                </div>
              </footer>
            </div>
            <Toaster />
          </TipContextProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
} 