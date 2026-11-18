<div align="center">

# oeduardosousa.com

**My personal website.** Who I am, what I build, and how to reach me.

[![Visit the site](https://img.shields.io/badge/Visit-oeduardosousa.com-111?style=for-the-badge&logo=cloudflare&logoColor=white)](https://oeduardosousa.com)

![Astro](https://img.shields.io/badge/Astro-BC52EE?style=flat-square&logo=astro&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=flat-square&logo=greensock&logoColor=black)
![Cloudflare Pages](https://img.shields.io/badge/Cloudflare_Pages-F38020?style=flat-square&logo=cloudflare&logoColor=white)

<img src="public/og.png" alt="Preview of oeduardosousa.com" width="820">

</div>

## Highlights

- **Bilingual:** English and Brazilian Portuguese, with browser detection and a manual toggle.
- **Data-driven projects:** adding a project takes one JSON entry and one image.
- **Command palette** (`Ctrl/Cmd + K`) and a terminal line that reacts to your local time and return visits.
- **Smooth, careful motion** with GSAP and Lenis, and full support for reduced motion.
- **Works without JavaScript**, with storage blocked, and offline.
- **Built for accessibility:** WCAG AA as the target, keyboard friendly, no tracking, no backend, no database.

Static [Astro](https://astro.build) site, hosted on Cloudflare Pages. Below are the developer notes.

---

```bash
npm install
npm run dev            # http://localhost:4321
npm run build          # static output in dist/
npm run check:content  # validate content/*.json and list open [TODO]s
```

## Where things live

| What | Where |
|---|---|
| English copy | `content/en.json` |
| Portuguese (pt-BR) copy | `content/pt.json` |
| Projects (both languages) | `content/projects.json` |
| Project images | `public/assets/projects/` |
| Design tokens (CSS variables) | `src/styles/tokens.css` |
| Fonts (self-hosted, subset WOFF2, hashed at build) | `src/assets/fonts/` + `src/styles/fonts.css` (licenses in `public/fonts/`) |

Every string, link, project and image comes from those files. Components never hardcode copy. The footer year is computed.

**Languages.** English lives at `/`, Portuguese at `/pt/`. On first visit the browser language picks one (only when arriving from outside the site). The `PT`/`EN` link in the header is the manual toggle and the choice is remembered in `localStorage`. With JS off or storage blocked, the toggle is still a plain link.

## How to add a project in 2 minutes

No code edits.

1. **Image.** Save a screenshot in `public/assets/projects/`, for example `my-project.webp`. Use 16:10 (for example 1600x1000), under 200 kB.
2. **JSON.** Add one object to `content/projects.json`. The order in the file is the order on the page.

   ```json
   {
     "id": "my-project",
     "published": true,
     "featured": false,
     "title": "my-project",
     "summary": {
       "en": "One honest line, in English.",
       "pt": "Uma linha honesta, em português."
     },
     "tags": ["React", "JavaScript"],
     "links": {
       "repo": "https://github.com/oeduardosousa/my-project",
       "live": "https://my-project.example.com"
     },
     "image": {
       "src": "my-project.webp",
       "alt": { "en": "What the screenshot shows", "pt": "O que a imagem mostra" }
     },
     "todo": []
   }
   ```

3. **Check.** Run `npm run check:content`. It catches a missing translation, a duplicate id, or an image path that does not exist. Then `npm run dev` and look at `/` and `/pt/`.

Notes:
- `image`, `links.repo` and `links.live` can be `null`. Nothing is rendered for a `null`.
- `todo` is a list of what is still missing. If it is not empty, the page shows a visible `[TODO] ...` line. Set it to `[]` when done.
- `published: false` keeps an entry in the file but off the page. Flip it to `true` when it is ready.
- Never claim clients, results or testimonials. These are practice builds until the day they are not.

## Open gaps

`npm run check:content` lists every open `[TODO]` (copy and projects). Gaps are never filled with invented text.

## Motion

Follows the Motion section of `DESIGN.md`. Only `transform` and `opacity` animate.

- `src/scripts/hero.js`: hero intro (plays once, remembered in `localStorage`) and the kinetic name. GSAP core only, in the first load.
- `src/scripts/scroll.js`: Lenis smooth scroll, ScrollTrigger, line-by-line heading reveals and the pinned work section. Loaded on idle or first interaction.
- `gsap.matchMedia` splits desktop, phone and `prefers-reduced-motion`: phones get simple fades, reduced motion gets opacity-only fades and no smooth scroll.
- The work section only pins when it fits the viewport; otherwise each project fades in as it arrives.

## Dynamic layer

Client-side only. No network calls, no tracking. Code in `src/scripts/dynamic.js` and `src/scripts/palette.js`; every string lives under `dynamic` in `content/en.json` and `content/pt.json`.

- The terminal line compares the visitor's local time with Belo Horizonte (`America/Sao_Paulo`), remembers visits in `localStorage` (try/catch everywhere) and reacts to tab return and idle. "forget me" in the footer clears it.
- `Ctrl/Cmd+K` opens the command palette (native `<dialog>`). Sections and projects are read from the page, so new projects show up automatically.
- With JS off, the terminal shows one static sentence and JS-only controls stay hidden.
