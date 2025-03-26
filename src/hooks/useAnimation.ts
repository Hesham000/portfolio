"use client";

import { useReducedMotion } from "framer-motion";
import { 
  CombinedAnimationProps, 
  ANIMATION_PRESETS, 
  AnimationDirection
} from "@/types/animation";
import { useScroll, useTransform, useSpring, useMotionValue, useVelocity, useAnimationFrame } from "framer-motion";
import { useEffect } from "react";

// Interface Segregation - creating small, focused interfaces for animation variants
interface AnimationVariants {
  hidden: Record<string, number | string>;
  visible: Record<string, number | string>;
}

interface AnimationConfig {
  stiffness?: number;
  damping?: number;
  mass?: number;
}

interface ScrollConfig {
  offset?: number;
  smooth?: boolean;
  stiffness?: number;
  damping?: number;
}

interface ParallaxConfig {
  offset?: number;
  speed?: number;
  stiffness?: number;
  damping?: number;
}

interface SpringConfig {
  stiffness?: number;
  damping?: number;
  mass?: number;
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
    useWhileInView = true
  } = options;
  
  // Don't animate if user prefers reduced motion
  if (prefersReducedMotion || !shouldAnimate) {
    return {
      stiffness: 100,
      damping: 30,
      mass: 1
    };
  }
  
  // Build animation variants
  let animationProps: CombinedAnimationProps;
  
  if (preset === "custom" && customAnimation) {
    animationProps = customAnimation;
  } else if (preset !== "custom" && ANIMATION_PRESETS[preset]) {
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
  const hidden: Record<string, number | string> = {};
  let visible: Record<string, any> = {};
  const transition: Record<string, number | number[] | string> = {};
  
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
  
  // Add properties to visible state
  Object.entries(hidden).forEach(([key, value]) => {
    if (typeof value === "number") {
      visible[key] = 0;
    } else if (Array.isArray(value)) {
      visible[key] = value.map(() => 0);
    }
  });

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
    stiffness: 100,
    damping: 30,
    mass: 1
  };
}

export function useScrollAnimation(config: AnimationConfig = {}) {
  const { stiffness = 100, damping = 30, mass = 1 } = config;
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [x, y]);

  const springX = useSpring(x, { stiffness, damping, mass });
  const springY = useSpring(y, { stiffness, damping, mass });

  return { x: springX, y: springY };
}

export function useScrollParallax(config: ScrollConfig = {}) {
  const { offset = 0, stiffness = 100, damping = 30 } = config;
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, offset]);
  const springY = useSpring(y, { stiffness, damping });

  return config.smooth === false ? y : springY;
}

export function useParallax(config: ParallaxConfig = {}) {
  const { offset = 50, speed = 1, stiffness = 100, damping = 30 } = config;
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, offset * speed]);

  return useSpring(y, { stiffness, damping });
}

export function useSpringAnimation(config: SpringConfig = {}) {
  const { stiffness = 100, damping = 30, mass = 1 } = config;
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness, damping, mass });
  const springY = useSpring(y, { stiffness, damping, mass });

  return { x: springX, y: springY };
}

export function useVelocityAnimation() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const velocityX = useVelocity(x);
  const velocityY = useVelocity(y);

  useAnimationFrame((t) => {
    x.set(Math.sin(t / 1000) * 100);
    y.set(Math.cos(t / 1000) * 100);
  });

  return { x: velocityX, y: velocityY };
} 