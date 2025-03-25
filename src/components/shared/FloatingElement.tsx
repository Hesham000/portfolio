"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface FloatingElementProps {
  children: ReactNode;
  className?: string;
  floatSpeed?: number;
  floatIntensity?: number;
  rotateSpeed?: number;
  rotateIntensity?: number;
  delay?: number;
}

export default function FloatingElement({
  children,
  className = "",
  floatSpeed = 3,
  floatIntensity = 10,
  rotateSpeed = 5,
  rotateIntensity = 3,
  delay = 0
}: FloatingElementProps) {
  // Floating animation
  const floatAnimation = {
    y: [
      -floatIntensity,
      floatIntensity,
      -floatIntensity
    ],
    transition: {
      y: {
        repeat: Infinity,
        duration: floatSpeed,
        ease: "easeInOut",
        delay: delay
      }
    }
  };

  // Rotation animation
  const rotateAnimation = {
    rotate: [
      -rotateIntensity,
      rotateIntensity,
      -rotateIntensity
    ],
    transition: {
      rotate: {
        repeat: Infinity,
        duration: rotateSpeed,
        ease: "easeInOut",
        delay: delay + 0.2
      }
    }
  };

  return (
    <motion.div
      className={className}
      animate={{
        ...floatAnimation,
        ...rotateAnimation
      }}
    >
      {children}
    </motion.div>
  );
} 