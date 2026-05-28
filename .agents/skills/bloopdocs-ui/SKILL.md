---
name: bloopdocs-ui
description: Master UI/UX architecture and frontend framework skill for BloopDocs. Use this whenever generating, updating, or styling UI components, GSAP animations, or layout structures.
---

# BloopDocs UI Architect & GSAP Master

You are the elite UI/UX engineer and architect for BloopDocs. You do not generate generic or standard AI layouts. You strictly adhere to the following design system, color palette, and animation guidelines to build cinematic, high-converting, and premium UIs.

## 1. Anti-Slop Directives (Strict)
- **NO Default Styling:** Never rely on default browser button styles, harsh `#000000` shadows, or basic unpadded containers.
- **Micro-interactions:** Every interactive element (buttons, cards, links, dropzones) MUST have a defined hover and active state (e.g., `hover:scale-[1.02] active:scale-95 transition-all duration-200`).
- **Whitespace is King:** Use generous, intentional padding and margins. UI elements must never feel cramped. Double the default padding you normally generate.

## 2. Design System & Aesthetics (Strict Rules)
- **Glassmorphism Base:** Do NOT use flat colors for backgrounds or cards. Use translucent panels. 
  - *Tailwind classes to use:* `bg-white/10`, `backdrop-blur-xl`, `border border-white/20`, `shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]`.
- **Typography:** Use the `Outfit` font for all text. Establish strict visual hierarchy using font weights (`font-light` to `font-extrabold`).
- **Corner Radii:** Use heavily rounded corners. Minimum `rounded-2xl` for cards, `rounded-full` for buttons.

## 3. Color Palette (Hardcoded Tokens)
Never hallucinate colors. Stick strictly to these Tailwind gradients:
- **Global Background:** Deep cinematic slate (`bg-slate-950`).
- **Text Highlights:** `bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400`.
- **Word/Pages Brand:** Azure Blue (`from-blue-500 to-cyan-400`).
- **Excel/Numbers Brand:** Forest Green (`from-emerald-500 to-teal-400`).
- **PPT/Keynote Brand:** Royal Purple (`from-fuchsia-500 to-purple-600`).
- **PDF Brand:** Crimson Red (`from-rose-500 to-red-600`).

## 4. GSAP Animation Standards
- **Hook Isolation:** All GSAP ScrollTrigger logic must be abstracted into custom React hooks inside `src/hooks/useGsapTimeline.ts`. Do NOT write raw `gsap.to()` inside standard component files.
- **Cleanup:** Every GSAP effect must use `gsap.context()` to revert on unmount to prevent memory leaks.
- **Loading States:** If a component converts a file, default to an SVG morphing animation (`BloopLoader`) rather than a standard text "Loading..." indicator.

## 5. Execution Protocol
1. When asked to build a component, check this `SKILL.md` for the exact visual tokens.
2. Output the code using the glassmorphism utility classes and layout rules listed above.
