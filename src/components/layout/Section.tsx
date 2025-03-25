"use client";

import { ReactNode } from "react";
import { motion, Variants } from "framer-motion";
import AnimatedText from "@/components/shared/AnimatedText";
import NeonText from "@/components/shared/NeonText";

interface SectionProps {
  id: string;
  title: string;
  children: ReactNode;
  className?: string;
  animate?: boolean;
  titleAnimation?: "none" | "fade" | "word" | "letter" | "neon";
  contentAnimation?: "none" | "fade" | "stagger";
  direction?: "up" | "down" | "left" | "right";
}

export default function Section({ 
  id, 
  title, 
  children, 
  className = "",
  animate = true,
  titleAnimation = "neon",
  contentAnimation = "fade",
  direction = "up"
}: SectionProps) {
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
        duration: 0.7,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  // Title renderer with different animation options
  const renderTitle = () => {
    switch (titleAnimation) {
      case "none":
        return (
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 relative inline-block">
            {title}
            <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-gradient-to-r from-[#FF00FF] to-[#7B00FF]"></span>
          </h2>
        );
      case "fade":
        return (
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-white mb-12 relative inline-block"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {title}
            <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-gradient-to-r from-[#FF00FF] to-[#7B00FF]"></span>
          </motion.h2>
        );
      case "word":
        return (
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 relative inline-block">
            <AnimatedText text={title} type="word" />
            <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-gradient-to-r from-[#FF00FF] to-[#7B00FF]"></span>
          </h2>
        );
      case "letter":
        return (
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 relative inline-block">
            <AnimatedText text={title} type="letter" staggerTime={0.02} />
            <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-gradient-to-r from-[#FF00FF] to-[#7B00FF]"></span>
          </h2>
        );
      case "neon":
        return (
          <h2 className="text-3xl md:text-4xl font-bold mb-12 relative inline-block">
            <NeonText 
              text={title} 
              glowColor="#FF00FF" 
              animateOnHover={true} 
              className="text-white"
            />
            <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-gradient-to-r from-[#FF00FF] to-[#7B00FF]"></span>
          </h2>
        );
      default:
        return (
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 relative inline-block">
            {title}
            <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-gradient-to-r from-[#FF00FF] to-[#7B00FF]"></span>
          </h2>
        );
    }
  };

  // Render the content with or without animation
  const renderContent = () => {
    if (!animate || contentAnimation === "none") {
      return children;
    }

    if (contentAnimation === "stagger") {
      // This is a simplified approach; for true staggered children,
      // StaggeredItems component should be used within the child components
      return (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
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
        viewport={{ once: true, margin: "-100px" }}
        variants={contentVariants}
      >
        {children}
      </motion.div>
    );
  };

  return (
    <section 
      id={id}
      className={`w-full py-20 bg-black ${className}`}
    >
      <div className="container mx-auto max-w-[1200px] px-6 md:px-12">
        {renderTitle()}
        {renderContent()}
      </div>
    </section>
  );
} 