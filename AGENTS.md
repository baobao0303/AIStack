# Agent Instructions

Add project-specific agent instructions here.

<!-- HARNESS:BEGIN -->

## Harness

This repo uses **Harness** — a durable, SQLite-backed operating framework for human-agent pair programming.

Before work, read:

- `README.md`
- `docs/HARNESS.md`
- `docs/FEATURE_INTAKE.md`
- `docs/ARCHITECTURE.md`
- All files in `.agents/rules/`

Use the Rust Harness CLI as the main operational tool. Run it through the stable repo-local entrypoint `scripts/harness`, which uses the prebuilt Rust binary at `scripts/bin/harness-cli`.

### Agent Workspace Structure (`.agents/`)

This directory is an enterprise-grade cognitive core containing:

- `.agents/rules/`: Authoritative operational guidelines (Harness, Scrum, Edge Case Hunter, Adversarial Review).
- `.agents/workflow/`: High-discipline execution workflows (`quick-dev.md`, `dev-story.md`, `code-review.md`).
- `.agents/skills/`: Comprehensive library of 44 BMad modular task skills.
- `.agents/agents/`: Repository of specialized personas categorized by discipline (Engineering, Product, etc.).
- `.agents/commands/`: Team coordination command configurations.

<!-- AGENT-SHIMS:BEGIN -->

## Claude Code

Before working in this repository:

1. Read all files in `.agents/rules/` for operating and validation rules
2. Run `scripts/harness query matrix` to see current validation status
3. Run `scripts/harness query stats` for project overview
4. Follow the mandatory task loop for every request

## Cursor

Before working in this repository:

1. Read all files in `.agents/rules/` for operating and validation rules
2. Reference `docs/FEATURE_INTAKE.md` for work classification
3. Use `scripts/harness query` commands for status checks
4. Follow the mandatory task loop for every request

## Windsurf

Before working in this repository:

1. Read all files in `.agents/rules/` for operating and validation rules
2. Reference `docs/FEATURE_INTAKE.md` for work classification
3. Use `scripts/harness query` commands for status checks
4. Follow the mandatory task loop for every request

## GitHub Copilot

Before suggesting code changes:

1. Read all files in `.agents/rules/` for operating and validation rules
2. Reference story packets in `docs/stories/` for implementation guidance
3. Use `scripts/harness query` commands for context
4. Always record traces upon task completion

## Antigravity

Before working in this repository:

1. Read all files in `.agents/rules/` for operating and validation rules
2. Run `scripts/harness query matrix` for validation status
3. Follow the mandatory task loop for every request

## Codex

Before working in this repository:

1. Read all files in `.agents/rules/` for operating and validation rules
2. Reference `docs/FEATURE_INTAKE.md` for work classification
3. Use `scripts/harness query` commands for context
4. Follow the mandatory task loop for every request

## All Other Agents

This repository uses Harness. Before working:

1. Read all files in `.agents/rules/` — these are the authoritative operating guides
2. Read `docs/HARNESS.md` for the human-agent collaboration model
3. Read `docs/FEATURE_INTAKE.md` for work classification
4. Use `scripts/harness` CLI for all task tracking

Treat harness docs as authoritative. Always record traces upon task completion. Report friction to backlog.

<!-- AGENT-SHIMS:END -->
<!-- HARNESS-SKILLS:BEGIN -->

## Available Harness Skills

Invoke a skill by reading its instructions: `.agents/skills/<name>/SKILL.md`
Or run directly: `./scripts/harness skill run <name>`

