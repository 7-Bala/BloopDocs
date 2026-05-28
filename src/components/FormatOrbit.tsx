"use client";

import React, { useState } from "react";
import { Cpu, Zap, Eye } from "lucide-react";

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
  const [activeIndex, setActiveIndex] = useState<number>(0); // Default to PDF (index 0)

  const activeNode = SUPPORTED_NODES[activeIndex];

  return (
    <section 
      id="orbit-section" 
      className="relative w-full py-16 bg-[#FAFAFA] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Grid overlay mask (White Theme Consistent) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(134,41,55,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(134,41,55,0.04)_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] pointer-events-none z-0" />

      <div className="max-w-4xl mx-auto px-4 relative z-10 w-full flex flex-col items-center">
        
        {/* Section Header */}
        <div className="text-center mb-12 select-none max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 border-2 border-[#862937] bg-[#B9A071] text-[10px] font-black uppercase tracking-widest text-[#862937] mb-6 shadow-[2px_2px_0px_0px_#862937]">
            <Cpu className="w-4 h-4" />
            Parallel Format Engine
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-[#862937] mb-4 leading-none uppercase tracking-tight">
            Universal Preservations
          </h2>
          <p className="text-xs font-bold tracking-widest uppercase text-[#903635]">
            Hover over any document card below to analyze translation benchmarks and check latency indices.
          </p>
        </div>

        {/* Static Document Card Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 w-full mb-10">
          {SUPPORTED_NODES.map((node, index) => {
            const isActive = activeIndex === index;
            return (
              <div
                key={node.ext}
                onMouseEnter={() => setActiveIndex(index)}
                className={`flex flex-col items-center justify-center p-5 border-2 select-none cursor-pointer transition-all duration-200 ${
                  isActive ? "bg-white translate-x-[-2px] translate-y-[-2px]" : "bg-white"
                }`}
                style={{
                  borderColor: node.nativeColor,
                  color: node.nativeColor,
                  boxShadow: isActive 
                    ? `6px 6px 0px 0px ${node.nativeColor}` 
                    : `4px 4px 0px 0px ${node.nativeColor}`
                }}
              >
                {/* Document SVG Icon with format name centered */}
                <div className="relative w-14 h-18 flex items-center justify-center mb-3">
                  <svg 
                    viewBox="0 0 24 24" 
                    className="absolute inset-0 w-full h-full stroke-[1.8] fill-[#FAFAFA] transition-colors duration-200"
                    style={{ stroke: node.nativeColor }}
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    {/* Standard Brutalist Document page shape with folder corner */}
                    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                    <path d="M15 2v7h7" />
                  </svg>
                  
                  {/* Format Label Text inside Document */}
                  <span 
                    className="relative z-10 text-[10px] font-black uppercase tracking-tighter mt-4 select-none"
                    style={{ color: node.nativeColor }}
                  >
                    {node.ext}
                  </span>
                </div>
                
                <span 
                  className="text-[8px] font-black uppercase tracking-widest opacity-80"
                  style={{ color: node.nativeColor }}
                >
                  {node.brand}
                </span>
              </div>
            );
          })}
        </div>

        {/* Dynamic Tooltip Detail Card (Always populated, no placeholder!) */}
        <div className="w-full min-h-[160px] flex items-center justify-center">
          <div 
            key={activeNode.ext}
            className="w-full p-6 border-4 bg-white animate-fade-in flex flex-col md:flex-row items-center justify-between gap-6"
            style={{ 
              borderColor: activeNode.nativeColor, 
              boxShadow: `6px 6px 0px 0px ${activeNode.nativeColor}`
            }}
          >
            <div className="space-y-2 text-center md:text-left flex-1">
              <div className="flex flex-col md:flex-row items-center gap-3">
                <h4 
                  className="text-lg font-black flex items-center gap-2"
                  style={{ color: activeNode.nativeColor }}
                >
                  {activeNode.name}
                  <span 
                    className="text-[10px] px-2.5 py-0.5 border-2 font-black tracking-widest uppercase shadow-[2px_2px_0px_0px_currentColor]"
                    style={{ 
                      borderColor: activeNode.nativeColor, 
                      color: activeNode.nativeColor,
                      backgroundColor: `${activeNode.nativeColor}15`
                    }}
                  >
                    {activeNode.ext}
                  </span>
                </h4>
              </div>
              <p className="text-xs text-slate-700 font-medium leading-relaxed max-w-lg normal-case">
                {activeNode.desc}
              </p>
            </div>
            
            {/* Metrics block */}
            <div 
              className="flex gap-4 border-t md:border-t-0 md:border-l-2 border-dashed pt-6 md:pt-0 md:pl-6 w-full md:w-auto shrink-0 justify-around select-none"
              style={{ borderColor: activeNode.nativeColor }}
            >
              <div className="text-center min-w-[70px]">
                <div className="text-[8px] text-slate-500 uppercase tracking-widest font-black mb-1.5">Fidelity</div>
                <div 
                  className="text-sm font-black flex items-center justify-center gap-1"
                  style={{ color: activeNode.nativeColor }}
                >
                  <Zap className="w-3.5 h-3.5 fill-current stroke-none" />
                  {activeNode.fidelity}
                </div>
              </div>
              
              <div className="text-center min-w-[70px]">
                <div className="text-[8px] text-slate-500 uppercase tracking-widest font-black mb-1.5">Latency</div>
                <div className="text-sm font-black text-slate-800 flex items-center justify-center gap-1">
                  <Eye className="w-3.5 h-3.5" style={{ color: activeNode.nativeColor }} />
                  {activeNode.speed}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </section>
  );
}
