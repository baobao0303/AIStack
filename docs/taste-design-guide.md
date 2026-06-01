# Taste-Driven High-End Frontend Design Guide

This guide compiles BMad design principles and Google Stitch tokens into a unified, actionable guide for engineering ultra-premium, tactile, and highly interactive digital experiences. Use it to audit existing user interfaces and scaffold new premium frontends.

---

## 1. Geometric Consistency & Radii Locks (Double-Bezel)

To prevent visual flatulence and generic layouts, apply concentric squircle tray systems for all major product cards, images, and visual trays:

*   **Outer Bezel (Tray)**: A wrapping container with padding `p-2` (8px), a soft background color (`bg-black/5` or `rgba(74, 101, 79, 0.03)`), a micro-hairline border (`border border-black/5` or `border-sage/10`), and a large outer radius (`rounded-[32px]` / `2rem`).
*   **Inner Core (Content)**: The actual card body containing content. It must utilize its own distinct background color (`bg-white` / `#ffffff`) and a mathematically calculated smaller radius to form beautiful concentric curves:
    $$\text{Radius}_{\text{inner}} = \text{Radius}_{\text{outer}} - \text{Padding}$$
    *Formula:* `rounded-[calc(2rem-0.5rem)]` = `rounded-[24px]` (`1.5rem`).

---

## 2. Interactive Nested Pill CTAs

Primary action buttons should feel weighty, mechanical, and tactile:

*   **Pill Shape**: Fully rounded (`rounded-full`) with a comfortable horizontal rhythm (`px-6 py-3`).
*   **Island Arrow Icon**: The diagonal trailing arrow (`↗`) must never sit naked next to the text. Nest it inside its own circular bubble tray wrapper (`w-8 h-8 rounded-full bg-white/10` or `bg-black/5`) flush with the button's right inner padding.
*   **Magnetic Hover Physics**: Apply a parent hover transition (`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]`). Scale down slightly on click (`active:scale-[0.97]`), and translate the nested arrow container diagonally (`group-hover:translate-x-1 group-hover:-translate-y-[1px]`) on hover to build tension.

---

## 3. Strict Copywriting & Tone Checks (Anti-Slop)

*   **Hard Em-Dash Ban**: Never use `—` or `--`. Replace with natural punctuation, sentence splits, or spaces around standard hyphens (` - `).
*   **No Emojis**: Banned from all production-ready business views. Use clean mono-line SVG icons (Phosphor Light, Material Symbol Outlined) instead.
*   **No AI Cliches**: Ban copywriting placeholders like *"Elevate"*, *"Seamless"*, *"Unleash"*, or *"Next-Gen"*. Use precise, active, and specific language.