| Skill | Description |
| --- | --- |
| brandkit | Premium brand-kit image generation skill for creating high-end brand-guidelines boards, logo systems, identity decks, and visual-world presentations. Trained for minimalist, cinematic, editorial, dark-tech, luxury, cultural, security, gaming, developer-tool, and consumer-app brand systems. Optimized for intentional logo concepting, refined composition, sparse typography, strong symbolic meaning, premium mockups, art-directed imagery, and flexible grid layouts. |
| design-taste-frontend-v1 | The original v1 taste-skill, preserved for projects depending on its exact behavior. The current default is `design-taste-frontend` (v2 experimental), which is a substantial rewrite. Use this v1 install name only if you need exact backward compatibility. |
| design-taste-frontend | Anti-slop frontend skill for landing pages, portfolios, and redesigns. The agent reads the brief, infers the right design direction, and ships interfaces that do not look templated. Real design systems when applicable, audit-first on redesigns, strict pre-flight check. |
| full-output-enforcement | Overrides default LLM truncation behavior. Enforces complete code generation, bans placeholder patterns, and handles token-limit splits cleanly. Apply to any task requiring exhaustive, unabridged output. |
| gpt-taste | Elite UX/UI & Advanced GSAP Motion Engineer. Enforces Python-driven true randomization for layout variance, strict AIDA page structure, wide editorial typography (bans 6-line wraps), gapless bento grids, strict GSAP ScrollTriggers (pinning, stacking, scrubbing), inline micro-images, and massive section spacing. |
| high-end-visual-design | Teaches the AI to design like a high-end agency. Defines the exact fonts, spacing, shadows, card structures, and animations that make a website feel expensive. Blocks all the common defaults that make AI designs look cheap or generic. |
| image-to-code | Elite website image-to-code skill for Codex. For visually important web tasks, it must first generate the design image(s) itself, deeply analyze them, then implement the website to match them as closely as possible. In Codex, it must prefer large, readable, section-specific images instead of tiny compressed boards, generate fresh standalone images for sections or detail views instead of cropping old ones, avoid lazy under-generation, avoid cards-inside-cards-inside-cards UI, and keep the hero clean, spacious, readable, and visible on a small laptop. |
| imagegen-frontend-mobile | Elite mobile app image-generation skill for creating premium, app-native screen concepts and flows. Designed for iOS, Android, and cross-platform mobile products. Prioritizes clean hierarchy, comfortably readable text, strong multi-screen consistency, controlled color palettes, non-generic creative direction, textured surfaces, image-led composition, tasteful custom iconography, and clean phone mockup framing. By default, screens should be shown inside a subtle premium iPhone or similar phone mockup with a visible frame, while the main focus stays on the app content itself. This skill generates images only. It does not write code. |
| imagegen-frontend-web | Elite frontend image-direction skill for generating premium, conversion-aware website design references. CRITICAL OUTPUT RULE — generate ONE separate horizontal image FOR EVERY section. A landing page with 8 sections produces 8 images. Never compress multiple sections into one image. Enforces composition variety (not always left-text / right-image), background-image freedom, varied CTAs, varied hero scales (giant / mid / mini minimalist), narrative concept spine, second-read moments, and a single consistent palette across all images. Optimized for landing pages, marketing sites, and product comps that developers or coding models can accurately recreate. |
| industrial-brutalist-ui | Raw mechanical interfaces fusing Swiss typographic print with military terminal aesthetics. Rigid grids, extreme type scale contrast, utilitarian color, analog degradation effects. For data-heavy dashboards, portfolios, or editorial sites that need to feel like declassified blueprints. |
| minimalist-ui | Clean editorial-style interfaces. Warm monochrome palette, typographic contrast, flat bento grids, muted pastels. No gradients, no heavy shadows. |
| redesign-existing-projects | Upgrades existing websites and apps to premium quality. Audits current design, identifies generic AI patterns, and applies high-end design standards without breaking functionality. Works with any CSS framework or vanilla CSS. |
| stitch-design-taste | Semantic Design System Skill for Google Stitch. Generates agent-friendly DESIGN.md files that enforce premium, anti-generic UI standards — strict typography, calibrated color, asymmetric layouts, perpetual micro-motion, and hardware-accelerated performance. |

<!-- HARNESS-SKILLS:END -->

<!-- HARNESS:END -->
