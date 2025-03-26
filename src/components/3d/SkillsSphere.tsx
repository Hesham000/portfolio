"use client";

import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

// Skills with their categories to display on the sphere
const skillsData = [
  { name: "React", category: "FRONT END", color: "#61DAFB" },
  { name: "TypeScript", category: "FRONT END", color: "#3178C6" },
  { name: "JavaScript", category: "FRONT END", color: "#F7DF1E" },
  { name: "Next.js", category: "FULL STACK", color: "#000000" },
  { name: "Node.js", category: "BACKEND", color: "#339933" },
  { name: "Express", category: "BACKEND", color: "#000000" },
  { name: "MongoDB", category: "BACKEND", color: "#47A248" },
  { name: "PostgreSQL", category: "BACKEND", color: "#4169E1" },
  { name: "GraphQL", category: "FULL STACK", color: "#E10098" },
  { name: "REST API", category: "BACKEND", color: "#FF6C37" },
  { name: "HTML", category: "FRONT END", color: "#E34F26" },
  { name: "CSS", category: "FRONT END", color: "#1572B6" },
  { name: "Tailwind", category: "FRONT END", color: "#38B2AC" },
  { name: "SASS", category: "FRONT END", color: "#CC6699" },
  { name: "Figma", category: "DESIGN", color: "#F24E1E" },
  { name: "Docker", category: "DEVOPS", color: "#2496ED" },
  { name: "Git", category: "DEVOPS", color: "#F05032" },
  { name: "AWS", category: "DEVOPS", color: "#FF9900" },
  { name: "Redux", category: "FRONT END", color: "#764ABC" },
  { name: "Jest", category: "TESTING", color: "#C21325" },
  { name: "Webflow", category: "WEBFLOW", color: "#4353FF" },
  { name: "SEO", category: "MARKETING", color: "#47A248" },
  { name: "Framer Motion", category: "FRONT END", color: "#0055FF" },
  { name: "Three.js", category: "FRONT END", color: "#000000" }
];

const categoryColors = {
  "FRONT END": "#FF00FF",
  "BACKEND": "#7B00FF",
  "FULL STACK": "#00BBFF",
  "DESIGN": "#FF5500",
  "DEVOPS": "#00CC88",
  "TESTING": "#FF3355",
  "WEBFLOW": "#4353FF",
  "MARKETING": "#FFAA00"
};

interface SkillsSphereProps {
  size?: number;
  className?: string;
  interactionEnabled?: boolean;
  activeCategory?: string | null;
  onCategoryHover?: (category: string | null) => void;
}

