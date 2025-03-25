// Three.js Model Interface following DIP

import { ReactNode } from "react";
import * as THREE from "three";

// Base 3D Model interface - high level modules will depend on this
export interface Base3DModel {
  initialize(container: HTMLElement): void;
  render(): void;
  update(deltaTime: number): void;
  resize(width: number, height: number): void;
  cleanup(): void;
}

// Common props for all 3D models
export interface Base3DModelProps {
  className?: string;
  width?: number;
  height?: number;
  interactive?: boolean;
}

// Animate specific props
export interface AnimatedModelProps extends Base3DModelProps {
  animationSpeed?: number;
  autoRotate?: boolean;
  pauseOnInteraction?: boolean;
}

// Interactive model props
export interface InteractiveModelProps extends Base3DModelProps {
  onInteraction?: (intersectedObject?: THREE.Object3D) => void;
  highlightOnHover?: boolean;
  interactiveDistance?: number;
}

// Skills model specific props
export interface SkillsModelProps extends AnimatedModelProps, InteractiveModelProps {
  skills?: {
    name: string;
    category: string;
    icon?: string;
    color?: string;
    level?: number;
  }[];
  activeCategory?: string;
  onCategoryHover?: (category: string | null) => void;
}

// Code model specific props
export interface CodeModelProps extends AnimatedModelProps {
  codeSnippets?: string[];
  theme?: "dark" | "light";
  language?: string;
}

// Generic Component Provider interface for 3D models
export interface ModelComponentProps<T extends Base3DModelProps> {
  modelImplementation: new () => Base3DModel;
  modelProps: T;
  children?: ReactNode;
  fallback?: ReactNode;
}

// Model Factory interface for creating models
export interface ModelFactory {
  createModel(type: string, props: Base3DModelProps): Base3DModel;
  registerModel(type: string, modelClass: new () => Base3DModel): void;
}

// Configuration interface for model initialization
export interface ModelConfig {
  pixelRatio?: number;
  antialias?: boolean;
  alpha?: boolean;
  shadows?: boolean;
  lights?: {
    ambient?: {
      color?: number;
      intensity?: number;
    };
    directional?: {
      color?: number;
      intensity?: number;
      position?: [number, number, number];
      castShadow?: boolean;
    }[];
    point?: {
      color?: number;
      intensity?: number;
      position?: [number, number, number];
      distance?: number;
      decay?: number;
    }[];
  };
  camera?: {
    fov?: number;
    near?: number;
    far?: number;
    position?: [number, number, number];
  };
  performance?: {
    lowPerformanceMode?: boolean;
    maxParticleCount?: number;
    reduceGeometryDetail?: boolean;
  };
} 