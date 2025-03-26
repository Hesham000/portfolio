"use client";

import { ReactNode, useRef, useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Base3DModel, ModelConfig } from "@/interfaces/3d-model";

interface ModelState {
  isLoaded: boolean;
  progress: number;
  error: string | null;
}

interface ModelProviderProps {
  modelClass: new () => Base3DModel;
  config?: ModelConfig;
  className?: string;
  fallback?: ReactNode;
  children?: ReactNode;
}

export default function ModelProvider({
  modelClass,
  config,
  className = "",
  fallback,
  children
}: ModelProviderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<Base3DModel | null>(null);
  const [modelState, setModelState] = useState<ModelState>({
    isLoaded: false,
    progress: 0,
    error: null,
  });
  const { theme } = useTheme();
  
  useEffect(() => {
    const loadModel = async () => {
      try {
        setModelState(prev => ({ ...prev, isLoaded: false, progress: 0 }));

        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setModelState(prev => ({ ...prev, isLoaded: true, progress: 100 }));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load model";
        setModelState(prev => ({ ...prev, error: errorMessage }));
      }
    };

    loadModel();
  }, [config]);

  useEffect(() => {
    if (!containerRef.current) return;
    
    try {
      const model = new modelClass();
      modelRef.current = model;
      
      const modelConfig = {
        ...config,
        lights: {
          ambient: {
            color: parseInt(theme.primary.replace('#', '0x')),
            intensity: 0.5,
            ...(config?.lights?.ambient || {})
          },
          ...(config?.lights || {})
        }
      };
      
      model.initialize(containerRef.current);
      
      let lastTime = 0;
      const animate = (time: number) => {
        if (!modelRef.current) return;
        
        const deltaTime = time - lastTime;
        lastTime = time;
        
        modelRef.current.update(deltaTime);
        modelRef.current.render();
        
        requestAnimationFrame(animate);
      };
      
      requestAnimationFrame(animate);
      
      const handleResize = () => {
        if (!containerRef.current || !modelRef.current) return;
        
        const { clientWidth, clientHeight } = containerRef.current;
        modelRef.current.resize(clientWidth, clientHeight);
      };
      
      window.addEventListener('resize', handleResize);
      setModelState(prev => ({ ...prev, isLoaded: true }));
      
      return () => {
        window.removeEventListener('resize', handleResize);
        if (modelRef.current) {
          modelRef.current.cleanup();
          modelRef.current = null;
        }
      };
    } catch (err) {
      console.error("Error initializing 3D model:", err);
      setModelState(prev => ({ ...prev, error: "Failed to load model" }));
    }
  }, [modelClass, theme, config]);

  if (modelState.error && fallback) {
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
      {children && modelState.isLoaded && (
        <div className="relative z-10">
          {children}
        </div>
      )}
    </div>
  );
} 