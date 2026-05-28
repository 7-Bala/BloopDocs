"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

// Elegant centerline sweep paths that perfectly span the text layout boundaries
const CONVERT_PATH = "M 260 150 Q 380 115, 500 150 T 740 150";
const ANYTHING_PATH = "M 180 280 Q 340 240, 500 280 T 820 280";

export default function HandwrittenTitle() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const penRef = useRef<SVGGElement | null>(null);

  // Mask path elements
  const maskPathConvertRef = useRef<SVGPathElement | null>(null);
  const maskPathAnythingRef = useRef<SVGPathElement | null>(null);

  useEffect(() => {
    const pen = penRef.current;
    const pathConvert = maskPathConvertRef.current;
    const pathAnything = maskPathAnythingRef.current;

    if (!pen || !pathConvert || !pathAnything) {
      return;
    }

    // Measure path lengths dynamically
    const lenConvert = pathConvert.getTotalLength();
    const lenAnything = pathAnything.getTotalLength();

    // Initialize stroke states (fully hidden)
    gsap.set(pathConvert, { strokeDasharray: lenConvert, strokeDashoffset: lenConvert });
    gsap.set(pathAnything, { strokeDasharray: lenAnything, strokeDashoffset: lenAnything });
    gsap.set(pen, { display: "none" });

    // Master Calligraphy Timeline
    const tl = gsap.timeline({
      delay: 0.6,
      onStart: () => {
        // Position pen at the very start of Convert and show it
        const startPt = pathConvert.getPointAtLength(0);
        gsap.set(pen, { x: startPt.x, y: startPt.y, display: "block", opacity: 1 });
      },
      onComplete: () => {
        // Fade the pen away elegantly once writing finishes
        gsap.to(pen, {
          opacity: 0,
          duration: 0.4,
          ease: "power2.out",
          onComplete: () => {
            gsap.set(pen, { display: "none" });
          }
        });
      }
    });

    // Helper to animate mask path reveal & keep the pen tip in pixel-perfect sync
    const animateSweep = (
      path: SVGPathElement,
      length: number,
      duration: number,
      ease: string = "power1.inOut"
    ) => {
      return {
        strokeDashoffset: 0,
        duration: duration,
        ease: ease,
        onUpdate: function (this: any) {
          const progress = this.progress();
          const currentLength = progress * length;
          const pt = path.getPointAtLength(currentLength);
          gsap.set(pen, { x: pt.x, y: pt.y });
        }
      };
    };

    // 1. Write "Convert" in one smooth, continuous calligraphic sweep
    tl.to(pathConvert, animateSweep(pathConvert, lenConvert, 2.2, "power1.inOut"));

    // 2. Lift pen and glide smoothly to the start of "Anything."
    const startAnythingPt = pathAnything.getPointAtLength(0);
    tl.to(pen, {
      x: startAnythingPt.x,
      y: startAnythingPt.y,
      duration: 0.6,
      ease: "power2.inOut",
    });

    // 3. Write "Anything." in one smooth, continuous calligraphic sweep
    tl.to(pathAnything, animateSweep(pathAnything, lenAnything, 2.8, "power1.inOut"));

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className="relative w-full aspect-[1000/400] max-w-4xl mx-auto select-none pointer-events-none">
      <svg
        ref={svgRef}
        viewBox="0 0 1000 400"
        className="w-full h-full"
        style={{ overflow: "visible" }}
      >
        <defs>
          {/* Mask 1 — Convert reveal */}
          <mask id="mask-convert" maskUnits="userSpaceOnUse">
            <rect x="0" y="0" width="1000" height="400" fill="black" />
            <path
              ref={maskPathConvertRef}
              d={CONVERT_PATH}
              fill="none"
              stroke="white"
              strokeWidth="200"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </mask>

          {/* Mask 2 — Anything. reveal */}
          <mask id="mask-anything" maskUnits="userSpaceOnUse">
            <rect x="0" y="0" width="1000" height="400" fill="black" />
            <path
              ref={maskPathAnythingRef}
              d={ANYTHING_PATH}
              fill="none"
              stroke="white"
              strokeWidth="200"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </mask>
        </defs>

        {/* Cursive text layers using Caveat from Google Fonts */}
        <text
          x="500"
          y="180"
          textAnchor="middle"
          fontFamily="var(--font-caveat), Caveat, cursive"
          fontSize="180"
          fontWeight="700"
          fill="#862937"
          mask="url(#mask-convert)"
          style={{ letterSpacing: "2px" }}
        >
          Convert
        </text>

        <text
          x="500"
          y="310"
          textAnchor="middle"
          fontFamily="var(--font-caveat), Caveat, cursive"
          fontSize="180"
          fontWeight="700"
          fill="#862937"
          mask="url(#mask-anything)"
          style={{ letterSpacing: "2px" }}
        >
          Anything.
        </text>

        {/* Slanted Golden & Crimson Calligraphic Fountain Pen + Luxurious Right Hand */}
        <g
          ref={penRef}
          style={{ display: "none", transformOrigin: "0px 0px" }}
        >
          {/* Tilted pen group slanted at a natural writing angle (-35 degrees) */}
          <g transform="rotate(-35)">
            {/* 1. Golden Nib (Highly detailed two-tone gold) */}
            <path
              d="M 0 0 L -4 -10 L -8 -25 L 8 -25 L 4 -10 Z"
              fill="#C4B883"
              stroke="#862937"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Gold nib center inlay */}
            <path
              d="M 0 -2 C -2 -6, -4 -12, -4 -18 L 4 -18 C 4 -12, 2 -6, 0 -2 Z"
              fill="#B9A071"
              stroke="#862937"
              strokeWidth="1"
            />
            {/* Nib slit and breather hole */}
            <line x1="0" y1="0" x2="0" y2="-15" stroke="#862937" strokeWidth="1" />
            <circle cx="0" cy="-15" r="1.2" fill="#862937" />

            {/* 2. Grip Section (sleek black with gold cap threads) */}
            <path
              d="M -8 -25 L -7 -45 L 7 -45 L 8 -25 Z"
              fill="#222"
              stroke="#862937"
              strokeWidth="1.5"
            />
            <rect x="-8.5" y="-27" width="17" height="2" fill="#B9A071" />
            <rect x="-7.5" y="-45" width="15" height="3" fill="#B9A071" />

            {/* 3. Pen Barrel (Luxurious deep black and gold) */}
            <path
              d="M -7 -45 L -5 -150 L 5 -150 L 7 -45 Z"
              fill="#111"
              stroke="#862937"
              strokeWidth="2"
            />
            
            {/* Gold Barrel Rings & Luxury Details */}
            <rect x="-6.5" y="-55" width="13" height="4" fill="#B9A071" />
            <rect x="-5.5" y="-142" width="11" height="6" fill="#B9A071" />
            <path d="M 0 -55 L 0 -135" stroke="#B9A071" strokeWidth="0.8" strokeDasharray="3,3" />

            {/* 4. Elegant Right Hand holding the pen (perfectly color-themed beige/red) */}
            <g>
              {/* Middle Finger (curves under the pen barrel) */}
              <path
                d="M -7 -40 C -15 -42, -22 -35, -22 -25 C -22 -15, -12 -12, -4 -20"
                fill="#C4B883"
                stroke="#862937"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              
              {/* Thumb (grips the left side of the grip section) */}
              <path
                d="M -6 -28 C -18 -26, -26 -16, -24 -6 C -22 4, -10 6, -2 -14"
                fill="#B9A071"
                stroke="#862937"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              
              {/* Index Finger (grips the right/top side of the grip section) */}
              <path
                d="M 6 -32 C 16 -34, 30 -28, 32 -14 C 34 0, 24 6, 12 -18"
                fill="#B9A071"
                stroke="#862937"
                strokeWidth="2"
                strokeLinejoin="round"
              />

              {/* Back of the Hand & Palm (extends down-right) */}
              <path
                d="M 32 -14 C 44 -12, 54 4, 48 24 C 42 44, 18 44, 8 24 C 2 12, 8 2, 12 -18"
                fill="#C4B883"
                stroke="#862937"
                strokeWidth="2"
                strokeLinejoin="round"
              />

              {/* Sleeve / Cuff (luxury crimson jacket sleeve with gold cufflink) */}
              <path
                d="M 48 24 C 54 26, 78 50, 78 50 L 58 70 C 58 70, 38 44, 42 44 Z"
                fill="#862937"
                stroke="#862937"
                strokeWidth="2"
              />
              {/* Golden Cufflink */}
              <circle cx="56" cy="46" r="3" fill="#B9A071" stroke="#862937" strokeWidth="1" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
