"use client";

import { ReactNode } from "react";
import { motion, Variants } from "framer-motion";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
  duration?: number;
  once?: boolean;
  threshold?: number;
}

export default function AnimatedSection({
  children,
  className = "",
  delay = 0.3,
  direction = "up",
  distance = 50,
  duration = 0.5,
  once = true,
  threshold = 0.1
}: AnimatedSectionProps) {
  const getDirectionOffset = (): { x: number; y: number } => {
    switch (direction) {
      case "up":
        return { x: 0, y: distance };
      case "down":
        return { x: 0, y: -distance };
      case "left":
        return { x: distance, y: 0 };
      case "right":
        return { x: -distance, y: 0 };
      default:
        return { x: 0, y: distance };
    }
  };

  const offset = getDirectionOffset();

  const variants: Variants = {
    hidden: {
      opacity: 0,
      x: offset.x,
      y: offset.y,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1], // Cubic bezier for smooth easing
      },
    },
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, threshold }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
} 