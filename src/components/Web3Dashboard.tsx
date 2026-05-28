"use client";

import React, { useRef, useEffect, useState } from "react";
import { useDashboardStagger } from "../hooks/useGsapTimeline";
import SpotlightCard from "./SpotlightCard";
import { Server, Activity, Flame, ShieldAlert, Terminal as TermIcon } from "lucide-react";

const INITIAL_LOGS = [
  "SYSTEM: OK - Parallel sandbox initialized",
  "NODE_0x7b2f: Active on port 443",
  "GAS_LIMIT: 4.00 MB / Gas Free stream",
  "SECURITY: SSL handshake complete",
  "SYSTEM: Parallel compilers ready"
];

const COMPILING_PHASES = [
  "INCOMING: Dispatched translation stream 0x{id}",
  "ANALYZING: Preserving layout columns & grids",
  "MAPPING: Preserving column coordinates and alignments",
  "TYPOGRAPHY: Outfit fonts mapped successfully",
  "SUCCESS: Translated vector compiled (Fidelity: 99.8%)",
  "SECURITY: secure stream sandboxes wiped from memory"
];

export default function Web3Dashboard() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const card1Ref = useRef<HTMLDivElement | null>(null);
  const card2Ref = useRef<HTMLDivElement | null>(null);
  const card3Ref = useRef<HTMLDivElement | null>(null);

  // Stagger entry animations on scroll
  useDashboardStagger(containerRef, {
    current: [card1Ref.current, card2Ref.current, card3Ref.current]
  });

  // Card 1: Ticking block height & gas limits
  const [blockHeight, setBlockHeight] = useState(59481209);
  const [activeNodes, setActiveNodes] = useState(1024);

  // Card 2: Live Latency Chart
  const [latencyPoints, setLatencyPoints] = useState<number[]>([14, 12, 16, 13, 11, 15, 12, 14, 10, 13, 12, 15]);

  // Card 3: Live compilation terminal
  const [logs, setLogs] = useState<string[]>(INITIAL_LOGS);
  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  // Cycle Ticking numbers
  useEffect(() => {
    const timer = setInterval(() => {
      setBlockHeight((prev) => prev + 1);
      // Randomly fluctuate nodes slightly
      setActiveNodes((prev) => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 2500);

    return () => clearInterval(timer);
  }, []);

  // Latency Chart updates
  useEffect(() => {
    const timer = setInterval(() => {
      setLatencyPoints((prev) => {
        const next = [...prev.slice(1)];
        // Generate values between 9ms and 17ms
        const newPoint = Math.floor(Math.random() * 8) + 9;
        next.push(newPoint);
        return next;
      });
    }, 1500);

    return () => clearInterval(timer);
  }, []);

  // Compilation Terminal log injector
  useEffect(() => {
    let logCount = 0;
    const interval = setInterval(() => {
      const timestamp = new Date().toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      const phaseIndex = logCount % COMPILING_PHASES.length;
      let template = COMPILING_PHASES[phaseIndex];

      if (template.includes("{id}")) {
        const hexId = Math.floor(Math.random() * 65535).toString(16).padStart(4, "0");
        template = template.replace("{id}", hexId);
      }

      setLogs((prev) => {
        // Limit log buffer to 20 lines
        const next = prev.length > 20 ? prev.slice(1) : prev;
        return [...next, `[${timestamp}] ${template}`];
      });

      logCount++;
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Autoscroll terminal to the latest logs
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  // SVG Chart path calculation
  const getSvgPath = () => {
    const width = 280;
    const height = 90;
    const maxVal = 20; // Max latency
    const minVal = 5;  // Min latency
    const range = maxVal - minVal;

    const step = width / (latencyPoints.length - 1);
    
    return latencyPoints.map((point, index) => {
      const x = index * step;
      // Map points so higher latency is higher up on chart
      const y = height - ((point - minVal) / range) * height;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    }).join(" ");
  };

  return (
    <section
      id="dashboard-section"
      ref={containerRef}
      className="relative w-full py-32 bg-slate-950 flex flex-col items-center justify-center overflow-hidden border-b border-white/5"
    >
      {/* Background glow effects */}
      <div className="absolute top-[20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-500/3 blur-[140px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-cyan-500/3 blur-[140px] mix-blend-screen pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10 w-full flex flex-col items-center">
        {/* Header Typography Section */}
        <div className="text-center mb-16 select-none max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/10 bg-cyan-500/5 text-[9px] font-extrabold uppercase tracking-widest text-cyan-400 mb-4">
            <Server className="w-3 h-3 animate-pulse" />
            Translation Ledger
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-100 mb-5 leading-tight tracking-tight">
            Cinematic <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400">Node Dashboard</span>
          </h2>
          <p className="text-xs md:text-sm text-slate-400 font-light leading-relaxed">
            Realtime parallel compiling network performance indexes, secure sandboxed wipes, and live transaction ledger indices.
          </p>
        </div>

        {/* Dashboard Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          
          {/* Card 1: Network status & ledgers */}
          <div ref={card1Ref}>
            <SpotlightCard
              glowColor="rgba(16, 185, 129, 0.1)"
              className="p-8 flex flex-col h-[280px] justify-between border border-white/10 bg-white/3"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[9px] font-black uppercase text-slate-450 tracking-widest">Network Ledger</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Server className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-extrabold">Active Block Height</div>
                  <div className="text-2xl font-black text-slate-100 tracking-tight font-mono tabular-nums">
                    #{blockHeight.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-4">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-extrabold">{activeNodes} Compile Nodes</span>
                </div>

                <div className="flex items-center gap-1 text-[10px] font-black text-amber-400">
                  <Flame className="w-3.5 h-3.5 animate-pulse" />
                  GAS FREE
                </div>
              </div>
            </SpotlightCard>
          </div>

          {/* Card 2: Performance oscilloscopes */}
          <div ref={card2Ref}>
            <SpotlightCard
              glowColor="rgba(6, 182, 212, 0.1)"
              className="p-8 flex flex-col h-[280px] justify-between border border-white/10 bg-white/3"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-black uppercase text-slate-450 tracking-widest">Stream Latency</span>
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <Activity className="w-4 h-4" />
                  </div>
                </div>

                {/* Oscilloscope SVG line path */}
                <div className="w-full h-24 flex items-center justify-center relative mt-3 select-none">
                  <svg className="w-full h-full" viewBox="0 0 280 90">
                    {/* Shadow blur backup */}
                    <path
                      d={getSvgPath()}
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="4"
                      strokeOpacity="0.2"
                      className="blur-[2px]"
                    />
                    {/* Core glowing graph line */}
                    <path
                      d={getSvgPath()}
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-4">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-extrabold">Fidelity Ratio</span>
                <span className="text-xs font-black text-cyan-400">99.98% True Grid</span>
              </div>
            </SpotlightCard>
          </div>

          {/* Card 3: Live terminal compile consoles */}
          <div ref={card3Ref}>
            <SpotlightCard
              glowColor="rgba(168, 85, 247, 0.1)"
              className="p-8 flex flex-col h-[280px] justify-between border border-white/10 bg-white/3"
            >
              <div className="flex items-center justify-between mb-4 shrink-0">
                <span className="text-[9px] font-black uppercase text-slate-450 tracking-widest">Secure Sandbox Logs</span>
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <TermIcon className="w-4 h-4 animate-[pulse_2s_infinite]" />
                </div>
              </div>

              {/* Scrolling hackerspace terminal screen */}
              <div
                className="flex-grow w-full bg-slate-950/90 border border-white/10 rounded-xl p-4 overflow-y-auto font-mono text-[9px] text-emerald-400 space-y-2 select-text text-left max-h-[145px]"
                style={{
                  boxShadow: "inset 0 4px 20px rgba(0,0,0,0.8)",
                  scrollbarWidth: "none" // Firefox
                }}
              >
                {logs.map((log, index) => (
                  <div 
                    key={index}
                    className="leading-relaxed whitespace-nowrap overflow-hidden text-ellipsis animate-fade-in font-medium"
                  >
                    {log}
                  </div>
                ))}
                <div ref={terminalEndRef} />
              </div>
            </SpotlightCard>
          </div>

        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </section>
  );
}
