"use client";

import { motion } from "framer-motion";

interface AnimatedTextProps {
  text: string;
  className?: string;
  type?: "word" | "letter";
  staggerTime?: number;
  duration?: number;
  delay?: number;
  once?: boolean;
  threshold?: number;
}

export default function AnimatedText({
  text,
  className = "",
  type = "word",
  staggerTime = 0.03,
  duration = 0.5,
  delay = 0.3,
  once = true,
  threshold = 0.1
}: AnimatedTextProps) {
  // For word animation
  const words = text.split(" ");
  
  // For letter animation
  const letters = Array.from(text);

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { 
        staggerChildren: staggerTime, 
        delayChildren: delay,
        ease: [0.25, 0.1, 0.25, 1]
      },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: duration,
        ease: [0.25, 0.1, 0.25, 1]
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
    },
  };

  return (
    <motion.div
      className={`inline-block ${className}`}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, threshold }}
    >
      {type === "word" ? (
        <span className="inline-flex flex-wrap">
          {words.map((word, index) => (
            <motion.span
              key={index}
              variants={child}
              className="inline-block mr-1"
            >
              {word}&nbsp;
            </motion.span>
          ))}
        </span>
      ) : (
        <span className="inline-flex flex-wrap">
          {letters.map((letter, index) => (
            <motion.span
              key={index}
              variants={child}
              className="inline-block"
            >
              {letter === " " ? <span>&nbsp;</span> : letter}
            </motion.span>
          ))}
        </span>
      )}
    </motion.div>
  );
} 