"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

// Centerline paths that trace the text boundaries for the masking reveal
const CONVERT_PATH = "M 320 110 C 270 90, 280 190, 320 180 C 350 140, 370 180, 390 170 C 410 150, 430 180, 440 180 C 460 150, 480 180, 490 180 C 510 150, 530 180, 540 180 C 560 150, 580 180, 590 180 C 610 140, 630 110, 640 110 C 640 130, 640 180, 660 180";
const CONVERT_CROSSBAR = "M 610 135 L 670 135";

const ANYTHING_PATH = "M 230 290 C 230 260, 255 210, 255 210 C 255 210, 280 260, 280 270 C 280 250, 260 240, 260 240 C 260 240, 280 245, 295 250 C 310 250, 320 290, 330 290 C 350 250, 370 290, 380 290 C 380 290, 370 340, 360 340 C 350 340, 370 300, 390 280 C 410 250, 410 220, 410 220 C 410 240, 410 290, 430 290 C 440 260, 450 220, 450 220 C 450 240, 450 290, 470 290 C 485 260, 495 290, 500 290 C 520 260, 530 290, 540 290 C 560 260, 580 290, 590 290 C 590 290, 580 340, 570 340 C 560 340, 580 300, 600 295 C 620 290, 630 295, 640 295";
const ANYTHING_CROSSBAR = "M 400 235 L 430 235";

// Hotspot coordinates for dots & quick marks
const DOT_COORDS = { x: 485, y: 230 };
const PERIOD_COORDS = { x: 640, y: 295 };

