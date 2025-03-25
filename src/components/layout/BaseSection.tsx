"use client";

import { ReactNode } from "react";
import { useThemeStyles } from "@/context/ThemeContext";

// Base Section props interface - follows LSP by defining properties common to all sections
export interface BaseSectionProps {
  id: string;
  children: ReactNode;
  className?: string;
  title?: string;
}

// Base Section component that can be extended but maintains core functionality
export default function BaseSection({
  id,
  children,
  className = "",
  title
}: BaseSectionProps) {
  const themeStyles = useThemeStyles();
  
  return (
    <section 
      id={id}
      className={`w-full py-20 ${className}`}
    >
      <div className="container mx-auto max-w-[1200px] px-6 md:px-12">
        {title && (
          <h2 className="text-3xl md:text-4xl font-bold mb-12 relative inline-block">
            {title}
            <span 
              className="absolute -bottom-2 left-0 w-1/2 h-1" 
              style={{ 
                background: `linear-gradient(to right, ${themeStyles.primary}, ${themeStyles.secondary})` 
              }}
            ></span>
          </h2>
        )}
        {children}
      </div>
    </section>
  );
} 