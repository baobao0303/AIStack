# Taste-Driven Frontend Engineering Workflow (TFW)

**Goal:** Establish an elite, high-discipline workflow that integrates BMad visual skills with Awwwards-tier design logic to build outstanding, anti-slop digital experiences. This workflow ensures that every frontend build—whether designed from scratch, updated from a mock, or refactored from an existing brownfield project—is mathematically consistent, visually premium, and structurally clean.

---

## 🗺️ Master Workflow Lifecycle

```text
+-----------------------------+
|  1. VIBE CHECK & DIALS      | <-- Read the brief, choose vibe profile, and tune Dials
+-----------------------------+
               |
               v
+-----------------------------+
|  2. CHOOSE THE ARCHETYPE    | <-- Map target needs to Minimalist, Brutalist, or Soft Soft-visuals
+-----------------------------+
               |
               v
+-----------------------------+
|  3. CONCENTRIC GEOMETRY     | <-- Enforce radius locks and Double-Bezel Tray-Core trays
+-----------------------------+
               |
               v
+-----------------------------+
|  4. INTERACTIVE KINETICS    | <-- Nested Button-in-Button, magnetic hover physics, no linear eases
+-----------------------------+
               |
               v
+-----------------------------+
|  5. STRICT PRE-FLIGHT CHECK | <-- Hard em-dash ban, exact copy audits, no placeholder comments
+-----------------------------+
               |
               v
+-----------------------------+
|  6. VERIFY & RECORD TRACE   | <-- Run green builds, execute stitch sync, log SQLite trace
+-----------------------------+
```

---

## 1. Vibe Check & Dial Tuning (Taste-Skill v2)

Before writing any HTML/CSS/React code, evaluate the product domain and user expectations. Align the visual language by tuning **The Three Dials** from `taste-skill` (`design-taste-frontend`):

*   **`DESIGN_VARIANCE` (1 - 10)**:
    *   *Low (1-3)*: Clean, highly structured corporate grid (typical SaaS, dashboard).
    *   *Medium (4-7)*: Offset components, asymmetric grid layers, bento boxes.
    *   *High (8-10)*: Artsy, cinematic overlaps, floating rotated blocks (`rotate-[2deg]`), broken grids.
*   **`MOTION_INTENSITY` (1 - 10)**:
    *   *Low (1-3)*: Static, purely transactional transitions (quick transitions).
    *   *Medium (4-7)*: Responsive spring physics hover lifts, map marker pulse.
    *   *High (8-10)*: Choreographed scroll-driven reveals (GSAP ScrollTrigger), split-screen scrolls, heavy blur fades.
*   **`VISUAL_DENSITY` (1 - 10)**:
    *   *Low (1-3)*: Lookbook-style airy gallery layout, massive whitespace gaps (`py-32`).
    *   *Medium (4-7)*: Daily balanced commerce product card pages.
    *   *High (8-10)*: Highly efficient dashboard terminals, data-dense cockpit controls.

---

## 2. Archetype Mapping & Skill Selection

Select and invoke BMad helper skills based on the aesthetic goals of the feature:

| Skill Identifier | Local Skill Name | When to Use / Primary Directives |
| :--- | :--- | :--- |
| **`taste-skill`** | `design-taste-frontend` | **Master Dial Orchestrator**. Reads brief, infers theme, tunes 3 dials, locks fonts, enforces **hard em-dash ban**, bans lazy Linear animations. |
| **`redesign-skill`** | `redesign-existing-projects` | **Existing Refactors / Audits**. Priority path: Scan -> Diagnose Slop (Inter font ban, saturations < 80%) -> Apply upgrades (smooth scroll, skeletal loads). |
| **`soft-skill`** | `high-end-visual-design` | **Awwwards Quiet-Luxury**. Concentric border squircle locks, Double-Bezel machining, Nested trailing button indicators (`↗` inside circular container). |
| **`minimalist-skill`** | `minimalist-ui` | **Clean Editorial (Linear Vibe)**. Zero linear gradients, bone/zinc canvas, crisp hairline borders, top-sidebar collapsible panels. |
| **`brutalist-skill`** | `industrial-brutalist-ui` | **Raw Mechanicalblueprints**. Monospace fonts, tabular numbers, extreme typography scale contrast, rigid grids, analog lines. |
| **`stitch-skill`** | `stitch-design-taste` | **Stitch Semantic Synchronization**. Generates Google Stitch-compatible semantic specs and exports `DESIGN.md` styling files. |
| **`output-skill`** | `full-output-enforcement` | **Anti-Placeholder Guardrail**. Ban all forms of `// TODO: Implement later` or `/* rest of code unchanged */`. Ships full files. |

