# DESIGN.md — oeduardosousa.com

Direction: **Dark terminal, loud name.** Dark and technical, with one loud accent, a huge type-led hero, mono details and dry jokes in microcopy. Sells a person, not a template. Contact is always one step away.

Sources: PRODUCT.md, VOICE.md, CONTENT.md, PLAYBOOK.md, WORKFLOW-EDUARDO.md, plus the reference research (principles only, nothing copied: Brittany Chiang, Rauno Freiberg, Dennis Snellenberg, Josh Comeau, Linear, Lusion).
Note: CLAUDE.md and BRIEF.md did not exist when this was written; the budget below comes from WORKFLOW-EDUARDO.md Phase 1.3 and must match CLAUDE.md once it is created.

Open decisions (single-token changes, see bottom): accent hue, final display font after a hero test.

---

## 1. Visual direction

- Near-black warm base, off-white text, ONE loud accent used sparingly (CTA, live terminal line, focus ring, hover, selection).
- Type does the hierarchy. No card boxes as default; hairlines and whitespace instead.
- Asymmetric layout. Best project gets 2x the space. Break the grid once on purpose.
- Proof is real: repos, builds, the live terminal line. Never fake clients, metrics or testimonials ("practice builds, real clients next").
- Humor is small and lives in microcopy (VOICE.md rule 4). One joke per section max.

## 2. Color (tokens; dark is default, light via `prefers-color-scheme` + manual toggle)

| Token | Dark | Light | Role |
|---|---|---|---|
| `--bg` | `#0B0C0E` | `#F4F3EE` | page background |
| `--surface` | `#131417` | `#EAE9E3` | raised areas (terminal box, palette) |
| `--border` | `#26272C` | `#D5D4CD` | hairlines, dividers |
| `--text` | `#F2F1EC` | `#0E0F11` | headings, body (about 17:1 / 17:1 on bg) |
| `--text-muted` | `#9A9CA3` | `#55575E` | secondary text, labels (about 7:1 / 6.5:1) |
| `--accent` | `#C6F432` | `#C6F432` | primary button fill, terminal prompt, focus ring, highlights |
| `--accent-ink` | `#C6F432` | `#3F6200` | accent used AS TEXT or link (light mode needs the darker value for 4.5:1) |
| `--on-accent` | `#0B0C0E` | `#0B0C0E` | text on accent fill (about 15:1) |
| `--success` | `#5FD38A` | `#1F7A45` | "copied", available |
| `--warning` | `#F5B84B` | `#8A5A00` | caution states |
| `--error` | `#FF6B5E` | `#B42318` | errors |

Rules: one accent only. Accent never as a gradient. No purple-blue gradients, no glow shadows, no glassmorphism. Text contrast at least 4.5:1, large text at least 3:1; verify in the audit pass.

## 3. Typography

Two families only, self-hosted WOFF2, subset to Latin + pt-BR (ã, õ, ç, á, é, í, ó, ú, â, ê, ô, à), `font-display: swap`.

- **Display / body:** Bricolage Grotesque (variable: weight, width, optical size; OFL). Variable axes drive the cursor-reactive name. Not Inter/Roboto/Poppins. Fallback: system sans.
- **Mono:** JetBrains Mono (variable or two weights, OFL). Terminal line, labels, tags, meta, buttons' small caps text, microcopy.

Scale (fluid with `clamp`, mobile to desktop):

| Token | Size | Line height | Use |
|---|---|---|---|
| `--fs-hero` | `clamp(3.5rem, 14vw, 12rem)` | 0.9 | the kinetic name only |
| `--fs-h1` | `clamp(2.5rem, 6vw, 5rem)` | 1.0 | section titles |
| `--fs-h2` | `clamp(1.75rem, 3.5vw, 2.75rem)` | 1.1 | project titles |
| `--fs-h3` | `1.375rem` | 1.25 | sub-heads |
| `--fs-body` | `1.0625rem` (17px) | 1.55 | body, 60 to 70ch max |
| `--fs-small` | `0.9375rem` | 1.5 | captions |
| `--fs-mono` | `0.875rem` | 1.5 | terminal, labels |

