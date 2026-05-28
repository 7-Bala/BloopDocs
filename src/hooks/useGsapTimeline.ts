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
export function useTypewriter(
  containerRef: RefObject<HTMLHeadingElement | null>,
  cursorRef: RefObject<HTMLSpanElement | null>
) {
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const letters = el.querySelectorAll(".tw-char");
    if (letters.length === 0) return;

    const tl = gsap.timeline({ delay: 0.5 });

    // Reveal each letter at 0.12s intervals
    letters.forEach((letter, i) => {
      tl.set(letter, { visibility: "visible" }, i * 0.12);
    });

    // Fade out cursor after typing finishes
    if (cursorRef.current) {
      tl.to(cursorRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: "power1.inOut",
      }, letters.length * 0.12 + 1.0);
    }

    return () => { tl.kill(); };
  }, [containerRef, cursorRef]);
}

/* ═══════════════════════════════════════════════════════════════════════════
   DOCUMENT DROP — scroll-scrubbed, CSS sticky does the viewport lock
   
   Layout:
     outerRef = div height:300vh (scroll runway for the trigger)
     Inside:  div.sticky.top-0.h-screen.overflow-hidden (viewport-locked panel)
     docRefs  = absolute cards inside the sticky panel
   
   GSAP drives yPercent from -500 → 0 → -600 as user scrolls the 300vh.
   ═══════════════════════════════════════════════════════════════════════════ */
export function useDocumentDrop(
  outerRef: RefObject<HTMLDivElement | null>,
  docRefs: RefObject<(HTMLDivElement | null)[]>,
  dustRef: RefObject<HTMLDivElement | null>
) {
  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;

    const docs = (docRefs.current || []).filter(Boolean) as HTMLDivElement[];
    if (docs.length === 0) return;

    // Initial state: hide above the clip boundary
    gsap.set(docs, { yPercent: -500, opacity: 1, rotation: 0, x: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: outer,
        start: "top top",
        end: "bottom bottom",
        scrub: 2,
        invalidateOnRefresh: true,
      },
    });

    // Phase 1 — Fall with bounce
    docs.forEach((doc, i) => {
      tl.to(doc, {
        yPercent: 0,
        rotation: (i % 2 === 0 ? 1 : -1) * (2 + i * 1.5),
        duration: 1,
        ease: "bounce.out",
      }, i * 0.2);
    });

    // Phase 2 — Float
    const floatTime = docs.length * 0.2 + 1;
    tl.to(docs, {
      yPercent: -8,
      duration: 0.5,
      ease: "sine.inOut",
    }, floatTime);

    // Phase 3 — Scatter upward
    const scatterTime = floatTime + 0.6;
    docs.forEach((doc, i) => {
      tl.to(doc, {
        yPercent: -600,
        x: (i % 2 === 0 ? -1 : 1) * (50 + i * 30),
        rotation: (i % 2 === 0 ? -1 : 1) * (20 + i * 10),
        opacity: 0,
        duration: 0.8,
        ease: "power2.in",
      }, scatterTime + i * 0.05);
    });

    // Dust burst — fires once
    let dustTrigger: ScrollTrigger | null = null;
    dustTrigger = ScrollTrigger.create({
      trigger: outer,
      start: "30% top",
      once: true,
      onEnter: () => {
        const container = dustRef.current;
        if (!container) return;
        docs.forEach((doc) => {
          const r = doc.getBoundingClientRect();
          const cr = container.getBoundingClientRect();
          burstDust(container, r.left - cr.left + r.width / 2, r.bottom - cr.top);
        });
      },
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      dustTrigger?.kill();
    };
  }, [outerRef, docRefs, dustRef]);
}

function burstDust(container: HTMLDivElement, cx: number, cy: number) {
  for (let i = 0; i < 12; i++) {
    const el = document.createElement("div");
    const sz = 2 + Math.random() * 5;
    el.style.cssText = `position:absolute;left:${cx}px;top:${cy}px;width:${sz}px;height:${sz}px;background:rgba(134,41,55,${0.3 + Math.random() * 0.4});pointer-events:none;z-index:60;`;
    container.appendChild(el);
    const a = (Math.PI * 2 * i) / 12 + (Math.random() - 0.5);
    const d = 30 + Math.random() * 70;
    gsap.to(el, {
      x: Math.cos(a) * d,
      y: Math.sin(a) * d - 20,
      opacity: 0,
      scale: 0.1,
      duration: 0.5 + Math.random() * 0.4,
      ease: "power2.out",
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
      { opacity: 0, y: 100 },
      {
        opacity: 1, y: 0,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          end: "top 45%",
          scrub: 1,
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
