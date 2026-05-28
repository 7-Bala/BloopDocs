"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { X, Check, AlertCircle, Info } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextProps {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-dismiss after 3.5 seconds
    setTimeout(() => {
      dismissToast(id);
    }, 3500);
  }, [dismissToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Overlay Container */}
      <div className="fixed top-8 right-8 z-50 flex flex-col gap-4 max-w-sm w-full pointer-events-none px-4 md:px-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-4 p-5 rounded-2xl transition-all duration-300 transform translate-y-0 scale-100 animate-slide-in bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] ${
              toast.type === "success"
                ? "border-emerald-500/30"
                : toast.type === "error"
                ? "border-rose-500/30"
                : "border-cyan-500/30"
            }`}
          >
            {/* Status Icons */}
            <div className="flex-shrink-0 mt-0.5">
              {toast.type === "success" && (
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}
              {toast.type === "error" && (
                <div className="w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 border border-rose-500/30">
                  <AlertCircle className="w-3.5 h-3.5" />
                </div>
              )}
              {toast.type === "info" && (
                <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 border border-cyan-500/30">
                  <Info className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            {/* Message Body */}
            <div className="flex-grow">
              <p className="text-xs font-semibold text-slate-100 tracking-tight leading-normal font-sans">
                {toast.message}
              </p>
            </div>

            {/* Micro-interaction Dismiss trigger */}
            <button
              onClick={() => dismissToast(toast.id)}
              className="flex-shrink-0 text-slate-400 hover:text-slate-200 transition-all p-1 rounded-full hover:bg-white/5 hover:scale-105 active:scale-95 duration-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Embedded Animation CSS for the Toasts */}
      <style jsx global>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-15px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-slide-in {
          animation: slideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </ToastContext.Provider>
  );
}
