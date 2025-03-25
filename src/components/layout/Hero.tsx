"use client";

import Image from "next/image";
import CodeParticles from "@/components/3d/CodeParticles";
import { motion, useReducedMotion } from "framer-motion";
import AnimatedText from "@/components/shared/AnimatedText";
import NeonText from "@/components/shared/NeonText";
import { useMemo } from "react";

export default function Hero() {
  // Add support for reduced motion
  const prefersReducedMotion = useReducedMotion();
  
  // Memoize tools data to prevent recreating arrays on each render
  const toolsRow1 = useMemo(() => [
    "React", "TypeScript", "Next.js", "JavaScript", "Node.js", "HTML5", "CSS3", "TailwindCSS", "GraphQL", "MongoDB"
  ], []);
  
  const toolsRow2 = useMemo(() => [
    "AWS", "Docker", "Git", "Redux", "Framer Motion", "Express", "Figma", "PostgreSQL", "Firebase", "Jest"
  ], []);

  // Optimize animations for reduced motion preference
  const imageAnimations = prefersReducedMotion 
    ? { scale: 1, y: 0 } 
    : { 
        scale: 1,
        rotate: [3, -3, 3],
        y: 0 
      };
      
  const marqueeAnimation1 = prefersReducedMotion
    ? {} 
    : { x: [0, '-100%'] };
    
  const marqueeAnimation2 = prefersReducedMotion
    ? {} 
    : { x: ['-100%', 0] };

  return (
    <section 
      id="hero" 
      className="min-h-screen w-full flex flex-col items-center justify-center pt-[60px] relative overflow-hidden"
    >
      {/* Modern dark background with subtle gradients */}
      <div className="absolute inset-0 bg-[#0a0a18] z-0">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0f0f24] to-[#0a0a18] opacity-80"></div>
        
        {/* Dark mesh grid */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `linear-gradient(rgba(123, 0, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(123, 0, 255, 0.05) 1px, transparent 1px)`,
            backgroundSize: '70px 70px'
          }}
        ></div>
        
        {/* Radial gradient in corner */}
        <div className="absolute -top-[30%] -right-[20%] w-[70%] h-[70%] bg-[#FF00FF]/5 blur-[120px] rounded-full"></div>
        <div className="absolute -bottom-[40%] -left-[30%] w-[80%] h-[80%] bg-[#7B00FF]/5 blur-[150px] rounded-full"></div>
      </div>
      
      {/* 3D Code Particles Background - with reduced particle count */}
      <CodeParticles className="opacity-20 z-0" />
      
      <div className="container mx-auto max-w-[1200px] px-6 md:px-12 flex flex-col md:flex-row items-center justify-between relative z-10">
        <motion.div 
          className="text-white max-w-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            ease: "easeOut"
          }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="block">
              <AnimatedText text="Hi, I'm Devon" type="word" delay={0.3} staggerTime={0.05} />
            </span>
            <span className="block mt-2">
              <NeonText 
                text="Full Stack Developer" 
                glowColor="#FF00FF"
                delay={0.6}
                className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF00FF] to-[#7B00FF]"
              />
            </span>
          </h1>
          <motion.p 
            className="text-lg md:text-xl mb-8 text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            I build exceptional and accessible digital experiences for the web.
          </motion.p>
          <motion.div 
            className="flex space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.8 }}
          >
            <motion.button 
              className="bg-gradient-to-r from-[#FF00FF] to-[#7B00FF] text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity will-change-transform"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              View Projects
            </motion.button>
            <motion.button 
              className="border-2 border-[#FF00FF] text-white px-6 py-3 rounded-full font-medium hover:bg-[#FF00FF]/10 transition-colors will-change-transform"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              About Me
            </motion.button>
          </motion.div>
        </motion.div>
        
        {/* Enhanced profile image with simplified geometric shapes */}
        <div className="relative w-72 h-72 md:w-96 md:h-96 mt-16 md:mt-0 perspective">
          {/* Simplified background shapes - reduced number and complexity */}
          {prefersReducedMotion ? null : (
            <>
              <motion.div 
                className="absolute -top-10 -left-10 w-32 h-32 rotate-45 bg-gradient-to-br from-[#7B00FF]/30 to-transparent rounded-lg backdrop-blur-sm z-0 will-change-transform"
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: 1, rotate: 45 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
              
              <motion.div 
                className="absolute -right-5 top-1/4 w-36 h-36 bg-gradient-to-tl from-[#FF00FF]/30 to-transparent rounded-full backdrop-blur-sm z-0 will-change-transform"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              />
            </>
          )}
          
          {/* Glowing outer ring with simplified animation */}
          <motion.div 
            className="absolute left-1/2 top-1/2 w-64 h-64 md:w-80 md:h-80 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0_0_25px_12px_rgba(123,0,255,0.3)] will-change-transform"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          />
          
          {/* Image container with main border */}
          <motion.div 
            className="relative w-56 h-56 md:w-64 md:h-64 mx-auto rounded-2xl overflow-hidden z-10 rotate-3 will-change-transform translate-z-0"
            initial={{ scale: 0.8, rotate: -5, y: 30 }}
            animate={imageAnimations}
            transition={{
              duration: 0.6,
              delay: 0.4,
              rotate: {
                duration: 12,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut"
              }
            }}
            whileHover={{ 
              scale: 1.05
            }}
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF00FF]/80 to-[#7B00FF]/80 z-0" />
            
            {/* Image frame with inner border */}
            <div className="absolute inset-[3px] overflow-hidden rounded-xl z-10">
              <div className="absolute inset-0 bg-black opacity-20 z-0" />
              <Image 
                src="https://picsum.photos/id/1/400/400" 
                alt="Devon Lane" 
                fill 
                sizes="(max-width: 768px) 224px, 256px"
                className="object-cover object-center z-10 grayscale-[30%] hover:grayscale-0 transition-all duration-500"
                priority
              />
              
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-white/20 rounded-tl-lg z-20" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-white/20 rounded-tr-lg z-20" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-white/20 rounded-bl-lg z-20" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-white/20 rounded-br-lg z-20" />
            </div>
          </motion.div>
          
          {/* Tech symbols - reduced to just one for better performance */}
          {prefersReducedMotion ? null : (
            <motion.div 
              className="absolute -top-2 -right-2 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center z-20 text-lg font-mono border border-[#FF00FF]/30 will-change-transform"
              animate={{ 
                y: [0, -10, 0],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "loop"
              }}
            >
              <span className="text-[#FF00FF]">{'<>'}</span>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Optimized Tools Marquee Section */}
      <motion.div 
        className="w-full mt-16 md:mt-8 relative z-10 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.9 }}
      >
        {/* Top highlight glow line - static */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#FF00FF]/30 to-transparent"></div>
        
        {/* Bottom highlight glow line - static */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#7B00FF]/30 to-transparent"></div>
        
        {/* Enhanced left and right fading edges */}
        <div className="absolute left-0 top-0 w-40 h-full bg-gradient-to-r from-black via-black/80 to-transparent z-10"></div>
        <div className="absolute right-0 top-0 w-40 h-full bg-gradient-to-l from-black via-black/80 to-transparent z-10"></div>
        
        {/* First row marquee - optimized */}
        <div className="py-5 bg-gradient-to-r from-black/50 via-black/30 to-black/50 relative backdrop-filter backdrop-blur-md">
          <motion.div 
            className="flex whitespace-nowrap will-change-transform translate-z-0"
            animate={marqueeAnimation1}
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              duration: prefersReducedMotion ? 0 : 60,
              ease: "linear",
            }}
          >
            {/* Reduced repetition of rows, using more efficient React key structure */}
            {[...toolsRow1, ...toolsRow1].map((tool, index) => (
              <div
                key={`row1-${index}`}
                className="flex items-center mr-12"
              >
                <div 
                  className="flex items-center rounded-full px-4 py-2 bg-[#0A0A0A] border border-[#FF00FF]/10 shadow-md hover:shadow-[#FF00FF]/20 hover:border-[#FF00FF]/40 hover:bg-black transition-all duration-300 group"
                >
                  <div 
                    className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#FF00FF] to-[#7B00FF] mr-2.5 group-hover:scale-125 transition-transform"
                  />
                  <span className="text-white/90 text-base font-medium group-hover:text-white transition-colors">{tool}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
        
        {/* Simple divider - static */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#FF00FF]/20 to-transparent" />
        
        {/* Second row marquee - optimized */}
        <div className="py-5 bg-gradient-to-r from-black/50 via-black/30 to-black/50 relative backdrop-filter backdrop-blur-md">
          <motion.div 
            className="flex whitespace-nowrap will-change-transform translate-z-0"
            animate={marqueeAnimation2}
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              duration: prefersReducedMotion ? 0 : 55,
              ease: "linear",
            }}
          >
            {/* Reduced repetition of rows */}
            {[...toolsRow2, ...toolsRow2].map((tool, index) => (
              <div
                key={`row2-${index}`}
                className="flex items-center mr-12"
              >
                <div 
                  className="flex items-center rounded-full px-4 py-2 bg-[#0A0A0A] border border-[#7B00FF]/10 shadow-md hover:shadow-[#7B00FF]/20 hover:border-[#7B00FF]/40 hover:bg-black transition-all duration-300 group"
                >
                  <div 
                    className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#7B00FF] to-[#FF00FF] mr-2.5 group-hover:scale-125 transition-transform"
                  />
                  <span className="text-white/90 text-base font-medium group-hover:text-white transition-colors">{tool}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
} 