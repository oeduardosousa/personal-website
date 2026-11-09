# CLAUDE.md: oeduardosousa.com

Personal site of Eduardo Sousa. Read BRIEF.md and DESIGN.md before building. Voice rules are in VOICE.md.

## Stack
Astro (static output), plain CSS with tokens, GSAP core + ScrollTrigger + Lenis for motion, Cloudflare Pages. No database, backend, forms, login, checkout or tracking. Use the stack in BRIEF.md.

## Rules
- All copy, links, projects and images live in `content/*.json` and `public/assets`. No hardcoded years, "latest" or strings in components.
- English at `/`, pt-BR at `/pt/`. Every string exists in both.
- Never invent facts about me, projects, clients, testimonials or claims. Mark gaps `[TODO]`.
- Commit each verified step with a clear message. Test before committing.
- Never push or force-push. Get my approval before any production change.
- Never commit `.env*` or secrets; never expose them in code, logs, bundles or chat.
- Use emil-design-eng for animation and interaction; Impeccable for design and UI audits.
- Keep CONTENT.md private notes (club names, volunteer projects) off the site and out of commits.

## Performance budget
First-load JS under 120 kB gzip, CSS under 30 kB, hero image under 150 kB, no image over 200 kB. Max 2 font families, WOFF2, self-hosted, subset to Latin + pt-BR. No jQuery, icon fonts, UI kits, third-party scripts or trackers. Ask me before adding any dependency and state its size. Heavy effects need a static fallback.
