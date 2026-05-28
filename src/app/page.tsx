"use client";

import React, { useRef } from "react";
import Navbar from "@/components/Navbar";
import Converter from "@/components/Converter";
import FloatingDocCard from "@/components/FloatingDocCard";
import { useTypewriter, useDocumentDrop, useConverterReveal } from "@/hooks/useGsapTimeline";

const FALL_DOCS = [
  { ext: "PDF",   name: "report.pdf",    brandColor: "#FF3B30" },
  { ext: "DOCX",  name: "resume.docx",   brandColor: "#2B579A" },
  { ext: "PAGES", name: "novel.pages",   brandColor: "#F98D29" },
  { ext: "XLSX",  name: "budget.xlsx",   brandColor: "#217346" },
  { ext: "PPTX",  name: "deck.pptx",     brandColor: "#D24726" },
  { ext: "KEY",   name: "keynote.key",   brandColor: "#007AFF" },
];

export default function Home() {
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const cursorRef = useRef<HTMLSpanElement | null>(null);
  const outerDropRef = useRef<HTMLDivElement | null>(null);
  const docRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dustRef = useRef<HTMLDivElement | null>(null);
  const converterRef = useRef<HTMLDivElement | null>(null);

  useTypewriter(titleRef, cursorRef);
  useDocumentDrop(outerDropRef, docRefs, dustRef);
  useConverterReveal(converterRef);

  return (
    <main className="w-full bg-[#C4B883]">
      <Navbar />

      {/* ─── HERO ─── */}
      <section className="w-full min-h-screen flex flex-col items-center justify-center px-6 pt-20 border-b-2 border-[#862937] bg-[#C4B883]">
        <h1
          ref={titleRef}
          className="font-black text-[#862937] text-center uppercase select-none leading-[0.85] text-[clamp(4rem,15vw,12rem)]"
        >
          {"CONVERT".split("").map((ch, i) => (
            <span key={`a${i}`} className="tw-char" style={{ visibility: "hidden" }}>{ch}</span>
          ))}
          <br />
          {"ANYTHING.".split("").map((ch, i) => (
            <span key={`b${i}`} className="tw-char" style={{ visibility: "hidden" }}>{ch}</span>
          ))}
          <span
            ref={cursorRef}
            className="inline-block w-[0.12em] h-[0.75em] bg-[#862937] ml-1 align-middle animate-blink"
            aria-hidden="true"
          />
        </h1>
        <p className="mt-6 text-lg md:text-2xl text-[#903635] font-bold tracking-widest uppercase text-center max-w-3xl leading-relaxed select-none">
          Strictly local. Absolutely free.<br />Zero size limits.
        </p>
        <div className="mt-12 flex flex-col items-center gap-2 opacity-50">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#862937]">Scroll</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2v12M3 9l5 5 5-5" stroke="#862937" strokeWidth="2" strokeLinecap="square"/>
          </svg>
        </div>
      </section>

      {/* ─── DOCUMENT DROP ─── 
           Outer = 300vh (scroll runway).
           Inner = sticky 100vh panel that stays in viewport while you scroll. -->  */}
      <div ref={outerDropRef} className="relative w-full" style={{ height: "300vh" }}>
        <div className="sticky top-0 left-0 w-full h-screen overflow-hidden bg-[#C4B883]">
          {/* dust layer */}
          <div ref={dustRef} className="absolute inset-0 pointer-events-none z-30" />

          {/* ground line */}
          <div className="absolute left-12 right-12 z-10" style={{ bottom: "30%" }}>
            <div className="w-full h-[2px] bg-[#862937] opacity-20" />
          </div>

          {/* label */}
          <div className="absolute top-10 left-0 right-0 text-center z-40 pointer-events-none">
            <p className="text-xs md:text-sm font-black uppercase tracking-[0.4em] text-[#862937] opacity-30">
              Every format, handled
            </p>
          </div>

          {/* cards — absolutely positioned across the width */}
          {FALL_DOCS.map((doc, idx) => {
            const pct = 6 + idx * 15; // 6%, 21%, 36%, 51%, 66%, 81%
            return (
              <div
                key={idx}
                ref={(el) => { docRefs.current[idx] = el; }}
                className="absolute z-20"
                style={{ width: 112, height: 144, left: `${pct}%`, bottom: "30%" }}
              >
                <FloatingDocCard ext={doc.ext} name={doc.name} brandColor={doc.brandColor} />
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── CONVERTER ─── */}
      <div ref={converterRef} className="w-full py-24 bg-[#B9A071]">
        <Converter />
      </div>

      {/* ─── FOOTER ─── */}
      <footer className="w-full border-t-2 border-[#862937] bg-[#C4B883] py-8 text-sm font-black uppercase tracking-widest text-[#862937]">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#862937] flex items-center justify-center text-[#C4B883] text-xs">BD</div>
            <span className="text-xl tracking-normal">BLOOPDOCS</span>
          </div>
          <p className="tracking-widest text-xs">© {new Date().getFullYear()} BLOOPDOCS</p>
        </div>
      </footer>
    </main>
  );
}
