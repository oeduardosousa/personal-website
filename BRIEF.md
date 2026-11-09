# BRIEF.md: oeduardosousa.com

## Business
Personal website of Eduardo Sousa, web developer in Belo Horizonte, Brazil (GMT-3). Repo: https://github.com/oeduardosousa/personal-website.

## Audience
Primary: recruiters, employers and people who might commission freelance work. Secondary: curious visitors who want to know who he is.

## Goals
Present and sell Eduardo. Success = a visitor contacts him (email, LinkedIn, GitHub) or leaves knowing who he is. Contact is one step away on every screen.

## Content (facts only, see CONTENT.md; gaps stay `[TODO]`)
- Builds websites and interactive systems. Portfolios only so far: no client work yet. The site never claims clients, testimonials, metrics or years of experience.
- Projects: cine-scope (React movie guide), devboard (project dashboard), plus Vercel practice builds still to be described: simulador-enem, advocacy, real-estate, waterproofing, beauty-salon, barber-shop-portfolio.
- Tools: GitHub, VS Code, Cloudflare, Claude Code. Languages to confirm: JavaScript, React, Python, C, HTML.
- Story: parents enrolled him in a technical program alongside high school; he kept researching the field alone and loved it. Wants to be a reference in the field someday.
- Outside code, kept abstract: family, friends, studying, volunteering, soccer.
- Contact: oeduardosousa.dev@gmail.com, https://www.linkedin.com/in/eduardo-sousa-528b77334, https://github.com/oeduardosousa. City only; no phone, WhatsApp or address.

## Features
Bilingual (EN + pt-BR, browser detection + manual toggle); data-driven projects; terminal line reacting to local time, language and returning visits (localStorage, "forget me" link); command palette; one easter egg; kinetic name; GSAP/Lenis motion with reduced-motion support; contact buttons with copy-email.

## Acceptance criteria
- Both languages switch; adding a project needs one JSON entry plus one image.
- Works with JS off, storage blocked and offline APIs.
- WCAG AA, keyboard-only, visible focus, no horizontal scroll at 360px.
- Lighthouse mobile 95+; every budget in CLAUDE.md met.
- No banned phrases from VOICE.md.

## Stack and deployment
Astro static, GSAP core + ScrollTrigger + Lenis, Cloudflare Pages, domain oeduardosousa.com. Nothing is published without my approval.

## Assumptions
Dark base with light mode via `prefers-color-scheme`. Fonts: Bricolage Grotesque + JetBrains Mono.

## Open questions
One-sentence role and what to be hired for; flagship project and differentiator; what "reference" means; confirmed skills list; live URLs and screenshots; portrait and casual photo; footer sentence.
