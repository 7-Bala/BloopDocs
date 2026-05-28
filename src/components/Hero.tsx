"use client";

import React, { useRef } from "react";
import { ArrowDown, Layers, Sparkles } from "lucide-react";
import { useHeroAnimation } from "../hooks/useGsapTimeline";

interface HeroProps {
  onScrollToConverter: () => void;
}

export default function Hero({ onScrollToConverter }: HeroProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const backgroundRef = useRef<HTMLDivElement | null>(null);

  // Activate GSAP hook (animations still work perfectly on the new elements)
  useHeroAnimation(containerRef, titleRef, subtitleRef, ctaRef, backgroundRef);

  return (
    <div
      ref={containerRef}
      className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden select-none bg-[#FAFAFA] pb-12"
    >
      {/* Floating Background Parallax Glow Spheres (Bright, Grand Gold & Amber lighting) */}
      <div
        ref={backgroundRef}
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
      >
        <div className="absolute top-[10%] left-[10%] w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] rounded-full bg-amber-300/30 blur-[120px] mix-blend-multiply" />
        <div className="absolute top-[30%] right-[5%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full bg-yellow-200/40 blur-[150px] mix-blend-multiply" />
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
        {/* Subtle, beautiful tag indicator */}
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-amber-200/50 bg-white/80 shadow-sm backdrop-blur-md mb-8 text-[11px] font-extrabold tracking-widest uppercase text-amber-600 select-none hover:scale-[1.02] hover:shadow-md transition-all duration-300">
          <Sparkles className="w-4 h-4 text-yellow-500" />
          The Unlimited Format Engine
        </div>

        {/* Hero Title with strict Gold highlights */}
        <h1
          ref={titleRef}
          className="text-6xl sm:text-7xl md:text-8xl lg:text-[7rem] font-black tracking-tighter mb-8 leading-[1.05] select-none pb-2 text-slate-900"
        >
          Transform <br className="hidden md:block" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600">
            Anything.
          </span>
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-lg sm:text-xl md:text-2xl text-slate-600 max-w-3xl leading-relaxed mb-12 font-medium tracking-tight"
        >
          The absolute standard in free local document conversion. Effortlessly bulk process Microsoft Office, Apple iWork, PDF, and text files instantly.
        </p>

        {/* Action Button */}
        <div ref={ctaRef} className="flex flex-col items-center gap-6">
          <button
            onClick={onScrollToConverter}
            className="group relative px-10 py-5 rounded-full font-black text-white overflow-hidden shadow-2xl hover:scale-[1.02] active:scale-95 transition-all duration-300 cursor-pointer bg-slate-900 hover:bg-black"
          >
            <span className="relative flex items-center gap-3 text-sm uppercase tracking-widest">
              Launch Converter
              <ArrowDown className="w-5 h-5 transition-transform duration-300 group-hover:translate-y-1 text-amber-400" />
            </span>
          </button>
          
          <span className="text-[11px] text-slate-500 uppercase tracking-widest font-bold flex items-center gap-2 mt-2">
            <Layers className="w-4 h-4 text-amber-500" />
            100% Free & Unlimited Pipeline
          </span>
        </div>
      </div>

      {/* Floating premium layout overlays serving as distinct differentiation anchors */}
      <div className="hidden lg:block absolute left-[6vw] bottom-[15vh] w-64 p-6 rounded-[1.5rem] bg-white/80 backdrop-blur-2xl border border-white shadow-xl text-left z-10 transition-all duration-500 hover:scale-[1.03] hover:-translate-y-2">
        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 mb-4 font-black text-[10px] uppercase shadow-sm">ZIP</div>
        <p className="text-sm font-black text-slate-900">Bulk Zip Engine</p>
        <p className="text-xs text-slate-500 font-medium leading-relaxed mt-2">Drop up to 50 files simultaneously. They'll be processed locally and bundled instantly.</p>
      </div>

      <div className="hidden lg:block absolute right-[6vw] bottom-[10vh] w-64 p-6 rounded-[1.5rem] bg-white/80 backdrop-blur-2xl border border-white shadow-xl text-left z-10 transition-all duration-500 hover:scale-[1.03] hover:-translate-y-2">
        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white mb-4 font-black text-[10px] uppercase shadow-sm">JS</div>
        <p className="text-sm font-black text-slate-900">Zero API Limits</p>
        <p className="text-xs text-slate-500 font-medium leading-relaxed mt-2">Driven by pure Node.js local processing. No API keys, no 4MB constraints, no tracking.</p>
      </div>
    </div>
  );
}
