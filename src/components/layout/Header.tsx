"use client";

import { Download, Mail, ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const navItems = [
    { name: "HOME", href: "#", section: "hero" },
    { name: "ABOUT", href: "#about", section: "about" },
    { name: "SKILLS", href: "#skills", section: "skills" },
    { name: "PROJECTS", href: "#projects", section: "projects" },
    { name: "CONTACT", href: "#contact", section: "contact" }
  ];

  const [scrollPosition, setScrollPosition] = useState(0);
  const [activeSection, setActiveSection] = useState("hero");
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      const scrollAmount = 200;
      
      if (direction === "left") {
        carouselRef.current.scrollTo({
          left: Math.max(0, scrollLeft - scrollAmount),
          behavior: "smooth"
        });
      } else {
        carouselRef.current.scrollTo({
          left: Math.min(scrollWidth - clientWidth, scrollLeft + scrollAmount),
          behavior: "smooth"
        });
      }
      
      setScrollPosition(carouselRef.current.scrollLeft);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (carouselRef.current) {
        setScrollPosition(carouselRef.current.scrollLeft);
      }
      
      // Update active section based on scroll position
      const sections = navItems.map(item => item.section);
      const scrollY = window.scrollY;
      
      // Auto-hide header logic for larger scroll movements
      if (scrollY > lastScrollY + 50 && scrollY > 100) {
        setIsVisible(false);
      } else if (scrollY < lastScrollY - 10) {
        setIsVisible(true);
      }
      setLastScrollY(scrollY);
      
      // Find the current section based on scroll position
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section) {
          const sectionTop = section.offsetTop - 100; // Offset for header
          if (scrollY >= sectionTop) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
      
      // If at the top of the page, set the hero as active
      if (scrollY < 100) {
        setActiveSection("hero");
      }
    };

    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener("scroll", handleScroll);
    }
    
    window.addEventListener("scroll", handleScroll);
    return () => {
      if (carousel) {
        carousel.removeEventListener("scroll", handleScroll);
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, [navItems, lastScrollY]);

  // Close mobile menu when clicking a navigation link
  const handleNavClick = () => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  const showLeftArrow = scrollPosition > 10;
  const showRightArrow = carouselRef.current 
    ? scrollPosition < carouselRef.current.scrollWidth - carouselRef.current.clientWidth - 10
    : true;

  return (
    <>
      <motion.header 
        className="fixed top-0 left-0 w-full z-50"
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : -70 }}
        transition={{ duration: 0.4, ease: [0.1, 0.9, 0.2, 1] }}
      >
        {/* Glowing border bottom effect */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#FF00FF]/50 to-transparent"></div>
        
        {/* Glassmorphism panel */}
        <div className="backdrop-blur-md bg-black/40 border-b border-white/5">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#7B00FF]/10 via-[#FF00FF]/5 to-[#7B00FF]/10 animate-gradient-x pointer-events-none"></div>
          
          <div className="container mx-auto px-4 h-16 flex items-center justify-between relative">
            {/* Logo area with 3D effect */}
            <div className="relative perspective">
              <motion.div
                initial={{ opacity: 0, rotateY: -15 }}
                animate={{ opacity: 1, rotateY: 0 }}
                transition={{ 
                  duration: 0.7, 
                  type: "spring", 
                  stiffness: 100 
                }}
                className="text-white font-bold text-2xl tracking-wide"
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF00FF] to-[#7B00FF] pr-1">D</span>
                <span className="relative inline-block group">
                  <span className="relative z-10">evon Lane</span>
                  <span className="absolute -bottom-0.5 left-0 w-0 h-[2px] bg-gradient-to-r from-[#FF00FF] to-[#7B00FF] group-hover:w-full transition-all duration-300"></span>
                </span>
                <motion.span 
                  className="absolute -z-10 inset-0 opacity-30 blur-sm"
                  animate={{ 
                    opacity: [0.2, 0.4, 0.2],
                    filter: ["blur(3px)", "blur(4px)", "blur(3px)"]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 3, 
                    ease: "easeInOut" 
                  }}
                >
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF00FF] to-[#7B00FF]">Devon Lane</span>
                </motion.span>
              </motion.div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center justify-center space-x-8">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  className="perspective"
                >
                  <Link 
                    href={item.href}
                    className={`transition-all duration-300 text-sm relative px-1 py-1 group overflow-hidden ${
                      activeSection === item.section
                        ? "text-white font-medium"
                        : "text-gray-300 hover:text-white"
                    }`}
                    onClick={handleNavClick}
                  >
                    <span className="relative z-10">{item.name}</span>
                    
                    {/* Hover animation */}
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#FF00FF] to-[#7B00FF] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                    
                    {/* Active indicator */}
                    {activeSection === item.section && (
                      <motion.div
                        layoutId="navIndicator"
                        className="absolute bottom-0 left-0 w-full h-0.5"
                        transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                      >
                        <div className="w-full h-full bg-gradient-to-r from-[#FF00FF] to-[#7B00FF]"></div>
                        
                        {/* Glow effect */}
                        <div className="absolute bottom-0 h-[6px] w-full blur-sm bg-gradient-to-r from-[#FF00FF]/50 to-[#7B00FF]/50"></div>
                      </motion.div>
                    )}
                  </Link>
                </motion.div>
              ))}
            </nav>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-3 z-10">
              <motion.a 
                href="/resume.pdf"
                download
                className="hidden sm:flex items-center bg-gradient-to-r from-[#FF00FF] to-[#7B00FF] text-white px-4 py-1.5 rounded-full text-sm transition-all relative group overflow-hidden"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-[105%] transition-transform duration-700"></span>
                <Download size={14} className="mr-2" />
                <span>Resume</span>
              </motion.a>
              
              <motion.a 
                href="#contact"
                className="flex items-center bg-transparent backdrop-blur-sm text-white border border-[#7B00FF]/50 hover:border-[#FF00FF] px-4 py-1.5 rounded-full text-sm transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2, borderColor: "#FF00FF" }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Mail size={14} className="mr-2" />
                <span className="hidden sm:inline">Contact</span>
              </motion.a>
              
              {/* Mobile menu button */}
              <motion.button
                onClick={toggleMobileMenu}
                className="flex md:hidden items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-[#FF00FF]/20 to-[#7B00FF]/20 text-white"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>
      
      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMobileMenu}
            ></motion.div>
            
            <motion.div
              className="absolute inset-y-0 right-0 w-full max-w-xs bg-gradient-to-br from-black/90 to-[#0f0120]/90 backdrop-blur-md shadow-xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex flex-col h-full pt-16 pb-6 px-6">
                <div className="flex flex-col space-y-2 mt-8">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 + (index * 0.05) }}
                    >
                      <Link
                        href={item.href}
                        className={`block py-3 px-4 text-lg font-medium rounded-lg transition-colors ${
                          activeSection === item.section
                            ? "bg-gradient-to-r from-[#FF00FF]/20 to-[#7B00FF]/20 text-white"
                            : "text-gray-300 hover:bg-white/5 hover:text-white"
                        }`}
                        onClick={handleNavClick}
                      >
                        {item.name}
                        
                        {activeSection === item.section && (
                          <motion.div 
                            className="h-0.5 mt-1 bg-gradient-to-r from-[#FF00FF] to-[#7B00FF]" 
                            layoutId="mobileNavIndicator"
                          ></motion.div>
                        )}
                      </Link>
                    </motion.div>
                  ))}
                </div>
                
                {/* Mobile menu action buttons */}
                <div className="mt-auto flex flex-col space-y-3">
                  <motion.a
                    href="/resume.pdf"
                    download
                    className="flex items-center justify-center bg-gradient-to-r from-[#FF00FF] to-[#7B00FF] text-white py-3 px-6 rounded-xl text-sm font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Download size={16} className="mr-2" />
                    <span>Download Resume</span>
                  </motion.a>
                  
                  <motion.a
                    href="#contact"
                    className="flex items-center justify-center border border-[#7B00FF]/50 text-white py-3 px-6 rounded-xl text-sm font-medium"
                    whileHover={{ scale: 1.02, borderColor: "#FF00FF" }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    onClick={handleNavClick}
                  >
                    <Mail size={16} className="mr-2" />
                    <span>Contact Me</span>
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 