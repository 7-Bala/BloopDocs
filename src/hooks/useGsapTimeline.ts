"use client";

import { useEffect, RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ═══════════════════════════════════════════════════════════════════════════
   TYPEWRITER — deterministic per-char reveal, no randomness
   ═══════════════════════════════════════════════════════════════════════════ */
function getWritingDuration(char: string): number {
  const c = char.toUpperCase();
  if (c === "." || c === "," || c === "!" || c === "?") return 0.18;
  if (c === "I" || c === "T" || c === "L" || c === "F" || c === "J" || c === " ") return 0.28;
  if (c === "C" || c === "E" || c === "H" || c === "K" || c === "P" || c === "U" || c === "V" || c === "Z") return 0.38;
  // Complex letters with curves or many strokes
  return 0.48; 
}

export function useTypewriter(
  containerRef: RefObject<HTMLHeadingElement | null>,
  cursorRef: RefObject<HTMLSpanElement | null>
) {
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const letters = el.querySelectorAll(".tw-char");
    if (letters.length === 0) return;

    // Set initial state for organic "writing on hand" slide-up and slant effect
    // We hide from right to left using clipPath: inset(0% 100% 0% 0%)
    gsap.set(letters, {
      opacity: 0,
      y: 8,
      rotation: -3,
      clipPath: "inset(0% 100% 0% 0%)",
      visibility: "visible"
    });

    const tl = gsap.timeline({ delay: 0.5 });
    let currentTime = 0;

    letters.forEach((letter, i) => {
      const char = letter.textContent || "";
      const isSpace = char === " " || char === "\xa0";
      
      // Calculate custom delay for human-like typing cadence (writing by hand)
      let delay = 0.05 + Math.random() * 0.06; // base cadence: 50ms - 110ms
      
      const prevLetter = letters[i - 1];
      const prevChar = prevLetter ? prevLetter.textContent || "" : "";
      
      // Pause at the line break boundary between CONVERT (length 7) and ANYTHING. (index 7 onwards)
      if (i === 7) {
        delay += 0.7 + Math.random() * 0.3; // 700ms - 1000ms pause for the line break
      } else if (char === "." || char === "," || char === "!" || char === "?") {
        delay += 0.3 + Math.random() * 0.2; // pause before punctuation
      } else if (prevChar === " " || prevChar === "\xa0") {
        delay += 0.1 + Math.random() * 0.1; // pause between words
      } else {
        // Occasional natural pause/hesitation (e.g. 5% chance of a 100-250ms pause)
        if (Math.random() < 0.05 && i > 0) {
          delay += 0.1 + Math.random() * 0.15;
        }
      }

      currentTime += delay;

      if (isSpace) {
        return; // spaces don't need drawing animation
      }

      const duration = getWritingDuration(char);

      // Organic, smooth hand-written sketch effect: reveals left-to-right using clipPath
      tl.to(letter, {
        opacity: 1,
        y: 0,
        rotation: 0,
        clipPath: "inset(0% 0% 0% 0%)",
        duration: duration,
        ease: "power1.inOut", // smooth organic hand writing ease
        force3D: true,
      }, currentTime);
    });

    // Fade out cursor after typing finishes
    if (cursorRef.current) {
      tl.to(cursorRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: "power1.inOut",
      }, currentTime + 1.2);
    }

    return () => { tl.kill(); };
  }, [containerRef, cursorRef]);
}

/* ═══════════════════════════════════════════════════════════════════════════
   DOCUMENT DROP — trigger-once, real-time playback
   
   Plays at normal GSAP speed when the section enters the viewport.
   No scrub, no pin, no sticky — scrolling feels completely natural.
   Does NOT reverse when scrolling back up.
   ═══════════════════════════════════════════════════════════════════════════ */
