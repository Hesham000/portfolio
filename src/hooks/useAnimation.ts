"use client";

import { useReducedMotion } from "framer-motion";
import { 
  CombinedAnimationProps, 
  ANIMATION_PRESETS, 
  ViewportOptions,
  AnimationDirection
} from "@/types/animation";

// Interface Segregation - creating small, focused interfaces for animation variants
interface AnimationVariants {
  hidden: Record<string, any>;
  visible: Record<string, any>;
}

interface AnimationConfig {
  variants: AnimationVariants;
  initial: string;
  animate?: string;
  whileInView?: string;
  viewport?: ViewportOptions;
  transition?: Record<string, any>;
}

// Customizable hook that follows ISP by creating focused animation presets
export function useAnimation(
  preset: keyof typeof ANIMATION_PRESETS | "custom" = "fadeIn",
  options: {
    customAnimation?: CombinedAnimationProps;
    direction?: AnimationDirection;
    distance?: number;
    duration?: number;
    delay?: number;
    ease?: number[];
    shouldAnimate?: boolean;
    viewport?: ViewportOptions;
    useWhileInView?: boolean;
  } = {}
): AnimationConfig {
  const prefersReducedMotion = useReducedMotion();
  
  const {
    customAnimation,
    direction = "up",
    distance = 30,
    duration = 0.7,
    delay = 0,
    ease = [0.25, 0.1, 0.25, 1],
    shouldAnimate = true,
    viewport = { once: true, threshold: 0.2 },
    useWhileInView = true
  } = options;
  
  // Don't animate if user prefers reduced motion
  if (prefersReducedMotion || !shouldAnimate) {
    return {
      variants: {
        hidden: { opacity: 1 },
        visible: { opacity: 1 }
      },
      initial: "visible",
    };
  }
  
  // Build animation variants
  let animationProps: CombinedAnimationProps;
  
  if (preset === "custom" && customAnimation) {
    animationProps = customAnimation;
  } else if (ANIMATION_PRESETS[preset]) {
    animationProps = ANIMATION_PRESETS[preset];
    
    // Allow overriding specific properties from the preset
    if (options.direction && animationProps.movement) {
      animationProps.movement.direction = options.direction;
    }
    
    if (options.distance && animationProps.movement) {
      animationProps.movement.distance = options.distance;
    }
    
    if (options.duration) {
      Object.values(animationProps).forEach(prop => {
        if (prop && 'duration' in prop) {
          prop.duration = options.duration;
        }
      });
    }
    
    if (options.delay) {
      Object.values(animationProps).forEach(prop => {
        if (prop && 'delay' in prop) {
          prop.delay = options.delay;
        }
      });
    }
    
    if (options.ease) {
      Object.values(animationProps).forEach(prop => {
        if (prop && 'ease' in prop) {
          prop.ease = options.ease;
        }
      });
    }
  } else {
    // Default to fadeIn if preset not found
    animationProps = ANIMATION_PRESETS.fadeIn;
  }
  
  // Construct variant objects
  const hidden: Record<string, any> = {};
  const visible: Record<string, any> = {};
  const transition: Record<string, any> = {};
  
  // Add fade properties
  if (animationProps.fade) {
    hidden.opacity = animationProps.fade.initial ?? 0;
    visible.opacity = animationProps.fade.target ?? 1;
    transition.duration = animationProps.fade.duration ?? duration;
    transition.delay = animationProps.fade.delay ?? delay;
    transition.ease = animationProps.fade.ease ?? ease;
  }
  
  // Add movement properties
  if (animationProps.movement) {
    const dir = animationProps.movement.direction ?? direction;
    const dist = animationProps.movement.distance ?? distance;
    
    if (dir === "up") {
      hidden.y = dist;
      visible.y = 0;
    } else if (dir === "down") {
      hidden.y = -dist;
      visible.y = 0;
    } else if (dir === "left") {
      hidden.x = dist;
      visible.x = 0;
    } else if (dir === "right") {
      hidden.x = -dist;
      visible.x = 0;
    }
  }
  
  // Add scale properties
  if (animationProps.scale) {
    hidden.scale = animationProps.scale.initialScale ?? 0.8;
    visible.scale = animationProps.scale.targetScale ?? 1;
  }
  
  // Add rotation properties
  if (animationProps.rotation) {
    hidden.rotate = animationProps.rotation.initialRotation ?? 0;
    visible.rotate = animationProps.rotation.targetRotation ?? 0;
  }
  
  // Add transition to visible
  visible.transition = transition;
  
  // Add stagger properties if needed
  if (animationProps.stagger) {
    visible.transition = {
      ...transition,
      staggerChildren: animationProps.stagger.staggerChildren ?? 0.1,
      delayChildren: animationProps.stagger.delayChildren ?? 0,
    };
  }
  
  return {
    variants: { hidden, visible },
    initial: "hidden",
    ...(useWhileInView 
      ? { whileInView: "visible", viewport } 
      : { animate: "visible" }),
  };
} 