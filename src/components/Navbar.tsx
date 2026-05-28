"use client";

import React from "react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#C4B883] border-b-2 border-[#862937]">
      <div className="w-full px-8 h-20 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="group flex items-center gap-4 transition-brutalist">
          <div className="w-8 h-8 bg-[#862937] flex items-center justify-center text-[#C4B883] font-black text-sm uppercase">
            BD
          </div>
          <span className="text-xl font-black text-[#862937] tracking-normal uppercase">BloopDocs</span>
        </Link>

        {/* BRUTALIST TEXT LINKS */}
        <div className="hidden md:flex items-center gap-8">
          <Link 
            href="#converter-section" 
            className="text-sm font-black text-[#862937] uppercase tracking-widest px-3 py-2 hover:bg-[#B9A071] transition-brutalist"
          >
            CONVERTERS
          </Link>
          <Link 
            href="#" 
            className="text-sm font-black text-[#862937] uppercase tracking-widest px-3 py-2 hover:bg-[#B9A071] transition-brutalist"
          >
            BATCH
          </Link>
          <Link 
            href="#" 
            className="text-sm font-black text-[#862937] uppercase tracking-widest px-3 py-2 hover:bg-[#B9A071] transition-brutalist"
          >
            DOCS
          </Link>
        </div>

        {/* MOBILE MENU TOGGLE (Pure Text) */}
        <button className="md:hidden text-sm font-black text-[#862937] uppercase tracking-widest hover:bg-[#B9A071] px-3 py-2 transition-brutalist">
          Menu
        </button>
      </div>
    </nav>
  );
}
