"use client";

import { useEffect, useState, useCallback, memo } from "react";
import Section from "@/components/layout/Section";
import { motion } from "framer-motion";
import FloatingElement from "@/components/shared/FloatingElement";
import StaggeredItems from "@/components/shared/StaggeredItems";
import { Layers, Code, Smartphone, GitMerge, Globe, Terminal, Server } from "lucide-react";

interface Skill {
  name: string;
  rating: number;
  category: string;
}

// Memoized SkillBar component for better performance
const SkillBar = memo(({ skill, index, isVisible }: { 
  skill: Skill;
  index: number;
  isVisible: boolean;
}) => {
  return (
    <motion.div 
      key={skill.name}
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ 
        duration: 0.5, 
        delay: 0.1 + (index * 0.05), 
        ease: [0.25, 0.1, 0.25, 1] 
      }}
      className="bg-gray-800/50 backdrop-blur-md p-4 rounded-xl border border-gray-700/50"
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-white font-medium">{skill.name}</h3>
        <span className="text-sm text-gray-400">{skill.rating}/10</span>
      </div>
      <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-[#7B00FF] to-[#FF00FF]"
          initial={{ width: 0 }}
          animate={isVisible ? { width: `${skill.rating * 10}%` } : { width: 0 }}
          transition={{ duration: 0.8, delay: 0.3 + (index * 0.05), ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
});

SkillBar.displayName = 'SkillBar';

// Skill data
const skills: Skill[] = [
  { name: "React", rating: 9, category: "FRONT END" },
  { name: "TypeScript", rating: 9, category: "FRONT END" },
  { name: "JavaScript", rating: 9, category: "FRONT END" },
  { name: "Next.js", rating: 8, category: "FULL STACK" },
  { name: "Node.js", rating: 8, category: "BACKEND" },
  { name: "MongoDB", rating: 7, category: "BACKEND" },
  { name: "GraphQL", rating: 8, category: "FULL STACK" },
  { name: "REST API", rating: 9, category: "BACKEND" },
  { name: "CSS/SASS", rating: 8, category: "FRONT END" },
  { name: "Tailwind", rating: 9, category: "FRONT END" },
  { name: "UI/UX Design", rating: 7, category: "DESIGN" },
  { name: "Docker", rating: 7, category: "DEVOPS" },
  { name: "AWS", rating: 7, category: "DEVOPS" },
  { name: "Testing", rating: 8, category: "TESTING" },
];

export default function Skills() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Categories with corresponding icons
  const categories = [
    { name: "ALL", icon: Layers },
    { name: "FRONT END", icon: Globe },
    { name: "BACKEND", icon: Terminal },
    { name: "FULL STACK", icon: Server },
    { name: "DESIGN", icon: Smartphone },
    { name: "DEVOPS", icon: GitMerge },
  ];
  
  // Filter skills based on active category
  const filteredSkills = skills.filter(skill => 
    !activeCategory || activeCategory === "ALL" ? true : skill.category === activeCategory
  );
  
  // Handle visibility change for animation
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    
    return () => clearTimeout(timeout);
  }, []);
  
  // Handle category click
  const handleCategoryClick = useCallback((category: string) => {
    setActiveCategory(category);
  }, []);

  return (
    <Section 
      id="skills" 
      title="My Skills"
      titleAnimation="letter"
      contentAnimation="fade"
      direction="up"
    >
      <div className="flex flex-col lg:flex-row items-center mb-12">
        <div className="lg:w-1/3 flex justify-center mb-8 lg:mb-0">
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
              <Skills3DModel />
            </motion.div>
          </FloatingElement>
        </div>
        
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
                Technical Expertise
              </span>
            </motion.h3>
            
            <motion.p 
              className="text-gray-300 mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              With a focus on modern web technologies, I specialize in building robust and scalable applications.
              I approach each project with a commitment to clean code, performance optimization, and exceptional user experiences.
            </motion.p>
            
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map((category, index) => (
                <motion.button
                  key={category.name}
                  onClick={() => handleCategoryClick(category.name)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === category.name 
                      ? 'bg-gradient-to-r from-[#FF00FF] to-[#7B00FF] text-white' 
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + (index * 0.05) }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <category.icon size={16} />
                  {category.name}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        viewport={{ once: true }}
      >
        {filteredSkills.map((skill, index) => (
          <SkillBar 
            key={skill.name}
            skill={skill}
            index={index}
            isVisible={isVisible}
          />
        ))}
      </motion.div>
    </Section>
  );
}

// Custom 3D visualization for skills section
function Skills3DModel() {
  return (
    <div className="relative w-[280px] h-[280px] flex items-center justify-center overflow-hidden">
      {/* Glowing background */}
      <div className="absolute inset-0 rounded-full bg-gradient-radial from-[#7B00FF]/30 to-transparent opacity-70 animate-pulse-slow" />
      
      {/* Skill orbs */}
      {[...Array(8)].map((_, i) => {
        const deg = (i / 8) * 360;
        const radius = 110;
        const x = radius * Math.cos(deg * Math.PI / 180);
        const y = radius * Math.sin(deg * Math.PI / 180);
        
        return (
          <motion.div
            key={i}
            className="absolute w-12 h-12 rounded-full bg-gradient-to-br from-[#7B00FF] to-[#FF00FF] flex items-center justify-center"
            style={{
              left: 'calc(50% - 24px)',
              top: 'calc(50% - 24px)',
              boxShadow: '0 0 15px rgba(123, 0, 255, 0.5), 0 0 30px rgba(255, 0, 255, 0.3)'
            }}
            initial={{ x, y, opacity: 0, scale: 0 }}
            animate={{ 
              x, 
              y, 
              opacity: 1, 
              scale: 1,
              rotate: [0, 360]
            }}
            transition={{
              type: 'spring',
              duration: 1.5,
              delay: i * 0.1,
              rotate: {
                duration: 20,
                repeat: Infinity,
                ease: 'linear'
              }
            }}
          >
            <span className="text-xs text-white font-bold">
              {['JS', 'TS', 'CSS', 'HTML', 'API', 'SQL', 'UX', 'DEV'][i]}
            </span>
          </motion.div>
        );
      })}
      
      {/* Central sphere */}
      <motion.div 
        className="relative w-24 h-24 rounded-full bg-gradient-to-br from-[#FF00FF] to-[#7B00FF] flex items-center justify-center text-white font-bold"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', bounce: 0.5, duration: 1 }}
        style={{
          boxShadow: '0 0 30px rgba(255, 0, 255, 0.6), 0 0 60px rgba(123, 0, 255, 0.4)'
        }}
      >
        <span>SKILLS</span>
        
        {/* Orbit rings */}
        <div className="absolute inset-0 rounded-full border border-[#FF00FF]/30 animate-spin-slow" 
             style={{ width: '220px', height: '220px', left: 'calc(50% - 110px)', top: 'calc(50% - 110px)' }} />
        <div className="absolute inset-0 rounded-full border border-[#7B00FF]/30 animate-spin-reverse-slow" 
             style={{ width: '240px', height: '240px', left: 'calc(50% - 120px)', top: 'calc(50% - 120px)' }} />
      </motion.div>
    </div>
  );
} 