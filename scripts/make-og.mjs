// Builds public/og.png (1200x630), the link-preview image. Language-neutral: name and domain only.
// Run: node scripts/make-og.mjs. Uses sharp, which Astro already installs.
// Text is drawn in system fonts (the WOFF2 faces cannot be read by the SVG renderer).
// Swap this for a real portrait card when the photo exists.
import sharp from "sharp";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const en = JSON.parse(readFileSync(new URL("../content/en.json", import.meta.url), "utf8"));
const domain = new URL(JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")).homepage ?? "https://oeduardosousa.com").hostname;

const [first, ...others] = en.name.split(" ");
const rest = others.join(" ");
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0B0C0E"/>
  <text x="80" y="330" font-family="Arial Black, Arial, Helvetica, sans-serif" font-weight="900" font-size="150" letter-spacing="-4" fill="#F2F1EC">${first}</text>
  <text x="80" y="470" font-family="Arial Black, Arial, Helvetica, sans-serif" font-weight="900" font-size="150" letter-spacing="-4" fill="#F2F1EC">${rest}</text>
  <rect x="80" y="510" width="120" height="8" fill="#C6F432"/>
  <text x="80" y="580" font-family="Consolas, Courier New, monospace" font-size="32" fill="#9A9CA3">${domain}</text>
</svg>`;

await sharp(Buffer.from(svg)).png({ palette: true, compressionLevel: 9 }).toFile(fileURLToPath(new URL("../public/og.png", import.meta.url)));
console.log(`og.png written for ${en.name} (${domain})`);