export function useDocumentDrop(
  sectionRef: RefObject<HTMLDivElement | null>,
  docRefs: RefObject<(HTMLDivElement | null)[]>,
  dustRef: RefObject<HTMLDivElement | null>
) {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const docs = (docRefs.current || []).filter(Boolean) as HTMLDivElement[];
    if (docs.length === 0) return;

    // Start hidden above the section (clipped by overflow:hidden)
    gsap.set(docs, { y: -400, opacity: 1, rotation: 0, x: 0, force3D: true });

    // Build the animation timeline (paused — ScrollTrigger will play it)
    const tl = gsap.timeline({
      paused: true,
      onComplete: () => {
        // Clean up will-change after animation is done
        docs.forEach(d => { d.style.willChange = "auto"; });
      },
    });

    // Phase 1 — All cards fall quickly with tight stagger (0.08s between each)
    docs.forEach((doc, i) => {
      tl.to(doc, {
        y: 0,
        rotation: (i % 2 === 0 ? 1 : -1) * (2 + i * 1.5),
        duration: 0.7,
        ease: "power3.out",
        force3D: true,
      }, i * 0.08);
    });

    // Phase 2 — Brief hover/float
    const hoverStart = docs.length * 0.08 + 0.7;
    tl.to(docs, {
      y: -12,
      duration: 0.6,
      ease: "sine.inOut",
      force3D: true,
    }, hoverStart);

    // Phase 3 — Scatter away
    const scatterStart = hoverStart + 0.7;
    docs.forEach((doc, i) => {
      tl.to(doc, {
        y: -500,
        x: (i % 2 === 0 ? -1 : 1) * (50 + i * 25),
        rotation: (i % 2 === 0 ? -1 : 1) * (20 + i * 8),
        opacity: 0,
        duration: 0.6,
        ease: "power2.in",
        force3D: true,
      }, scatterStart + i * 0.04);
    });

    // Trigger: play once when section enters viewport, never reverse
    const st = ScrollTrigger.create({
      trigger: section,
      start: "top 80%",
      once: true,
      onEnter: () => {
        tl.play();

        // Dust burst after cards have mostly landed (~0.5s in)
        setTimeout(() => {
          const container = dustRef.current;
          if (!container) return;
          docs.forEach((doc) => {
            const r = doc.getBoundingClientRect();
            const cr = container.getBoundingClientRect();
            burstDust(container, r.left - cr.left + r.width / 2, r.bottom - cr.top);
          });
        }, 500);
      },
    });

    // ScrollTrigger to instantly remove the empty section when it is fully scrolled past (above viewport)
    // This completely eliminates visual scrolling glitches or jumping while height collapsing.
    const removeTrigger = ScrollTrigger.create({
      trigger: section,
      start: "bottom top", // when bottom of the section leaves top of the viewport
      onLeave: () => {
        const height = section.offsetHeight;
        if (height > 0) {
          removeTrigger.disable();
          section.style.display = "none";
          section.style.height = "0px";
          window.scrollTo(0, window.scrollY - height);
          ScrollTrigger.refresh();
        }
      }
    });

    return () => {
      st.kill();
      removeTrigger.kill();
      tl.kill();
    };
  }, [sectionRef, docRefs, dustRef]);
}


function burstDust(container: HTMLDivElement, cx: number, cy: number) {
  // 6 particles per card (not 12) — keeps total under 40 concurrent tweens
  for (let i = 0; i < 6; i++) {
    const el = document.createElement("div");
    const sz = 3 + Math.random() * 4;
    el.style.cssText = `position:absolute;left:${cx}px;top:${cy}px;width:${sz}px;height:${sz}px;background:rgba(134,41,55,${0.35 + Math.random() * 0.35});pointer-events:none;z-index:60;will-change:transform,opacity;`;
    container.appendChild(el);
    const a = (Math.PI * 2 * i) / 6 + (Math.random() - 0.5);
    const d = 35 + Math.random() * 60;
    gsap.to(el, {
      x: Math.cos(a) * d,
      y: Math.sin(a) * d - 20,
      opacity: 0,
      scale: 0.1,
      duration: 0.4 + Math.random() * 0.3,
      ease: "power2.out",
      force3D: true,
      onComplete: () => el.remove(),
    });
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   CONVERTER REVEAL
   
   BUG FIX: Previous version killed ALL ScrollTriggers on cleanup,
   which nuked the doc-drop triggers. Now only kills its own.
   ═══════════════════════════════════════════════════════════════════════════ */
export function useConverterReveal(ref: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const anim = gsap.fromTo(el,
      { opacity: 0, y: 80, force3D: true },
      {
        opacity: 1, y: 0,
        ease: "power3.out",
        force3D: true,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          end: "top 50%",
          scrub: 0.3,          // tight tracking
        },
      }
    );

    return () => {
      // Only kill THIS animation's ScrollTrigger, not all of them
      anim.scrollTrigger?.kill();
      anim.kill();
    };
  }, [ref]);
}

