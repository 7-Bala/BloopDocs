"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function HandwrittenTitle() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const penRef = useRef<SVGGElement | null>(null);

  // Hidden path elements for coordinate extraction
  const pathConvertRef = useRef<SVGPathElement | null>(null);
  const pathAnythingRef = useRef<SVGPathElement | null>(null);

  // Mask polygon elements for slanted reveals
  const maskPolyConvertRef = useRef<SVGPolygonElement | null>(null);
  const maskPolyAnythingRef = useRef<SVGPolygonElement | null>(null);

  // Text elements to measure dynamic bounding boxes
  const textConvertRef = useRef<SVGTextElement | null>(null);
  const textAnythingRef = useRef<SVGTextElement | null>(null);

  useEffect(() => {
    const pen = penRef.current;
    const pathConvert = pathConvertRef.current;
    const pathAnything = pathAnythingRef.current;
    const polyConvert = maskPolyConvertRef.current;
    const polyAnything = maskPolyAnythingRef.current;
    const textConvert = textConvertRef.current;
    const textAnything = textAnythingRef.current;

    if (
      !pen ||
      !pathConvert ||
      !pathAnything ||
      !polyConvert ||
      !polyAnything ||
      !textConvert ||
      !textAnything
    ) {
      return;
    }

    let tl: gsap.core.Timeline;
    let active = true;

    // Wait until all fonts are loaded so getBBox() measures final Caveat font size, not fallbacks
    document.fonts.ready.then(() => {
      if (!active) return;
      // 1. Measure the exact SVG bounding boxes of both text elements dynamically
      const convertBBox = textConvert.getBBox();
      const anythingBBox = textAnything.getBBox();

      // 2. Relative peaks and valleys for each character shape to trace cursive handwriting
      const convertPoints = [
        { x: 0.0, y: 140 }, // Start C
        { x: 0.03, y: 120 }, // Top of C
        { x: 0.08, y: 180 }, // Bottom of C
        { x: 0.15, y: 160 }, // Connect C to o
        { x: 0.20, y: 145 }, // Top of o
        { x: 0.25, y: 175 }, // Bottom of o
        { x: 0.28, y: 145 }, // Loop of o
        { x: 0.33, y: 175 }, // Connect to n (bottom)
        { x: 0.38, y: 145 }, // Top of n (first arch)
        { x: 0.42, y: 175 }, // Bottom of n (first arch)
        { x: 0.46, y: 145 }, // Top of n (second arch)
        { x: 0.50, y: 175 }, // Bottom of n
        { x: 0.55, y: 150 }, // Top of v
        { x: 0.60, y: 175 }, // Bottom of v
        { x: 0.64, y: 150 }, // Right side of v
        { x: 0.68, y: 145 }, // Loop of e
        { x: 0.72, y: 175 }, // Bottom of e
        { x: 0.77, y: 145 }, // Top of r
        { x: 0.81, y: 145 }, // Shoulder of r
        { x: 0.85, y: 175 }, // Bottom of r
        { x: 0.90, y: 95 },  // Top of t
        { x: 0.93, y: 175 }, // Bottom of t
        { x: 1.0, y: 160 }   // Finish stroke
      ];

      const anythingPoints = [
        { x: 0.0, y: 285 },  // Start A
        { x: 0.05, y: 220 }, // Top of A
        { x: 0.09, y: 300 }, // Bottom of A (left)
        { x: 0.12, y: 275 }, // Cross of A
        { x: 0.15, y: 300 }, // Connect to n
        { x: 0.20, y: 270 }, // Top of n (first arch)
        { x: 0.24, y: 300 }, // Bottom of n
        { x: 0.28, y: 270 }, // Top of n (second arch)
        { x: 0.32, y: 300 }, // Bottom of n
        { x: 0.36, y: 325 }, // Loop of y (descender)
        { x: 0.40, y: 295 }, // Exit of y
        { x: 0.45, y: 220 }, // Top of t
        { x: 0.48, y: 300 }, // Bottom of t
        { x: 0.52, y: 255 }, // Top of h
        { x: 0.56, y: 300 }, // Bottom of h
        { x: 0.60, y: 270 }, // Top of i
        { x: 0.63, y: 300 }, // Bottom of i
        { x: 0.67, y: 270 }, // Top of n (first arch)
        { x: 0.70, y: 300 }, // Bottom of n
        { x: 0.74, y: 270 }, // Top of n (second arch)
        { x: 0.77, y: 300 }, // Bottom of n
        { x: 0.82, y: 350 }, // Bottom loop of g (descender)
        { x: 0.88, y: 290 }, // Exit of g
        { x: 0.95, y: 300 }, // Dot of .
        { x: 1.0, y: 300 }   // Finish stroke
      ];

      // Add a tiny grace padding (6px) so the pen starts slightly before and ends slightly after the text
      const pad = 6;
      const xStartConv = convertBBox.x - pad;
      const xEndConv = convertBBox.x + convertBBox.width + pad;
      const wConv = xEndConv - xStartConv;
      const dConv = "M " + convertPoints.map(p => `${(xStartConv + p.x * wConv).toFixed(1)} ${p.y}`).join(" L ");

      const xStartAny = anythingBBox.x - pad;
      const xEndAny = anythingBBox.x + anythingBBox.width + pad;
      const wAny = xEndAny - xStartAny;
      const dAny = "M " + anythingPoints.map(p => `${(xStartAny + p.x * wAny).toFixed(1)} ${p.y}`).join(" L ");

      // 3. Update the path attributes dynamically
      pathConvert.setAttribute("d", dConv);
      pathAnything.setAttribute("d", dAny);

      // 4. Measure the paths dynamically after setting them
      const lenConvert = pathConvert.getTotalLength();
      const lenAnything = pathAnything.getTotalLength();

      // 5. Slant angle configuration for perfect cursive alignment
      // 0 degrees slant ensures a clean vertical mask reveal, preventing any early unmasking of upcoming letters.
      const slantAngle = 0;
      const tanSlant = Math.tan((slantAngle * Math.PI) / 180);

      // Helper function to update slanted mask polygon points passing through a given (x, y)
      const updateMaskPolygon = (poly: SVGPolygonElement, x: number, y: number) => {
        // x(y) = x + tan(theta) * (y_target - y)
        const xTop = x - y * tanSlant;
        const xBottom = x + (400 - y) * tanSlant;
        poly.setAttribute("points", `0,0 ${xTop},0 ${xBottom},400 0,400`);
      };

      // Set initial states: mask polygons are empty, pen is hidden
      polyConvert.setAttribute("points", "0,0 0,0 0,400 0,400");
      polyAnything.setAttribute("points", "0,0 0,0 0,400 0,400");
      gsap.set(pen, { display: "none" });

      // Master Calligraphy Timeline
      tl = gsap.timeline({
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

      // 1. Write "Convert" in one smooth, continuous calligraphic sweep
      let prevMaxXConvert = 0;
      const objConvert = { val: 0 };
      tl.to(objConvert, {
        val: lenConvert,
        duration: 2.2,
        ease: "power1.inOut",
        onUpdate: () => {
          const pt = pathConvert.getPointAtLength(objConvert.val);
          gsap.set(pen, { x: pt.x, y: pt.y });
          prevMaxXConvert = Math.max(prevMaxXConvert, pt.x);
          updateMaskPolygon(polyConvert, prevMaxXConvert, pt.y);
        }
      });

      // 2. Lift pen and glide smoothly to the start of "Anything."
      const startAnythingPt = pathAnything.getPointAtLength(0);
      tl.to(pen, {
        x: startAnythingPt.x,
        y: startAnythingPt.y,
        duration: 0.6,
        ease: "power2.inOut",
        onUpdate: () => {
          // Keep the first mask fully open and second mask empty during transit
          updateMaskPolygon(polyConvert, xEndConv, 150);
          polyAnything.setAttribute("points", "0,0 0,0 0,400 0,400");
        }
      });

      // 3. Write "Anything." in one smooth, continuous calligraphic sweep
      let prevMaxXAnything = 0;
      const objAnything = { val: 0 };
      tl.to(objAnything, {
        val: lenAnything,
        duration: 2.8,
        ease: "power1.inOut",
        onUpdate: () => {
          const pt = pathAnything.getPointAtLength(objAnything.val);
          gsap.set(pen, { x: pt.x, y: pt.y });
          prevMaxXAnything = Math.max(prevMaxXAnything, pt.x);
          updateMaskPolygon(polyAnything, prevMaxXAnything, pt.y);
        }
      });
    });

    return () => {
      active = false;
      if (tl) tl.kill();
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
          {/* Hidden reference paths used purely for mathematical stroke coordinate calculations */}
          <path ref={pathConvertRef} fill="none" />
          <path ref={pathAnythingRef} fill="none" />

          {/* Mask 1 — Convert sliding window reveal */}
          <mask id="mask-convert" maskUnits="userSpaceOnUse">
            <rect x="0" y="0" width="1000" height="400" fill="black" />
            <polygon
              ref={maskPolyConvertRef}
              points="0,0 0,0 0,400 0,400"
              fill="white"
            />
          </mask>

          {/* Mask 2 — Anything. sliding window reveal */}
          <mask id="mask-anything" maskUnits="userSpaceOnUse">
            <rect x="0" y="0" width="1000" height="400" fill="black" />
            <polygon
              ref={maskPolyAnythingRef}
              points="0,0 0,0 0,400 0,400"
              fill="white"
            />
          </mask>
        </defs>

        {/* Cursive text layers using Caveat from Google Fonts */}
        <text
          ref={textConvertRef}
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
          ref={textAnythingRef}
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

        {/* Slanted Golden & Crimson Calligraphic Fountain Pen (Pen Only) */}
        <g
          ref={penRef}
          style={{ display: "none", transformOrigin: "0px 0px" }}
        >
          {/* Slanted pen group rotated at 130 degrees to lean down-right (held from below) for realistic right-handed posture */}
          <g transform="rotate(130)">
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

            {/* Golden Cap Clip */}
            <path
              d="M 0 -138 L 4 -138 L 5 -96 L 2 -92 L 0 -96 Z"
              fill="#B9A071"
              stroke="#862937"
              strokeWidth="1.2"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}