export default function HandwrittenTitle() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const penRef = useRef<SVGGElement | null>(null);

  // Mask paths
  const maskPathConvertRef = useRef<SVGPathElement | null>(null);
  const maskPathConvertCrossRef = useRef<SVGPathElement | null>(null);
  const maskPathAnythingRef = useRef<SVGPathElement | null>(null);
  const maskPathAnythingCrossRef = useRef<SVGPathElement | null>(null);

  // Mask static dots
  const maskDotRef = useRef<SVGCircleElement | null>(null);
  const maskPeriodRef = useRef<SVGCircleElement | null>(null);

  useEffect(() => {
    const pen = penRef.current;
    
    // Get all path elements
    const pathConvert = maskPathConvertRef.current;
    const pathConvertCross = maskPathConvertCrossRef.current;
    const pathAnything = maskPathAnythingRef.current;
    const pathAnythingCross = maskPathAnythingCrossRef.current;
    const circleDot = maskDotRef.current;
    const circlePeriod = maskPeriodRef.current;

    if (!pen || !pathConvert || !pathConvertCross || !pathAnything || !pathAnythingCross || !circleDot || !circlePeriod) {
      return;
    }

    // Measure total path lengths dynamically
    const lenConvert = pathConvert.getTotalLength();
    const lenConvertCross = pathConvertCross.getTotalLength();
    const lenAnything = pathAnything.getTotalLength();
    const lenAnythingCross = pathAnythingCross.getTotalLength();

    // Initialize all mask paths as hidden (strokeDashoffset = length)
    gsap.set(pathConvert, { strokeDasharray: lenConvert, strokeDashoffset: lenConvert });
    gsap.set(pathConvertCross, { strokeDasharray: lenConvertCross, strokeDashoffset: lenConvertCross });
    gsap.set(pathAnything, { strokeDasharray: lenAnything, strokeDashoffset: lenAnything });
    gsap.set(pathAnythingCross, { strokeDasharray: lenAnythingCross, strokeDashoffset: lenAnythingCross });
    gsap.set([circleDot, circlePeriod], { opacity: 0 });
    gsap.set(pen, { display: "none" });

    // Build the master handwriting timeline
    const tl = gsap.timeline({
      delay: 0.6,
      onStart: () => {
        gsap.set(pen, { display: "block" });
      },
      onComplete: () => {
        // Fade the pen away elegantly once writing is finished
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

    // Helper to animate a path and sync the pen tip position to it
    const animateStroke = (
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

    // 1. Write the main "Convert" cursive body
    tl.to(pathConvert, animateStroke(pathConvert, lenConvert, 1.8, "power1.inOut"));

    // 2. Lift pen, move to crossbar, and draw "Convert" 't' crossbar
    tl.to(pen, {
      x: 610,
      y: 135,
      duration: 0.25,
      ease: "power2.inOut",
    });
    tl.to(pathConvertCross, animateStroke(pathConvertCross, lenConvertCross, 0.35, "sine.inOut"));

    // 3. Lift pen, move to start of "Anything" cursive body
    tl.to(pen, {
      x: 230,
      y: 290,
      duration: 0.35,
      ease: "power2.inOut",
    });
    
    // 4. Write "Anything" cursive body
    tl.to(pathAnything, animateStroke(pathAnything, lenAnything, 2.4, "power1.inOut"));

    // 5. Lift pen, move to second 't' crossbar, and draw it
    tl.to(pen, {
      x: 400,
      y: 235,
      duration: 0.25,
      ease: "power2.inOut",
    });
    tl.to(pathAnythingCross, animateStroke(pathAnythingCross, lenAnythingCross, 0.35, "sine.inOut"));

    // 6. Lift pen, move to dot the 'i'
    tl.to(pen, {
      x: DOT_COORDS.x,
      y: DOT_COORDS.y,
      duration: 0.2,
      ease: "power2.inOut",
    });
    tl.to(circleDot, {
      opacity: 1,
      duration: 0.1,
      onStart: () => {
        // Quick visual tap/press down
        gsap.fromTo(pen, { scale: 1 }, { scale: 0.85, duration: 0.05, yoyo: true, repeat: 1 });
      }
    });

    // 7. Lift pen, move to dot the period '.'
    tl.to(pen, {
      x: PERIOD_COORDS.x,
      y: PERIOD_COORDS.y,
      duration: 0.25,
      ease: "power2.inOut",
    });
    tl.to(circlePeriod, {
      opacity: 1,
      duration: 0.1,
      onStart: () => {
        // Quick visual tap/press down
        gsap.fromTo(pen, { scale: 1 }, { scale: 0.85, duration: 0.05, yoyo: true, repeat: 1 });
      }
    });

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
              strokeWidth="180"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              ref={maskPathConvertCrossRef}
              d={CONVERT_CROSSBAR}
              fill="none"
              stroke="white"
              strokeWidth="180"
              strokeLinecap="round"
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
              strokeWidth="180"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              ref={maskPathAnythingCrossRef}
              d={ANYTHING_CROSSBAR}
              fill="none"
              stroke="white"
              strokeWidth="180"
              strokeLinecap="round"
            />
            <circle
              ref={maskDotRef}
              cx={DOT_COORDS.x}
              cy={DOT_COORDS.y}
              r="90"
              fill="white"
            />
            <circle
              ref={maskPeriodRef}
              cx={PERIOD_COORDS.x}
              cy={PERIOD_COORDS.y}
              r="90"
              fill="white"
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

        {/* Elegant fountain pen slanted at 45 degrees */}
        <g
          ref={penRef}
          style={{ display: "none", transformOrigin: "0px 0px" }}
        >
          {/* Slanted fountain pen tip aligning precisely at the (0,0) hot-spot */}
          <path
            d="M 0 0 L 8 -8 L 14 -4 Z"
            fill="#862937"
          />
          <path
            d="M 8 -8 L 56 -56 L 68 -44 L 20 4 Z"
            fill="#903635"
            stroke="#862937"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M 50 -50 L 62 -62 L 68 -56 L 56 -44 Z"
            fill="#C4B883"
            stroke="#862937"
            strokeWidth="1.5"
          />
          <circle cx="14" cy="-10" r="2.5" fill="#C4B883" />
        </g>
      </svg>
    </div>
  );
}
