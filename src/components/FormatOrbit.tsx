"use client";

import React, { useRef, useState } from "react";
import { FileText, Sparkles, AlertCircle, Cpu, Zap, Eye } from "lucide-react";
import { useOrbitSync } from "../hooks/useGsapTimeline";
import SpotlightCard from "./SpotlightCard";

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
  { ext: "DOCX", name: "Microsoft Word", desc: "Complex tables, columns, and embedded shape structures.", brand: "Word", color: "from-blue-600 to-cyan-500", speed: "14ms", fidelity: "99.8%" },
  { ext: "PAGES", name: "Apple Pages", desc: "Rich editorial layouts, multi-font grids, dynamic columns.", brand: "iWork", color: "from-orange-500 to-amber-500", speed: "18ms", fidelity: "99.9%" },
  { ext: "XLSX", name: "Microsoft Excel", desc: "Formula preservation, massive cell structures, sheet links.", brand: "Excel", color: "from-emerald-600 to-teal-500", speed: "22ms", fidelity: "100%" },
  { ext: "NUMBERS", name: "Apple Numbers", desc: "Visual grids, sheet layouts, mathematical cell blocks.", brand: "iWork", color: "from-green-500 to-emerald-500", speed: "16ms", fidelity: "99.8%" },
  { ext: "PPTX", name: "PowerPoint", desc: "Slide transitions, geometric vector assets, custom text frames.", brand: "PowerPoint", color: "from-fuchsia-600 to-purple-600", speed: "25ms", fidelity: "99.7%" },
  { ext: "KEY", name: "Apple Keynote", desc: "Cinematic slide grids, vector coordinates, group bounding boxes.", brand: "iWork", color: "from-violet-600 to-purple-500", speed: "20ms", fidelity: "99.9%" },
  { ext: "TXT", name: "Plain Text", desc: "Raw string layout, completely unformatted text extraction.", brand: "Universal", color: "from-slate-600 to-slate-400", speed: "2ms", fidelity: "100%" },
  { ext: "CSV", name: "Comma Separated", desc: "Flat data tables, purely delimited values for data science.", brand: "Data", color: "from-yellow-600 to-amber-500", speed: "5ms", fidelity: "100%" },
  { ext: "RTF", name: "Rich Text Format", desc: "Universal cross-platform document styling protocol.", brand: "Universal", color: "from-rose-500 to-red-500", speed: "10ms", fidelity: "99.5%" },
];

