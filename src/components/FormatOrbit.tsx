"use client";

import React, { useState } from "react";
import { Cpu } from "lucide-react";

interface FormatNode {
  ext: string;
  name: string;
  desc: string;
  brand: string;
  speed: string;
  fidelity: string;
  nativeColor: string; // The native brand color used in falling files / apps
}

const SUPPORTED_NODES: FormatNode[] = [
  { ext: "PDF", name: "Adobe PDF", desc: "Universal layout locking, absolute vector rendering, and embedded fonts.", brand: "Universal", speed: "8ms", fidelity: "100%", nativeColor: "#FF3B30" },
  { ext: "DOCX", name: "Microsoft Word", desc: "Complex columns, absolute margins, headers, footers, and shape layers.", brand: "Word", speed: "14ms", fidelity: "99.8%", nativeColor: "#2B579A" },
  { ext: "PAGES", name: "Apple Pages", desc: "Rich typography, nested column layouts, custom media frames, and canvas grids.", brand: "iWork", speed: "18ms", fidelity: "99.9%", nativeColor: "#F98D29" },
  { ext: "XLSX", name: "Microsoft Excel", desc: "Multi-sheet financial matrices, mathematical formula preservation, and styled cell borders.", brand: "Excel", speed: "22ms", fidelity: "100%", nativeColor: "#217346" },
  { ext: "NUMBERS", name: "Apple Numbers", desc: "Canvas layout sheets, independent tables, vector chart data, and formula parsing.", brand: "iWork", speed: "16ms", fidelity: "99.8%", nativeColor: "#34C759" },
  { ext: "PPTX", name: "PowerPoint", desc: "Slide transitions, geometric vector assets, styled text boxes, and coordinate mapping.", brand: "PowerPoint", speed: "25ms", fidelity: "99.7%", nativeColor: "#D24726" },
  { ext: "KEY", name: "Apple Keynote", desc: "Cinematic slide grids, absolute coordinate bounding boxes, and grouped shape transformations.", brand: "iWork", speed: "20ms", fidelity: "99.9%", nativeColor: "#007AFF" },
  { ext: "TXT", name: "Plain Text", desc: "Raw string extraction, UTF-8 unicode encoding, and unformatted data dumps.", brand: "Universal", speed: "2ms", fidelity: "100%", nativeColor: "#64748B" },
  { ext: "CSV", name: "Comma Separated", desc: "Delimited spreadsheet grids, database rows, and clean flat table matrix parsing.", brand: "Data", speed: "5ms", fidelity: "100%", nativeColor: "#F59E0B" },
  { ext: "RTF", name: "Rich Text Format", desc: "Standard cross-platform styling, absolute font family tags, bold, italics, and paragraph maps.", brand: "Universal", speed: "10ms", fidelity: "99.5%", nativeColor: "#E91E63" },
];

export default function FormatOrbit() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section 
      id="orbit-section" 
      className="relative w-full py-16 bg-[#FAFAFA] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Grid overlay mask (White Theme Consistent) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(134,41,55,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(134,41,55,0.04)_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] pointer-events-none z-0" />

      <div className="max-w-4xl mx-auto px-4 relative z-10 w-full flex flex-col items-center">
        
        {/* Section Header */}
        <div className="text-center mb-12 select-none max-w-2xl font-black">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 border-2 border-[#862937] bg-[#B9A071] text-[10px] font-black uppercase tracking-widest text-[#862937] mb-6 shadow-[2px_2px_0px_0px_#862937]">
            <Cpu className="w-4 h-4" />
            Parallel Format Engine
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-[#862937] mb-4 leading-none uppercase tracking-tight">
            Universal Preservations
          </h2>
          <p className="text-xs font-bold tracking-widest uppercase text-[#903635]">
            Experience local desktop-grade compilation speeds across all major document formats.
          </p>
        </div>

        {/* Static Document Card Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 w-full">
          {SUPPORTED_NODES.map((node, index) => {
            const isHovered = hoveredIndex === index;
            
            // Calculate dynamic font sizes inside the banner based on text length
            const textClass = node.ext.length > 5 
              ? "text-[8px] tracking-tighter font-extrabold" 
              : node.ext.length > 4 
              ? "text-[9px] tracking-tight font-black" 
              : "text-[10px] tracking-wider font-black";

            return (
              <div
                key={node.ext}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`flex flex-col items-center justify-center p-6 border-2 select-none cursor-pointer transition-all duration-200 ${
                  isHovered ? "bg-white translate-x-[-2px] translate-y-[-2px]" : "bg-white"
                }`}
                style={{
                  borderColor: node.nativeColor,
                  boxShadow: isHovered 
                    ? `6px 6px 0px 0px ${node.nativeColor}` 
                    : `4px 4px 0px 0px ${node.nativeColor}`
                }}
              >
                {/* Premium, High-Fidelity NATIVE Document File Page Icon */}
                <div 
                  className="relative w-[60px] h-[76px] bg-white border-2 transition-all duration-200 mb-4 overflow-hidden flex flex-col justify-between"
                  style={{
                    borderColor: node.nativeColor,
                    // Folded corner clip-path
                    clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)"
                  }}
                >
                  {/* Folded corner triangle decoration inside */}
                  <div 
                    className="absolute top-0 right-0 w-[12px] h-[12px] bg-[#FAFAFA] border-b-2 border-l-2 z-10"
                    style={{
                      borderColor: node.nativeColor,
                    }}
                  />

                  {/* Aesthetic document lines representing content lines in a real file */}
                  <div className="pt-4 px-3 space-y-1 z-0 select-none opacity-20 pointer-events-none">
                    <div className="w-[80%] h-[1.5px]" style={{ backgroundColor: node.nativeColor }} />
                    <div className="w-[90%] h-[1.5px]" style={{ backgroundColor: node.nativeColor }} />
                    <div className="w-[60%] h-[1.5px]" style={{ backgroundColor: node.nativeColor }} />
                  </div>

                  {/* Horizontal Colored Branding Banner in the bottom-middle of the sheet */}
                  <div 
                    className="w-full h-5 flex items-center justify-center text-white mb-2 z-10 shadow-sm border-t border-b border-black/10 select-none"
                    style={{ backgroundColor: node.nativeColor }}
                  >
                    <span className={`${textClass} uppercase leading-none`}>
                      {node.ext}
                    </span>
                  </div>
                </div>
                
                {/* Brand label below the icon */}
                <span 
                  className="text-[9px] font-black uppercase tracking-widest text-center select-none"
                  style={{ color: node.nativeColor }}
                >
                  {node.brand}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
