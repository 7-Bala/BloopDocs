"use client";

import React, { useState } from "react";

interface FloatingDocCardProps {
  ext: string;
  name: string;
  brandColor: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function FloatingDocCard({
  ext,
  name,
  brandColor,
  className = "",
  style = {},
}: FloatingDocCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Determine what mini vector content to draw inside based on format type
  const isSheet = ["xlsx", "numbers"].includes(ext.toLowerCase());
  const isSlide = ["pptx", "key"].includes(ext.toLowerCase());

  return (
    <div
      className={`w-full h-full bg-[#C4B883] border-2 border-[#862937] select-none transition-brutalist z-10 ${className}`}
      style={{
        ...style,
        clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)",
        transform: `${style.transform || ""} ${isHovered ? "scale(1.08) rotate(4deg)" : "scale(1) rotate(0deg)"}`,
        backgroundColor: isHovered ? "#B9A071" : "#C4B883",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Brutalist Dog-Ear Fold Flap */}
      <div
        className="absolute top-0 right-0 w-[20px] h-[20px] border-l-2 border-b-2 border-[#862937] transition-brutalist"
        style={{
          backgroundColor: isHovered ? "#AF8760" : "#B9A071", // slightly darker shading
        }}
      />

      {/* Card Internal Layout */}
      <div className="w-full h-full p-4 flex flex-col items-start justify-between relative pt-6">
        
        {/* Top brand tag */}
        <div className="flex items-center gap-1">
          <span 
            className="text-[9px] font-black px-2 py-0.5 border-[1px] border-[#862937] text-white uppercase tracking-wider"
            style={{ backgroundColor: brandColor }}
          >
            {ext}
          </span>
        </div>

        {/* Dynamic Inner Schematic Graphic */}
        <div className="w-full flex-grow flex flex-col justify-center mt-3">
          {isSheet ? (
            /* MINI SHEET GRID GRAPHIC */
            <div className="grid grid-cols-3 gap-0.5 border border-[#862937] p-1 w-full bg-[#B9A071]/20">
              <div className="h-2 bg-[#862937]/80" />
              <div className="h-2 bg-[#862937]/30" />
              <div className="h-2 bg-[#862937]/40" />
              <div className="h-2 bg-[#862937]/20" />
              <div className="h-2 bg-[#862937]/50" />
              <div className="h-2 bg-[#862937]/10" />
            </div>
          ) : isSlide ? (
            /* MINI SLIDESHOW CANVAS GRAPHIC */
            <div className="border border-[#862937] p-1 w-full h-10 flex items-center justify-center bg-[#B9A071]/10 relative">
              <div className="w-4 h-4 bg-[#862937] border border-[#862937]" />
              <div className="w-3 h-3 bg-transparent border border-[#862937] absolute top-1 left-1" />
            </div>
          ) : (
            /* MINI PARAGRAPH LINES GRAPHIC */
            <div className="flex flex-col gap-1 w-full">
              <div className="h-[2px] bg-[#862937] w-full" />
              <div className="h-[2px] bg-[#862937] w-[85%]" />
              <div className="h-[2px] bg-[#862937] w-[90%]" />
              <div className="h-[2px] bg-[#862937] w-[60%]" />
            </div>
          )}
        </div>

        {/* Bottom Dummy File Name */}
        <div className="w-full text-left mt-2">
          <div className="text-[9px] font-black text-[#862937] truncate uppercase tracking-widest leading-none">
            {name}
          </div>
        </div>

      </div>
    </div>
  );
}
