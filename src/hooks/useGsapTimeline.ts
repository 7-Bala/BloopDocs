"use client";

import { useEffect, RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Safely register ScrollTrigger on client-side
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Hook for cinematic Hero header text animation.
 * Features a stagger-in fade/translate on mount and dynamic parallax scroll effects.
 */
export function useHeroAnimation(
  containerRef: RefObject<HTMLDivElement | null>,
  titleRef: RefObject<HTMLHeadingElement | null>,
  subtitleRef: RefObject<HTMLParagraphElement | null>,
  ctaRef: RefObject<HTMLDivElement | null>,
  backgroundRef: RefObject<HTMLDivElement | null>
) {
  useEffect(() => {
    if (!containerRef.current) return;

    // React 18 clean animation context (guarantees garbage collection on unmount)
    const ctx = gsap.context(() => {
      // 1. Initial mounting timeline (fades and moves elements up staggered)
      const tl = gsap.timeline({
        defaults: { ease: "power3.out", duration: 1.2 },
      });

      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 50, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, delay: 0.2 }
      )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0 },
          "-=0.9" // overlap by 0.9s
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0 },
          "-=0.8"
        );

      // 2. Parallax effect on the background shapes as the user scrolls
      if (backgroundRef.current) {
        gsap.to(backgroundRef.current.children, {
          y: (i) => {
            const speed = (i + 1) * 80;
            return speed;
          },
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }, containerRef);

    // Cleanup: Revert all animations and kill ScrollTriggers to prevent memory leaks
    return () => ctx.revert();
  }, [containerRef, titleRef, subtitleRef, ctaRef, backgroundRef]);
}

/**
 * Hook to "parachute" and pin the main converter section.
 * Smoothly translates and scales the container into place on scroll.
 */
