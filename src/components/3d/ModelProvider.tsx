"use client";

import { ReactNode, useRef, useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Base3DModel, Base3DModelProps, ModelConfig } from "@/interfaces/3d-model";

// Following DIP - high-level modules depend on abstractions
interface ModelProviderProps<T extends Base3DModelProps> {
  modelClass: new () => Base3DModel;
  modelProps: T;
  config?: ModelConfig;
  className?: string;
  fallback?: ReactNode;
  children?: ReactNode;
}

// Generic ModelProvider that can work with any model implementation
export default function ModelProvider<T extends Base3DModelProps>({
  modelClass,
  modelProps,
  config,
  className = "",
  fallback,
  children
}: ModelProviderProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<Base3DModel | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { theme } = useTheme();
  
  // Initialize model
  useEffect(() => {
    if (!containerRef.current) return;
    
    try {
      // Create model instance
      const model = new modelClass();
      modelRef.current = model;
      
      // Apply default config values based on theme
      const finalConfig: ModelConfig = {
        ...config,
        // Apply theme-based defaults if not specified
        lights: {
          ambient: {
            color: parseInt(theme.primary.replace('#', '0x')),
            intensity: 0.5,
            ...(config?.lights?.ambient || {})
          },
          ...(config?.lights || {})
        }
      };
      
      // Initialize with container element
      model.initialize(containerRef.current);
      
      // Start animation loop
      let lastTime = 0;
      const animate = (time: number) => {
        if (!modelRef.current) return;
        
        const deltaTime = time - lastTime;
        lastTime = time;
        
        modelRef.current.update(deltaTime);
        modelRef.current.render();
        
        requestAnimationFrame(animate);
      };
      
      // Start animation loop
      requestAnimationFrame(animate);
      
      // Handle resize
      const handleResize = () => {
        if (!containerRef.current || !modelRef.current) return;
        
        const { clientWidth, clientHeight } = containerRef.current;
        modelRef.current.resize(clientWidth, clientHeight);
      };
      
      window.addEventListener('resize', handleResize);
      setIsLoaded(true);
      
      // Cleanup on unmount
      return () => {
        window.removeEventListener('resize', handleResize);
        if (modelRef.current) {
          modelRef.current.cleanup();
          modelRef.current = null;
        }
      };
    } catch (err) {
      console.error("Error initializing 3D model:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  }, [modelClass, theme]);

  if (error && fallback) {
    return (
      <div className={`relative ${className}`}>
        {fallback}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={containerRef} 
        className="absolute inset-0"
      />
      {children && isLoaded && (
        <div className="relative z-10">
          {children}
        </div>
      )}
    </div>
  );
} 