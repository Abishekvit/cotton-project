
import React, { useMemo } from 'react';

const COTTON_IMAGES = [
  "https://images.unsplash.com/photo-1594818379496-da1e345b0ded?q=80&w=150",
  "https://images.unsplash.com/photo-1558350315-8aa00e8e4590?q=80&w=150",
  "https://images.unsplash.com/photo-1623945193853-90768407481b?q=80&w=150",
  "https://images.unsplash.com/photo-1520038410233-7141be7e6f97?q=80&w=150",
  "https://images.unsplash.com/photo-1603561591411-0e7320b9ec9a?q=80&w=150"
];

interface OrbitalConfig {
  id: number;
  url: string;
  size: number;
  radius: number;
  duration: number; 
  spinDuration: number; 
  initialDelay: number;
}

const SpinningCottonBackground: React.FC = () => {
  // Generate configuration for 5 orbital items
  const configs = useMemo(() => {
    const list: OrbitalConfig[] = [];
    const count = 5;
    
    // Explicitly using forEach to populate configuration
    const indices = [0, 1, 2, 3, 4];
    indices.forEach((val) => {
      list.push({
        id: val,
        url: COTTON_IMAGES[val % COTTON_IMAGES.length],
        size: 64, // "5 size" style images
        radius: 130 + (val * 25), // Distinct orbital radii
        duration: 7 + (val * 5), // Varying speeds (slow and fast)
        spinDuration: 4 + Math.random() * 6,
        initialDelay: -(val * 3) 
      });
    });
    
    return list;
  }, []);

  // Using forEach to generate JSX elements as requested
  const orbitalElements: React.ReactNode[] = [];
  
  configs.forEach((cfg) => {
    orbitalElements.push(
      <div
        key={cfg.id}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          '--radius': `${cfg.radius}px`,
          animation: `orbit ${cfg.duration}s linear infinite`,
          animationDelay: `${cfg.initialDelay}s`
        } as React.CSSProperties}
      >
        <div 
          className="rounded-full overflow-hidden border-2 border-white/30 shadow-2xl backdrop-blur-sm"
          style={{
            width: cfg.size,
            height: cfg.size,
          }}
        >
          <img
            src={cfg.url}
            alt=""
            className="w-full h-full object-cover"
            style={{
              animation: `self-spin ${cfg.spinDuration}s linear infinite`
            }}
          />
        </div>
      </div>
    );
  });

  return (
    <div className="fixed top-0 right-0 w-1/3 h-full pointer-events-none overflow-hidden z-[50] select-none opacity-50 dark:opacity-30 flex items-center justify-center">
      <style>
        {`
          @keyframes orbit {
            from { transform: rotate(0deg) translateX(var(--radius)) rotate(0deg); }
            to { transform: rotate(360deg) translateX(var(--radius)) rotate(-360deg); }
          }
          @keyframes self-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
      
      {/* Container for the orbits */}
      <div className="relative w-1 h-1"> 
        {orbitalElements}
      </div>
    </div>
  );
};

export default SpinningCottonBackground;
