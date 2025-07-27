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

    // Enhanced text texture function with special styling for currency notes
    const createTextTexture = (text, color = '#4EEAFF') => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = 256;
      canvas.height = 256;
      
      // Clear canvas
      context.clearRect(0, 0, 256, 256);
      
      // Check if it's a currency note emoji
      const isCurrencyNote = ['💵', '💴', '💶', '💷', '💳', '💰'].includes(text);
      
      if (isCurrencyNote) {
        // Special styling for currency notes
        context.fillStyle = color;
        context.font = 'bold 120px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        
        // Add enhanced green glow effect for currency notes
        context.shadowColor = color;
        context.shadowBlur = 35;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        
        // Draw with multiple glow layers
        context.fillText(text, 128, 128);
        
        context.globalCompositeOperation = 'screen';
        context.shadowBlur = 45;
        context.fillText(text, 128, 128);
      } else {
        // Regular styling for other symbols
        context.fillStyle = color;
        context.font = 'bold 150px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        
        // Add glow effect
        context.shadowColor = color;
        context.shadowBlur = 30;
        context.fillText(text, 128, 128);
      }
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    };

    // Financial symbols including currency notes
    const symbols = ['$', '+', '-', '₹', '€', '¥', '100', '500', '1K', '5K', '10K', '💵', '💴', '💶', '💷', '💳', '🪙', '📊', '📈', '💰'];
    
    // Enhanced color palette with more green variations for currency notes
    const colors = [
      '#4EEAFF',  // Cyan
      '#22C55E',  // Green
      '#16A34A',  // Dark Green (currency note green)
      '#15803D',  // Forest Green  
      '#166534',  // Deep Green
      '#10B981',  // Emerald
      '#059669',  // Emerald Dark
      '#047857',  // Emerald Darker
      '#EF4444',  // Red
      '#F59E0B',  // Yellow
      '#8B5CF6',  // Purple
      '#EC4899'   // Pink
    ];
    const particles = [];

    // Create fewer floating particles for calmer effect
    for (let i = 0; i < 40; i++) { // Reduced from 80 to 40
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const texture = createTextTexture(symbol, color);
      
      const geometry = new THREE.PlaneGeometry(4, 4); // Slightly smaller
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.6, // More transparent for subtle effect
        side: THREE.DoubleSide
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      
      // More spread out positioning
      mesh.position.set(
        (Math.random() - 0.5) * 120, // Wider spread
        Math.random() * 120 - 60,    // Full height range
        (Math.random() - 0.5) * 60   // More depth
      );
      
      // Random rotation
      mesh.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );
      
      // Store animation data with slower, smoother speeds
      mesh.userData = {
        speedY: 0.08 + Math.random() * 0.12, // Much slower upward movement (was 0.5-2.0)
        speedX: (Math.random() - 0.5) * 0.03, // Gentle horizontal drift (was 0.5)
        rotSpeed: (Math.random() - 0.5) * 0.005, // Slow rotation (was 0.02)
        originalX: mesh.position.x,
        // Add smooth oscillation for more organic movement
        oscillationSpeed: 0.01 + Math.random() * 0.02,
        oscillationAmplitude: 1 + Math.random() * 2
      };
      
      scene.add(mesh);
      particles.push(mesh);
    }

    // Create special currency note elements (larger, greener, more prominent)
    const currencyNotes = ['💵', '💴', '💶', '💷', '💳', '💰'];
    const greenShades = ['#22C55E', '#16A34A', '#15803D', '#166534', '#10B981', '#059669'];
    
    for (let i = 0; i < 15; i++) { // Add 15 currency note elements
      const note = currencyNotes[Math.floor(Math.random() * currencyNotes.length)];
      const greenColor = greenShades[Math.floor(Math.random() * greenShades.length)];
      const texture = createTextTexture(note, greenColor);
      
      const geometry = new THREE.PlaneGeometry(6, 6); // Larger size for currency notes
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.7, // Slightly more opaque for prominence
        side: THREE.DoubleSide
      });
      
      const noteMesh = new THREE.Mesh(geometry, material);
      
      // Position currency notes
      noteMesh.position.set(
        (Math.random() - 0.5) * 100,
        Math.random() * 120 - 60,
        (Math.random() - 0.5) * 50
      );
      
      // Random rotation
      noteMesh.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );
      
      // Slower animation for currency notes (more majestic movement)
      noteMesh.userData = {
        speedY: 0.05 + Math.random() * 0.08, // Even slower for currency notes
        speedX: (Math.random() - 0.5) * 0.02,
        rotSpeed: (Math.random() - 0.5) * 0.003, // Very slow rotation
        originalX: noteMesh.position.x,
        oscillationSpeed: 0.008 + Math.random() * 0.015,
        oscillationAmplitude: 2 + Math.random() * 3,
        isCurrencyNote: true // Flag to identify currency notes
      };
      
      scene.add(noteMesh);
      particles.push(noteMesh);
    }

    particlesRef.current = particles;
    console.log(`ThreeBackground: Created ${particles.length} floating symbols (including currency notes)`);

    // Set camera position
    camera.position.z = 30;

    // Animation loop with smooth, slow movements
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      const time = Date.now() * 0.001; // Time for smooth oscillations
      
      // Move particles with gentle, smooth animations
      particles.forEach((particle, index) => {
        // Slow upward movement
        particle.position.y += particle.userData.speedY;
        
        // Gentle horizontal oscillation instead of linear drift
        const oscillation = Math.sin(time * particle.userData.oscillationSpeed + index) 
                          * particle.userData.oscillationAmplitude;
        particle.position.x = particle.userData.originalX + oscillation;
        
        // Very slow, smooth rotation
        particle.rotation.y += particle.userData.rotSpeed;
        particle.rotation.x += particle.userData.rotSpeed * 0.3;
        particle.rotation.z += particle.userData.rotSpeed * 0.7;
        
        // Reset when out of bounds with smooth transition
        if (particle.position.y > 60) {
          particle.position.y = -60;
          // Keep original X position for consistent oscillation
          particle.userData.originalX = (Math.random() - 0.5) * 80;
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
