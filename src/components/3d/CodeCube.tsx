"use client";

import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

// Code snippets for each face of the cube
const codeSnippets = [
  // JavaScript/TypeScript
  `function calculateTotal(items) {
  return items
    .filter(item => item.price > 0)
    .reduce((total, item) => 
      total + item.price * item.quantity, 0);
}`,

  // React
  `const App = () => {
  const [state, setState] = useState(0);
  
  useEffect(() => {
    document.title = \`Count: \${state}\`;
  }, [state]);
  
  return (
    <button onClick={() => setState(s => s + 1)}>
      Clicked {state} times
    </button>
  );
};`,

  // HTML/JSX
  `<div className="container">
  <header className="header">
    <h1>Welcome to my site</h1>
    <nav>
      <ul>
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
      </ul>
    </nav>
  </header>
</div>`,

  // CSS
  `.button {
  background: linear-gradient(45deg, 
    #FF00FF, #7B00FF);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  font-weight: 500;
  transition: opacity 0.2s;
}

.button:hover {
  opacity: 0.9;
}`,

  // Node.js
  `const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/api/data', async (req, res) => {
  try {
    const data = await fetchData();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port);`,

  // Python
  `def fibonacci(n):
    if n <= 1:
        return n
    else:
        return fibonacci(n-1) + fibonacci(n-2)

for i in range(10):
    print(fibonacci(i))
`
];

const createTextCanvas = (text: string, bgColor: string) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return canvas;
  
  canvas.width = 512;
  canvas.height = 512;
  
  // Background
  context.fillStyle = bgColor;
  context.fillRect(0, 0, canvas.width, canvas.height);
  
  // Text styling
  context.font = '16px Courier New';
  context.fillStyle = '#ffffff';
  context.textAlign = 'left';
  context.textBaseline = 'top';
  
  // Split text into lines and draw each line
  const lines = text.split('\n');
  const lineHeight = 20;
  const startY = 20;
  const startX = 20;
  
  lines.forEach((line, i) => {
    context.fillText(line, startX, startY + i * lineHeight);
  });
  
  return canvas;
};

interface CodeCubeProps {
  size?: number;
  className?: string;
}

export default function CodeCube({ size = 200, className = '' }: CodeCubeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create scene
    const scene = new THREE.Scene();
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75,
      1, // We're enforcing a square aspect ratio
      0.1,
      1000
    );
    camera.position.z = 3;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true
    });
    renderer.setSize(size, size);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    
    // Create cube materials with code snippets
    const materials = codeSnippets.map((snippet, index) => {
      // Alternate background colors
      const backgroundColor = index % 2 === 0 ? '#1e1e3f' : '#2d2b55'; // VSCode-like dark themes
      
      const canvas = createTextCanvas(snippet, backgroundColor);
      const texture = new THREE.CanvasTexture(canvas);
      
      return new THREE.MeshBasicMaterial({ map: texture });
    });
    
    // Create cube
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const cube = new THREE.Mesh(geometry, materials);
    scene.add(cube);
    
    // Initial rotation
    cube.rotation.x = Math.PI / 5;
    cube.rotation.y = -Math.PI / 5;
    
    // Animation variables
    let targetRotationX = cube.rotation.x;
    let targetRotationY = cube.rotation.y;
    let animating = true;
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (animating) {
        // Smooth rotation animation
        cube.rotation.x += (targetRotationX - cube.rotation.x) * 0.05;
        cube.rotation.y += (targetRotationY - cube.rotation.y) * 0.05;
        
        renderer.render(scene, camera);
      }
    };
    
    animate();
    
    // Hover animation controller
    const updateRotation = () => {
      if (isHovering) {
        // Faster continuous rotation when hovering
        targetRotationY = cube.rotation.y + 0.01;
        targetRotationX = cube.rotation.x + 0.005;
      } else {
        // Return to initial position when not hovering
        targetRotationX = Math.PI / 5;
        targetRotationY = -Math.PI / 5;
      }
    };
    
    // Update rotation based on hover state
    const intervalId = setInterval(updateRotation, 10);
    
    return () => {
      clearInterval(intervalId);
      animating = false;
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [size, isHovering]);
  
  return (
    <div 
      ref={containerRef} 
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{ width: size, height: size }}
    />
  );
} 