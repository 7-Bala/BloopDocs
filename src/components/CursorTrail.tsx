"use client";

import React, { useEffect, useRef } from "react";

interface TrailPoint {
  x: number;
  y: number;
  alpha: number;
  size: number;
}

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointsRef = useRef<TrailPoint[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    // Handle high-DPI (Retina) scaling for absolute crispness
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0); // reset scale matrix
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Silky smooth event handler (Zero React state triggers)
    const handleMouseMove = (e: MouseEvent) => {
      pointsRef.current.push({
        x: e.clientX,
        y: e.clientY,
        alpha: 1.0,
        size: 16, // Stark 16px square
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Hardware-accelerated Render loop
    const render = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const points = pointsRef.current;
      for (let i = points.length - 1; i >= 0; i--) {
        const p = points[i];
        
        // Beautiful brutalist tapered size decay
        const size = p.size * p.alpha;

        // Draw crisp solid square
        ctx.fillStyle = `rgba(134, 41, 55, ${p.alpha})`; // #862937
        ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size);

        // Smooth linear opacity decay
        p.alpha -= 0.06;
        
        // Clean up dead points
        if (p.alpha <= 0) {
          points.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[9999] w-full h-full"
    />
  );
}
