"use client";

import React, { useRef, useState } from "react";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glowColor?: string; // e.g. "rgba(99, 102, 241, 0.12)" (Indigo default)
  glowSize?: number; // default 400px
}

export default function SpotlightCard({
  children,
  className = "",
  glowColor = "rgba(34, 211, 238, 0.15)", // Premium BloopDocs Cyan default
  glowSize = 350,
  ...props
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCoords({ x, y });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.99] hover:bg-white/[0.08] hover:border-white/20 select-none ${className}`}
      {...props}
    >
      {/* Spotlight overlay glow element */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 will-change-transform"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(${glowSize}px circle at ${coords.x}px ${coords.y}px, ${glowColor}, transparent 50%)`,
        }}
      />

      {/* Structured inner card container */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
