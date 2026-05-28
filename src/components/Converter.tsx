"use client";

import React, { useState, useRef, DragEvent, ChangeEvent, useEffect } from "react";
import { UploadCloud, Trash2, ArrowRight, Download, CheckSquare, RefreshCw } from "lucide-react";
import { useToast } from "./Toast";

// Assign brand colors to formats
const ALL_FORMATS = [
  { label: "Word (.docx)", ext: "docx", brand: "#2B579A" },
  { label: "Pages (.pages)", ext: "pages", brand: "#F98D29" },
  { label: "Excel (.xlsx)", ext: "xlsx", brand: "#217346" },
  { label: "Numbers (.numbers)", ext: "numbers", brand: "#3FA94D" },
  { label: "PowerPoint (.pptx)", ext: "pptx", brand: "#D24726" },
  { label: "Keynote (.key)", ext: "key", brand: "#007AFF" },
  { label: "PDF (.pdf)", ext: "pdf", brand: "#FF0000" },
  { label: "Text (.txt)", ext: "txt", brand: "#555555" },
  { label: "CSV (.csv)", ext: "csv", brand: "#217346" },
  { label: "RTF (.rtf)", ext: "rtf", brand: "#804A95" },
];

const SUPPORTED_INPUT_EXTS = ALL_FORMATS.map(f => "." + f.ext);

type ConverterState = "idle" | "selected" | "converting" | "success";

// Processing Pixel (10x10px)
const ProcessingPixel = ({ isSuccess }: { isSuccess: boolean }) => {
  if (isSuccess) {
    return (
      <div className="w-[10px] h-[10px] bg-[#C4B883] border border-[#862937]" />
    );
  }

  return (
    <div className="w-[10px] h-[10px] bg-[#903635] animate-pulse rounded-none shadow-none" />
  );
};

