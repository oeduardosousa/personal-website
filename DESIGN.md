---
name: oeduardosousa.com
description: Dark terminal, loud name. A type-led personal site with one lime accent, mono details and dry jokes.
colors:
  primary: "#C6F432"
  on-primary: "#0B0C0E"
  primary-ink-light: "#3F6200"
  bg: "#0B0C0E"
  surface: "#131417"
  border: "#26272C"
  text: "#F2F1EC"
  text-muted: "#9A9CA3"
  bg-light: "#F4F3EE"
  surface-light: "#EAE9E3"
  border-light: "#D5D4CD"
  text-light: "#0E0F11"
  text-muted-light: "#55575E"
  success: "#5FD38A"
  success-light: "#1F7A45"
  warning: "#F5B84B"
  warning-light: "#8A5A00"
  error: "#FF6B5E"
  error-light: "#B42318"
typography:
  hero:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "clamp(3.5rem, 14vw, 12rem)"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 6vw, 5rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)"
    fontWeight: 600
    lineHeight: 1.1
  body:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "0.04em"
rounded:
  sm: "4px"
  md: "8px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "32px"
  xl: "64px"
  section: "96px"
  section-max: "160px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "14px 24px"
    height: "48px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "14px 24px"
    height: "48px"
  terminal-line:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
  tag:
    backgroundColor: "transparent"
    textColor: "{colors.text-muted}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "2px 8px"
  palette:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "16px"
---

# Design System: oeduardosousa.com

## Overview

**Creative North Star: "The Loud Terminal"**

A dark, technical page that is quiet everywhere except one place: a huge name and one lime accent. It reads like a developer's terminal that learned to talk: mono details, a live line that notices you, dry jokes in the microcopy. It sells a person, not a template, so real copy beats polish (VOICE.md) and proof is real repos and real builds. No clients, testimonials or metrics are claimed.

Type does the hierarchy. Hairlines and whitespace replace card boxes. Layout is asymmetric: the best project gets twice the space and the grid breaks once on purpose. Contact is one step away on every screen.

Directional sources: PRODUCT.md, VOICE.md, CONTENT.md, WORKFLOW-EDUARDO.md, and a six-site reference study (principles only, no assets or layouts copied).

**Key Characteristics:**
- Near-black warm base, off-white text, one lime accent used on at most about 10% of any screen.
- One variable display face for the name and headings, one mono for the terminal line and labels.
- Flat: hairline borders, no shadows except the command palette.
- Motion that is fast, purposeful and cheap. Transform and opacity only.
- Dark by default; light mode follows `prefers-color-scheme` with a manual toggle.

## Colors

A warm near-black and off-white pair with a single electric lime. Lime is the only loud color; everything else steps back.

### Primary
- **Electric Lime** (`#C6F432`): primary button fill, the terminal prompt, focus ring, selection, link hover. Its rarity is the point.
- **Lime Ink (light mode)** (`#3F6200`): lime used as text or links on the light background, where raw lime fails contrast.
- **On Lime** (`#0B0C0E`): text on a lime fill (about 15:1).

### Neutral
- **Ink Black** (`#0B0C0E` dark / `#F4F3EE` light): page background.
- **Raised Graphite** (`#131417` / `#EAE9E3`): terminal bar, palette, any raised area.
- **Hairline** (`#26272C` / `#D5D4CD`): 1px dividers and borders.
- **Bone White** (`#F2F1EC` / `#0E0F11`): headings and body (about 17:1).
- **Quiet Gray** (`#9A9CA3` / `#55575E`): secondary text and labels (about 7:1 / 6.5:1).

### Status
Success `#5FD38A`, warning `#F5B84B`, error `#FF6B5E` in dark; `#1F7A45`, `#8A5A00`, `#B42318` in light. Used for "copied", availability and errors only.

### Named Rules
**The One Voice Rule.** Lime appears on at most about 10% of any screen. If two things are lime, one of them is wrong.

**The No-Gradient Rule.** No gradients, no glow. Flat fills only.

**The Contrast Rule.** Text at least 4.5:1 (large text at least 3:1). Lime is never body text on the light background; use Lime Ink.

## Typography

**Display Font:** Bricolage Grotesque (variable: weight, width, optical size; OFL), fallback system-ui
**Body Font:** Bricolage Grotesque
**Label/Mono Font:** JetBrains Mono (OFL), fallback ui-monospace

