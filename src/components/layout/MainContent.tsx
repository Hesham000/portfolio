"use client";

import { ReactNode } from "react";
import { useSplash } from "@/context/SplashContext";
import { motion } from "framer-motion";

interface MainContentProps {
  children: ReactNode;
}

export default function MainContent({ children }: MainContentProps) {
  const { splashComplete } = useSplash();
  
  if (!splashComplete) {
    // Don't render anything if splash screen is still active
    return null;
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="min-h-screen flex flex-col"
    >
      {children}
    </motion.div>
  );
} 