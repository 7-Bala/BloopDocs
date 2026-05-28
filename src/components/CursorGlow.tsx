"use client";

import React, { useEffect, useRef } from "react";

export default function CursorGlow() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  // Track actual mouse coords
  const mouse = useRef({ x: 0, y: 0 });
  // Track animated circle positions for elastic lag effect
  const cyanPos = useRef({ x: 0, y: 0 });
  const purplePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Check for touch devices (no hover capability) to disable cursor tracking on mobile
    if (typeof window === "undefined" || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    let animationFrameId: number;

    const updatePosition = () => {
      if (!containerRef.current) {
        animationFrameId = requestAnimationFrame(updatePosition);
        return;
      }

      // Linear interpolation (Lerp) for smooth trailing latency
      // Cyan follows faster (0.15), Purple trails slower (0.06)
      cyanPos.current.x += (mouse.current.x - cyanPos.current.x) * 0.15;
      cyanPos.current.y += (mouse.current.y - cyanPos.current.y) * 0.15;

      purplePos.current.x += (mouse.current.x - purplePos.current.x) * 0.06;
      purplePos.current.y += (mouse.current.y - purplePos.current.y) * 0.06;

      const cyanCircle = containerRef.current.querySelector(".cyan-glow") as HTMLDivElement;
      const purpleCircle = containerRef.current.querySelector(".purple-glow") as HTMLDivElement;

      if (cyanCircle) {
        // Offset by half of circle size (160px) to center it under cursor
        cyanCircle.style.transform = `translate3d(${cyanPos.current.x - 160}px, ${cyanPos.current.y - 160}px, 0)`;
      }
      
      if (purpleCircle) {
        // Offset by half of circle size (240px)
        purpleCircle.style.transform = `translate3d(${purplePos.current.x - 240}px, ${purplePos.current.y - 240}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(updatePosition);
    };

    animationFrameId = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      {/* Cyan Glow Sphere (Small, fast trail) */}
      <div className="cyan-glow absolute top-0 left-0 w-80 h-80 rounded-full bg-cyan-500/8 blur-[100px] mix-blend-screen will-change-transform" />

      {/* Purple Glow Sphere (Large, slow trailing atmospheric light) */}
      <div className="purple-glow absolute top-0 left-0 w-[480px] h-[480px] rounded-full bg-purple-600/6 blur-[140px] mix-blend-screen will-change-transform" />
    </div>
  );
}