**Character:** A characterful grotesque for the loud name and plain body copy, set against a utilitarian mono for everything machine-like. Two families only, self-hosted WOFF2, subset to Latin plus pt-BR (ã õ ç á é í ó ú â ê ô à), `font-display: swap`, preload only the hero font. Not Inter, Roboto or Poppins.

### Hierarchy
- **Hero** (800, `clamp(3.5rem, 14vw, 12rem)`, 0.9): the name only, may bleed off the edge.
- **Headline** (700, `clamp(2.5rem, 6vw, 5rem)`, 1.0): section titles.
- **Title** (600, `clamp(1.75rem, 3.5vw, 2.75rem)`, 1.1): project titles.
- **Body** (400, 17px, 1.55): copy, max 60 to 70ch. Never under 16px.
- **Label** (JetBrains Mono 500, 14px, +0.04em, uppercase for tags): terminal line, tags, buttons, meta, microcopy.

### Named Rules
**The Two Voices Rule.** Human words are in the grotesque; machine words (time, status, commands, tags) are in mono.

## Layout

Mobile first. 12-column grid on desktop with mixed alignments (left, right-offset), one deliberate grid break, and a hero that bleeds. The best project spans about 8 columns, others 4; never a uniform 3-column card grid. Section spacing varies on purpose (96 to 160px), not uniform.

Spacing scale (4px base): 4, 8, 12, 16, 24, 32, 48, 64, 96, 160. Text column max 68ch; wide max 1280px. Gutters 16px mobile, 32px tablet, 48px desktop. Breakpoints 640, 960, 1280.

Mobile: the hero name scales with `vw` and wraps to two lines, the terminal line sits below, nav becomes a full-screen menu, projects stack with the best first, tap targets 44px or more, no horizontal scroll at 360px. Pt-BR text runs about 20% longer, so no fixed-width text boxes.

## Elevation & Depth

Flat by default. Depth comes from hairline borders and the Raised Graphite fill. One shadow exists, only for the command palette (`0 24px 64px rgba(0,0,0,.5)`).

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. No glow, no glass, no blur, no decorative shadow.

## Shapes

Small and square-leaning: 4px for buttons, inputs and tags; 8px for the terminal bar and palette. Nothing pill-shaped, nothing over-rounded. 1px hairline borders. Decoration is CSS or SVG only (grid lines, a caret): no blobs, no orbs, no stock imagery. Icons are inline SVG, one set, 1.5px stroke, no emoji, no icon fonts. Photos are real, slightly imperfect, AVIF/WebP with dimensions.

## Components

### Buttons
- **Shape:** 4px radius, 48px tall (44px minimum tap), mono label.
- **Primary:** Electric Lime fill, On Lime text, padding 14px 24px. Only one per view. Hover (fine pointer only): `translateY(-1px)`. Press: `scale(0.97)` in 120ms. Focus: 2px lime outline, 3px offset. Disabled: 40% opacity.
- **Secondary:** transparent, 1px hairline, Bone White text; hover swaps the border to Bone White instantly (no color transition, to keep to transform and opacity).
- **Quiet / link:** underline offset 4px, Lime Ink; hover thickens underline.
- **Contact set:** Email (mailto with prefilled subject), LinkedIn, GitHub, and "copy email" with an inline "copied" state in success color (no alert).

### Terminal line (signature)
A Raised Graphite bar with a lime `>` prompt and a mono line that reads local time, weekday, language and visit state, compared to Belo Horizonte time. Caret blinks with CSS opacity. With JS off it shows one static sentence.

### Project entries
Big title, one honest line, mono tags, link. Hairline separators, no card box. Data from `content/projects.json`. Hover (fine pointer only): the title gets a lime underline slide.

### Navigation
Wordmark left; section links, language toggle and theme toggle right. Sticky, transparent, hairline appears on scroll. Mobile: full-screen menu with large type.

### Command palette
Ctrl/Cmd+K, Raised Graphite, 8px radius, the one shadow, focus-trapped, keyboard-first. Opening and closing it is instant (no animation): it is a keyboard action.

### Inputs / tags
Inputs only inside the palette: Raised Graphite fill, hairline border, 4px radius, lime focus ring. Tags: mono 12 to 13px, hairline border, 4px radius.