/* ═══════════════════════════════════════════════════════════════════════════
   LEGACY STUBS
   ═══════════════════════════════════════════════════════════════════════════ */
export function useHeroAnimation(..._args: unknown[]) { /* no-op */ }
export function useConverterParachute(..._args: unknown[]) { /* no-op */ }
export function useHeroParallax(..._args: unknown[]) { /* no-op */ }

export function useBloopMorph(
  svgPathRef: RefObject<SVGPathElement | null>,
  filterRef: RefObject<SVGFETurbulenceElement | null>,
  isActive: boolean
) {
  useEffect(() => {
    if (!svgPathRef.current || !isActive) return;
    const shapes = [
      "M25,50 C25,25 50,25 50,25 C50,25 75,25 75,50 C75,75 75,75 50,75 C25,75 25,75 25,50 Z",
      "M30,50 C25,20 60,30 55,20 C50,10 80,30 70,50 C60,70 80,80 50,80 C20,80 35,80 30,50 Z",
      "M20,45 C20,30 40,15 50,25 C60,35 85,25 80,45 C75,65 70,85 52,75 C34,65 20,60 20,45 Z",
      "M25,50 C25,25 50,25 50,25 C50,25 75,25 75,50 C75,75 75,75 50,75 C25,75 25,75 25,50 Z",
    ];
    const tl = gsap.timeline({ repeat: -1 });
    tl.to(svgPathRef.current, { attr: { d: shapes[1] }, duration: 1.5, ease: "sine.inOut" })
      .to(svgPathRef.current, { attr: { d: shapes[2] }, duration: 1.5, ease: "sine.inOut" })
      .to(svgPathRef.current, { attr: { d: shapes[3] }, duration: 1.5, ease: "sine.inOut" });
    gsap.to(svgPathRef.current, { rotate: 360, transformOrigin: "center center", duration: 10, repeat: -1, ease: "none" });
    if (filterRef.current) {
      gsap.to(filterRef.current, { attr: { baseFrequency: "0.015 0.08" }, duration: 1.8, repeat: -1, yoyo: true, ease: "sine.inOut" });
    }
    return () => { tl.kill(); };
  }, [svgPathRef, filterRef, isActive]);
}

export function useOrbitSync(
  containerRef: RefObject<HTMLDivElement | null>,
  orbitRef: RefObject<HTMLDivElement | null>,
  nodesRef: RefObject<(HTMLDivElement | null)[]>
) {
  useEffect(() => {
    const area = containerRef.current;
    if (!area || !orbitRef.current || !nodesRef.current) return;
    const tlO = gsap.to(orbitRef.current, { rotation: 360, duration: 40, repeat: -1, ease: "none" });
    const nodes = nodesRef.current.filter(Boolean) as HTMLDivElement[];
    const tlI = gsap.to(nodes, { rotation: -360, duration: 40, repeat: -1, ease: "none" });
    const pause = () => { tlO.pause(); tlI.pause(); };
    const play = () => { tlO.play(); tlI.play(); };
    area.addEventListener("mouseenter", pause);
    area.addEventListener("mouseleave", play);
    return () => { area.removeEventListener("mouseenter", pause); area.removeEventListener("mouseleave", play); tlO.kill(); tlI.kill(); };
  }, [containerRef, orbitRef, nodesRef]);
}

export function useDashboardStagger(
  containerRef: RefObject<HTMLDivElement | null>,
  cardsRef: RefObject<(HTMLDivElement | null)[]>
) {
  useEffect(() => {
    if (!containerRef.current || !cardsRef.current) return;
    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
    if (cards.length === 0) return;
    gsap.fromTo(cards, { opacity: 0, y: 40, scale: 0.97 }, {
      opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.12, ease: "power2.out",
      scrollTrigger: { trigger: containerRef.current, start: "top 85%", toggleActions: "play none none none" },
    });
  }, [containerRef, cardsRef]);
}
