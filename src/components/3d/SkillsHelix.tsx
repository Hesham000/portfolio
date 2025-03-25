"use client";

import { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';

// Skills with their categories to display on the helix
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

// Reduced dataset for better performance
const optimizedSkillsData = skillsData.slice(0, 15);

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

interface SkillsHelixProps {
  size?: number;
  className?: string;
  interactionEnabled?: boolean;
  activeCategory?: string | null;
  onCategoryHover?: (category: string | null) => void;
}

export default function SkillsHelix({ 
  size = 240, 
  className = '',
  interactionEnabled = true,
  activeCategory = null,
  onCategoryHover
}: SkillsHelixProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [internalActiveCategory, setInternalActiveCategory] = useState<string | null>(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const lastHoverUpdate = useRef(0);
  const animationRef = useRef<number | null>(null);
  const isFirstRender = useRef(true);
  
  // Use the external activeCategory if provided, otherwise use internal state
  const currentActiveCategory = activeCategory !== null ? activeCategory : internalActiveCategory;
  
  // Debounced category hover handler to prevent too many state updates
  const handleCategoryHover = useCallback((category: string | null) => {
    const now = Date.now();
    if (now - lastHoverUpdate.current > 100) { // 100ms debounce
      lastHoverUpdate.current = now;
      if (onCategoryHover && category !== internalActiveCategory) {
        onCategoryHover(category);
      }
      setInternalActiveCategory(category);
    }
  }, [onCategoryHover, internalActiveCategory]);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Prevent recreating the scene on activeCategory change
    if (!isFirstRender.current) return;
    isFirstRender.current = false;
    
    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      60,
      1, // We enforce a square aspect ratio
      0.1,
      1000
    );
    camera.position.z = 7;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(size, size);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
    containerRef.current.appendChild(renderer.domElement);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 0.8);
    pointLight.position.set(0, 0, 8);
    scene.add(pointLight);

    const skillNodes = new THREE.Group();
    const strand1 = new THREE.Group(); // First helix strand
    const strand2 = new THREE.Group(); // Second helix strand
    
    // Create main container group
    const helixGroup = new THREE.Group();
    scene.add(helixGroup);
    helixGroup.add(skillNodes);
    helixGroup.add(strand1);
    helixGroup.add(strand2);
    
    // Create the helix strands - reduced number of points for better performance
    const createHelixStrands = () => {
      const numPoints = 60; // Reduced from 100
      const helixRadius = 1.2;
      const helixHeight = 10;
      const strand1Material = new THREE.MeshPhongMaterial({ 
        color: 0xFF00FF,
        emissive: 0xFF00FF,
        emissiveIntensity: 0.2,
        shininess: 70
      });
      
      const strand2Material = new THREE.MeshPhongMaterial({ 
        color: 0x7B00FF,
        emissive: 0x7B00FF,
        emissiveIntensity: 0.2,
        shininess: 70
      });
      
      // Create fewer helix points for performance
      for (let i = 0; i < numPoints; i++) {
        const t = (i / numPoints) * Math.PI * 4; // 2 full rotations
        const y = (i / numPoints) * helixHeight - helixHeight/2;
        
        // Strand 1 sphere (first helix strand)
        const x1 = Math.cos(t) * helixRadius;
        const z1 = Math.sin(t) * helixRadius;
        
        const sphereGeometry1 = new THREE.SphereGeometry(0.08, 8, 8); // Reduced segments
        const sphere1 = new THREE.Mesh(sphereGeometry1, strand1Material);
        sphere1.position.set(x1, y, z1);
        strand1.add(sphere1);
        
        // Strand 2 sphere (second helix strand - opposite side)
        const x2 = Math.cos(t + Math.PI) * helixRadius;
        const z2 = Math.sin(t + Math.PI) * helixRadius;
        
        const sphereGeometry2 = new THREE.SphereGeometry(0.08, 8, 8); // Reduced segments
        const sphere2 = new THREE.Mesh(sphereGeometry2, strand2Material);
        sphere2.position.set(x2, y, z2);
        strand2.add(sphere2);
        
        // Add connecting lines between strands less frequently
        if (i % 12 === 0) { // Reduced from every 8 to every 12
          const connectorGeometry = new THREE.CylinderGeometry(0.02, 0.02, helixRadius * 2, 6);
          const connectorMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xFFFFFF,
            transparent: true,
            opacity: 0.4,
            shininess: 80
          });
          
          const connector = new THREE.Mesh(connectorGeometry, connectorMaterial);
          connector.position.set((x1 + x2) / 2, y, (z1 + z2) / 2);
          
          // Rotate to connect the two strand spheres
          connector.lookAt(new THREE.Vector3(x2, y, z2));
          connector.rotateX(Math.PI / 2);
          
          strand1.add(connector);
        }
      }
    };
    
    createHelixStrands();
    
    // Create text sprites for skills
    const createSkillSprite = (text: string, category: string, position: THREE.Vector3, scale = 1) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) return;
      
      canvas.width = 200;
      canvas.height = 80;
      
      // Background with transparency
      context.fillStyle = 'rgba(0, 0, 0, 0)';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // Create glowing neon text effect
      const categoryColor = categoryColors[category as keyof typeof categoryColors] || "#FFFFFF";
      
      // Outer glow - less blur for better performance
      context.shadowBlur = 10;
      context.shadowColor = categoryColor;
      context.fillStyle = categoryColor;
      
      // Text styling
      context.font = 'Bold 24px Inter, Arial, sans-serif';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(text, canvas.width / 2, canvas.height / 2);
      
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
      sprite.scale.set(scale, scale * 0.4, 1);
      
      // Add metadata
      sprite.userData = { 
        category,
        isSkill: true,
        originalScale: scale
      };
      
      return sprite;
    };
    
    // Create orbit of skill sprites - using reduced dataset
    const createSkillOrbits = () => {
      const radius = 3.5;
      const orbitHeight = 8;
      
      optimizedSkillsData.forEach((skill, i) => {
        // Calculate position on an orbit
        const angle = (i / optimizedSkillsData.length) * Math.PI * 2;
        const orbitY = (i / optimizedSkillsData.length) * orbitHeight - orbitHeight/2;
        
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        const position = new THREE.Vector3(x, orbitY, z);
        
        // Create skill sprite
        const sprite = createSkillSprite(skill.name, skill.category, position, 1.2);
        if (sprite) {
          // Track orbit parameters for animation
          sprite.userData.orbitY = orbitY;
          sprite.userData.orbitRadius = radius;
          sprite.userData.orbitAngle = angle;
          sprite.userData.orbitSpeed = 0.15 + Math.random() * 0.1; // Reduced speed
          skillNodes.add(sprite);
          
          // Only create orbit rings for some skills to improve performance
          if (i % 3 === 0) {
            const orbitGeometry = new THREE.RingGeometry(radius - 0.02, radius + 0.02, 32); // Reduced segments
            const orbitMaterial = new THREE.MeshBasicMaterial({ 
              color: categoryColors[skill.category as keyof typeof categoryColors] || "#FFFFFF",
              transparent: true,
              opacity: 0.1,
              side: THREE.DoubleSide
            });
            const orbitRing = new THREE.Mesh(orbitGeometry, orbitMaterial);
            orbitRing.position.set(0, orbitY, 0);
            orbitRing.rotation.x = Math.PI / 2;
            orbitRing.userData = { category: skill.category };
            skillNodes.add(orbitRing);
          }
        }
      });
    };
    
    createSkillOrbits();
    
    // Create raycaster for mouse interaction - with throttled checking
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let lastRaycastTime = 0;
    
    const checkIntersects = (event: MouseEvent) => {
      if (!containerRef.current || !interactionEnabled) return;
      
      const now = performance.now();
      // Only raycast every 100ms for performance
      if (now - lastRaycastTime < 100) return;
      lastRaycastTime = now;
      
      const rect = containerRef.current.getBoundingClientRect();
      
      // Calculate mouse position in normalized device coordinates (-1 to +1)
      mouse.x = ((event.clientX - rect.left) / size) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / size) * 2 + 1;
      
      // Update the raycaster
      raycaster.setFromCamera(mouse, camera);
      
      // Check for intersections with skill sprites
      const intersects = raycaster.intersectObjects(skillNodes.children.filter(c => c.userData?.isSkill));
      
      if (intersects.length > 0) {
        const firstIntersect = intersects[0].object;
        if (firstIntersect.userData?.isSkill) {
          const hoveredCategory = firstIntersect.userData.category;
          
          // Call debounced category hover handler
          handleCategoryHover(hoveredCategory);
          document.body.style.cursor = 'pointer';
          return;
        }
      }
      
      // Reset if not hovering over any skill
      if (activeCategory === null) {
        handleCategoryHover(null);
      }
      
      document.body.style.cursor = 'default';
    };
    
    // Handle mouse movement for interaction with throttling
    let throttleTimer: number | null = null;
    const handleMouseMove = (event: MouseEvent) => {
      if (!containerRef.current || !interactionEnabled) return;
      
      // Store the mouse position regardless of throttling
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / size) * 2 - 1;
      const y = -((event.clientY - rect.top) / size) * 2 + 1;
      mousePosition.current = { x, y };
      
      // Throttle the raycasting for performance
      if (!throttleTimer) {
        throttleTimer = window.setTimeout(() => {
          checkIntersects(event);
          throttleTimer = null;
        }, 50); // 50ms throttle
      }
    };
    
    if (interactionEnabled) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }
    
    // Animation loop with performance optimizations
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      // Base rotation - slower for better performance
      helixGroup.rotation.y += isHovering ? 0.002 : 0.003;
      
      // If hovering, adjust rotation based on mouse position
      if (isHovering && interactionEnabled) {
        const targetX = mousePosition.current.y * 0.2; // Reduced factor
        
        // Smooth transition to target rotation - reduced calculations
        helixGroup.rotation.x += (targetX - helixGroup.rotation.x) * 0.05;
        
        // Add a slight tilt effect based on mouse position
        helixGroup.position.x += (mousePosition.current.x * 0.3 - helixGroup.position.x) * 0.02;
        helixGroup.position.y += (mousePosition.current.y * 0.3 - helixGroup.position.y) * 0.02;
      } else {
        // Reset position when not hovering
        helixGroup.rotation.x *= 0.95;
        helixGroup.position.x *= 0.95;
        helixGroup.position.y *= 0.95;
      }
      
      // Animate skill orbits - more efficiently
      skillNodes.children.forEach((child) => {
        if (child.userData?.isSkill) {
          // Update orbit angle
          child.userData.orbitAngle += 0.003 * child.userData.orbitSpeed;
          
          // Calculate new position
          const angle = child.userData.orbitAngle;
          const radius = child.userData.orbitRadius;
          const y = child.userData.orbitY;
          
          // Update position
          child.position.x = Math.cos(angle) * radius;
          child.position.z = Math.sin(angle) * radius;
          
          // Keep the y position fixed (don't update every frame)
          if (child.position.y !== y) {
            child.position.y = y;
          }
          
          // Always face the camera
          child.quaternion.copy(camera.quaternion);
        }
      });
      
      // Handle ALL category as null for display purposes
      const displayCategory = currentActiveCategory === "ALL" ? null : currentActiveCategory;
      
      // Highlight active category - optimized to avoid per-frame material changes
      skillNodes.children.forEach((child) => {
        if (child.userData?.category) {
          // For skill sprites
          if (child.userData.isSkill) {
            const sprite = child as THREE.Sprite;
            const originalScale = child.userData.originalScale || 1;
            
            if (displayCategory && child.userData.category === displayCategory) {
              // Highlighted - make bigger and fully opaque
              if (sprite.material.opacity < 0.9) {
                sprite.material.opacity += (1 - sprite.material.opacity) * 0.05;
              }
              sprite.scale.lerp(new THREE.Vector3(originalScale * 1.2, originalScale * 0.48, 1), 0.05);
            } else if (displayCategory) {
              // Not highlighted - make smaller and less opaque
              if (sprite.material.opacity > 0.45) {
                sprite.material.opacity += (0.4 - sprite.material.opacity) * 0.05;
              }
              sprite.scale.lerp(new THREE.Vector3(originalScale * 0.8, originalScale * 0.32, 1), 0.05);
            } else {
              // No category selected - normal size
              if (sprite.material.opacity < 0.85) {
                sprite.material.opacity += (0.9 - sprite.material.opacity) * 0.05;
              }
              sprite.scale.lerp(new THREE.Vector3(originalScale, originalScale * 0.4, 1), 0.05);
            }
          } 
          // For orbit rings - update less frequently
          else if (Date.now() % 3 === 0) { // Only process every 3rd frame
            const mesh = child as THREE.Mesh;
            const material = mesh.material as THREE.MeshBasicMaterial;
            
            if (displayCategory && child.userData.category === displayCategory) {
              // Highlighted orbit
              material.opacity += (0.3 - material.opacity) * 0.05;
            } else {
              // Normal orbit
              material.opacity += (0.1 - material.opacity) * 0.05;
            }
          }
        }
      });
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      if (throttleTimer) {
        clearTimeout(throttleTimer);
      }
      
      if (interactionEnabled) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      document.body.style.cursor = 'default';
    };
  }, [size, handleCategoryHover, interactionEnabled]); // Removed dependencies that cause re-renders

  // Effect to handle category changes without recreating the entire scene
  useEffect(() => {
    // No need to do anything here, the animate loop will handle the visual updates
    // by checking currentActiveCategory
  }, [currentActiveCategory, activeCategory]);
  
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