---

## 3. The Double-Bezel and Concentric Geometry (Soft-Skill)

For premium layouts, never place cards flat on backgrounds. Use the **Double-Bezel nested tray model**:

```text
+-------------------------------------------------------------+
| Outer Shell (bg-black/5 or bg-white/5, rounded-[32px])     |
|  +-------------------------------------------------------+  |
|  | Inner Core (bg-white, rounded-[24px])                 |  |
|  | Content goes here...                                  |  |
|  +-------------------------------------------------------+  |
+-------------------------------------------------------------+
```

### Concentric Radius Lock Math:
To prevent curves from overlapping awkwardly (visual "pinching"), the outer corner radius and the inner corner radius must satisfy:
$$\text{Radius}_{\text{inner}} = \text{Radius}_{\text{outer}} - \text{Padding}$$
*Example:* Outer Shell bo tròn `32px` (`2rem`) chứa lớp đệm `8px` (`0.5rem`) thì lớp Lõi Inner Core phải được khóa bo góc chính xác ở mức `24px` (`1.5rem`) (`rounded-[calc(2rem-0.5rem)]`).

---

## 4. Nested CTA Kinetics & Motion (Soft-Skill + Motion-Skill)

### Nested Buttons:
Interactive primary buttons should use fully rounded pill-shapes (`rounded-full`) with generous breathing padding.
*   **Button-in-Button Trailing Icon**: Arrow elements (`↗`) must **never** sit naked next to text labels. They must be nested within a distinct circular background bubble wrapper (`w-8 h-8 rounded-full bg-white/10`) placed flush against the right inner padding.
*   **Kinetic Hover Feedback**: On hover, scale down the parent button slightly (`active:scale-[0.98]`) to simulate haptic compression, while dynamically translating the nested icon diagonally (`group-hover:translate-x-1 group-hover:-translate-y-[1px]`) to create tension.

---

## 5. Strict Pre-Flight Checklist

Before proposing or committing code changes, run this checklist. If any item is violated, immediately fix it:

*   [ ] **Hard Em-Dash Ban**: Search the code and copywriting for standard `—` (em-dash) or `--`. Replace with standard commas, sentence boundaries, or space-separated hyphens (` - `).
*   [ ] **No Emojis**: Emojis are strictly banned from premium business-critical storefront templates. Use precise mono-line icons (Material Symbols, Phosphor Light) instead.
*   [ ] **Accents Saturation**: Neutralize saturations to below 80%. Never use default neon gradients.
*   [ ] **Paragraph Width Lock**: Keep all descriptions constrained to a maximum of `65ch` (characters) to prevent sprawling lines. Use `text-wrap: balance` on displaying headers.
*   [ ] **Radius Locks**: Ensure all elements obey concentric squircle math.
*   [ ] **Anti-Placeholder**: Verify `full-output-enforcement` is obeyed. Zero code omissions allowed.

---

## 6. Verification & SQLite Harness Logging

1.  **Production Compile**: Run the package compilation manager to ensure 0 routing, linter, or bundler warnings:
    ```bash
    npx nx build storefront-web
    ```
2.  **Stitch Sync**: If working on a Stitch-linked project, export or verify the updated `DESIGN.md` rules, then execute Stitch update:
    ```bash
    ./scripts/harness decision verify <decision_id>
    ```
3.  **Trace Log**: Record the trace in the SQLite operational database:
    ```bash
    ./scripts/harness trace \
      --summary "Redesign storefront using Taste-Skill v2 concentric curves and nested button CTAs" \
      --outcome "completed" \
      --changed "libs/shared-react/src/lib/ui/views/HomeView.tsx,libs/shared-react/src/lib/ui/styles/page.module.scss"
    ```
