"use client";

import { useState } from "react";
import Section from "@/components/layout/Section";
import { motion, AnimatePresence } from "framer-motion";
import FloatingElement from "@/components/shared/FloatingElement";
import ProjectsModel from "@/components/3d/ProjectsModel";
import { Github, ExternalLink, Code2, Globe, Smartphone, Server } from "lucide-react";

interface Project {
  title: string;
  description: string;
  image: string;
  technologies: string[];
  github?: string;
  demo?: string;
  category: "web" | "mobile" | "fullstack";
}

const projects: Project[] = [
  {
    title: "E-Commerce Platform",
    description: "A full-stack e-commerce platform with real-time inventory management and payment processing.",
    image: "https://picsum.photos/id/1/800/600",
    technologies: ["React", "Node.js", "MongoDB", "Stripe"],
    github: "https://github.com/yourusername/ecommerce",
    demo: "https://ecommerce-demo.com",
    category: "fullstack"
  },
  {
    title: "Mobile Banking App",
    description: "A secure and intuitive mobile banking application with biometric authentication.",
    image: "https://picsum.photos/id/2/800/600",
    technologies: ["React Native", "Firebase", "Redux"],
    github: "https://github.com/yourusername/banking-app",
    demo: "https://banking-app-demo.com",
    category: "mobile"
  },
  {
    title: "Portfolio Website",
    description: "A modern portfolio website with 3D animations and interactive elements.",
    image: "https://picsum.photos/id/3/800/600",
    technologies: ["Next.js", "Three.js", "Framer Motion"],
    github: "https://github.com/yourusername/portfolio",
    demo: "https://portfolio-demo.com",
    category: "web"
  }
];

const categories = [
  { id: "all", label: "All Projects", icon: Code2 },
  { id: "web", label: "Web Apps", icon: Globe },
  { id: "mobile", label: "Mobile Apps", icon: Smartphone },
  { id: "fullstack", label: "Full Stack", icon: Server }
];

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  const filteredProjects = projects.filter(
    project => activeCategory === "all" || project.category === activeCategory
  );

  return (
    <Section 
      id="projects" 
      title="Projects"
      titleAnimation="letter"
      contentAnimation="fade"
      direction="up"
    >
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left side - Project Cards */}
        <div className="lg:w-2/3">
          {/* Category Filter */}
          <motion.div 
            className="flex flex-wrap gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${
                  activeCategory === category.id
                    ? "border-[#FF00FF] bg-[#FF00FF]/10 text-white"
                    : "border-gray-700 text-gray-400 hover:border-[#FF00FF]/50 hover:text-white"
                }`}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <category.icon size={18} />
                {category.label}
              </motion.button>
            ))}
          </motion.div>

          {/* Project Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="wait">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative"
                  onHoverStart={() => setHoveredProject(index)}
                  onHoverEnd={() => setHoveredProject(null)}
                >
                  <div className="relative overflow-hidden rounded-xl bg-gray-800/50 backdrop-blur-md border border-gray-700/50">
                    {/* Project Image */}
                    <div className="relative h-48 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#FF00FF]/20 to-[#7B00FF]/20" />
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>

                    {/* Project Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                      <p className="text-gray-400 mb-4">{project.description}</p>
                      
                      {/* Technologies */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 rounded-full text-sm bg-gray-700/50 text-gray-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Project Links */}
                      <div className="flex gap-4">
                        {project.github && (
                          <motion.a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                            whileHover={{ x: 5 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Github size={18} />
                            <span>Code</span>
                          </motion.a>
                        )}
                        {project.demo && (
                          <motion.a
                            href={project.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                            whileHover={{ x: 5 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <ExternalLink size={18} />
                            <span>Live Demo</span>
                          </motion.a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Right side - 3D Model */}
        <div className="lg:w-1/3">
          <FloatingElement
            floatIntensity={1.5}
            floatSpeed={2.5}
            rotateIntensity={0.2}
            rotateSpeed={1}
          >
            <ProjectsModel
              width={400}
              height={400}
              className="rounded-xl overflow-hidden"
            />
          </FloatingElement>
        </div>
      </div>
    </Section>
  );
} 