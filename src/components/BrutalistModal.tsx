"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

interface BrutalistModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function BrutalistModal({ isOpen, onClose, title, children }: BrutalistModalProps) {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop with premium blur */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#FAFAFA] border-4 border-[#862937] shadow-[12px_12px_0px_0px_#862937] flex flex-col z-10 transition-all duration-300 animate-modalPop">
        
        {/* Header Bar */}
        <div className="w-full bg-[#862937] text-[#C4B883] px-6 py-4 flex items-center justify-between border-b-4 border-[#862937] select-none">
          <span className="font-black text-sm uppercase tracking-widest">
            {title}
          </span>
          <button 
            onClick={onClose}
            className="p-1 border-2 border-[#C4B883] bg-[#862937] text-[#C4B883] hover:bg-[#C4B883] hover:text-[#862937] transition-all duration-200 hover:rotate-90 origin-center"
            aria-label="Close modal"
          >
            <X className="w-4 h-4 stroke-[3px]" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-2 md:p-6 bg-[#FAFAFA]">
          {children}
        </div>
      </div>

      {/* Embedded Animations using simple CSS */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalPop {
          from { 
            opacity: 0;
            transform: scale(0.96) translateY(20px);
          }
          to { 
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out forwards;
        }
        .animate-modalPop {
          animation: modalPop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>
    </div>
  );
}
