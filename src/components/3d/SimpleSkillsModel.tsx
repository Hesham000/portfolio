"use client";

import { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface SimpleSkillsModelProps {
  size?: number;
  className?: string;
}

export default function SimpleSkillsModel({ 
  size = 280, 
  className = '' 
}: SimpleSkillsModelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      50,
      1, // We enforce a square aspect ratio
      0.1,
      1000
    );
    camera.position.z = 5;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true
    });
    renderer.setSize(size, size);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    
    // Create a group to hold all objects
    const group = new THREE.Group();
    scene.add(group);
    
    // Create skill orbs in a spherical arrangement
    const skillsColors = [
      0xFF00FF, // Pink
      0x7B00FF, // Purple
      0x00BBFF, // Blue
      0xFFAA00, // Orange
      0x00CC88  // Green
    ];
    
    const createOrbs = () => {
      const orbCount = 25;
      const radius = 2;
      
      for (let i = 0; i < orbCount; i++) {
        // Calculate position on a sphere
        const phi = Math.acos(-1 + (2 * i) / orbCount);
        const theta = Math.sqrt(orbCount * Math.PI) * phi;
        
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        
        // Create orb
        const size = 0.1 + Math.random() * 0.15;
        const geometry = new THREE.SphereGeometry(size, 16, 16);
        
        // Choose color
        const colorIndex = i % skillsColors.length;
        const color = skillsColors[colorIndex];
        
        const material = new THREE.MeshPhongMaterial({
          color: color,
          emissive: color,
          emissiveIntensity: 0.2,
          shininess: 80
        });
        
        const orb = new THREE.Mesh(geometry, material);
        orb.position.set(x, y, z);
        
        // Add to group
        group.add(orb);
        
        // Add connection lines between some orbs for visual effect
        if (i > 0 && i % 3 === 0 && i < orbCount - 1) {
          // Connect to next orb
          const nextPhi = Math.acos(-1 + (2 * (i + 1)) / orbCount);
          const nextTheta = Math.sqrt(orbCount * Math.PI) * nextPhi;
          
          const nextX = radius * Math.sin(nextPhi) * Math.cos(nextTheta);
          const nextY = radius * Math.sin(nextPhi) * Math.sin(nextTheta);
          const nextZ = radius * Math.cos(nextPhi);
          
          const lineGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(x, y, z),
            new THREE.Vector3(nextX, nextY, nextZ)
          ]);
          
          const lineMaterial = new THREE.LineBasicMaterial({ 
            color: color,
            opacity: 0.4,
            transparent: true
          });
          
          const line = new THREE.Line(lineGeometry, lineMaterial);
          group.add(line);
        }
      }
      
      // Add central orb
      const centerGeometry = new THREE.SphereGeometry(0.5, 24, 24);
      const centerMaterial = new THREE.MeshPhongMaterial({
        color: 0xFFFFFF,
        emissive: 0xFFFFFF,
        emissiveIntensity: 0.1,
        transparent: true,
        opacity: 0.9,
        shininess: 100
      });
      
      const centerOrb = new THREE.Mesh(centerGeometry, centerMaterial);
      group.add(centerOrb);
      
      // Add glow effect around center
      const glowGeometry = new THREE.SphereGeometry(0.6, 24, 24);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xFF00FF,
        transparent: true,
        opacity: 0.1,
        side: THREE.BackSide
      });
      
      const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
      glowMesh.scale.multiplyScalar(1.2);
      group.add(glowMesh);
    };
    
    createOrbs();
    
    // Animation loop
    let animationFrame = 0;
    const animate = () => {
      animationFrame = requestAnimationFrame(animate);
      
      // Rotate the entire group
      group.rotation.y += 0.002;
      group.rotation.x += 0.001;
      
      // Pulse effect on central glow
      const time = Date.now() * 0.001;
      const pulse = Math.sin(time) * 0.1 + 1;
      
      // Apply pulse to the central orb scale
      if (group.children[group.children.length - 1]) {
        const glowMesh = group.children[group.children.length - 1];
        glowMesh.scale.set(1.2 * pulse, 1.2 * pulse, 1.2 * pulse);
      }
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      camera.aspect = 1; // Keep aspect ratio square
      camera.updateProjectionMatrix();
      renderer.setSize(size, size);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [size]);
  
  return (
    <div 
      ref={containerRef} 
      className={`relative ${className}`}
      style={{ 
        width: size, 
        height: size,
        cursor: 'default'
      }}
    />
  );
} 