// Interface Segregation Principle - small, focused interfaces

// Base animation properties shared by many animation types
export interface BaseAnimationProps {
  duration?: number;
  delay?: number;
  ease?: string | number[];
}

// Fade animation properties
export interface FadeAnimationProps extends BaseAnimationProps {
  initial?: number;
  target?: number;
}

// Movement direction options
export type AnimationDirection = "up" | "down" | "left" | "right";

// Movement animation properties 
export interface MovementAnimationProps extends BaseAnimationProps {
  direction?: AnimationDirection;
  distance?: number;
}

// Scale animation properties
export interface ScaleAnimationProps extends BaseAnimationProps {
  initialScale?: number;
  targetScale?: number;
}

// Rotation animation properties
export interface RotationAnimationProps extends BaseAnimationProps {
  initialRotation?: number;
  targetRotation?: number;
  rotationUnit?: "deg" | "turn";
}

// Stagger animation for children
export interface StaggerAnimationProps extends BaseAnimationProps {
  staggerChildren?: number;
  delayChildren?: number;
}

// Combined interface for common animations
export interface CombinedAnimationProps {
  fade?: FadeAnimationProps;
  movement?: MovementAnimationProps;
  scale?: ScaleAnimationProps;
  rotation?: RotationAnimationProps;
  stagger?: StaggerAnimationProps;
}

// Animation variants for different title animations
export type TitleAnimationVariant = "none" | "fade" | "word" | "letter" | "neon";

// Animation variants for content animations
export type ContentAnimationVariant = "none" | "fade" | "stagger";

// Interface for view transition options
export interface ViewportOptions {
  once?: boolean;
  threshold?: number;
  margin?: string;
}

// Animation presets for common combinations
export const ANIMATION_PRESETS = {
  fadeIn: {
    fade: {
      initial: 0,
      target: 1,
      duration: 0.7,
      ease: [0.25, 0.1, 0.25, 1]
    }
  },
  fadeInUp: {
    fade: {
      initial: 0,
      target: 1,
      duration: 0.7,
      ease: [0.25, 0.1, 0.25, 1]
    },
    movement: {
      direction: "up" as AnimationDirection,
      distance: 30,
      duration: 0.7,
      ease: [0.25, 0.1, 0.25, 1]
    }
  },
  scaleIn: {
    scale: {
      initialScale: 0.8,
      targetScale: 1,
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1]
    }
  },
  staggerChildren: {
    stagger: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
      duration: 0.5
    }
  }
}; 