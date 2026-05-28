"use client";

import React, { useRef } from "react";
import Navbar from "@/components/Navbar";
import Converter from "@/components/Converter";
import FloatingDocCard from "@/components/FloatingDocCard";
import { useHeroParallax } from "@/hooks/useGsapTimeline";

const FLOATING_DOCS = [
  { ext: "PDF", name: "report.pdf", brandColor: "#FF0000", speedX: -1.2, speedY: -0.8, style: { left: "8%", top: "15%" } },
  { ext: "DOCX", name: "resume.docx", brandColor: "#2B579A", speedX: 1.4, speedY: -1.0, style: { right: "8%", top: "12%" } },
  { ext: "PAGES", name: "novel.pages", brandColor: "#F98D29", speedX: -1.6, speedY: 1.2, style: { left: "5%", bottom: "20%" } },
  { ext: "XLSX", name: "budget.xlsx", brandColor: "#217346", speedX: 1.2, speedY: 0.9, style: { right: "5%", bottom: "16%" } },
  { ext: "KEY", name: "pitch.key", brandColor: "#007AFF", speedX: -0.8, speedY: -1.4, style: { left: "20%", top: "50%" } },
  { ext: "PPTX", name: "deck.pptx", brandColor: "#D24726", speedX: 1.1, speedY: 1.3, style: { right: "20%", bottom: "45%" } },
];

export default function Home() {
  const converterSectionRef = useRef<HTMLDivElement | null>(null);
  const heroContainerRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useHeroParallax(heroContainerRef, cardsRef);

  return (
    <main className="flex-grow flex flex-col relative z-10 w-full bg-[#C4B883] overflow-hidden pt-20 min-h-screen">
      <Navbar />

      {/* MASSIVE TYPOGRAPHIC HERO */}
      <div 
        ref={heroContainerRef}
        className="w-full relative z-20 flex flex-col items-center justify-center pt-24 pb-12 px-6 mt-12 border-b-2 border-[#862937] min-h-[420px] md:min-h-[500px]"
      >
        {/* Floating document themed cards */}
        {FLOATING_DOCS.map((doc, idx) => (
          <div
            key={idx}
            ref={(el) => {
              if (cardsRef.current) {
                cardsRef.current[idx] = el;
              }
            }}
            data-speed-x={doc.speedX}
            data-speed-y={doc.speedY}
            className="hidden lg:block absolute"
            style={doc.style}
          >
            <FloatingDocCard
              ext={doc.ext}
              name={doc.name}
              brandColor={doc.brandColor}
            />
          </div>
        ))}

        <h1 className="text-[6rem] md:text-[12rem] font-black tracking-normal text-[#862937] mb-8 text-center leading-[0.85] uppercase relative z-30 select-none">
          CONVERT <br className="hidden md:block"/> ANYTHING.
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
