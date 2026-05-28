"use client";

import { useEffect, RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Safely register ScrollTrigger on client-side
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ─────────────────────────────────────────────────────────────────────────────
// TYPEWRITER HOOK – Real typewriter feel: slow, variable cadence, blink cursor
// ─────────────────────────────────────────────────────────────────────────────
export function useTypewriter(
  containerRef: RefObject<HTMLHeadingElement | null>,
  cursorRef: RefObject<HTMLSpanElement | null>
) {
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const letters = Array.from(
        containerRef.current!.querySelectorAll(".typewriter-letter")
      ) as HTMLElement[];
      if (letters.length === 0) return;

      // Start: all letters hidden, cursor visible & blinking
      gsap.set(letters, { display: "none" });
      if (cursorRef.current) {
        gsap.set(cursorRef.current, { opacity: 1, display: "inline-block" });
      }

      // Build a timeline that reveals each letter with natural human variance
      const tl = gsap.timeline({ delay: 0.6 });

      let elapsed = 0;
      letters.forEach((letter, i) => {
        // Real typewriter cadence: 80–180ms per character,
        // longer pauses at word boundaries (space or br), occasional "hesitation"
        const char = letter.textContent || "";
        const isSpace = char === " ";

        // Variable delay: normal chars 0.09–0.18s, space 0.25s (word pause)
        const baseDelay = isSpace ? 0.28 : 0.09 + Math.random() * 0.09;

        // Occasional longer "thinking" pause every ~5–8 chars
        const hesitate = i > 0 && i % (5 + Math.floor(Math.random() * 4)) === 0
          ? 0.18 + Math.random() * 0.2
          : 0;

        const delay = elapsed + baseDelay + hesitate;
        elapsed = delay;

        tl.set(letter, { display: "inline" }, delay);
      });

      // After typing completes: keep cursor blinking for 1.2s, then fade it
      const totalDuration = elapsed + 1.2;
      if (cursorRef.current) {
        tl.to(
          cursorRef.current,
          { opacity: 0, duration: 0.4, ease: "power1.inOut" },
          totalDuration
        ).set(cursorRef.current, { display: "none" }, totalDuration + 0.5);
      }
    }, containerRef);

    return () => ctx.revert();
  }, [containerRef, cursorRef]);
}

