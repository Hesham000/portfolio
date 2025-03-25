"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import NeonText from "../shared/NeonText";
import { Terminal, Code2, Brain, Bot, Server, Cpu, GitBranch, TerminalSquare } from "lucide-react";
import { useSplash } from "@/context/SplashContext";

// Extracted animation constants for better maintainability
const ANIMATIONS = {
  rotate: {
    animate: { rotate: [0, 360] },
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: "linear"
    }
  },
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  },
  progressBar: {
    initial: { width: "0%" },
    transition: { ease: "easeInOut" }
  },
  exitAnimation: {
    initial: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.8, ease: [0.65, 0, 0.35, 1] }
  }
};

// Loading phrases data separated from component logic
const LOADING_PHRASES = [
  "Initializing development environment...",
  "Compiling neural networks...",
  "Connecting to creative servers...",
  "Optimizing algorithms...",
  "Building virtual interfaces...",
  "Synchronizing AI modules...",
  "Rendering experience...",
];

// Custom hook for loading logic (SRP)
function useLoading() {
  const { setIsLoading } = useSplash();
  const [progress, setProgress] = useState(0);
  const [showText, setShowText] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [showFinalMessage, setShowFinalMessage] = useState(false);

  useEffect(() => {
    // Start showing text after a small delay
    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 800);

    // Progress counter
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 1;
        
        // Update loading phase based on progress
        const phaseIndex = Math.floor((newProgress / 100) * LOADING_PHRASES.length);
        if (phaseIndex < LOADING_PHRASES.length && phaseIndex !== currentPhase) {
          setCurrentPhase(phaseIndex);
        }
        
        // Show final message at 90%
        if (newProgress >= 90 && !showFinalMessage) {
          setShowFinalMessage(true);
        }

        // Complete loading at 100%
        if (newProgress >= 100) {
          clearInterval(timer);
          
          // Small delay before removing splash screen
          setTimeout(() => {
            setIsLoading(false);
          }, 1000);
          
          return 100;
        }
        
        return newProgress;
      });
    }, 40); // Adjust speed of progress here

    return () => {
      clearTimeout(textTimer);
      clearInterval(timer);
    };
  }, [currentPhase, showFinalMessage, setIsLoading]);

  return {
    progress,
    showText,
    currentPhase,
    showFinalMessage
  };
}

// Separate component for CircuitLines (SRP)
function CircuitLines() {
  return (
    <svg 
      className="absolute inset-0 w-full h-full" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke="var(--primary)" strokeWidth="0.5" fill="none">
        <path 
          d="M100,100 C150,50 200,200 250,150 C300,100 350,250 400,200" 
          className="splash-circuit"
        />
        <path 
          d="M500,200 C450,150 400,300 350,250 C300,200 250,350 200,300" 
          className="splash-circuit"
          style={{ animationDelay: '0.5s' }}
        />
        <path 
          d="M200,400 C250,350 300,500 350,450 C400,400 450,550 500,500" 
          className="splash-circuit"
          style={{ animationDelay: '1s' }}
        />
        <path 
          d="M600,300 C550,250 500,400 450,350 C400,300 350,450 300,400" 
          className="splash-circuit"
          style={{ animationDelay: '1.5s' }}
        />
      </g>
    </svg>
  );
}

// Separate component for background (SRP)
function SplashBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `linear-gradient(rgba(123, 0, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(123, 0, 255, 0.05) 1px, transparent 1px)`,
          backgroundSize: '70px 70px'
        }}
      />
      
      <CircuitLines />
      
      {/* Glowing orbs at corners */}
      <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-[#FF00FF]/5 blur-[120px] rounded-full"></div>
      <div className="absolute -bottom-[30%] -left-[20%] w-[60%] h-[60%] bg-[#7B00FF]/5 blur-[150px] rounded-full"></div>
    </div>
  );
}

// Separate component for the tech icons ring (SRP)
function TechIconsRing() {
  const techIcons = [Terminal, Code2, Brain, Bot, Server, Cpu, GitBranch, TerminalSquare];
  
  return (
    <div className="relative w-44 h-44">
      <motion.div 
        className="absolute inset-0 flex items-center justify-center"
        animate={ANIMATIONS.rotate.animate}
        transition={ANIMATIONS.rotate.transition}
      >
        {techIcons.map((Icon, index) => {
          const angle = (index / techIcons.length) * 2 * Math.PI;
          const radius = 72;
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);
          
          return (
            <motion.div
              key={index}
              className="absolute"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                x: x,
                y: y 
              }}
              transition={{
                duration: 0.5,
                delay: 0.2 + (index * 0.1),
              }}
            >
              <Icon 
                className={`text-[#FF00FF] h-8 w-8 opacity-80`} 
                strokeWidth={1.5}
              />
            </motion.div>
          );
        })}
      </motion.div>
      
      {/* Central AI brain image */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0, rotate: -30 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
      >
        <div className="relative h-24 w-24">
          <Brain 
            className="text-white h-24 w-24"
            strokeWidth={0.5}
          />
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ 
              opacity: [0.5, 1, 0.5],
              filter: ["blur(2px)", "blur(1px)", "blur(2px)"]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#FF00FF]/40 to-[#7B00FF]/40 blur-sm" />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

// Separate component for loading progress indicator (SRP)
function LoadingProgress({ progress }: { progress: number }) {
  return (
    <div className="w-full max-w-md relative">
      <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-[#7B00FF] to-[#FF00FF]"
          initial={ANIMATIONS.progressBar.initial}
          animate={{ width: `${progress}%` }}
          transition={ANIMATIONS.progressBar.transition}
        />
      </div>
      <motion.p 
        className="text-gray-400 text-xs font-mono mt-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Loading: {progress}%
      </motion.p>
    </div>
  );
}

// Separate component for loading text (SRP)
function LoadingText({ showText, currentPhase }: { showText: boolean; currentPhase: number }) {
  return (
    <AnimatePresence mode="wait">
      {showText && (
        <motion.div
          className="text-center space-y-4"
          {...ANIMATIONS.fadeIn}
        >
          <NeonText
            text="DEV.AI STUDIO"
            className="text-3xl md:text-4xl font-bold tracking-wider"
            glowColor="#FF00FF"
          />
          
          <motion.div 
            className="h-14 overflow-hidden"
            initial={{ height: 0 }}
            animate={{ height: "3.5rem" }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={currentPhase}
                className="text-gray-400 text-sm md:text-base font-mono"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {LOADING_PHRASES[currentPhase]}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Separate component for final message (SRP)
function FinalMessage({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="absolute bottom-10 text-center"
          {...ANIMATIONS.fadeIn}
        >
          <p className="text-white text-sm md:text-base">
            <span className="text-[#FF00FF]">Ready</span> to explore a world of creative development
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Main component with proper composition
export default function SplashScreen() {
  const { isLoading } = useSplash();
  const { progress, showText, currentPhase, showFinalMessage } = useLoading();

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 bg-[#0a0a18] z-50 flex flex-col items-center justify-center splash-container"
          {...ANIMATIONS.exitAnimation}
        >
          <SplashBackground />
          
          {/* Main content container */}
          <div className="relative z-10 flex flex-col items-center justify-center space-y-6 px-6">
            <TechIconsRing />
            <LoadingText showText={showText} currentPhase={currentPhase} />
            <LoadingProgress progress={progress} />
            <FinalMessage show={showFinalMessage} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 