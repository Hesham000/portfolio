"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SplashContextType {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  splashComplete: boolean;
}

// Create context with default values
const SplashContext = createContext<SplashContextType>({
  isLoading: true,
  setIsLoading: () => {},
  splashComplete: false,
});

// SplashProvider component
export function SplashProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [splashComplete, setSplashComplete] = useState(false);

  // Handle splash screen completion
  useEffect(() => {
    if (!isLoading) {
      // Add a small delay before considering splash truly complete
      // This gives time for exit animations to finish
      const timer = setTimeout(() => {
        setSplashComplete(true);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    <SplashContext.Provider value={{ isLoading, setIsLoading, splashComplete }}>
      {children}
    </SplashContext.Provider>
  );
}

// Custom hook for using splash context
export function useSplash() {
  const context = useContext(SplashContext);
  if (context === undefined) {
    throw new Error('useSplash must be used within a SplashProvider');
  }
  return context;
} 