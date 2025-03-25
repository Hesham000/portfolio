"use client";

import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

interface ProjectsModelProps {
  width?: number;
  height?: number;
  className?: string;
}

export default function ProjectsModel({ 
  width = 450, 
  height = 350, 
  className = '' 
}: ProjectsModelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const mousePosition = useRef({ x: 0, y: 0 });
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      width / height,
      0.1,
      1000
    );
    camera.position.z = 5;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xff00ff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    
    const pointLight2 = new THREE.PointLight(0x7b00ff, 1);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);
    
    // Create a group to hold all objects
    const group = new THREE.Group();
    scene.add(group);
    
    // Create holographic project showcase
    const createProjectShowcase = () => {
      // Main holographic display
      const displayGeometry = new THREE.BoxGeometry(3, 2, 0.2);
      const displayMaterial = new THREE.MeshPhongMaterial({
        color: 0x1a1a2e,
        specular: 0x666666,
        shininess: 100,
        transparent: true,
        opacity: 0.9
      });
      
      const display = new THREE.Mesh(displayGeometry, displayMaterial);
      group.add(display);
      
      // Screen content - code editor interface
      const screenGeometry = new THREE.PlaneGeometry(2.8, 1.8);
      const screenMaterial = new THREE.MeshBasicMaterial({
        color: 0x0f0f1a,
        side: THREE.DoubleSide
      });
      
      const screen = new THREE.Mesh(screenGeometry, screenMaterial);
      screen.position.z = 0.11;
      group.add(screen);
      
      // Create code grid pattern
      const gridSize = 10;
      const gridGroup = new THREE.Group();
      
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          if (Math.random() > 0.7) continue; // Create some empty spaces
          
          const cellWidth = 2.6 / gridSize;
          const cellHeight = 1.6 / gridSize;
          const cellGeometry = new THREE.PlaneGeometry(cellWidth * 0.9, cellHeight * 0.9);
          
          // Different colors for different types of cells
          const colorOptions = [0xff00ff, 0x7b00ff, 0x00bbff];
          const colorIndex = Math.floor(Math.random() * colorOptions.length);
          
          const cellMaterial = new THREE.MeshBasicMaterial({
            color: colorOptions[colorIndex],
            transparent: true,
            opacity: 0.1 + Math.random() * 0.2
          });
          
          const cell = new THREE.Mesh(cellGeometry, cellMaterial);
          
          // Position in grid
          cell.position.x = -1.3 + cellWidth * (i + 0.5);
          cell.position.y = -0.8 + cellHeight * (j + 0.5);
          cell.position.z = 0.12;
          
          gridGroup.add(cell);
        }
      }
      
      group.add(gridGroup);
      
      // Create floating UI elements
      const createUIElements = () => {
        const uiGroup = new THREE.Group();
        
        // Create floating menu bar
        const menuBarGeometry = new THREE.PlaneGeometry(2.4, 0.15);
        const menuBarMaterial = new THREE.MeshBasicMaterial({
          color: 0xff00ff,
          transparent: true,
          opacity: 0.3
        });
        
        const menuBar = new THREE.Mesh(menuBarGeometry, menuBarMaterial);
        menuBar.position.y = 0.7;
        menuBar.position.z = 0.13;
        uiGroup.add(menuBar);
        
        // Create menu buttons
        const buttonCount = 4;
        const buttonWidth = 0.12;
        const buttonSpacing = 0.18;
        
        for (let i = 0; i < buttonCount; i++) {
          const buttonGeometry = new THREE.CircleGeometry(buttonWidth / 2, 16);
          const buttonMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.8
          });
          
          const button = new THREE.Mesh(buttonGeometry, buttonMaterial);
          button.position.x = -1 + (i * buttonSpacing);
          button.position.y = 0.7;
          button.position.z = 0.14;
          uiGroup.add(button);
        }
        
        // Create project cards
        const cardCount = 3;
        const cardWidth = 0.8;
        const cardHeight = 0.6;
        const cardSpacing = 0.9;
        
        for (let i = 0; i < cardCount; i++) {
          const cardGeometry = new THREE.PlaneGeometry(cardWidth, cardHeight);
          const cardMaterial = new THREE.MeshBasicMaterial({
            color: i === 1 ? 0x7b00ff : 0x222236,
            transparent: true,
            opacity: i === 1 ? 0.5 : 0.3
          });
          
          const card = new THREE.Mesh(cardGeometry, cardMaterial);
          card.position.x = -0.9 + (i * cardSpacing);
          card.position.y = 0;
          card.position.z = 0.14;
          
          // Add card border
          const borderGeometry = new THREE.EdgesGeometry(cardGeometry);
          const borderMaterial = new THREE.LineBasicMaterial({ 
            color: 0xff00ff,
            transparent: true,
            opacity: i === 1 ? 0.8 : 0.4
          });
          
          const border = new THREE.LineSegments(borderGeometry, borderMaterial);
          card.add(border);
          
          // Add card content lines
          for (let j = 0; j < 3; j++) {
            const lineGeometry = new THREE.PlaneGeometry(cardWidth * 0.7, 0.04);
            const lineMaterial = new THREE.MeshBasicMaterial({
              color: 0xffffff,
              transparent: true,
              opacity: 0.5
            });
            
            const line = new THREE.Mesh(lineGeometry, lineMaterial);
            line.position.y = 0.15 - (j * 0.15);
            card.add(line);
          }
          
          uiGroup.add(card);
        }
        
        // Add stats bars at the bottom
        const barCount = 4;
        const barWidth = 2.4 / barCount;
        const barSpacing = barWidth + 0.05;
        
        for (let i = 0; i < barCount; i++) {
          const barHeight = 0.05 + Math.random() * 0.1;
          const barGeometry = new THREE.PlaneGeometry(barWidth - 0.05, barHeight);
          
          // Different colors for different bars
          const colorOptions = [0xff00ff, 0x7b00ff, 0x00bbff];
          const colorIndex = Math.floor(Math.random() * colorOptions.length);
          
          const barMaterial = new THREE.MeshBasicMaterial({
            color: colorOptions[colorIndex],
            transparent: true,
            opacity: 0.6
          });
          
          const bar = new THREE.Mesh(barGeometry, barMaterial);
          bar.position.x = -1.2 + (i * barSpacing) + barWidth / 2;
          bar.position.y = -0.6;
          bar.position.z = 0.13;
          uiGroup.add(bar);
        }
        
        return uiGroup;
      };
      
      const uiElements = createUIElements();
      group.add(uiElements);
      
      // Add floating particles
      const particlesCount = 30;
      const particlesGeometry = new THREE.BufferGeometry();
      const particlePositions = [];
      const particleSizes = [];
      
      for (let i = 0; i < particlesCount; i++) {
        // Random positions within display bounds
        const x = (Math.random() - 0.5) * 3;
        const y = (Math.random() - 0.5) * 2;
        const z = Math.random() * 0.5 + 0.2;
        
        particlePositions.push(x, y, z);
        particleSizes.push(Math.random() * 3 + 1);
      }
      
      particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(particlePositions, 3));
      particlesGeometry.setAttribute('size', new THREE.Float32BufferAttribute(particleSizes, 1));
      
      // Create shader material for particles
      const particlesMaterial = new THREE.PointsMaterial({
        color: 0xff00ff,
        size: 0.05,
        transparent: true,
        opacity: 0.6,
        sizeAttenuation: true
      });
      
      const particles = new THREE.Points(particlesGeometry, particlesMaterial);
      group.add(particles);
      
      return {
        display,
        screen,
        gridGroup,
        uiElements,
        particles
      };
    };
    
    const showcase = createProjectShowcase();
    
    // Handle mouse movements for interactivity
    containerRef.current.addEventListener('mouseenter', () => setIsHovered(true));
    containerRef.current.addEventListener('mouseleave', () => setIsHovered(false));
    containerRef.current.addEventListener('mousedown', () => setIsClicked(true));
    containerRef.current.addEventListener('mouseup', () => setIsClicked(false));
    
    const handleMouseMove = (event: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      
      // Calculate mouse position in normalized device coordinates (-1 to +1)
      const x = ((event.clientX - rect.left) / width) * 2 - 1;
      const y = -((event.clientY - rect.top) / height) * 2 + 1;
      
      mousePosition.current = { x, y };
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Animation loop
    let animationFrame = 0;
    let elapsedTime = 0;
    
    const animate = () => {
      animationFrame = requestAnimationFrame(animate);
      elapsedTime += 0.01;
      
      // Base floating animation
      const baseYFloat = Math.sin(elapsedTime) * 0.05;
      
      // Dynamic UI elements animation
      showcase.uiElements.children.forEach((child, index) => {
        if (index > 4) { // Only animate the cards
          child.position.y = baseYFloat * (index % 2 === 0 ? 1 : -1) * 0.5;
        }
      });
      
      // Grid cells pulse
      showcase.gridGroup.children.forEach((cell, index) => {
        const offset = index * 0.1;
        const pulse = Math.sin(elapsedTime * 2 + offset) * 0.5 + 0.5;
        (cell.material as THREE.MeshBasicMaterial).opacity = 0.1 + pulse * 0.2;
      });
      
      // Particles animation
      showcase.particles.children.forEach((particle, index) => {
        const offset = index * 0.1;
        particle.position.y = particle.position.y + Math.sin(elapsedTime + offset) * 0.001;
      });
      
      // Apply interactive rotation based on mouse position if hovered
      if (isHovered) {
        group.rotation.y = mousePosition.current.x * 0.2;
        group.rotation.x = -mousePosition.current.y * 0.1;
        
        // Slightly elevate when hovered
        group.position.z = 0.2;
      } else {
        // Gentle rotation when not hovered
        group.rotation.y = Math.sin(elapsedTime * 0.5) * 0.1;
        group.rotation.x = Math.sin(elapsedTime * 0.3) * 0.05;
        group.position.z = 0;
      }
      
      // Click effect - slight scale up
      if (isClicked) {
        group.scale.set(1.02, 1.02, 1.02);
      } else {
        group.scale.set(1, 1, 1);
      }
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      containerRef.current?.removeEventListener('mouseenter', () => setIsHovered(true));
      containerRef.current?.removeEventListener('mouseleave', () => setIsHovered(false));
      containerRef.current?.removeEventListener('mousedown', () => setIsClicked(true));
      containerRef.current?.removeEventListener('mouseup', () => setIsClicked(false));
    };
  }, [width, height]);
  
  return (
    <div 
      ref={containerRef} 
      className={`relative ${className}`}
      style={{ 
        width: width, 
        height: height,
        cursor: isHovered ? 'pointer' : 'default'
      }}
    />
  );
} 