export function useConverterParachute(
  containerRef: RefObject<HTMLDivElement | null>,
  cardRef: RefObject<HTMLDivElement | null>
) {
  useEffect(() => {
    if (!containerRef.current || !cardRef.current) return;

    const ctx = gsap.context(() => {
      // Animate the card into view as the user scrolls down into the section
      gsap.fromTo(
        cardRef.current,
        {
          opacity: 0,
          y: 120,
          scale: 0.9,
          rotationX: 12, // Cinematic perspective tilt
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationX: 0,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%", // Starts when the top of the container is 80% down the viewport
            end: "top 30%",   // Reaches fully animated state at 30% viewport height
            scrub: 1,         // Smooth delayed catch-up
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [containerRef, cardRef]);
}

/**
 * Hook to drive a continuous wobbly liquid SVG shape and filter morphing timeline
 * to represent the "Bloop" loading state.
 */
export function useBloopMorph(
  svgPathRef: RefObject<SVGPathElement | null>,
  filterRef: RefObject<SVGFETurbulenceElement | null>,
  isActive: boolean
) {
  useEffect(() => {
    if (!svgPathRef.current || !isActive) return;

    // Organic path variations (defined with identical vertex counts to morph out-of-the-box)
    const shapes = [
      "M25,50 C25,25 50,25 50,25 C50,25 75,25 75,50 C75,75 75,75 50,75 C25,75 25,75 25,50 Z", // Base
      "M30,50 C25,20 60,30 55,20 C50,10 80,30 70,50 C60,70 80,80 50,80 C20,80 35,80 30,50 Z", // Right stretch
      "M20,45 C20,30 40,15 50,25 C60,35 85,25 80,45 C75,65 70,85 52,75 C34,65 20,60 20,45 Z", // Left stretch
      "M25,50 C25,25 50,25 50,25 C50,25 75,25 75,50 C75,75 75,75 50,75 C25,75 25,75 25,50 Z"  // Re-base
    ];

    const ctx = gsap.context(() => {
      // Loop the morph timeline infinitely
      const tl = gsap.timeline({ repeat: -1 });

      tl.to(svgPathRef.current, {
        attr: { d: shapes[1] },
        duration: 1.5,
        ease: "sine.inOut",
      })
        .to(svgPathRef.current, {
          attr: { d: shapes[2] },
          duration: 1.5,
          ease: "sine.inOut",
        })
        .to(svgPathRef.current, {
          attr: { d: shapes[3] },
          duration: 1.5,
          ease: "sine.inOut",
        });

      // Liquid wobbly rotation
      gsap.to(svgPathRef.current, {
        rotate: 360,
        transformOrigin: "center center",
        duration: 10,
        repeat: -1,
        ease: "none",
      });

      // Dynamic liquid feTurbulence morphing
      if (filterRef.current) {
        gsap.to(filterRef.current, {
          attr: { baseFrequency: "0.015 0.08" },
          duration: 1.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    });

    return () => ctx.revert();
  }, [svgPathRef, filterRef, isActive]);
}

/**
 * Hook to drive a synchronized circular orbit where the outer container rotates
 * and the inner items counter-rotate to stay upright. Pauses on hover.
 */
export function useOrbitSync(
  containerRef: RefObject<HTMLDivElement | null>,
  orbitRef: RefObject<HTMLDivElement | null>,
  nodesRef: RefObject<(HTMLDivElement | null)[]>
) {
  useEffect(() => {
    const triggerArea = containerRef.current;
    if (!triggerArea || !orbitRef.current || !nodesRef.current) return;

    const ctx = gsap.context(() => {
      const tlOuter = gsap.to(orbitRef.current, {
        rotation: 360,
        duration: 40,
        repeat: -1,
        ease: "none",
      });

      const nodes = nodesRef.current.filter((node) => node !== null) as HTMLDivElement[];
      const tlInner = gsap.to(nodes, {
        rotation: -360,
        duration: 40,
        repeat: -1,
        ease: "none",
      });

      // Pause on hover handlers
      const handleMouseEnter = () => {
        tlOuter.pause();
        tlInner.pause();
      };

      const handleMouseLeave = () => {
        tlOuter.play();
        tlInner.play();
      };

      triggerArea.addEventListener("mouseenter", handleMouseEnter);
      triggerArea.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        triggerArea.removeEventListener("mouseenter", handleMouseEnter);
        triggerArea.removeEventListener("mouseleave", handleMouseLeave);
      };
    }, containerRef);

    return () => ctx.revert();
  }, [containerRef, orbitRef, nodesRef]);
}

/**
 * Hook to stagger-fade dashboard components on scroll.
 */
export function useDashboardStagger(
  containerRef: RefObject<HTMLDivElement | null>,
  cardsRef: RefObject<(HTMLDivElement | null)[]>
) {
  useEffect(() => {
    if (!containerRef.current || !cardsRef.current) return;

    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter((card) => card !== null) as HTMLDivElement[];
      if (cards.length === 0) return;

      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 40,
          scale: 0.97,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%", // Animation starts when top is 85% down viewport
            toggleActions: "play none none none",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [containerRef, cardsRef]);
}

/**
 * Hook for dynamic multi-layered document parallax around the hero header.
 * Staggers in on mount and shifts card items based on mouse moves.
 */
export function useHeroParallax(
  containerRef: RefObject<HTMLDivElement | null>,
  cardsRef: RefObject<(HTMLDivElement | null)[]>,
  converterRef: RefObject<HTMLDivElement | null>
) {
  useEffect(() => {
    if (!containerRef.current || !cardsRef.current) return;

    const ctx = gsap.context(() => {
      const wrappers = cardsRef.current.filter((card) => card !== null) as HTMLDivElement[];
      if (wrappers.length === 0) return;

      // 1. Initial State: Force wrappers to be fully transparent on mount (appear strictly on scroll!)
      gsap.set(wrappers, { opacity: 0, scale: 0.4, y: 80 });

      // 2. Coordinated ScrollTrigger timeline for document cards
      const tlDocs = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom 10%",
          scrub: 1.2, // Silky smooth scroll scrubbing
        }
      });

      // Scroll Phase 1: Documents parachute, scale up, and fade in staggered
      tlDocs.to(wrappers, {
        opacity: 1,
        scale: 1,
        y: 0,
        stagger: 0.08,
        duration: 1.5,
        ease: "power2.out"
      });

      // Scroll Phase 2: Documents disperse outwards and fade away
      tlDocs.to(wrappers, {
        y: (i) => (i % 2 === 0 ? -180 : 180),
        x: (i) => (i < 3 ? -120 : 120),
        opacity: 0,
        duration: 1.8,
        ease: "power2.inOut",
        delay: 0.3 // brief pause in visual float
      });

      // 3. ScrollTrigger for the Converter Section sliding entry
      if (converterRef.current) {
        gsap.fromTo(
          converterRef.current,
          { 
            opacity: 0, 
            y: 150, 
            scale: 0.95,
            rotationX: 8, // slight 3D perspective entry angle
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotationX: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: converterRef.current,
              start: "top 90%", // slide starts as top reaches 90% viewport
              end: "top 40%",   // full locked alignment by 40%
              scrub: 1.5,
            }
          }
        );
      }

      // 4. Mouse Move Parallax Logic on the inner cards
      const innerCards = wrappers
        .map((w) => w.querySelector(".parallax-inner"))
        .filter((el) => el !== null) as HTMLDivElement[];

      const handleMouseMove = (e: MouseEvent) => {
        const mouseX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
        const mouseY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);

        innerCards.forEach((card) => {
          const speedX = parseFloat(card.getAttribute("data-speed-x") || "0") * 35;
          const speedY = parseFloat(card.getAttribute("data-speed-y") || "0") * 35;

          gsap.to(card, {
            x: mouseX * speedX,
            y: mouseY * speedY,
            duration: 0.8,
            ease: "power2.out",
            overwrite: "auto",
          });
        });
      };

      window.addEventListener("mousemove", handleMouseMove);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }, containerRef);

    return () => ctx.revert();
  }, [containerRef, cardsRef, converterRef]);
}

/**
 * Hook for brutalist terminal typewriter styling on hero header.
 * Staggers characters from hidden to block, then fades out the blinking cursor.
 */
export function useTypewriter(
  containerRef: RefObject<HTMLHeadingElement | null>,
  cursorRef: RefObject<HTMLSpanElement | null>
) {
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const letters = containerRef.current!.querySelectorAll(".typewriter-letter");
      if (letters.length === 0) return;

      const tl = gsap.timeline();

      // Typing stagger - 0.05s between each letter
      tl.fromTo(
        letters,
        { display: "none" },
        {
          display: "inline-block",
          stagger: 0.05,
          ease: "none",
          duration: 0.01,
        }
      );

      // Fade out block cursor smoothly after typing completes
      if (cursorRef.current) {
        tl.to(cursorRef.current, {
          opacity: 0,
          duration: 0.5,
          delay: 0.4,
          onComplete: () => {
            if (cursorRef.current) {
              cursorRef.current.style.display = "none";
            }
          }
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [containerRef, cursorRef]);
}

