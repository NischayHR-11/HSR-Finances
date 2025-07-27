import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeBackground = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const animationIdRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    if (!mountRef.current) return;

    console.log('ThreeBackground: Starting initialization...');

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    
    try {
      mountRef.current.appendChild(renderer.domElement);
      console.log('ThreeBackground: Canvas mounted successfully');
    } catch (error) {
      console.error('Failed to mount canvas:', error);
      return;
    }
    
    sceneRef.current = scene;
    rendererRef.current = renderer;

    // Create text texture function
    const createTextTexture = (text, color = '#4EEAFF') => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = 256;
      canvas.height = 256;
      
      // Clear canvas
      context.clearRect(0, 0, 256, 256);
      
      // Style the text
      context.fillStyle = color;
      context.font = 'bold 150px Arial';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      
      // Add glow effect
      context.shadowColor = color;
      context.shadowBlur = 30;
      context.fillText(text, 128, 128);
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    };

    // Financial symbols to display
    const symbols = ['$', '+', '-', '₹', '€', '¥', '100', '500', '1K', '5K', '10K'];
    const colors = ['#4EEAFF', '#22C55E', '#EF4444', '#F59E0B', '#8B5CF6', '#EC4899'];
    const particles = [];

    // Create floating particles
    for (let i = 0; i < 80; i++) {
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const texture = createTextTexture(symbol, color);
      
      const geometry = new THREE.PlaneGeometry(5, 5);
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      
      // Random positioning
      mesh.position.set(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 50
      );
      
      // Random rotation
      mesh.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );
      
      // Store animation data
      mesh.userData = {
        speedY: 0.5 + Math.random() * 1.5,
        speedX: (Math.random() - 0.5) * 0.5,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        originalX: mesh.position.x
      };
      
      scene.add(mesh);
      particles.push(mesh);
    }

    particlesRef.current = particles;
    console.log(`ThreeBackground: Created ${particles.length} floating symbols`);

    // Set camera position
    camera.position.z = 30;

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      // Move particles
      particles.forEach(particle => {
        // Move upward
        particle.position.y += particle.userData.speedY;
        
        // Slight horizontal drift
        particle.position.x += particle.userData.speedX;
        
        // Rotate
        particle.rotation.y += particle.userData.rotSpeed;
        particle.rotation.x += particle.userData.rotSpeed * 0.5;
        
        // Reset when out of bounds
        if (particle.position.y > 60) {
          particle.position.y = -60;
          particle.position.x = particle.userData.originalX + (Math.random() - 0.5) * 20;
        }
        
        if (Math.abs(particle.position.x) > 50) {
          particle.position.x = particle.userData.originalX;
        }
      });
      
      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      console.log('ThreeBackground: Cleaning up...');
      window.removeEventListener('resize', handleResize);
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      particles.forEach(particle => {
        if (particle.geometry) particle.geometry.dispose();
        if (particle.material) {
          if (particle.material.map) particle.material.map.dispose();
          particle.material.dispose();
        }
        scene.remove(particle);
      });
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none',
        overflow: 'hidden'
      }}
    />
  );
};

export default ThreeBackground;