### Footer
One opinionated sentence (to write with Eduardo), "forget me" link, computed year, contact repeated.

## Motion

Principles (emil-design-eng): animate only when there is a purpose, make it fast and interruptible, never block reading or contact. Only `transform` and `opacity` are animated. No video backgrounds. UI motion stays at or under 250ms; entrances up to 600ms. Exits are faster than enters. Never animate keyboard-initiated actions. Hover effects run only under `@media (hover: hover) and (pointer: fine)`. Prefer CSS transitions over keyframes for anything that can be re-triggered. Everything honors `prefers-reduced-motion` (keep opacity fades, drop movement).

Easing: `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` for entering and feedback, `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)` for on-screen movement. Never `ease-in`. Never animate from `scale(0)`; start at `scale(0.95)` with opacity 0. Stagger 30 to 80ms.

| Effect | What it does | Library | Cost |
|---|---|---|---|
| Hover and press states | Primary lifts 1px; all pressables `scale(.97)` on press, 120 to 160ms | CSS | cheap |
| Hero intro sequence | Name letters rise in with a short stagger, then the terminal line types in; plays once, skipped on repeat visits and reduced motion | GSAP core | cheap |
| Loading animation | A short greeting/prompt under 1s that never gates content | CSS | cheap |
| Text reveals | Headings and lines translate up from a mask and fade in, split by line not by character | GSAP + ScrollTrigger | medium |
| Smooth scroll | Eased wheel scrolling, never traps scroll, off under reduced motion | Lenis | medium |
| Scroll-driven storytelling and pinned section | The work section pins and reveals projects one by one; mobile gets a simple fade via `gsap.matchMedia` | GSAP ScrollTrigger | medium |
| Page transitions | Cross-fade/slide between list and project page | View Transitions API (CSS) | cheap |
| Terminal caret | Opacity blink | CSS | cheap |
| **Parallax** | A few decorative elements drift at different speeds | ScrollTrigger scrub | **expensive** (cut 1st) |
| **Cursor effects** | Magnetic buttons and a soft cursor follower, desktop fine pointer only | GSAP `quickTo` | **expensive** (cut 2nd) |
| **Kinetic name** | Each letter shifts with pointer proximity using per-letter `translate`, `skewX` and `scaleY`; springy, interruptible | GSAP `quickTo` | **expensive** (cut 3rd) |

Cut order if over budget: parallax, cursor effects, kinetic name reaction, then the pinned section. Each has a static fallback.

Decision (confirmed): the kinetic name is transform-only. Variable-font axes (`wght`, `wdth`) are never animated, because that changes glyph widths and repaints text. The variable font is used for static weights and widths only.

## Do's and Don'ts

### Do:
- **Do** keep lime to one job per screen: the primary action or the live terminal line.
- **Do** write human words in the grotesque and machine words in mono.
- **Do** give the best project twice the space and break the grid once.
- **Do** use real photos and real repos; mark gaps `[TODO]`, never filler.
- **Do** keep first-load JS under 120 kB gzip, CSS under 30 kB, hero image under 150 kB, no image over 200 kB, two font families max.
- **Do** use only GSAP core, ScrollTrigger and Lenis for motion; load ScrollTrigger, Lenis and the palette on idle or first interaction.
- **Do** keep a visible `:focus-visible` ring, skip link, landmarks and a no-JS fallback.

### Don't:
- **Don't** use gradients, gradient text, glow, glassmorphism or blur.
- **Don't** animate anything but `transform` and `opacity`, or use video backgrounds.
- **Don't** animate keyboard actions (the palette) or use `ease-in`.
- **Don't** add jQuery, icon fonts, UI kits, third-party scripts or trackers.

## This site is NOT

- A centered hero with a gradient blob and three identical rounded cards.
- Purple-to-blue gradients, gradient headings, glow shadows, glassmorphism.
- Emoji icons, "Hi, I'm X 👋", "welcome to my portfolio", "passionate", "innovative".
- Fake testimonials, client logos, metrics or "X years of experience".
- A uniform three-column project grid or evenly spaced sections.
- A clone of any reference site's layout (sticky-left sidebar, preloader greeting loop) or its assets or copy.
- Over-rounded everything, decorative blobs, stock photography, a hero video.
- Heavy by default: no 3D scene, no autoplay audio, no analytics.
- Pretending to be bigger than it is: it says "practice builds, real clients next".
