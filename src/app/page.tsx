"use client";

import React, { useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Converter from "@/components/Converter";
import FloatingDocCard from "@/components/FloatingDocCard";
import HandwrittenTitle from "@/components/HandwrittenTitle";
import FormatOrbit from "@/components/FormatOrbit";
import DocsSection from "@/components/DocsSection";
import BrutalistModal from "@/components/BrutalistModal";
import { useDocumentDrop, useConverterReveal } from "@/hooks/useGsapTimeline";

const FALL_DOCS = [
  { ext: "PDF",   name: "report.pdf",    brandColor: "#FF3B30" },
  { ext: "DOCX",  name: "resume.docx",   brandColor: "#2B579A" },
  { ext: "PAGES", name: "novel.pages",   brandColor: "#F98D29" },
  { ext: "XLSX",  name: "budget.xlsx",   brandColor: "#217346" },
  { ext: "PPTX",  name: "deck.pptx",     brandColor: "#D24726" },
  { ext: "KEY",   name: "keynote.key",   brandColor: "#007AFF" },
];

export default function Home() {
  const outerDropRef = useRef<HTMLDivElement | null>(null);
  const docRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dustRef = useRef<HTMLDivElement | null>(null);
  const converterRef = useRef<HTMLDivElement | null>(null);

  const [activeModal, setActiveModal] = useState<"supported-files" | "docs" | null>(null);

  useDocumentDrop(outerDropRef, docRefs, dustRef);
  useConverterReveal(converterRef);

  return (
    <main className="w-full bg-[#C4B883]">
      <Navbar 
        onOpenSupportedFiles={() => setActiveModal("supported-files")}
        onOpenDocs={() => setActiveModal("docs")}
      />

      {/* ─── HERO ─── */}
      <section className="w-full min-h-screen flex flex-col items-center justify-center px-6 pt-20 border-b-2 border-[#862937] bg-[#C4B883]">
        <div className="w-full max-w-4xl">
          <HandwrittenTitle />
        </div>
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
           Simple section — animation triggers once on enter, scrolling stays natural */}
      <div
        ref={outerDropRef}
        className="relative w-full overflow-hidden bg-[#C4B883]"
        style={{ height: "80vh" }}
      >
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

        {/* cards */}
        {FALL_DOCS.map((doc, idx) => {
          const pct = 6 + idx * 15;
          return (
            <div
              key={idx}
              ref={(el) => { docRefs.current[idx] = el; }}
              className="absolute z-20"
              style={{ width: 112, height: 144, left: `${pct}%`, bottom: "30%", willChange: "transform, opacity" }}
            >
              <FloatingDocCard ext={doc.ext} name={doc.name} brandColor={doc.brandColor} />
            </div>
          );
        })}
      </div>

      {/* ─── CONVERTER ─── */}
      <div ref={converterRef} className="w-full py-24 bg-[#B9A071]">
        <Converter />
      </div>

      {/* ─── FOOTER ─── */}
      <footer className="w-full border-t-2 border-[#862937] bg-[#C4B883] py-8 text-sm font-black uppercase tracking-widest text-[#862937]">
        <div className="w-full px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 select-none">
            <div className="w-8 h-8 bg-[#862937] flex items-center justify-center text-[#C4B883] text-xs font-black">BD</div>
            <span className="text-xl tracking-normal font-black">BLOOPDOCS</span>
          </div>

          {/* Cursive "think2thrive" Branding */}
          <div className="flex items-center gap-2 group cursor-default select-none text-[#862937] font-bold text-xs tracking-wide lowercase">
            <span>crafted with</span>
            <span className="relative inline-flex items-center justify-center w-5 h-5">
              {/* Beating Heart Symbol (Beige fill, Burgundy stroke) */}
              <svg
                className="w-4 h-4 text-[#862937] fill-[#C4B883] transition-all duration-300 group-hover:scale-125 group-hover:fill-[#862937]"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </span>
            <span>by</span>
            <span
              className="font-caveat text-2xl tracking-normal text-[#862937] inline-block transition-transform duration-300 ease-out origin-center group-hover:scale-110 group-hover:rotate-[-2deg]"
              style={{ fontFamily: "var(--font-caveat), Caveat, cursive" }}
            >
              think2thrive
            </span>
          </div>

          {/* Copyright */}
          <p className="tracking-widest text-xs font-black select-none">© {new Date().getFullYear()} BLOOPDOCS</p>
        </div>
      </footer>

      {/* Brutalist Overlay Modals */}
      <BrutalistModal
        isOpen={activeModal === "supported-files"}
        onClose={() => setActiveModal(null)}
        title="Supported Document Formats"
      >
        <FormatOrbit />
      </BrutalistModal>

      {/* Technical Documentation Modal */}
      <BrutalistModal
        isOpen={activeModal === "docs"}
        onClose={() => setActiveModal(null)}
        title="Technical Documentation"
      >
        <DocsSection />
      </BrutalistModal>
    </main>
  );
}
