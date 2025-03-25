"use client";

import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

interface CodeEditorProps {
  width?: number;
  height?: number;
  className?: string;
}

export default function CodeEditor({ width = 400, height = 300, className = '' }: CodeEditorProps) {
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
      50,
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
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Create code editor window
    const createEditorGeometry = () => {
      // Main editor body
      const group = new THREE.Group();
      
      // Editor panel with slight curve at edges
      const panelGeometry = new THREE.BoxGeometry(4, 3, 0.1);
      const panelMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x1e1e3f,
        specular: 0x111133,
        shininess: 30
      }); // Dark blue VSCode-like color
      const panel = new THREE.Mesh(panelGeometry, panelMaterial);
      group.add(panel);
      
      // Top bar
      const topBarGeometry = new THREE.BoxGeometry(4, 0.3, 0.11);
      const topBarMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x252450,
        specular: 0x222244,
        shininess: 40
      });
      const topBar = new THREE.Mesh(topBarGeometry, topBarMaterial);
      topBar.position.y = 1.35;
      group.add(topBar);
      
      // Create window control dots
      const dotGeometry = new THREE.CircleGeometry(0.05, 32);
      const redDotMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xff3b30,
        emissive: 0xff3b30,
        emissiveIntensity: 0.2
      });
      const yellowDotMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xffcc00,
        emissive: 0xffcc00,
        emissiveIntensity: 0.2
      });
      const greenDotMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x34c759,
        emissive: 0x34c759,
        emissiveIntensity: 0.2
      });
      
      const redDot = new THREE.Mesh(dotGeometry, redDotMaterial);
      redDot.position.set(-1.8, 1.35, 0.06);
      
      const yellowDot = new THREE.Mesh(dotGeometry, yellowDotMaterial);
      yellowDot.position.set(-1.6, 1.35, 0.06);
      
      const greenDot = new THREE.Mesh(dotGeometry, greenDotMaterial);
      greenDot.position.set(-1.4, 1.35, 0.06);
      
      group.add(redDot);
      group.add(yellowDot);
      group.add(greenDot);
      
      // Side panel
      const sidePanelGeometry = new THREE.BoxGeometry(0.5, 3, 0.11);
      const sidePanelMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x191933,
        specular: 0x111122,
        shininess: 30
      });
      const sidePanel = new THREE.Mesh(sidePanelGeometry, sidePanelMaterial);
      sidePanel.position.x = -1.75;
      group.add(sidePanel);
      
      // Create code lines
      const createCodeLines = () => {
        const linesGroup = new THREE.Group();
        const lineCount = 12;
        const colors = [0xeeeeee, 0xff00ff, 0x777777, 0x7b00ff];
        
        for (let i = 0; i < lineCount; i++) {
          const lineWidth = 1.5 + Math.random() * 1.3; // Random width
          const lineGeometry = new THREE.PlaneGeometry(lineWidth, 0.08);
          const colorIndex = Math.floor(Math.random() * colors.length);
          const lineMaterial = new THREE.MeshBasicMaterial({ 
            color: colors[colorIndex],
            transparent: true,
            opacity: 0.8
          });
          
          const line = new THREE.Mesh(lineGeometry, lineMaterial);
          line.position.y = 0.8 - i * 0.2;
          line.position.x = -0.7 + Math.random() * 0.5; // Slight random offset
          line.position.z = 0.06;
          
          // Add random "indent" to some lines
          if (i > 0 && Math.random() > 0.5) {
            line.position.x += 0.3;
          }
          
          linesGroup.add(line);
        }
        
        return linesGroup;
      };
      
      const codeLines = createCodeLines();
      group.add(codeLines);
      
      // Add cursor
      const cursorGeometry = new THREE.PlaneGeometry(0.05, 0.18);
      const cursorMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffffff, 
        transparent: true,
        opacity: 0.8
      });
      const cursor = new THREE.Mesh(cursorGeometry, cursorMaterial);
      cursor.position.set(0.8, 0.2, 0.07);
      
      // Cursor blinking animation
      const blinkCursor = () => {
        let visible = true;
        setInterval(() => {
          if (visible) {
            cursor.visible = false;
          } else {
            cursor.visible = true;
          }
          visible = !visible;
        }, 500);
      };
      
      blinkCursor();
      group.add(cursor);
      
      return group;
    };
    
    const editor = createEditorGeometry();
    scene.add(editor);
    
    // Handle mouse movement
    const handleMouseMove = (event: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      
      // Calculate mouse position in normalized device coordinates (-1 to +1)
      const x = ((event.clientX - rect.left) / width) * 2 - 1;
      const y = -((event.clientY - rect.top) / height) * 2 + 1;
      
      mousePosition.current = { x, y };
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Add a slight floating animation
    let elapsedTime = 0;
    
    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      elapsedTime += 0.01;
      
      // Base floating effect
      const baseYFloat = Math.sin(elapsedTime) * 0.1;
      const baseXRotation = Math.sin(elapsedTime * 0.5) * 0.03;
      const baseYRotation = Math.sin(elapsedTime * 0.3) * 0.1;
      
      // Apply hover effect if hovered
      if (isHovered) {
        // Respond to mouse position
        editor.rotation.y = baseYRotation + mousePosition.current.x * 0.3;
        editor.rotation.x = baseXRotation - mousePosition.current.y * 0.2;
        
        // Slightly elevated when hovered
        editor.position.y = baseYFloat + 0.1;
        
        // Add glow effect when hovered (handled in CSS)
      } else {
        // Normal animation when not hovered
        editor.position.y = baseYFloat;
        editor.rotation.x = baseXRotation;
        editor.rotation.y = baseYRotation;
      }
      
      // Apply click effect
      if (isClicked) {
        editor.scale.set(1.05, 1.05, 1.05);
      } else {
        editor.scale.set(1, 1, 1);
      }
      
      renderer.render(scene, camera);
      
      return () => {
        cancelAnimationFrame(animationId);
      };
    };
    
    animate();
    
    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [width, height, isHovered, isClicked]);
  
  return (
    <div 
      ref={containerRef} 
      className={`relative cursor-pointer ${isHovered ? 'glow-effect' : ''} ${className}`}
      style={{ width, height }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsClicked(false);
      }}
      onMouseDown={() => setIsClicked(true)}
      onMouseUp={() => setIsClicked(false)}
    />
  );
} 