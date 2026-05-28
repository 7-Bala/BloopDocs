"use client";

import React, { useRef } from "react";
import Navbar from "@/components/Navbar";
import Converter from "@/components/Converter";
import FloatingDocCard from "@/components/FloatingDocCard";
import { useHeroParallax, useTypewriter } from "@/hooks/useGsapTimeline";

const FLOATING_DOCS = [
  { ext: "PDF", name: "report.pdf", brandColor: "#FF0000", speedX: -1.2, speedY: -0.8, style: { left: "1%", top: "10%" } },
  { ext: "DOCX", name: "resume.docx", brandColor: "#2B579A", speedX: 1.4, speedY: -1.0, style: { right: "1%", top: "8%" } },
  { ext: "PAGES", name: "novel.pages", brandColor: "#F98D29", speedX: -1.6, speedY: 1.2, style: { left: "0%", bottom: "12%" } },
  { ext: "XLSX", name: "budget.xlsx", brandColor: "#217346", speedX: 1.2, speedY: 0.9, style: { right: "0%", bottom: "10%" } },
  { ext: "KEY", name: "pitch.key", brandColor: "#007AFF", speedX: -0.8, speedY: -1.4, style: { left: "4%", top: "44%" } },
  { ext: "PPTX", name: "deck.pptx", brandColor: "#D24726", speedX: 1.1, speedY: 1.3, style: { right: "4%", bottom: "40%" } },
];

export default function Home() {
  const converterSectionRef = useRef<HTMLDivElement | null>(null);
  const heroContainerRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const cursorRef = useRef<HTMLSpanElement | null>(null);

  // Mount-time typewriter reveal
  useTypewriter(titleRef, cursorRef);

  // Coordinated scroll-driven document dispersion + converter perspective slide-in
  useHeroParallax(heroContainerRef, cardsRef, converterSectionRef);

  const textLine1 = "CONVERT";
  const textLine2 = "ANYTHING.";

  return (
    <main className="flex-grow flex flex-col relative z-10 w-full bg-[#C4B883] overflow-hidden pt-20 min-h-screen">
      <Navbar />

      {/* MASSIVE TYPOGRAPHIC HERO */}
      <div 
        ref={heroContainerRef}
        className="w-full relative z-20 flex flex-col items-center justify-center pt-24 pb-12 px-6 mt-12 border-b-2 border-[#862937] min-h-[420px] md:min-h-[500px] bg-[#C4B883]"
      >
        {/* Alignment Wrapper: Locks boundaries to max-w-5xl and prevents offscreen clipping */}
        <div className="absolute inset-0 w-full max-w-5xl mx-auto pointer-events-none z-10 hidden lg:block">
          <div className="relative w-full h-full">
            {/* Floating document themed cards */}
            {FLOATING_DOCS.map((doc, idx) => (
              <div
                key={idx}
                ref={(el) => {
                  if (cardsRef.current) {
                    cardsRef.current[idx] = el;
                  }
                }}
                className="absolute pointer-events-auto"
                style={doc.style}
              >
                <div
                  className="parallax-inner"
                  data-speed-x={doc.speedX}
                  data-speed-y={doc.speedY}
                >
                  <FloatingDocCard
                    ext={doc.ext}
                    name={doc.name}
                    brandColor={doc.brandColor}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <h1 
          ref={titleRef}
          className="text-[6rem] md:text-[12rem] font-black tracking-normal text-[#862937] mb-8 text-center leading-[0.85] uppercase relative z-30 select-none min-h-[160px] md:min-h-[260px]"
        >
          {textLine1.split("").map((char, index) => (
            <span key={`line1-${index}`} className="typewriter-letter" style={{ display: "none" }}>
              {char}
            </span>
          ))}
          <br className="hidden md:block"/>
          {" "}
          {textLine2.split("").map((char, index) => (
            <span key={`line2-${index}`} className="typewriter-letter" style={{ display: "none" }}>
              {char}
            </span>
          ))}
          {/* Blinking block terminal cursor */}
          <span 
            ref={cursorRef} 
            className="inline-block w-[15px] md:w-[30px] h-[65px] md:h-[115px] bg-[#862937] ml-2 align-middle relative top-[-6px] md:top-[-10px] animate-blink"
          />
        </h1>
        <p className="text-xl md:text-2xl text-[#903635] font-bold tracking-widest uppercase text-center max-w-3xl leading-relaxed mt-4 relative z-30 select-none">
          Strictly local. Absolutely free. <br /> Zero size limits.
        </p>
      </div>

      {/* CONVERTER ENGINE SECTION */}
      <div 
        id="converter-section"
        ref={converterSectionRef} 
        className="w-full relative flex-grow flex items-start justify-center py-24 bg-[#B9A071]"
      >
        <Converter />
      </div>

      {/* BRUTALIST FOOTER */}
      <footer className="w-full border-t-2 border-[#862937] bg-[#C4B883] py-8 relative z-20 text-center text-sm font-black uppercase tracking-widest text-[#862937]">
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