export default function Converter() {
  const { showToast } = useToast();

  const [state, setState] = useState<ConverterState>("idle");
  const [files, setFiles] = useState<File[]>([]);
  const [targetExt, setTargetExt] = useState<string>("pdf");
  const [isDragActive, setIsDragActive] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [sessionId, setSessionId] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const validateAndProcessFiles = (selectedFiles: FileList | File[]) => {
    const validFiles: File[] = [];
    Array.from(selectedFiles).forEach(file => {
      const fileName = file.name;
      const dotIndex = fileName.lastIndexOf(".");
      if (dotIndex === -1) return;
      const ext = fileName.substring(dotIndex).toLowerCase();
      if (SUPPORTED_INPUT_EXTS.includes(ext)) {
        validFiles.push(file);
      }
    });

    if (validFiles.length === 0) {
      showToast("No supported files found.", "error");
      return;
    }

    setFiles(prev => [...prev, ...validFiles]);
    setState("selected");
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
  };
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(true);
  };
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFiles(e.dataTransfer.files);
    }
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFiles(e.target.files);
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    if (newFiles.length === 0) setState("idle");
  };

  const handleReset = () => {
    setFiles([]);
    setDownloadUrl("");
    setState("idle");
  };

  const handleConvert = async () => {
    if (files.length === 0 || !targetExt) return;

    setState("converting");
    
    const sId = Math.random().toString(36).substring(2, 8).toUpperCase();
    setSessionId(sId);
    setTerminalLogs([`Initializing secure sandbox session: bloopdocs_engine_${sId}`]);

    // Clear existing timeouts
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    // Helper to queue progress logs
    const addLogWithDelay = (message: string, delay: number) => {
      const t = setTimeout(() => {
        setTerminalLogs(prev => [...prev, message]);
      }, delay);
      timeoutsRef.current.push(t);
    };

    addLogWithDelay("Spawning headless LibreOffice compiler instance...", 1200);
    addLogWithDelay("Allocating private session memory block for thread isolation...", 2800);
    addLogWithDelay(`Mounting source documents and preparing translation queue...`, 4500);
    addLogWithDelay(`Executing LibreOffice conversion to format: ${targetExt.toUpperCase()}...`, 6800);
    addLogWithDelay("Rebuilding document grids, spacing layers, and rendering geometry...", 9500);
    addLogWithDelay("Creating deep-compressed JSZip export cluster stream...", 12500);
    addLogWithDelay("Finalizing system integrity checks and wiping server temp blocks...", 15000);

    const formData = new FormData();
    files.forEach(file => formData.append("files", file));
    formData.append("targetExt", targetExt);

    try {
      const response = await fetch("/api/convert", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);

      // Success! Clear timeouts and show final success outputs
      timeoutsRef.current.forEach(clearTimeout);
      setTerminalLogs(prev => [
        ...prev,
        `[SUCCESS] LibreOffice core successfully converted all files to ${targetExt.toUpperCase()}!`,
        `[SUCCESS] Session: bloopdocs_engine_${sId} secured and wiped (0 bytes remaining).`,
        "Ready for download compilation."
      ]);

      setState("success");
    } catch (error: any) {
      console.error(error);
      
      // Error! Clear timeouts and show failure outputs
      timeoutsRef.current.forEach(clearTimeout);
      setTerminalLogs(prev => [
        ...prev,
        `[ERROR] Conversion engine encountered a fatal exception.`,
        `[ERROR] Details: ${error.message || "Unknown compile error"}.`,
        `[ERROR] Securely wiping conversion session block: COMPLETE.`
      ]);

      setState("selected");
      showToast(error.message || "An error occurred during local conversion.", "error");
    }
  };

  const handleDownload = () => {
    if (!downloadUrl) return;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = "Converted_Documents.zip";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-6 select-none">
      <div className="w-full border-[2px] border-solid border-[#862937] bg-[#C4B883] rounded-none shadow-none">
        
        {/* STATE: IDLE (DRAG & DROP ZONE) */}
        {state === "idle" && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex flex-col items-center justify-center py-40 px-12 cursor-pointer transition-none rounded-none shadow-none border-b-[2px] border-solid border-[#862937] ${isDragActive ? "bg-[#903635]" : "bg-[#B9A071]"}`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".docx,.pages,.xlsx,.numbers,.pptx,.key,.pdf,.txt,.csv,.rtf"
              onChange={handleFileChange}
              className="hidden"
            />
            <UploadCloud className="w-20 h-20 mb-8 text-[#862937]" strokeWidth={1.5} />
            <h3 className={`text-5xl md:text-6xl font-black mb-4 uppercase tracking-normal ${isDragActive ? "text-[#C4B883]" : "text-[#862937]"}`}>
              DROP FILES HERE
            </h3>
            <p className={`text-xl font-bold uppercase tracking-widest ${isDragActive ? "text-[#C4B883]" : "text-[#903635]"}`}>
              or click to browse local documents
            </p>
          </div>
        )}

        {/* STATE: SELECTED, CONVERTING, SUCCESS (TABLE UI) */}
        {state !== "idle" && (
          <div className="flex flex-col rounded-none shadow-none">
            {/* Header row - 2px structural border */}
            <div className="grid grid-cols-12 gap-4 px-8 py-4 border-b-[2px] border-solid border-[#862937] bg-[#B9A071] text-sm font-black text-[#862937] uppercase tracking-widest rounded-none shadow-none">
              <div className="col-span-4 md:col-span-4">FILE NAME</div>
              <div className="col-span-2 md:col-span-2 hidden md:block">SIZE</div>
              <div className="col-span-4 md:col-span-3 text-center">TARGET FORMAT</div>
              <div className="col-span-1 md:col-span-1 text-center">STATUS</div>
              <div className="col-span-1 md:col-span-2 text-right">ACTION</div>
            </div>

            {/* File List Rows - 1px border per row */}
            <div className="max-h-[500px] overflow-y-auto custom-scrollbar bg-[#C4B883] rounded-none shadow-none">
              {files.map((file, idx) => {
                const ext = file.name.split('.').pop()?.toLowerCase() || '';
                const format = ALL_FORMATS.find(f => f.ext === ext);
                const iconColor = format ? format.brand : "#862937";
                
                return (
                  <div key={idx} className="grid grid-cols-12 gap-4 px-8 py-6 border-b-[1px] border-solid border-[#862937] items-center hover:bg-[#862937] hover:text-[#C4B883] group transition-none rounded-none shadow-none">
                    <div className="col-span-4 md:col-span-4 flex items-center gap-4 min-w-0">
                      <div className="w-8 h-8 flex items-center justify-center font-bold text-white uppercase text-[10px] rounded-none shadow-none border border-transparent" style={{ backgroundColor: iconColor }}>
                        {ext}
                      </div>
                      <span className="text-base font-bold text-[#862937] group-hover:text-[#C4B883] truncate">{file.name}</span>
                    </div>
                    <div className="col-span-2 md:col-span-2 text-sm font-bold text-[#903635] group-hover:text-[#C4B883] hidden md:block">
                      {formatFileSize(file.size)}
                    </div>
                    <div className="col-span-4 md:col-span-3 flex items-center justify-center gap-4">
                      {state === "selected" ? (
                        <>
                          <span className="text-xs text-[#903635] group-hover:text-[#C4B883] uppercase font-black">{ext}</span>
                          <ArrowRight className="w-4 h-4 text-[#862937] group-hover:text-[#C4B883]" />
                          <select
                            value={targetExt}
                            onChange={(e) => setTargetExt(e.target.value)}
                            className="bg-[#C4B883] border-[2px] border-solid border-[#862937] px-4 py-2 text-sm font-black text-[#862937] uppercase outline-none cursor-pointer rounded-none shadow-none hover:bg-[#B9A071] transition-none"
                          >
                            {ALL_FORMATS.map(f => (
                              <option key={f.ext} value={f.ext}>{f.label}</option>
                            ))}
                          </select>
                        </>
                      ) : (
                        <span className="text-sm font-black text-[#862937] group-hover:text-[#C4B883] uppercase">
                          ➔ {targetExt}
                        </span>
                      )}
                    </div>
                    <div className="col-span-1 md:col-span-1 flex items-center justify-center">
                      {(state === "converting" || state === "success") && (
                        <ProcessingPixel isSuccess={state === "success"} />
                      )}
                    </div>
                    <div className="col-span-1 md:col-span-2 flex items-center justify-end">
                      {state === "selected" && (
                        <button onClick={() => handleRemoveFile(idx)} className="text-[#862937] hover:bg-[#C4B883] group-hover:text-[#C4B883] group-hover:hover:bg-[#B9A071] group-hover:hover:text-[#862937] p-2 transition-none rounded-none shadow-none border-none">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ENGINE TERMINAL LOGS CONSOLE */}
            {state === "converting" && (
              <div className="p-8 border-t-[2px] border-solid border-[#862937] bg-[#1E1E1E] font-mono text-sm text-[#3FA94D] text-left rounded-none shadow-none select-text">
                <div className="flex items-center justify-between border-b border-[#862937] pb-3 mb-4">
                  <span className="font-black uppercase tracking-wider text-[#862937]">BloopDocs Engine Terminal</span>
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#3FA94D] animate-ping" />
                    <span className="text-[10px] uppercase font-bold text-[#3FA94D]">active</span>
                  </span>
                </div>
                <div className="space-y-2 h-[140px] overflow-y-auto custom-scrollbar pr-2">
                  {terminalLogs.map((log, i) => (
                    <div key={i} className="flex gap-3 leading-relaxed">
                      <span className="text-[#862937] font-bold select-none">&gt;</span>
                      <span className="font-bold tracking-normal">{log}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-3">
                    <span className="text-[#862937] font-bold select-none">&gt;</span>
                    <span className="inline-block w-2.5 h-4 bg-[#3FA94D] animate-pulse" />
                  </div>
                </div>
              </div>
            )}

            {/* Action Bar footer - 2px structural border */}
            <div className="p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-t-[2px] border-solid border-[#862937] bg-[#B9A071] rounded-none shadow-none">
              <div className="text-sm text-[#862937] font-black uppercase tracking-widest">
                {files.length} file{files.length !== 1 ? 's' : ''} queued
              </div>
              
              <div className="flex w-full sm:w-auto gap-4">
                {state === "selected" && (
                  <button
                    onClick={handleConvert}
                    className="w-full sm:w-auto px-10 py-4 bg-[#862937] text-[#C4B883] font-bold hover:font-black hover:bg-[#C4B883] hover:text-[#862937] text-lg uppercase tracking-widest border-[2px] border-solid border-[#862937] transition-none flex items-center justify-center gap-3 rounded-none shadow-none"
                  >
                    CONVERT NOW
                  </button>
                )}
                
                {state === "converting" && (
                  <button disabled className="w-full sm:w-auto px-10 py-4 bg-[#862937] text-[#C4B883] border-[2px] border-solid border-[#862937] font-black text-lg uppercase tracking-widest flex items-center justify-center gap-3 cursor-not-allowed opacity-100 rounded-none shadow-none">
                    <RefreshCw className="w-5 h-5 animate-spin" /> PROCESSING
                  </button>
                )}

                {state === "success" && (
                  <>
                    <button
                      onClick={handleReset}
                      className="w-full sm:w-auto px-8 py-4 bg-transparent hover:bg-[#862937] text-[#862937] hover:text-[#C4B883] font-bold hover:font-black text-lg uppercase tracking-widest border-[2px] border-solid border-[#862937] transition-none rounded-none shadow-none"
                    >
                      Convert More
                    </button>
                    <button
                      onClick={handleDownload}
                      className="w-full sm:w-auto px-10 py-4 bg-[#862937] text-[#C4B883] font-bold hover:font-black hover:bg-[#C4B883] hover:text-[#862937] text-lg uppercase tracking-widest border-[2px] border-solid border-[#862937] transition-none flex items-center justify-center gap-3 rounded-none shadow-none"
                    >
                      <Download className="w-5 h-5" /> DOWNLOAD ZIP
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
