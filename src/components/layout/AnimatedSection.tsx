"use client";

import { ReactNode } from "react";
import { motion, Variants } from "framer-motion";
import BaseSection, { BaseSectionProps } from "./BaseSection";
import AnimatedText from "@/components/shared/AnimatedText";
import NeonText from "@/components/shared/NeonText";

// Extended props interface for AnimatedSection
export interface AnimatedSectionProps extends BaseSectionProps {
  animate?: boolean;
  titleAnimation?: "none" | "fade" | "word" | "letter" | "neon";
  contentAnimation?: "none" | "fade" | "stagger";
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
  once?: boolean;
  threshold?: number;
}

export default function AnimatedSection({ 
  id, 
  title, 
  children, 
  className = "",
  animate = true,
  titleAnimation = "neon",
  contentAnimation = "fade",
  direction = "up",
  delay = 0.3,
  duration = 0.7,
  once = true,
  threshold = 0.1,
  ...restProps
}: AnimatedSectionProps) {
  // Animation variants for the content
  const contentVariants: Variants = {
    hidden: {
      opacity: 0,
      y: direction === "up" ? 30 : direction === "down" ? -30 : 0,
      x: direction === "left" ? 30 : direction === "right" ? -30 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  // Title renderer with different animation options
  const renderTitle = () => {
    if (!title) return null;
    
    switch (titleAnimation) {
      case "none":
        return title;
      case "fade":
        return (
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {title}
          </motion.span>
        );
      case "word":
        return <AnimatedText text={title} type="word" />;
      case "letter":
        return <AnimatedText text={title} type="letter" staggerTime={0.02} />;
      case "neon":
        return (
          <NeonText 
            text={title} 
            glowColor="#FF00FF" 
            animateOnHover={true} 
            className="text-white"
          />
        );
      default:
        return title;
    }
  };

  // Render the content with or without animation
  const renderContent = () => {
    if (!animate || contentAnimation === "none") {
      return children;
    }

    if (contentAnimation === "stagger") {
      return (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once, amount: threshold, margin: "-100px" }}
          variants={{
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
              },
            },
            hidden: {
              opacity: 0,
            },
          }}
        >
          {children}
        </motion.div>
      );
    }

    // Default fade animation
    return (
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once, amount: threshold, margin: "-100px" }}
        variants={contentVariants}
      >
        {children}
      </motion.div>
    );
  };

  // Use the BaseSection component to maintain LSP
  return (
    <BaseSection
      id={id}
      className={className}
      {...restProps}
    >
      {title && (
        <h2 className="text-3xl md:text-4xl font-bold mb-12 relative inline-block">
          {renderTitle()}
          <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-gradient-to-r from-[#FF00FF] to-[#7B00FF]"></span>
        </h2>
      )}
      {renderContent()}
    </BaseSection>
  );
} 