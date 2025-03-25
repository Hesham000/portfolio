"use client";

import Link from "next/link";
import { Github, Twitter, Linkedin, Instagram, ArrowUp } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <footer className="bg-black text-white py-12 border-t border-gray-800">
      <div className="container mx-auto max-w-[1200px] px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          {/* Logo/Brand */}
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold">Devon Lane</h2>
            <p className="text-gray-400 mt-2">Full Stack Developer</p>
          </div>
          
          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center gap-6 mb-6 md:mb-0">
            <Link href="#" className="text-gray-300 hover:text-[#FF00FF] transition-colors">
              Home
            </Link>
            <Link href="#about" className="text-gray-300 hover:text-[#FF00FF] transition-colors">
              About
            </Link>
            <Link href="#skills" className="text-gray-300 hover:text-[#FF00FF] transition-colors">
              Skills
            </Link>
            <Link href="#projects" className="text-gray-300 hover:text-[#FF00FF] transition-colors">
              Projects
            </Link>
            <Link href="#contact" className="text-gray-300 hover:text-[#FF00FF] transition-colors">
              Contact
            </Link>
          </div>
          
          {/* Social Links */}
          <div className="flex space-x-4">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-800 hover:bg-[#FF00FF] transition-colors"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-800 hover:bg-[#FF00FF] transition-colors"
              aria-label="Twitter"
            >
              <Twitter size={20} />
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-800 hover:bg-[#FF00FF] transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-800 hover:bg-[#FF00FF] transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-6 flex flex-col-reverse md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mt-4 md:mt-0">
            &copy; {new Date().getFullYear()} Devon Lane. All rights reserved.
          </p>
          
          <button 
            onClick={scrollToTop}
            className="bg-gradient-to-r from-[#FF00FF] to-[#7B00FF] text-white w-10 h-10 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity"
            aria-label="Scroll to top"
          >
            <ArrowUp size={18} />
          </button>
        </div>
      </div>
    </footer>
  );
} 