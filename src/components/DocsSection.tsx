"use client";

import React, { useState } from "react";
import { Shield, Zap, RefreshCw, Cpu, ChevronDown, ChevronUp, FileCode } from "lucide-react";

interface DocItem {
  icon: React.ReactNode;
  title: string;
  shortDesc: string;
  longDesc: string;
}

const DOCS_DATA: DocItem[] = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: "100% Local (Zero Server Uploads)",
    shortDesc: "All translation tasks occur fully inside your browser sandbox via WebAssembly.",
    longDesc: "Confidentiality is guaranteed. Unlike cloud tools that transmit documents to remote microservices, BloopDocs boots a localized compilation pipeline. Once loaded, you can turn off your Wi-Fi entirely; the converter will continue to compile Word, Excel, Pages, and Keynote sheets locally. Absolutely zero bytes leave your hardware."
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Unlimited File Sizes",
    shortDesc: "Say goodbye to arbitrary 5MB limits. If your computer can open it, BloopDocs can convert it.",
    longDesc: "Because local execution bypasses network bandwidth bottlenecks and server memory limits, BloopDocs has an absolute zero-file-size cap. Feel free to drop a 500MB corporate financial ledger, a 1.2GB Keynote slide pack, or massive raw text logs. The browser allocates system RAM directly, finishing the translation in seconds."
  },
  {
    icon: <Cpu className="w-6 h-6" />,
    title: "Multithreaded Parallel Engine",
    shortDesc: "Utilizes advanced hardware thread pooling to translate batches in parallel.",
    longDesc: "BloopDocs is engineered with highly parallelized Web Workers. When you drop a batch of documents, our manager queries `navigator.hardwareConcurrency` and initializes a pool of background threads. Every document compiles on its own logical core, preventing UI freezes and maximizing CPU efficiency for batch operations."
  },
  {
    icon: <RefreshCw className="w-6 h-6" />,
    title: "High-Fidelity Layout Preservation",
    shortDesc: "Preserves cell coordinates, geometric vector assets, sheets, and fonts.",
    longDesc: "Our layouts are preserved using native canvas rendering grids and structural XML vector mapping. Rather than flat-rasterizing text blocks (which degrades quality), our parser extracts absolute typographic coordinates, CSS margins, column wrappers, slide layers, and Excel grid configurations, outputting pixel-perfect universally readable formats."
  }
];

export default function DocsSection() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section 
      id="docs-section" 
      className="w-full py-24 bg-[#C4B883] border-t-2 border-[#862937] text-[#862937]"
    >
      <div className="max-w-6xl mx-auto px-8 w-full">
        {/* Section Header */}
        <div className="text-center mb-16 select-none max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-none border-2 border-[#862937] bg-[#B9A071] text-[10px] font-black uppercase tracking-widest text-[#862937] mb-6 shadow-[2px_2px_0px_0px_#862937]">
            <FileCode className="w-4 h-4" />
            Local Engine Docs
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-[#862937] mb-6 leading-none uppercase tracking-tight">
            Technical Documentation
          </h2>
          <p className="text-xs md:text-sm font-black uppercase tracking-widest leading-relaxed text-[#903635]">
            Learn how the privacy-first WebAssembly document compiler runs locally inside your browser sandbox.
          </p>
        </div>

        {/* Documentation Brutalist Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {DOCS_DATA.map((item, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <div 
                key={index}
                className="group relative border-4 border-[#862937] bg-[#FAFAFA] text-[#862937] p-6 shadow-[6px_6px_0px_0px_#862937] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_#862937] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Row: Icon + Title */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="p-2 border-2 border-[#862937] bg-[#B9A071] text-[#862937] flex items-center justify-center">
                      {item.icon}
                    </div>
                    <button 
                      onClick={() => toggleExpand(index)}
                      className="p-1 border-2 border-[#862937] hover:bg-[#B9A071] transition-colors duration-200"
                      aria-label={isExpanded ? "Collapse specifications" : "Expand specifications"}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  <h3 className="text-lg font-black uppercase tracking-wider mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs font-semibold leading-relaxed text-[#903635]">
                    {item.shortDesc}
                  </p>

                  {/* Expandable Specifications Details */}
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isExpanded ? "max-h-60 mt-4 opacity-100 border-t border-dashed border-[#862937] pt-4" : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="text-xs font-medium text-slate-700 leading-relaxed normal-case">
                      {item.longDesc}
                    </p>
                  </div>
                </div>

                {/* Bottom Toggle CTA */}
                <div className="mt-6 flex justify-end">
                  <button 
                    onClick={() => toggleExpand(index)}
                    className="text-[10px] font-black uppercase tracking-widest border-2 border-[#862937] px-3 py-1 bg-[#B9A071] hover:bg-[#862937] hover:text-[#C4B883] transition-all duration-200"
                  >
                    {isExpanded ? "hide details" : "view technical details"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
