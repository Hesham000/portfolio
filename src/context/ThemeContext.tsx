"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Theme interfaces following OCP - can be extended without modifying the base interface
interface BaseTheme {
  type: string;
  background: string;
  foreground: string;
  primary: string;
  secondary: string;
}

// Default dark theme implementation
const darkTheme: BaseTheme = {
  type: 'dark',
  background: '#0a0a18',
  foreground: '#FFFFFF',
  primary: '#FF00FF',
  secondary: '#7B00FF',
};

// Alternate dark theme, showing extension without modification
const purpleDarkTheme: BaseTheme = {
  type: 'purpleDark',
  background: '#0f0620',
  foreground: '#FFFFFF',
  primary: '#7B00FF',
  secondary: '#FF00FF',
};

// Theme context provides a way to access theme across the app
interface ThemeContextType {
  theme: BaseTheme;
  setTheme: (theme: string) => void;
  availableThemes: BaseTheme[];
}

// Create context with default values
const ThemeContext = createContext<ThemeContextType>({
  theme: darkTheme,
  setTheme: () => {},
  availableThemes: [darkTheme, purpleDarkTheme],
});

// Theme provider component
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<BaseTheme>(darkTheme);
  const availableThemes = [darkTheme, purpleDarkTheme];

  // Function to change theme by name
  const setTheme = (themeName: string) => {
    const newTheme = availableThemes.find(t => t.type === themeName);
    if (newTheme) {
      setThemeState(newTheme);
      // Store theme preference
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', themeName);
      }
      
      // Update CSS variables
      document.documentElement.style.setProperty('--background', newTheme.background);
      document.documentElement.style.setProperty('--foreground', newTheme.foreground);
      document.documentElement.style.setProperty('--primary', newTheme.primary);
      document.documentElement.style.setProperty('--secondary', newTheme.secondary);
    }
  };

  // Load saved theme on initial load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        setTheme(savedTheme);
      }
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, availableThemes }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook for using theme
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Theme hook specifically for component styling
export function useThemeStyles() {
  const { theme } = useTheme();
  
  return {
    background: theme.background,
    foreground: theme.foreground,
    primary: theme.primary,
    secondary: theme.secondary,
    gradientText: `bg-clip-text text-transparent bg-gradient-to-r from-[${theme.primary}] to-[${theme.secondary}]`,
    primaryGlow: `shadow-[0_0_15px_${theme.primary}]`,
    secondaryGlow: `shadow-[0_0_15px_${theme.secondary}]`,
  };
} 