// ─────────────────────────────────────────────────────────────────────────────
// DOCUMENT DROP + DUST HOOK
// Triggered by scroll. Documents fall from above, bounce, then scatter away.
// ─────────────────────────────────────────────────────────────────────────────
export function useDocumentDrop(
  sectionRef: RefObject<HTMLDivElement | null>,
  docRefs: RefObject<(HTMLDivElement | null)[]>,
  dustContainerRef: RefObject<HTMLDivElement | null>
) {
  useEffect(() => {
    if (!sectionRef.current || !docRefs.current) return;

    const ctx = gsap.context(() => {
      const docs = docRefs.current.filter(Boolean) as HTMLDivElement[];
      if (docs.length === 0) return;

      // ── Initial state: all docs start ABOVE the section (invisible via overflow:hidden on parent) ──
      gsap.set(docs, { y: -400, opacity: 1, rotation: 0, x: 0 });

      // ── PHASE 1+2+3 scrubbed timeline (pin the section) ──
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=220%",    // amount of scroll to consume while pinned
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
        },
      });

      // Phase 1 — Fall in one-by-one with a satisfying bounce
      docs.forEach((doc, i) => {
        tl.to(
          doc,
          {
            y: 0,
            ease: "bounce.out",    // built-in GSAP bounce easing = realistic ball bounce
            duration: 0.7,
            rotation: (i % 2 === 0 ? 1 : -1) * (2 + i * 2),
          },
          i * 0.15   // stagger start times
        );
      });

      // Phase 2 — Pause / float: slight upward drift
      tl.to(
        docs,
        { y: -18, ease: "sine.inOut", duration: 0.35 },
        docs.length * 0.15 + 0.55
      );

      // Phase 3 — Scatter: all docs fly upward + sideways and fade
      docs.forEach((doc, i) => {
        tl.to(
          doc,
          {
            y: -500,
            x: (i % 2 === 0 ? -1 : 1) * (60 + i * 35),
            opacity: 0,
            rotation: (i % 2 === 0 ? -1 : 1) * (25 + i * 12),
            ease: "power2.in",
            duration: 0.5,
          },
          docs.length * 0.15 + 1.05 + i * 0.04
        );
      });

      // ── PHASE 1 DUST: separate non-scrubbed trigger fires once on entry ──
      // (tl.call() does not fire reliably in scrub mode — use a standalone ST instead)
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top+=60% top",   // roughly when first docs have landed
        once: true,
        onEnter: () => {
          const container = dustContainerRef.current;
          if (!container) return;
          docs.forEach((doc) => {
            const rect = doc.getBoundingClientRect();
            const sRect = container.getBoundingClientRect();
            spawnDustBurst(
              container,
              rect.left - sRect.left + rect.width / 2,
              rect.bottom - sRect.top
            );
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [sectionRef, docRefs, dustContainerRef]);
}

// Spawns radial dust particles at (cx, cy) inside a container
function spawnDustBurst(container: HTMLDivElement, cx: number, cy: number) {
  const COUNT = 14;
  for (let i = 0; i < COUNT; i++) {
    const el = document.createElement("div");
    const size = 2 + Math.random() * 5;
    el.style.cssText = `
      position:absolute;
      left:${cx}px; top:${cy}px;
      width:${size}px; height:${size}px;
      background:rgba(134,41,55,${0.25 + Math.random() * 0.55});
      pointer-events:none; z-index:60;
    `;
    container.appendChild(el);

    const angle = (Math.PI * 2 * i) / COUNT + (Math.random() - 0.5);
    const dist  = 30 + Math.random() * 90;

    gsap.fromTo(
      el,
      { x: 0, y: 0, opacity: 0.9, scale: 1 },
      {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist - 20,
        opacity: 0,
        scale: 0.1,
        duration: 0.5 + Math.random() * 0.5,
        ease: "power2.out",
        onComplete: () => el.parentNode?.removeChild(el),
      }
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CONVERTER SLIDE-IN HOOK
// ─────────────────────────────────────────────────────────────────────────────
export function useConverterReveal(
  converterRef: RefObject<HTMLDivElement | null>
) {
  useEffect(() => {
    if (!converterRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        converterRef.current,
        { opacity: 0, y: 120, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: converterRef.current,
            start: "top 88%",
            end: "top 40%",
            scrub: 1.2,
          },
        }
      );
    }, converterRef);

    return () => ctx.revert();
  }, [converterRef]);
}

// ─────────────────────────────────────────────────────────────────────────────
// LEGACY HOOKS (kept for other components that may reference them)
// ─────────────────────────────────────────────────────────────────────────────

export function useHeroAnimation(
  containerRef: RefObject<HTMLDivElement | null>,
  titleRef: RefObject<HTMLHeadingElement | null>,
  subtitleRef: RefObject<HTMLParagraphElement | null>,
  ctaRef: RefObject<HTMLDivElement | null>,
  backgroundRef: RefObject<HTMLDivElement | null>
) {
  useEffect(() => {
    // no-op legacy stub
  }, [containerRef, titleRef, subtitleRef, ctaRef, backgroundRef]);
}

export function useConverterParachute(
  containerRef: RefObject<HTMLDivElement | null>,
  cardRef: RefObject<HTMLDivElement | null>
) {
  useEffect(() => {
    // no-op legacy stub
  }, [containerRef, cardRef]);
}

export function useBloopMorph(
  svgPathRef: RefObject<SVGPathElement | null>,
  filterRef: RefObject<SVGFETurbulenceElement | null>,
  isActive: boolean
) {
  useEffect(() => {
    if (!svgPathRef.current || !isActive) return;
    const ctx = gsap.context(() => {
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
    });
    return () => ctx.revert();
  }, [svgPathRef, filterRef, isActive]);
}

export function useOrbitSync(
  containerRef: RefObject<HTMLDivElement | null>,
  orbitRef: RefObject<HTMLDivElement | null>,
  nodesRef: RefObject<(HTMLDivElement | null)[]>
) {
  useEffect(() => {
    const triggerArea = containerRef.current;
    if (!triggerArea || !orbitRef.current || !nodesRef.current) return;
    const ctx = gsap.context(() => {
      const tlOuter = gsap.to(orbitRef.current, { rotation: 360, duration: 40, repeat: -1, ease: "none" });
      const nodes = nodesRef.current.filter((n) => n !== null) as HTMLDivElement[];
      const tlInner = gsap.to(nodes, { rotation: -360, duration: 40, repeat: -1, ease: "none" });
      const pause = () => { tlOuter.pause(); tlInner.pause(); };
      const play = () => { tlOuter.play(); tlInner.play(); };
      triggerArea.addEventListener("mouseenter", pause);
      triggerArea.addEventListener("mouseleave", play);
      return () => { triggerArea.removeEventListener("mouseenter", pause); triggerArea.removeEventListener("mouseleave", play); };
    }, containerRef);
    return () => ctx.revert();
  }, [containerRef, orbitRef, nodesRef]);
}

export function useDashboardStagger(
  containerRef: RefObject<HTMLDivElement | null>,
  cardsRef: RefObject<(HTMLDivElement | null)[]>
) {
  useEffect(() => {
    if (!containerRef.current || !cardsRef.current) return;
    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter((c) => c !== null) as HTMLDivElement[];
      if (cards.length === 0) return;
      gsap.fromTo(cards, { opacity: 0, y: 40, scale: 0.97 }, {
        opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.12, ease: "power2.out",
        scrollTrigger: { trigger: containerRef.current, start: "top 85%", toggleActions: "play none none none" },
      });
    }, containerRef);
    return () => ctx.revert();
  }, [containerRef, cardsRef]);
}

// kept for any page that still uses this signature
export function useHeroParallax(
  containerRef: RefObject<HTMLDivElement | null>,
  cardsRef: RefObject<(HTMLDivElement | null)[]>,
  converterRef: RefObject<HTMLDivElement | null>
) {
  useEffect(() => {
    // no-op – replaced by useDocumentDrop + useConverterReveal
  }, [containerRef, cardsRef, converterRef]);
}