export default function SkillsSphere({ 
  size = 240, 
  className = '',
  interactionEnabled = true,
  activeCategory = null,
  onCategoryHover
}: SkillsSphereProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [internalActiveCategory, setInternalActiveCategory] = useState<string | null>(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  
  // Use the external activeCategory if provided, otherwise use internal state
  const currentActiveCategory = activeCategory !== null ? activeCategory : internalActiveCategory;
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create scene
    const scene = new THREE.Scene();
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75,
      1, // We enforce a square aspect ratio
      0.1,
      1000
    );
    camera.position.z = 4.5;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true
    });
    renderer.setSize(size, size);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    
    // Create text sprites for skills
    const createSkillSprite = (text: string, category: string, position: THREE.Vector3, scale = 1) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) return;
      
      canvas.width = 256;
      canvas.height = 64;
      
      // Background with transparency
      context.fillStyle = 'rgba(0, 0, 0, 0)';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // Category indicator - small colored circle
      const categoryColor = categoryColors[category as keyof typeof categoryColors] || "#FFFFFF";
      context.beginPath();
      context.arc(20, canvas.height / 2, 8, 0, 2 * Math.PI);
      context.fillStyle = categoryColor;
      context.fill();
      
      // Text styling
      context.font = 'Bold 24px Inter, Arial, sans-serif';
      context.fillStyle = '#FFFFFF';
      context.textAlign = 'left';
      context.textBaseline = 'middle';
      context.fillText(text, 40, canvas.height / 2);
      
      // Create texture from canvas
      const texture = new THREE.CanvasTexture(canvas);
      
      // Create material with the texture
      const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0.9
      });
      
      // Create sprite with the material
      const sprite = new THREE.Sprite(material);
      sprite.position.copy(position);
      sprite.scale.set(scale, scale * 0.25, 1);
      
      // Add metadata
      sprite.userData = { 
        category,
        isSkill: true
      };
      
      return sprite;
    };
    
    // Create group to hold all skills
    const skillsGroup = new THREE.Group();
    
    // Create sphere of skills
    const createSkillsSphere = () => {
      const radius = 2.5;
      const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

      skillsData.forEach((skill, i) => {
        const y = 1 - (i / (skillsData.length - 1)) * 2; // -1 to 1
        const radiusAtY = Math.sqrt(1 - y * y) * radius;
        
        const theta = phi * i; // Golden angle increment
        
        const x = Math.cos(theta) * radiusAtY;
        const z = Math.sin(theta) * radiusAtY;
        
        const position = new THREE.Vector3(x, y * radius, z);
        
        const sprite = createSkillSprite(skill.name, skill.category, position, 1);
        if (sprite) {
          skillsGroup.add(sprite);
        }
      });
      
      scene.add(skillsGroup);
    };
    
    createSkillsSphere();
    
    // Add a pulsing glow sphere in the center
    const createCenterGlow = () => {
      const geometry = new THREE.SphereGeometry(1.2, 32, 32);
      const material = new THREE.MeshBasicMaterial({
        color: 0x7B00FF,
        transparent: true,
        opacity: 0.05
      });
      const sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);
      
      return sphere;
    };
    
    const centerGlow = createCenterGlow();
    
    // Connect skills to center with lines based on category
    const createConnectionLines = () => {
      const lineGroup = new THREE.Group();
      
      skillsGroup.children.forEach((child) => {
        if (child.userData?.isSkill) {
          const category = child.userData.category;
          const color = categoryColors[category as keyof typeof categoryColors] || "#FFFFFF";
          
          const lineGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            child.position
          ]);
          
          const lineMaterial = new THREE.LineBasicMaterial({ 
            color: new THREE.Color(color),
            transparent: true,
            opacity: 0.3
          });
          
          const line = new THREE.Line(lineGeometry, lineMaterial);
          line.userData = { category };
          lineGroup.add(line);
        }
      });
      
      scene.add(lineGroup);
      return lineGroup;
    };
    
    const connectionLines = createConnectionLines();
    
    // Create raycaster for mouse interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    const checkIntersects = (event: MouseEvent) => {
      if (!containerRef.current || !interactionEnabled) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      
      // Calculate mouse position in normalized device coordinates (-1 to +1)
      mouse.x = ((event.clientX - rect.left) / size) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / size) * 2 + 1;
      
      // Update the raycaster
      raycaster.setFromCamera(mouse, camera);
      
      // Check for intersections with skill sprites
      const intersects = raycaster.intersectObjects(skillsGroup.children);
      
      if (intersects.length > 0) {
        const firstIntersect = intersects[0].object;
        if (firstIntersect.userData?.isSkill) {
          const hoveredCategory = firstIntersect.userData.category;
          
          // Set internal active category
          if (activeCategory === null) {
            setInternalActiveCategory(hoveredCategory);
          }
          
          // Call onCategoryHover callback if provided
          if (onCategoryHover) {
            onCategoryHover(hoveredCategory);
          }
          
          document.body.style.cursor = 'pointer';
          return;
        }
      }
      
      // Reset if not hovering over any skill
      if (activeCategory === null) {
        setInternalActiveCategory(null);
      }
      
      if (onCategoryHover && isHovering) {
        onCategoryHover(null);
      }
      
      document.body.style.cursor = 'default';
    };
    
    // Handle mouse movement for interaction
    const handleMouseMove = (event: MouseEvent) => {
      if (!containerRef.current || !interactionEnabled) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      
      // Calculate mouse position in normalized device coordinates (-1 to +1)
      const x = ((event.clientX - rect.left) / size) * 2 - 1;
      const y = -((event.clientY - rect.top) / size) * 2 + 1;
      
      mousePosition.current = { x, y };
      
      // Check for intersections with skills
      checkIntersects(event);
    };
    
    if (interactionEnabled) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    
    // Animation loop
    let animationFrame: number;
    const animate = () => {
      animationFrame = requestAnimationFrame(animate);
      
      // Base rotation
      const baseSpeed = isHovering ? 0.001 : 0.002;
      skillsGroup.rotation.y += baseSpeed;
      connectionLines.rotation.y += baseSpeed;
      
      // If hovering, adjust rotation based on mouse position
      if (isHovering && interactionEnabled) {
        const targetX = mousePosition.current.y * 0.5;
        const targetY = mousePosition.current.x * 0.5;
        
        // Smooth transition to target rotation
        skillsGroup.rotation.x += (targetX - skillsGroup.rotation.x) * 0.05;
        // Keep the y rotation continuously spinning but influenced by mouse
        skillsGroup.rotation.y += (targetY - skillsGroup.rotation.y) * 0.05;
        
        connectionLines.rotation.x = skillsGroup.rotation.x;
        connectionLines.rotation.y = skillsGroup.rotation.y;
      }
      
      // Pulse the center glow
      const time = Date.now() * 0.001;
      centerGlow.scale.set(
        1 + Math.sin(time) * 0.1,
        1 + Math.sin(time) * 0.1,
        1 + Math.sin(time) * 0.1
      );
      
      // Handle ALL category as null for display purposes
      const displayCategory = currentActiveCategory === "ALL" ? null : currentActiveCategory;
      
      // Highlight active category if set
      if (displayCategory) {
        connectionLines.children.forEach((line) => {
          const material = ((line as THREE.Line).material as THREE.LineBasicMaterial);
          if (line.userData.category === displayCategory) {
            material.opacity += (0.8 - material.opacity) * 0.1;
          } else {
            material.opacity += (0.1 - material.opacity) * 0.1;
          }
        });
        
        skillsGroup.children.forEach((sprite) => {
          if (sprite.userData?.category === displayCategory) {
            sprite.scale.lerp(new THREE.Vector3(1.2, 0.3, 1), 0.1);
          } else {
            sprite.scale.lerp(new THREE.Vector3(0.8, 0.2, 1), 0.1);
          }
        });
      } else {
        // Reset all opacities and scales if no active category
        connectionLines.children.forEach((line) => {
          const material = ((line as THREE.Line).material as THREE.LineBasicMaterial);
          material.opacity += (0.3 - material.opacity) * 0.1;
        });
        
        skillsGroup.children.forEach((sprite) => {
          sprite.scale.lerp(new THREE.Vector3(1, 0.25, 1), 0.1);
        });
      }
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationFrame);
      if (interactionEnabled) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      document.body.style.cursor = 'default';
    };
  }, [size, isHovering, currentActiveCategory, activeCategory, interactionEnabled, onCategoryHover]);
  
  return (
    <div 
      ref={containerRef} 
      className={`relative cursor-pointer ${className}`}
      style={{ width: size, height: size }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        if (onCategoryHover) {
          onCategoryHover(null);
        }
      }}
    />
  );
} 