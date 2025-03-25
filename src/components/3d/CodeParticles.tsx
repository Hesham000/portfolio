"use client";

import { useRef, useEffect } from 'react';
import * as THREE from 'three';

// Define code-related symbols for particles
const codeSymbols = [
  '{', '}', '(', ')', '[', ']', '<', '>',
  ';', ':', '=', '+', '-', '*', '/', '%',
  '&&', '||', '!', '?', '.',
  'function', 'const', 'let', 'var',
  'if', 'else', 'for', 'while', 'return',
  'import', 'export', 'class', 'interface',
  'async', 'await', 'true', 'false', 'null',
  '0', '1', 'react', 'next', 'jsx', 'tsx'
];

interface CodeParticlesProps {
  className?: string;
}

export default function CodeParticles({ className = '' }: CodeParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<THREE.Group | null>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Initialize Three.js scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Set up camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 15;
    cameraRef.current = camera;
    
    // Set up renderer with transparency
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Create a group for all particles
    const particlesGroup = new THREE.Group();
    scene.add(particlesGroup);
    particlesRef.current = particlesGroup;
    
    // Create text sprites for code symbols
    const createTextSprite = (text: string, position: THREE.Vector3, scale = 0.3, color = '#FF00FF') => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) return;
      
      canvas.width = 256;
      canvas.height = 128;
      
      // Background with transparency
      context.fillStyle = 'rgba(0, 0, 0, 0)';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // Text styling
      context.font = 'Bold 40px Courier New';
      context.fillStyle = color;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(text, canvas.width / 2, canvas.height / 2);
      
      // Create texture from canvas
      const texture = new THREE.CanvasTexture(canvas);
      
      // Create material with the texture
      const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0.8
      });
      
      // Create sprite with the material
      const sprite = new THREE.Sprite(material);
      sprite.position.copy(position);
      sprite.scale.set(scale, scale/2, 1);
      
      // Add random rotation speed
      const rotationSpeed = (Math.random() - 0.5) * 0.01;
      sprite.userData = { rotationSpeed };
      
      return sprite;
    };
    
    // Create particles with code symbols
    const createParticles = (count: number) => {
      for (let i = 0; i < count; i++) {
        const symbol = codeSymbols[Math.floor(Math.random() * codeSymbols.length)];
        
        // Random position in sphere
        const radius = 10;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        
        const position = new THREE.Vector3(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(phi)
        );
        
        // Alternate colors between pink and purple
        const color = i % 2 === 0 ? '#FF00FF' : '#7B00FF';
        
        const sprite = createTextSprite(symbol, position, 0.5 + Math.random() * 0.3, color);
        if (sprite) {
          // Add movement data
          sprite.userData.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 0.02,
            (Math.random() - 0.5) * 0.02,
            (Math.random() - 0.5) * 0.02
          );
          
          particlesGroup.add(sprite);
        }
      }
    };
    
    // Create particles
    createParticles(60);
    
    // Animation loop
    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      
      if (particlesGroup) {
        // Rotate the entire particle group
        particlesGroup.rotation.x += 0.001;
        particlesGroup.rotation.y += 0.0015;
        
        // Update individual particles
        particlesGroup.children.forEach((child) => {
          // Move particles slightly
          if (child.userData.velocity) {
            child.position.add(child.userData.velocity);
          }
          
          // Rotate particles
          if (child.userData.rotationSpeed) {
            child.rotation.z += child.userData.rotationSpeed;
          }
          
          // Boundary check and bounce
          const maxDistance = 12;
          if (child.position.length() > maxDistance) {
            const direction = child.position.clone().normalize();
            child.position.sub(direction.multiplyScalar(0.1));
            
            // Reflect velocity
            if (child.userData.velocity) {
              const velocity = child.userData.velocity;
              const normal = child.position.clone().normalize();
              const dot = velocity.dot(normal);
              velocity.sub(normal.multiplyScalar(2 * dot));
            }
          }
        });
      }
      
      renderer.render(scene, camera);
      
      return () => {
        cancelAnimationFrame(animationId);
      };
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);
  
  return (
    <div ref={containerRef} className={`absolute inset-0 -z-10 ${className}`} />
  );
} 