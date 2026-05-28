"use client";

import React, { useState } from "react";
import { Cpu, Zap, Eye, AlertCircle } from "lucide-react";

interface FormatNode {
  ext: string;
  name: string;
  desc: string;
  brand: string;
  color: string;
  speed: string;
  fidelity: string;
}

const SUPPORTED_NODES: FormatNode[] = [
  { ext: "PDF", name: "Adobe PDF", desc: "Universal layout locking, absolute vector rendering, and embedded fonts.", brand: "Universal", color: "from-red-600 to-rose-500", speed: "8ms", fidelity: "100%" },
  { ext: "DOCX", name: "Microsoft Word", desc: "Complex columns, absolute margin margins, headers, footers, and shape layers.", brand: "Word", color: "from-blue-600 to-cyan-500", speed: "14ms", fidelity: "99.8%" },
  { ext: "PAGES", name: "Apple Pages", desc: "Rich typography, nested column layouts, custom media frames, and canvas grids.", brand: "iWork", color: "from-orange-500 to-amber-500", speed: "18ms", fidelity: "99.9%" },
  { ext: "XLSX", name: "Microsoft Excel", desc: "Multi-sheet financial matrices, mathematical formula preservation, and styled cell borders.", brand: "Excel", color: "from-emerald-600 to-teal-500", speed: "22ms", fidelity: "100%" },
  { ext: "NUMBERS", name: "Apple Numbers", desc: "Canvas layout sheet nodes, independent tables, vector chart data, and formula parsing.", brand: "iWork", color: "from-green-500 to-emerald-500", speed: "16ms", fidelity: "99.8%" },
  { ext: "PPTX", name: "PowerPoint", desc: "Slide transitions, geometric vector assets, styled text boxes, and coordinate mapping.", brand: "PowerPoint", color: "from-fuchsia-600 to-purple-600", speed: "25ms", fidelity: "99.7%" },
  { ext: "KEY", name: "Apple Keynote", desc: "Cinematic slide grids, absolute coordinate bounding boxes, and grouped shape transformations.", brand: "iWork", color: "from-violet-600 to-purple-500", speed: "20ms", fidelity: "99.9%" },
  { ext: "TXT", name: "Plain Text", desc: "Raw string extraction, UTF-8 unicode encoding, and unformatted data dumps.", brand: "Universal", color: "from-slate-600 to-slate-400", speed: "2ms", fidelity: "100%" },
  { ext: "CSV", name: "Comma Separated", desc: "Delimited spreadsheet grids, database rows, and clean flat table matrix parsing.", brand: "Data", color: "from-yellow-600 to-amber-500", speed: "5ms", fidelity: "100%" },
  { ext: "RTF", name: "Rich Text Format", desc: "Standard cross-platform styling, absolute font family tags, bold, italics, and paragraph maps.", brand: "Universal", color: "from-rose-500 to-red-500", speed: "10ms", fidelity: "99.5%" },
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
            const isHovered = hoveredIndex === index;
            return (
              <div
                key={node.ext}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`flex flex-col items-center justify-center p-5 border-2 border-[#862937] select-none cursor-pointer transition-all duration-200 ${
                  isHovered 
                    ? "bg-[#B9A071]/10 translate-x-[-2px] translate-y-[-2px] shadow-[6px_6px_0px_0px_#862937]" 
                    : "bg-white shadow-[4px_4px_0px_0px_#862937]"
                }`}
              >
                {/* Document SVG Icon with format name centered */}
                <div className="relative w-14 h-18 flex items-center justify-center mb-3">
                  <svg 
                    viewBox="0 0 24 24" 
                    className={`absolute inset-0 w-full h-full stroke-[#862937] stroke-[1.8] fill-[#FAFAFA] transition-colors duration-200 ${
                      isHovered ? "fill-white" : "fill-[#FAFAFA]"
                    }`}
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    {/* Standard Brutalist Document page shape with folder corner */}
                    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                    <path d="M15 2v7h7" />
                  </svg>
                  
                  {/* Format Label Text inside Document */}
                  <span className="relative z-10 text-[10px] font-black text-[#862937] uppercase tracking-tighter mt-4 select-none">
                    {node.ext}
                  </span>
                </div>
                
                <span className="text-[8px] text-slate-500 font-extrabold uppercase tracking-widest">
                  {node.brand}
                </span>
              </div>
            );
          })}
        </div>

        {/* Dynamic Tooltip Detail Card */}
        <div className="w-full min-h-[160px] flex items-center justify-center">
          {hoveredIndex !== null ? (
            (() => {
              const node = SUPPORTED_NODES[hoveredIndex];
              return (
                <div className="w-full p-6 border-4 border-[#862937] bg-white shadow-[6px_6px_0px_0px_#862937] animate-fade-in flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-2 text-center md:text-left flex-1">
                    <div className="flex flex-col md:flex-row items-center gap-3">
                      <h4 className="text-lg font-black text-[#862937] flex items-center gap-2">
                        {node.name}
                        <span className="text-[10px] px-2.5 py-0.5 border-2 border-[#862937] bg-[#B9A071] font-black tracking-widest uppercase text-[#862937] shadow-[2px_2px_0px_0px_#862937]">
                          {node.ext}
                        </span>
                      </h4>
                    </div>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed max-w-lg normal-case">
                      {node.desc}
                    </p>
                  </div>
                  
                  {/* Metrics block */}
                  <div className="flex gap-4 border-t md:border-t-0 md:border-l-2 border-dashed border-[#862937] pt-6 md:pt-0 md:pl-6 w-full md:w-auto shrink-0 justify-around select-none">
                    <div className="text-center min-w-[70px]">
                      <div className="text-[8px] text-slate-500 uppercase tracking-widest font-black mb-1.5">Fidelity</div>
                      <div className="text-sm font-black text-[#862937] flex items-center justify-center gap-1">
                        <Zap className="w-3.5 h-3.5 fill-[#862937] stroke-none" />
                        {node.fidelity}
                      </div>
                    </div>
                    
                    <div className="text-center min-w-[70px]">
                      <div className="text-[8px] text-slate-500 uppercase tracking-widest font-black mb-1.5">Latency</div>
                      <div className="text-sm font-black text-slate-800 flex items-center justify-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {node.speed}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="flex flex-col items-center justify-center p-8 border-4 border-dashed border-[#862937] w-full text-[#862937] gap-2 select-none bg-white shadow-[4px_4px_0px_0px_#862937] animate-pulse">
              <AlertCircle className="w-6 h-6" />
              <span className="text-[10px] font-black tracking-widest uppercase">Hover over a format card to view precise benchmarks</span>
            </div>
          )}
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
