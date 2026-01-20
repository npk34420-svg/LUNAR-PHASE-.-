
import React from 'react';

interface MoonDisplayProps {
  illumination: number;
  isWaxing: boolean;
  size?: number;
  glow?: boolean;
}

export const MoonDisplay: React.FC<MoonDisplayProps> = ({ illumination, isWaxing, size = 150, glow = false }) => {
  const percentage = illumination * 100;
  
  return (
    <div 
      className={`relative rounded-full overflow-hidden transition-all duration-700 ${glow ? 'shadow-[0_0_80px_rgba(147,197,253,0.4),inset_0_0_30px_rgba(255,255,255,0.1)]' : 'shadow-inner'}`}
      style={{ 
        width: size, 
        height: size, 
        backgroundColor: '#0f172a',
      }}
    >
      {/* Texture: Procedural Craters */}
      <div className="absolute inset-0 opacity-40 pointer-events-none" style={{
        backgroundImage: `
          radial-gradient(circle at 30% 20%, rgba(0,0,0,0.2) 2%, transparent 8%),
          radial-gradient(circle at 70% 60%, rgba(0,0,0,0.2) 4%, transparent 12%),
          radial-gradient(circle at 40% 80%, rgba(0,0,0,0.1) 3%, transparent 10%),
          radial-gradient(circle at 80% 30%, rgba(0,0,0,0.15) 5%, transparent 15%)
        `,
        backgroundSize: '100% 100%'
      }}></div>
      
      {/* Dynamic Light Part */}
      <div 
        className="absolute inset-0 bg-[#f1f5f9] transition-all duration-700 ease-in-out"
        style={{
          clipPath: isWaxing 
            ? `inset(0 0 0 ${100 - percentage}%)` 
            : `inset(0 ${100 - percentage}% 0 0)`,
        }}
      >
        {/* Detail texture on the lit part */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')]"></div>
      </div>

      {/* Spherical Shading Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-white/20 pointer-events-none rounded-full border border-white/5"></div>
      
      {/* Terminate Line Glow (Transition between light and dark) */}
      <div 
        className="absolute inset-0 pointer-events-none transition-all duration-700"
        style={{
          boxShadow: `inset ${isWaxing ? '-' : ''}${size/10}px 0 ${size/4}px rgba(0,0,0,0.8)`
        }}
      ></div>
    </div>
  );
};
