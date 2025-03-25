"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Github, Linkedin, Twitter, Mail, ArrowRight } from "lucide-react";

export default function SplashScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
      setShowContent(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleEnter = () => {
    router.push("/home");
  };

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF00FF]/10 to-[#7B00FF]/10" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        
        {/* Animated Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: 0,
              opacity: 0,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Loading Animation */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="relative">
              <motion.div
                className="w-24 h-24 rounded-full border-4 border-[#FF00FF]"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-[#7B00FF]"
                animate={{
                  scale: [1.2, 1, 1.2],
                  rotate: [360, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative h-full flex flex-col items-center justify-center p-8"
          >
            {/* Title */}
            <motion.h1
              className="text-6xl md:text-8xl font-bold text-white mb-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF00FF] to-[#7B00FF]">
                Welcome
              </span>
              <br />
              <span className="text-4xl md:text-6xl text-gray-300">to my portfolio</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              className="text-xl text-gray-400 text-center max-w-2xl mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Explore my creative journey through code, design, and innovation.
              Let's build something amazing together.
            </motion.p>

            {/* Interactive Button */}
            <motion.button
              onClick={handleEnter}
              className="group relative px-8 py-4 bg-gradient-to-r from-[#FF00FF] to-[#7B00FF] rounded-xl text-white font-medium overflow-hidden"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Enter Portfolio
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <motion.div
                className="absolute inset-0 bg-white/20"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.5 }}
              />
            </motion.button>

            {/* Social Links */}
            <motion.div
              className="absolute bottom-8 left-8 flex gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              {[
                { icon: Github, href: "https://github.com/yourusername", label: "GitHub" },
                { icon: Linkedin, href: "https://linkedin.com/in/yourusername", label: "LinkedIn" },
                { icon: Twitter, href: "https://twitter.com/yourusername", label: "Twitter" },
                { icon: Mail, href: "mailto:your.email@example.com", label: "Email" }
              ].map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl bg-gray-800/50 backdrop-blur-md border border-gray-700/50 flex items-center justify-center text-gray-300 hover:text-white hover:border-[#FF00FF]/50 transition-colors"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + (index * 0.1) }}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon size={20} />
                </motion.a>
              ))}
            </motion.div>

            {/* Mouse Follow Effect */}
            <motion.div
              className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-[#FF00FF]/20 to-[#7B00FF]/20 blur-3xl pointer-events-none"
              animate={{
                x: mousePosition.x * 100,
                y: mousePosition.y * 100,
              }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 