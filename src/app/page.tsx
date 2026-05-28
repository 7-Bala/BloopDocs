"use client";

import React, { useRef } from "react";
import Navbar from "@/components/Navbar";
import Converter from "@/components/Converter";
import FloatingDocCard from "@/components/FloatingDocCard";
import { useTypewriter, useDocumentDrop, useConverterReveal } from "@/hooks/useGsapTimeline";

// Document definitions for the fall effect
const FALL_DOCS = [
  { ext: "PDF",   name: "annual_report.pdf",  brandColor: "#FF3B30" },
  { ext: "DOCX",  name: "resume_2024.docx",   brandColor: "#2B579A" },
  { ext: "PAGES", name: "novel_draft.pages",  brandColor: "#F98D29" },
  { ext: "XLSX",  name: "budget_q4.xlsx",     brandColor: "#217346" },
  { ext: "PPTX",  name: "pitch_deck.pptx",    brandColor: "#D24726" },
  { ext: "KEY",   name: "keynote_final.key",  brandColor: "#007AFF" },
];

export default function Home() {
  // --- Typewriter refs ---
  const titleRef   = useRef<HTMLHeadingElement | null>(null);
  const cursorRef  = useRef<HTMLSpanElement | null>(null);

  // --- Document drop refs ---
  const docDropSectionRef  = useRef<HTMLDivElement | null>(null);
  const docRefs            = useRef<(HTMLDivElement | null)[]>([]);
  const dustContainerRef   = useRef<HTMLDivElement | null>(null);

  // --- Converter ref ---
  const converterSectionRef = useRef<HTMLDivElement | null>(null);

  // --- Hook activations ---
  useTypewriter(titleRef, cursorRef);
  useDocumentDrop(docDropSectionRef, docRefs, dustContainerRef);
  useConverterReveal(converterSectionRef);

  const textLine1 = "CONVERT";
  const textLine2 = "ANYTHING.";

  return (
    <main className="flex-grow flex flex-col relative z-10 w-full bg-[#C4B883] overflow-x-hidden pt-20">
      <Navbar />

      {/* ══════════════════════════════════════════════
          SECTION 1 — TYPEWRITER HERO
          Full-viewport height, text types in on load
         ══════════════════════════════════════════════ */}
      <section className="w-full min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-6 border-b-2 border-[#862937] bg-[#C4B883] relative z-20">
        <h1
          ref={titleRef}
          className="text-[5.5rem] md:text-[11rem] font-black tracking-normal text-[#862937] mb-6 text-center leading-[0.9] uppercase select-none"
          aria-label="Convert Anything"
        >
          {/* Line 1 */}
          {textLine1.split("").map((char, i) => (
            <span
              key={`l1-${i}`}
              className="typewriter-letter"
              style={{ display: "none" }}
            >
              {char}
            </span>
          ))}
          <br className="hidden md:block" />
          {/* small gap between lines */}
          <span className="typewriter-letter" style={{ display: "none" }}>{" "}</span>
          {/* Line 2 */}
          {textLine2.split("").map((char, i) => (
            <span
              key={`l2-${i}`}
              className="typewriter-letter"
              style={{ display: "none" }}
            >
              {char}
            </span>
          ))}
          {/* Terminal block cursor */}
          <span
            ref={cursorRef}
            className="inline-block w-[14px] md:w-[26px] h-[64px] md:h-[110px] bg-[#862937] ml-2 align-middle relative top-[-4px] md:top-[-8px] animate-blink"
            aria-hidden="true"
          />
        </h1>

        <p className="text-xl md:text-2xl text-[#903635] font-bold tracking-widest uppercase text-center max-w-3xl leading-relaxed mt-4 select-none">
          Strictly local. Absolutely free. <br /> Zero size limits.
        </p>

        {/* Scroll nudge */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60 animate-bounce-slow">
          <span className="text-xs font-black uppercase tracking-widest text-[#862937]">Scroll</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-[#862937]">
            <path d="M10 3v14M4 11l6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square"/>
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 2 — DOCUMENT DROP STAGE
          Outer: 400vh tall (gives scroll distance for the animation)
          Inner: CSS sticky so it stays visible during scroll
         ══════════════════════════════════════════════ */}
      <div
        ref={docDropSectionRef}
        className="relative w-full"
        style={{ height: "400vh" }}
        aria-hidden="true"
      >
        {/* Inner sticky panel — visible for all 400vh of scrolling */}
        <div
          className="sticky top-0 w-full bg-[#C4B883]"
          style={{ height: "100vh", overflow: "hidden" }}
        >
          {/* Dust particle container */}
          <div
            ref={dustContainerRef}
            className="absolute inset-0 pointer-events-none z-30"
          />

          {/* Label */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 z-40 pointer-events-none whitespace-nowrap">
            <p className="text-xs md:text-sm font-black uppercase tracking-[0.4em] text-[#862937] opacity-40">
              Drop any format — we handle it
            </p>
          </div>

          {/* Ground line */}
          <div className="absolute left-8 right-8 z-10" style={{ bottom: "28%" }}>
            <div className="w-full h-[2px] bg-[#862937] opacity-20" />
          </div>

          {/* Document cards — spread across width, anchored at settle height */}
          {FALL_DOCS.map((doc, idx) => {
            const leftPercent = 8 + idx * 14;
            return (
              <div
                key={idx}
                ref={(el) => { docRefs.current[idx] = el; }}
                className="absolute z-20"
                style={{
                  width: 112,
                  height: 144,
                  left: `calc(${leftPercent}% - 56px)`,
                  bottom: "28%",
                }}
              >
                <FloatingDocCard
                  ext={doc.ext}
                  name={doc.name}
                  brandColor={doc.brandColor}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          SECTION 3 — CONVERTER ENGINE
         ══════════════════════════════════════════════ */}
      <div
        id="converter-section"
        ref={converterSectionRef}
        className="w-full relative flex-grow flex items-start justify-center py-24 bg-[#B9A071]"
      >
        <Converter />
      </div>

      {/* ══════════════════════════════════════════════
          FOOTER
         ══════════════════════════════════════════════ */}
      <footer className="w-full border-t-2 border-[#862937] bg-[#C4B883] py-8 relative z-20 text-sm font-black uppercase tracking-widest text-[#862937]">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-[#862937] flex items-center justify-center text-[#C4B883] font-black text-sm uppercase">
              BD
            </div>
            <span className="text-xl tracking-normal">BLOOPDOCS</span>
          </div>
          <p className="tracking-widest">
            © {new Date().getFullYear()} BLOOPDOCS
          </p>
        </div>
      </footer>
    </main>
  );
}
