"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface ContactModelProps {
  width?: number;
  height?: number;
  className?: string;
}

export default function ContactModel({ width = 400, height = 300, className = "" }: ContactModelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xff00ff, 1, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x7b00ff, 1, 100);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    // Create a group to hold all objects
    const group = new THREE.Group();
    scene.add(group);
    groupRef.current = group;

    // Create a holographic display
    const displayGeometry = new THREE.BoxGeometry(3, 2, 0.1);
    const displayMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.1,
      side: THREE.DoubleSide
    });
    const display = new THREE.Mesh(displayGeometry, displayMaterial);
    group.add(display);

    // Add screen content
    const screenGeometry = new THREE.PlaneGeometry(2.8, 1.8);
    const screenMaterial = new THREE.MeshPhongMaterial({
      color: 0x00ff00,
      transparent: true,
      opacity: 0.2,
      side: THREE.DoubleSide
    });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.z = 0.06;
    group.add(screen);

    // Add grid pattern
    const gridGeometry = new THREE.PlaneGeometry(3, 2);
    const gridMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.05,
      wireframe: true,
      side: THREE.DoubleSide
    });
    const grid = new THREE.Mesh(gridGeometry, gridMaterial);
    grid.position.z = 0.05;
    group.add(grid);

    // Add floating UI elements
    const uiElements = [];
    for (let i = 0; i < 5; i++) {
      const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.1);
      const material = new THREE.MeshPhongMaterial({
        color: i % 2 === 0 ? 0xff00ff : 0x7b00ff,
        transparent: true,
        opacity: 0.3
      });
      const element = new THREE.Mesh(geometry, material);
      element.position.set(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 1.5,
        0.1
      );
      group.add(element);
      uiElements.push(element);
    }

    // Add particle effects
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 100;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 5;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: 0xff00ff,
      transparent: true,
      opacity: 0.5
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Animation
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      if (groupRef.current) {
        groupRef.current.rotation.y = Math.sin(time) * 0.1;
        groupRef.current.rotation.x = Math.cos(time) * 0.05;
      }

      // Animate UI elements
      uiElements.forEach((element, index) => {
        element.position.y += Math.sin(time + index) * 0.01;
        element.rotation.z += 0.01;
      });

      // Animate particles
      particles.rotation.y += 0.001;

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;

      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;

      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, [width, height]);

  return <div ref={containerRef} className={className} />;
} 