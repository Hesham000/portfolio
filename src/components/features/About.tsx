"use client";

import { useEffect, useState } from "react";
import Section from "@/components/layout/Section";
import { motion, useScroll, useTransform } from "framer-motion";
import FloatingElement from "@/components/shared/FloatingElement";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";

export default function About() {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.2], [50, 0]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Section 
      id="about" 
      title="About Me"
      titleAnimation="letter"
      contentAnimation="fade"
      direction="up"
    >
      <div className="flex flex-col lg:flex-row items-center gap-12">
        {/* Left side - 3D Avatar */}
        <div className="lg:w-1/3 flex justify-center">
          <FloatingElement
            floatIntensity={1.5}
            floatSpeed={2.5}
            rotateIntensity={0.2}
            rotateSpeed={1}
          >
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-[#FF00FF]/20 to-[#7B00FF]/20 blur-2xl opacity-40" />
              <div className="relative w-[280px] h-[280px] rounded-full overflow-hidden border-2 border-[#FF00FF]/20">
                <div className="absolute inset-0 bg-gradient-to-br from-[#7B00FF] to-[#FF00FF] opacity-20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 rounded-full bg-gradient-to-br from-[#FF00FF] to-[#7B00FF] flex items-center justify-center text-white text-4xl font-bold">
                    H
                  </div>
                </div>
                {/* Animated rings */}
                <div className="absolute inset-0 rounded-full border border-[#FF00FF]/30 animate-spin-slow" 
                     style={{ width: '320px', height: '320px', left: 'calc(50% - 160px)', top: 'calc(50% - 160px)' }} />
                <div className="absolute inset-0 rounded-full border border-[#7B00FF]/30 animate-spin-reverse-slow" 
                     style={{ width: '340px', height: '340px', left: 'calc(50% - 170px)', top: 'calc(50% - 170px)' }} />
              </div>
            </motion.div>
          </FloatingElement>
        </div>

        {/* Right side - Content */}
        <div className="lg:w-2/3">
          <motion.div 
            className="relative pl-0 md:pl-6 border-l-0 md:border-l border-gray-700/50"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.h3 
              className="text-2xl font-bold text-white mb-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF00FF] to-[#7B00FF]">
                Full Stack Developer
              </span>
            </motion.h3>
            
            <motion.p 
              className="text-gray-300 mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              I'm a passionate Full Stack Developer with expertise in building modern web applications.
              My journey in software development has been driven by a constant desire to learn and create
              innovative solutions that make a difference.
            </motion.p>

            {/* Key Points */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {[
                { title: "Experience", value: "5+ Years" },
                { title: "Projects", value: "50+" },
                { title: "Technologies", value: "20+" },
                { title: "Clients", value: "30+" }
              ].map((point, index) => (
                <motion.div
                  key={point.title}
                  className="bg-gray-800/50 backdrop-blur-md p-4 rounded-xl border border-gray-700/50"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + (index * 0.1) }}
                  viewport={{ once: true }}
                >
                  <h4 className="text-gray-400 text-sm mb-1">{point.title}</h4>
                  <p className="text-white font-bold text-xl">{point.value}</p>
                </motion.div>
              ))}
            </div>

            {/* Social Links */}
            <motion.div 
              className="flex gap-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
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
                  className="w-12 h-12 rounded-full bg-gray-800/50 backdrop-blur-md border border-gray-700/50 flex items-center justify-center text-gray-300 hover:text-white hover:border-[#FF00FF]/50 transition-colors"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 + (index * 0.1) }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon size={20} />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
} 