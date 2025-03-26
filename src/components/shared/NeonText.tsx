"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface NeonTextProps {
  text: string;
  className?: string;
  glowColor?: string;
  textColor?: string;
  animateOnHover?: boolean;
  flickerIntensity?: number;
  delay?: number;
}

export default function NeonText({
  text,
  className = "",
  glowColor = "#FF00FF",
  textColor = "#FFFFFF",
  animateOnHover = false,
  flickerIntensity = 0.8,
  delay = 0
}: NeonTextProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Prevent hydration error by checking if we're on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  const glowVariants = {
    initial: {
      textShadow: `0 0 7px ${glowColor}00, 0 0 10px ${glowColor}00, 0 0 21px ${glowColor}00`,
      color: textColor,
    },
    animate: {
      textShadow: `0 0 7px ${glowColor}, 0 0 10px ${glowColor}, 0 0 21px ${glowColor}`,
      color: textColor,
      transition: {
        delay: delay,
        duration: 0.8,
        ease: "easeInOut",
      },
    },
    hover: {
      textShadow: `0 0 7px ${glowColor}, 0 0 10px ${glowColor}, 0 0 21px ${glowColor}, 0 0 42px ${glowColor}`,
      color: textColor,
    },
    flicker: {
      textShadow: [
        `0 0 4px ${glowColor}`,
        `0 0 11px ${glowColor}`,
        `0 0 19px ${glowColor}`,
        `0 0 4px ${glowColor}`,
      ],
      transition: {
        duration: 0.1,
        repeat: Infinity,
        repeatType: "loop" as const,
        repeatDelay: 0.5,
      },
    },
  };

  if (!isClient) return null;

  return (
    <motion.span
      className={`inline-block font-medium ${className}`}
      initial="initial"
      animate="animate"
      variants={glowVariants}
      whileHover={animateOnHover ? "hover" : undefined}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {isHovered && animateOnHover ? (
        <motion.span
          variants={glowVariants}
          animate="flicker"
          className="inline-block"
        >
          {text}
        </motion.span>
      ) : (
        text
      )}
    </motion.span>
  );
} 