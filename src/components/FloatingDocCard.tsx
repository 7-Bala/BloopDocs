"use client";

import React from "react";

interface FloatingDocCardProps {
  ext: string;
  name: string;
  brandColor: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Brutalist document card — used in the falling doc animation.
 *
 * IMPORTANT: No CSS transitions on transform/opacity — they conflict with GSAP.
 * Hover effects use only background-color transition (safe).
 */
export default function FloatingDocCard({
  ext,
  name,
  brandColor,
  className = "",
  style = {},
}: FloatingDocCardProps) {
  const isSheet = ["xlsx", "numbers"].includes(ext.toLowerCase());
  const isSlide = ["pptx", "key"].includes(ext.toLowerCase());

  return (
    <div
      className={`w-full h-full bg-[#C4B883] border-2 border-[#862937] select-none relative ${className}`}
      style={{
        ...style,
        clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)",
        /* No transform here — GSAP controls transform on the parent wrapper */
        transition: "background-color 0.15s linear",
      }}
    >
      {/* Dog-Ear Fold */}
      <div
        className="absolute top-0 right-0 w-[20px] h-[20px] border-l-2 border-b-2 border-[#862937]"
        style={{ backgroundColor: "#B9A071" }}
      />

      <div className="w-full h-full p-3 flex flex-col items-start justify-between pt-5">
        {/* Brand tag */}
        <span
          className="text-[9px] font-black px-2 py-0.5 border border-[#862937] text-white uppercase tracking-wider"
          style={{ backgroundColor: brandColor }}
        >
          {ext}
        </span>

        {/* Inner schematic graphic */}
        <div className="w-full flex-grow flex flex-col justify-center mt-2">
          {isSheet ? (
            <div className="grid grid-cols-3 gap-0.5 border border-[#862937] p-1 w-full bg-[#B9A071]/20">
              <div className="h-2 bg-[#862937]/80" />
              <div className="h-2 bg-[#862937]/30" />
              <div className="h-2 bg-[#862937]/40" />
              <div className="h-2 bg-[#862937]/20" />
              <div className="h-2 bg-[#862937]/50" />
              <div className="h-2 bg-[#862937]/10" />
            </div>
          ) : isSlide ? (
            <div className="border border-[#862937] p-1 w-full h-10 flex items-center justify-center bg-[#B9A071]/10 relative">
              <div className="w-4 h-4 bg-[#862937]" />
              <div className="w-3 h-3 bg-transparent border border-[#862937] absolute top-1 left-1" />
            </div>
          ) : (
            <div className="flex flex-col gap-1 w-full">
              <div className="h-[2px] bg-[#862937] w-full" />
              <div className="h-[2px] bg-[#862937] w-[85%]" />
              <div className="h-[2px] bg-[#862937] w-[90%]" />
              <div className="h-[2px] bg-[#862937] w-[60%]" />
            </div>
          )}
        </div>

        {/* Filename */}
        <div className="text-[8px] font-black text-[#862937] truncate uppercase tracking-widest leading-none mt-1 w-full">
          {name}
        </div>
      </div>
    </div>
  );
}
