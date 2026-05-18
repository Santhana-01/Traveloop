import React, { useRef, useEffect } from 'react';

/**
 * MagneticEffect - A high-performance wrapper that creates a "Fluid Push" interaction.
 * Elements subtly drift away from the cursor and spring back smoothly.
 */
const MagneticEffect = ({ 
  children, 
  strength = 6,      // Repel strength (max pixels to drift)
  range = 80,        // Proximity range to trigger the effect
  spring = 0.1,      // Spring back speed (0-1)
  className = "" 
}) => {
  const elementRef = useRef(null);
  const position = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const rafId = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!elementRef.current) return;

      const rect = elementRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      if (distance < range) {
        // Calculate repel direction (away from cursor)
        const angle = Math.atan2(distanceY, distanceX);
        
        // Inverse proportional force: stronger when closer
        const force = (1 - distance / range) * strength;
        
        // Move AWAY from cursor path
        target.current = {
          x: -Math.cos(angle) * force,
          y: -Math.sin(angle) * force,
        };
      } else {
        // Spring back to origin
        target.current = { x: 0, y: 0 };
      }
    };

    const update = () => {
      // Smooth interpolation for fluid spring motion
      position.current.x += (target.current.x - position.current.x) * spring;
      position.current.y += (target.current.y - position.current.y) * spring;

      if (elementRef.current) {
        // Use translate3d for hardware acceleration
        elementRef.current.style.transform = `translate3d(${position.current.x}px, ${position.current.y}px, 0)`;
      }

      rafId.current = requestAnimationFrame(update);
    };

    window.addEventListener('mousemove', handleMouseMove);
    rafId.current = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId.current);
    };
  }, [strength, range, spring]);

  return (
    <div 
      ref={elementRef} 
      className={`magnetic-wrapper ${className}`}
      style={{ 
        display: 'inline-block', 
        willChange: 'transform',
        pointerEvents: 'auto' 
      }}
    >
      {children}
    </div>
  );
};

export default MagneticEffect;
