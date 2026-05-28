"use client";

import React, { useEffect, useRef } from "react";

/**
 * Hardware-accelerated cursor trail using canvas.
 * 
 * Glitch-proofed:
 *  - Points stored in a flat typed-like array, swapped out each frame (no splice)
 *  - Capped at 80 points max to prevent frame drops on fast mouse
 *  - Canvas dimensions cached to avoid repeated DOM reads in render loop
 *  - DPR handled once on resize, not per-frame
 */

const MAX_POINTS = 80;
const DECAY_RATE = 0.05;
const INITIAL_SIZE = 14;

interface Pt {
  x: number;
  y: number;
  alpha: number;
}

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let points: Pt[] = [];

    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      // Cap the points array to prevent unbounded growth
      if (points.length >= MAX_POINTS) {
        points.shift();
      }
      points.push({ x: e.clientX, y: e.clientY, alpha: 1.0 });
    };

    window.addEventListener("mousemove", onMove);

    const render = () => {
      ctx.clearRect(0, 0, w, h);

      // Build the next frame's points without splice (no index jumps)
      const next: Pt[] = [];
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const size = INITIAL_SIZE * p.alpha;
        ctx.fillStyle = `rgba(134,41,55,${p.alpha})`;
        ctx.fillRect(p.x - size * 0.5, p.y - size * 0.5, size, size);
        p.alpha -= DECAY_RATE;
        if (p.alpha > 0) {
          next.push(p);
        }
      }
      points = next;

      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[9999]"
      aria-hidden="true"
    />
  );
}