Weights in use: 400, 500, 700 (display up to 800 for the hero). Letter-spacing: tight on big sizes (about -0.02em), +0.04em on uppercase mono labels. Body min 16px.

## 4. Spacing, layout, shape

- 4px base scale: `--s-1:4 --s-2:8 --s-3:12 --s-4:16 --s-5:24 --s-6:32 --s-7:48 --s-8:64 --s-9:96 --s-10:160` (px).
- Section vertical rhythm varies on purpose: `--s-9` to `--s-10`, not uniform.
- Content width: text column max `68ch`; wide max `1280px`; hero may bleed edge to edge. Page gutter: 16px mobile, 32px tablet, 48px desktop.
- Layout: 12-col grid on desktop, mixed alignments (left, right-offset), one deliberate grid break. Best project spans about 8 cols, others 4. Not a uniform 3-col card grid.
- Radius: `--r-sm: 4px` (buttons, inputs, tags), `--r-md: 8px` (terminal box, palette). Nothing pill-shaped except nothing. Over-rounding is banned.
- Depth: none by default. Hairline borders. One allowed shadow, only for the command palette: `0 24px 64px rgba(0,0,0,.5)`.
- Borders: 1px `--border`.

## 5. Components

- **Button primary:** fill `--accent`, text `--on-accent`, mono 14px, 48px min height (44px min tap), radius 4. Hover: translateY(-1px) + brightness up; press: scale(.97) in 100ms. Focus: 2px `--accent` outline, 3px offset. Disabled: 40% opacity, no pointer.
- **Button secondary:** transparent, 1px `--border`, text `--text`; hover border `--text`.
- **Button quiet / link:** underline offset 4px, color `--accent-ink`; hover underline thickens.
- **Contact buttons:** Email (mailto with prefilled subject), LinkedIn, GitHub, "copy email" with inline "copied" state (`--success`, no alert). Only the first is primary.
- **Terminal line:** mono, `--surface` bar with `>` prompt in `--accent`, blinking caret (CSS, off under reduced motion), reads local time, language and visit state. Static fallback sentence when JS is off.
- **Project entry:** big title, one honest line, mono tags, link. Hairline separators, no card box. Hover: title shifts accent. Data from `content/projects.json`.
- **Navigation:** minimal: wordmark left, section links + language toggle + theme toggle right. Sticky, transparent over `--bg`, hairline below on scroll. Mobile: simple full-screen menu, big type.
- **Inputs:** only inside the command palette (search). `--surface` fill, 1px border, radius 4, accent focus ring.
- **Command palette (Ctrl/Cmd+K):** `--surface`, radius 8, the one shadow, focus-trapped, keyboard-first.
- **Footer:** one opinionated sentence (to be written with Eduardo), "forget me" link, computed year. Contact repeats here.
- **Tags/labels:** mono 12-13px uppercase, 1px border, radius 4.

## 6. Imagery and icons

- Real photos only: 1 portrait, 1 casual. AVIF/WebP, dimensions set. A slightly imperfect crop beats stock polish.
- Project screenshots in plain frames (hairline border). No device-mockup stock.
- Icons: inline SVG, one set, 1.5px stroke, minimal (arrow, copy, check, globe). No emoji as icons. No icon fonts.
- Decoration via CSS/SVG (grid lines, a caret, noise-free). No blobs, no gradient orbs, no video backgrounds.

## 7. Responsive

- Mobile first. Breakpoints: 640, 960, 1280.
- Mobile: hero name scales with `vw`, wraps to two lines, terminal line sits below. Nav becomes a menu. Projects stack, best one first.
- Tap targets 44px+. No horizontal scroll at 360px.
- Effects: `gsap.matchMedia`: desktop gets cursor effects and pinning, mobile gets fades only.

