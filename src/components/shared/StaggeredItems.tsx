"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface StaggeredItemsProps {
  children: ReactNode;
  className?: string;
  delayIncrement?: number;
  initialDelay?: number;
  staggerTime?: number;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
  duration?: number;
  once?: boolean;
  threshold?: number;
}

export default function StaggeredItems({
  children,
  className = "",
  initialDelay = 0.2,
  staggerTime = 0.1,
  direction = "up",
  distance = 30,
  duration = 0.5,
  once = true,
  threshold = 0.1
}: StaggeredItemsProps) {
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerTime,
        delayChildren: initialDelay,
      },
    },
  };

  const itemVariants = {
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
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  const childArray = Array.isArray(children) ? children : [children];

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: threshold }}
      variants={containerVariants}
    >
      {childArray.map((child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
} 