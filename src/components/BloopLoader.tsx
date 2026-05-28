"use client";

import React, { useRef, useEffect, useState } from "react";
import { useBloopMorph } from "../hooks/useGsapTimeline";

interface BloopLoaderProps {
  isActive: boolean;
}

const LOADING_MESSAGES = [
  "Uploading document structure...",
  "Parsing layout geometry...",
  "Mapping typographic rules...",
  "Translating brand assets...",
  "Formatting layout grids...",
  "Polishing final elements...",
  "Assembling document package...",
];

export default function BloopLoader({ isActive }: BloopLoaderProps) {
  const pathRef = useRef<SVGPathElement | null>(null);
  const filterRef = useRef<SVGFETurbulenceElement | null>(null);
  const [messageIndex, setMessageIndex] = useState(0);

  // Activate isolated GSAP morphing and displacement animation hook
  useBloopMorph(pathRef, filterRef, isActive);

  // Cycle through detailed loading descriptions
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 1800);

    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center select-none animate-fade-in bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 max-w-sm mx-auto shadow-[0_8px_32px_0_rgba(31,38,135,0.2)]">
      {/* Morphing Bubble Vector */}
      <div className="relative w-40 h-40 mb-8 flex items-center justify-center">
        {/* Soft background glow matching morph */}
        <div className="absolute inset-2 bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse" />

        <svg
          viewBox="0 0 100 100"
          className="bloop-svg w-full h-full relative z-10"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Custom SVG Liquid Filter */}
          <defs>
            <filter id="liquid-filter" x="-20%" y="-20%" width="140%" height="140%">
              {/*feTurbulence produces organic visual distortion */}
              <feTurbulence
                ref={filterRef}
                type="fractalNoise"
                baseFrequency="0.02 0.05"
                numOctaves="3"
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale="10"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>

            {/* Gradient definition */}
            <linearGradient id="bloop-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" /> {/* cyan-400 */}
              <stop offset="50%" stopColor="#818cf8" /> {/* indigo-450 */}
              <stop offset="100%" stopColor="#c084fc" /> {/* purple-400 */}
            </linearGradient>
          </defs>

          {/* Morphing path element */}
          <path
            ref={pathRef}
            d="M25,50 C25,25 50,25 50,25 C50,25 75,25 75,50 C75,75 75,75 50,75 C25,75 25,75 25,50 Z"
            fill="url(#bloop-grad)"
            filter="url(#liquid-filter)"
            className="transition-transform duration-300 scale-90 origin-center"
          />
        </svg>
        
        {/* Playful center logo text rotating slowly */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="w-9 h-9 rounded-xl bg-slate-950/80 border border-white/10 flex items-center justify-center animate-spin-slow shadow-lg">
            <span className="text-white text-[10px] font-black tracking-widest animate-pulse">BD</span>
          </div>
        </div>
      </div>

      {/* Loading message */}
      <div className="h-6 overflow-hidden">
        <p className="text-xs font-extrabold text-slate-200 uppercase tracking-widest animate-pulse transition-all duration-300">
          {LOADING_MESSAGES[messageIndex]}
        </p>
      </div>
      
      <p className="text-[10px] text-slate-500 mt-2 font-medium">
        Preserving margins and grid geometry...
      </p>

      {/* Custom slow spin keyframe */}
      <style jsx>{`
        .animate-spin-slow {
          animation: spin 16s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