export default function FormatOrbit() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const orbitRef = useRef<HTMLDivElement | null>(null);
  const nodesRef = useRef<(HTMLDivElement | null)[]>([]);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Synchronize outer rotation + inner node upright counter-rotation
  useOrbitSync(containerRef, orbitRef, nodesRef);

  const radius = 230; // Orbit radius in pixels
  const centerCoord = 290; // Half of orbit boundary (580px / 2)

  // Calculate coordinates for the laser SVG line from node to center
  const getLineTargetCoords = (index: number) => {
    const total = SUPPORTED_NODES.length;
    // Calculate angle in radians, matching initial transform positioning
    const angleRad = ((index / total) * 360 * Math.PI) / 180;
    
    // Dynamic coordinate shifting based on rotation
    const x = centerCoord + radius * Math.cos(angleRad);
    const y = centerCoord + radius * Math.sin(angleRad);
    return { x, y };
  };

  return (
    <section 
      id="orbit-section" 
      ref={containerRef} 
      className="relative w-full py-32 bg-[#FAFAFA] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background glowing rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-slate-200 pointer-events-none z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-slate-100 pointer-events-none z-0" />

      {/* Grid overlay mask (Light Theme) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none z-0" />

      <div className="max-w-6xl mx-auto px-6 relative z-10 w-full flex flex-col items-center">
        {/* Section Typography Header */}
        <div className="text-center mb-16 select-none max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-amber-200 bg-amber-50 text-[10px] font-black uppercase tracking-widest text-amber-600 mb-6 shadow-sm">
            <Cpu className="w-4 h-4" />
            Parallel Format Engine
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
            Universal <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-600">Preservations</span>
          </h2>
          <p className="text-sm md:text-base text-slate-600 font-medium leading-relaxed max-w-lg mx-auto">
            Hover over any format card in the orbit network below to pause the system, analyze individual translation benchmarks, and check fidelity grids.
          </p>
        </div>

        {/* Orbit playground wrapper */}
        <div className="relative w-[580px] h-[580px] flex items-center justify-center select-none scale-[0.7] sm:scale-100 my-4">
          
          {/* Laser beam SVG overlay */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            <defs>
              <linearGradient id="laser-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="1" />
                <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.4" />
              </linearGradient>
            </defs>
            {hoveredIndex !== null && (() => {
              const coords = getLineTargetCoords(hoveredIndex);
              return (
                <>
                  {/* Glowing wide backing path */}
                  <line
                    x1={centerCoord}
                    y1={centerCoord}
                    x2={coords.x}
                    y2={coords.y}
                    stroke="#f59e0b"
                    strokeWidth="6"
                    strokeOpacity="0.2"
                    className="blur-[4px]"
                  />
                  {/* High-speed dotted dash path */}
                  <line
                    x1={centerCoord}
                    y1={centerCoord}
                    x2={coords.x}
                    y2={coords.y}
                    stroke="url(#laser-grad)"
                    strokeWidth="3"
                    strokeDasharray="8,6"
                    className="animate-laser-flow"
                  />
                </>
              );
            })()}
          </svg>

          {/* 1. CENTRAL TRANSLATION CORE */}
          <div className="absolute z-20 w-40 h-40 rounded-full bg-white border-4 border-amber-100 flex items-center justify-center p-2 shadow-[0_0_60px_rgba(245,158,11,0.2)]">
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-amber-50 via-yellow-50 to-orange-50 flex flex-col items-center justify-center text-center p-4 border border-amber-200 relative overflow-hidden group">
              {/* Spinning decorative grid ring */}
              <div className="absolute inset-2 border-2 border-dashed border-amber-200 rounded-full animate-[spin_30s_linear_infinite] pointer-events-none" />
              
              {/* Inner glowing pulse */}
              <div className="absolute inset-4 bg-gradient-to-r from-amber-300 to-yellow-400 rounded-full opacity-10 group-hover:opacity-30 blur-md transition-opacity duration-300" />
              
              <FileText className="w-8 h-8 text-amber-500 mb-1 animate-pulse" />
              <span className="text-[11px] font-black text-slate-800 tracking-wider">PDF LABS</span>
              <span className="text-[9px] text-amber-600 font-bold uppercase mt-1 tracking-widest">Universal</span>
            </div>
          </div>

          {/* 2. OUTER ROTATING CONTAINER (Driven by GSAP) */}
          <div ref={orbitRef} className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {SUPPORTED_NODES.map((node, index) => {
              const total = SUPPORTED_NODES.length;
              const angle = (index / total) * 360;

              return (
               <div
                  key={node.ext}
                  ref={(el) => { nodesRef.current[index] = el; }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="absolute pointer-events-auto cursor-pointer"
                  style={{
                    width: "86px",
                    height: "86px",
                    // Positions absolute cards strictly on the circle radius
                    transform: `rotate(${angle}deg) translate(${radius}px) rotate(${-angle}deg)`,
                  }}
                >
                  {/* Upright inner container (Anti-rotate driven by GSAP to stay upright) */}
                  <div className="orbit-node-inner w-full h-full rounded-2xl bg-white border-2 border-slate-200 flex flex-col items-center justify-center p-3 hover:scale-110 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-300 shadow-md relative group">
                    {/* Hover spotlight gradient tag */}
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-tr ${node.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`} />
                    
                    <span className={`text-[12px] font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-br ${node.color}`}>
                      {node.ext}
                    </span>
                    <span className="text-[8px] text-slate-500 font-black uppercase mt-1.5 tracking-widest">{node.brand}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. DYNAMIC INFO TOOLTIP EXPANSION */}
        <div className="w-full max-w-2xl mt-16 min-h-[160px] flex items-center justify-center">
          {hoveredIndex !== null ? (
            (() => {
              const node = SUPPORTED_NODES[hoveredIndex];
              return (
                <SpotlightCard
                  glowColor="rgba(245,158,11,0.15)"
                  className="w-full p-8 border border-slate-200 bg-white shadow-xl animate-fade-in flex flex-col md:flex-row items-center gap-8 rounded-[2rem]"
                >
                  <div className="flex-grow space-y-3 text-center md:text-left">
                    <div className="flex flex-col md:flex-row items-center gap-3">
                      <h4 className="text-xl font-black text-slate-900 flex items-center gap-3">
                        {node.name}
                        <span className="text-[10px] px-2.5 py-1 rounded-full font-black tracking-widest uppercase bg-slate-100 text-slate-600 border border-slate-200">
                          {node.ext}
                        </span>
                      </h4>
                    </div>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed max-w-md">
                      {node.desc}
                    </p>
                  </div>
                  
                  {/* Benchmarks status card */}
                  <div className="flex gap-6 border-t md:border-t-0 md:border-l border-slate-200 pt-6 md:pt-0 md:pl-8 w-full md:w-auto shrink-0 justify-around select-none">
                    <div className="text-center">
                      <div className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-2">Fidelity</div>
                      <div className="text-base font-black text-amber-500 flex items-center justify-center gap-1.5">
                        <Zap className="w-4 h-4 fill-amber-500" />
                        {node.fidelity}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-2">Latency</div>
                      <div className="text-base font-black text-slate-900 flex items-center justify-center gap-1.5">
                        <Eye className="w-4 h-4" />
                        {node.speed}
                      </div>
                    </div>
                  </div>
                </SpotlightCard>
              );
            })()
          ) : (
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 rounded-[2rem] w-full text-slate-500 gap-3 select-none bg-slate-50 animate-[pulse_4s_ease-in-out_infinite]">
              <AlertCircle className="w-6 h-6 text-slate-400" />
              <span className="text-sm font-bold tracking-widest uppercase">Hover over a format card to view precise benchmarks</span>
            </div>
          )}
        </div>
      </div>

      {/* Laser line stream dash animation */}
      <style jsx>{`
        .animate-laser-flow {
          stroke-dashoffset: 0;
          animation: laser 0.75s linear infinite;
        }
        @keyframes laser {
          to {
            stroke-dashoffset: -20;
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </section>
  );
}
