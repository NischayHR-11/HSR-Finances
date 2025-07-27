import { useEffect, useState } from 'react';
import './AnimatedBackground.css';

const AnimatedBackground = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const symbols = ['$', '$', '$', '+', '100', '500', '1K', '5K', '10K', '₹', '€', '£', '+', '+'];
    const colors = ['#4EEAFF', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];
    
    const newParticles = [];
    
    // Create more particles for better visibility
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1.2 + Math.random() * 2.5, // Larger sizes
        duration: 8 + Math.random() * 15,
        delay: Math.random() * 8
      });
    }
    
    setParticles(newParticles);
  }, []);

  return (
    <>
      <div className="animated-background">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="floating-particle"
            style={{
              '--x': `${particle.x}vw`,
              '--y': `${particle.y}vh`,
              '--color': particle.color,
              '--size': `${particle.size}rem`,
              '--duration': `${particle.duration}s`,
              '--delay': `${particle.delay}s`
            }}
          >
            {particle.symbol}
          </div>
        ))}
        
        {/* Additional glow effects */}
        <div className="glow-orb glow-orb-1"></div>
        <div className="glow-orb glow-orb-2"></div>
        <div className="glow-orb glow-orb-3"></div>
        
        {/* Grid pattern overlay */}
        <div className="grid-overlay"></div>
      </div>
    </>
  );
};

export default AnimatedBackground;
