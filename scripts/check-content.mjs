// Validates content/*.json and lists every open [TODO]. Exit 1 on structural errors.
import { readFileSync, existsSync } from "node:fs";

const read = (f) => JSON.parse(readFileSync(new URL(`../content/${f}`, import.meta.url), "utf8"));
const en = read("en.json");
const pt = read("pt.json");
const projects = read("projects.json");
const errors = [];

// 1. en/pt must have identical shape (same keys, same list lengths).
function shape(a, b, path = "") {
  if (Array.isArray(a) !== Array.isArray(b)) return errors.push(`${path}: array vs non-array`);
  if (Array.isArray(a)) {
    if (a.length !== b.length) errors.push(`${path}: en has ${a.length} items, pt has ${b.length}`);
    a.forEach((v, i) => typeof v === "object" && v && shape(v, b[i] ?? {}, `${path}[${i}]`));
    return;
  }
  if (a && typeof a === "object") {
    for (const k of new Set([...Object.keys(a), ...Object.keys(b ?? {})])) {
      if (!(k in a)) errors.push(`${path}.${k}: missing in en.json`);
      else if (!b || !(k in b)) errors.push(`${path}.${k}: missing in pt.json`);
      else shape(a[k], b[k], `${path}.${k}`);
    }
  }
}
shape(en, pt);
if (JSON.stringify(en.links) !== JSON.stringify(pt.links)) errors.push("links must be identical in en.json and pt.json");

// 2. Projects: required fields, unique ids, images exist.
const ids = new Set();
for (const p of projects) {
  const where = `projects.json[${p.id ?? "?"}]`;
  if (!p.id) errors.push(`${where}: missing id`);
  if (ids.has(p.id)) errors.push(`${where}: duplicate id`);
  ids.add(p.id);
  if (!p.title) errors.push(`${where}: missing title`);
  else if (typeof p.title !== "string" && (!p.title.en || !p.title.pt)) errors.push(`${where}: title needs en and pt`);
  if (!p.summary?.en || !p.summary?.pt) errors.push(`${where}: summary needs en and pt`);
  if (p.image) {
    if (!p.image.src) errors.push(`${where}: image.src missing`);
    else if (!existsSync(new URL(`../public/assets/projects/${p.image.src}`, import.meta.url)))
      errors.push(`${where}: public/assets/projects/${p.image.src} not found`);
    if (!p.image.alt?.en || !p.image.alt?.pt) errors.push(`${where}: image.alt needs en and pt`);
  }
}

// 3. Report open TODOs.
const todos = [];
(function walk(v, path) {
  if (typeof v === "string") { if (v.includes("[TODO")) todos.push(`${path}: ${v}`); }
  else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${path}[${i}]`));
  else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) walk(x, `${path}.${k}`);
})({ en, pt }, "");
for (const p of projects) {
  if (p.published === false) continue;
  if (p.todo?.length) todos.push(`projects.json[${p.id}]: ${p.todo.join(", ")}`);
}
const unpublished = projects.filter((p) => p.published === false).map((p) => p.id);

console.log(`projects: ${projects.length - unpublished.length} published, ${unpublished.length} hidden (${unpublished.join(", ") || "none"})`);
console.log(`open [TODO]s: ${todos.length}`);
todos.forEach((t) => console.log(`  - ${t}`));
if (errors.length) {
  console.error(`\n${errors.length} error(s):`);
  errors.forEach((e) => console.error(`  x ${e}`));
  process.exit(1);
}
console.log("\ncontent OK");