## 8. Accessibility

- WCAG AA contrast; verified per token pair.
- Visible `:focus-visible` ring on everything interactive; keyboard-only operation; skip link; landmarks; real `lang` per language.
- `prefers-reduced-motion`: disable kinetic name reaction, parallax, pinning, caret blink; keep instant state changes.
- `prefers-color-scheme` honored, manual toggle wins and is remembered (try/catch storage).
- Works without JS (static content, static terminal sentence, links work).
- Both languages first-class; text expands about 20% in pt-BR, so no fixed-width text boxes.

## 9. Motion

Principles (emil-design-eng): purposeful, fast, interruptible. UI feedback 100 to 250ms, ease-out; entrances up to 600ms. Animate only `transform` and `opacity`. Nothing blocks reading or contact. 60fps on a mid phone. Easing tokens: `--ease-out: cubic-bezier(.22,1,.36,1)`, `--ease-in-out: cubic-bezier(.65,0,.35,1)`.

| Effect | Library | Cost | Notes |
|---|---|---|---|
| Hover / press states | CSS | cheap | 120 to 200ms |
| Hero intro: name letters stagger up, terminal line types in | GSAP core | cheap | once per load; skipped if reduced motion |
| Loading animation | CSS | cheap | short (under 1s) greeting/prompt, never gates content; skip on repeat visit |
| Text reveals on scroll | GSAP + ScrollTrigger | medium | lines fade/translate in; split by line, not by char |
| Smooth scroll | Lenis | medium | disabled under reduced motion, never traps scroll |
| Scroll-driven storytelling / pinned work section | GSAP ScrollTrigger | medium | one pinned moment only; mobile gets simple fade |
| Page transitions (project pages) | View Transitions API (CSS) | cheap | falls back to none; no extra library |
| Hover states on projects (title shifts, image follows slightly) | CSS + tiny JS | cheap | |
| **Cursor-reactive variable-font name** | GSAP `quickTo` + variable font axes | **expensive** | desktop pointer only; cut first |
| **Cursor effects (custom cursor, magnetic buttons)** | GSAP `quickTo` | **expensive** | desktop pointer only; cut second |
| **Parallax** | ScrollTrigger scrub | **expensive** | few elements, desktop only; cut third |

Cut order if over budget: parallax, cursor effects, kinetic name reaction, then pinned section. Heavy effects need a static fallback. Allowed libraries: GSAP core + ScrollTrigger + Lenis only. Load ScrollTrigger, Lenis and the palette on idle/first interaction.

## 10. Performance (from the workflow's budget)

First-load JS under 120 kB gzip, CSS under 30 kB, hero image under 150 kB, no image over 200 kB. Max 2 font families, WOFF2, self-hosted, subset. No jQuery, icon fonts, UI kits, third-party scripts or trackers. Preload only the hero font and hero image.

## 11. This site is NOT

- A centered hero with a gradient blob and three identical rounded cards.
- Purple-to-blue gradients, gradient text, glow shadows, glassmorphism.
- Emoji icons, "Hi, I'm X 👋", "welcome to my portfolio".
- Fake testimonials, client logos, metrics or "X years of experience".
- A uniform 3-column project grid or uniform spacing between sections.
- A Brittany-style sticky-left clone, a jQuery/analytics-heavy build, or a copy of any reference site's layout, assets or text.
- Over-rounded everything, decorative blobs, stock photography.
- Heavy by default: no 3D scene, no video background, no autoplay audio.

## 12. Tokens to put in code (Phase 3.1)

CSS variables for everything in sections 2 to 4 and 9 (`--bg`, `--surface`, `--border`, `--text`, `--text-muted`, `--accent`, `--accent-ink`, `--on-accent`, status colors, `--fs-*`, `--s-*`, `--r-*`, easing). Pages use names, never raw values. Changing the accent hue means editing `--accent`, `--accent-ink` and `--on-accent` only.
