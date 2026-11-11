// Generated at build time from `site` in astro.config.mjs. Each language lists the other as an alternate.
const paths = { en: "/", "pt-BR": "/pt/" };

export function GET({ site }) {
  const abs = (p) => new URL(p, site).href;
  const alternates = [
    ...Object.entries(paths).map(
      ([lang, p]) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${abs(p)}"/>`
    ),
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(paths.en)}"/>`,
  ].join("\n");

  const urls = Object.values(paths)
    .map((p) => `  <url>\n    <loc>${abs(p)}</loc>\n${alternates}\n  </url>`)
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
