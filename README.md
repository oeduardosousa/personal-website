# oeduardosousa.com

Personal site of Eduardo Sousa. Static [Astro](https://astro.build) site, no backend, no database, no tracking. Target host: Cloudflare Pages.

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
| Fonts (self-hosted, Latin subset) | `public/fonts/` + `src/styles/fonts.css` |

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
