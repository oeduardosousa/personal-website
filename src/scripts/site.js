// Always-on behavior: language/theme toggles, menu, copy email, header hairline, year, dynamic layer.
// Heavy motion (ScrollTrigger, SplitText, Lenis) and the command palette load later, on demand.
import { initHero } from "./hero.js";
import { initDynamic } from "./dynamic.js";
import { store, currentTheme, copyText } from "./util.js";

const root = document.documentElement;
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];

// Strings and facts for the dynamic layer come from content/*.json via a JSON block in the page.
let dyn = null;
try { dyn = JSON.parse($("#dyn")?.textContent || "null"); } catch (e) { /* page still works */ }

// Language toggle: the link already points at the other language (works without JS).
$$("[data-lang-toggle]").forEach((link) => {
  link.addEventListener("click", () => {
    store.set("lang", link.dataset.langToggle);
    if (location.hash) link.setAttribute("href", link.getAttribute("href") + location.hash);
  });
});

// Theme toggle: flips whatever is currently showing and remembers it.
$("[data-theme-toggle]")?.addEventListener("click", () => {
  const next = currentTheme() === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  store.set("theme", next);
  document.dispatchEvent(new CustomEvent("themechange", { detail: next }));
});

// Footer year is computed, never hardcoded. (The build-time value is only the no-JS fallback.)
$$("[data-year]").forEach((el) => { el.textContent = String(new Date().getFullYear()); });

// Header gets a hairline once the page has scrolled.
const header = $("[data-header]");
const progress = $("[data-progress]");
const onScroll = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 8);
  if (progress) {
    const max = root.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
  }
};
addEventListener("scroll", onScroll, { passive: true });
onScroll();

// The nav marks the section crossing the middle of the screen.
if ("IntersectionObserver" in window) {
  const navLinks = new Map($$("[data-nav] a[href^='#']").map((a) => [a.getAttribute("href").slice(1), a]));
  const spy = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      const link = navLinks.get(e.target.id);
      if (!link) return;
      if (e.isIntersecting) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    }),
    { rootMargin: "-50% 0px -50% 0px" },
  );
  navLinks.forEach((_, id) => { const el = document.getElementById(id); if (el) spy.observe(el); });
}

// Small drawings: loops rest while off screen (.is-off), one-time entrances play on first sight (.is-seen).
const anims = $$("[data-anim]");
if ("IntersectionObserver" in window) {
  const watch = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      e.target.classList.toggle("is-off", !e.isIntersecting);
      if (e.intersectionRatio >= 0.4) e.target.classList.add("is-seen");
    }),
    { threshold: [0, 0.4] },
  );
  anims.forEach((el) => watch.observe(el));
} else {
  anims.forEach((el) => el.classList.add("is-seen"));
}

// The ball in About hops when tapped. Decorative: nothing depends on it.
const ball = $("[data-ball]");
ball?.addEventListener("pointerdown", () => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  ball.firstElementChild.animate(
    [
      { transform: "translateY(0) rotate(0deg)", easing: "ease-out" },
      { transform: "translateY(-24px) rotate(60deg)", easing: "ease-in", offset: 0.34 },
      { transform: "translateY(0) rotate(116deg)", easing: "ease-out", offset: 0.68 },
      { transform: "translateY(-6px) rotate(132deg)", easing: "ease-in", offset: 0.84 },
      { transform: "translateY(0) rotate(144deg)" }, // 144deg = two fifths of a turn: the ball looks the same at rest
    ],
    { duration: 720 },
  );
});

// Mobile full-screen menu.
const btn = $("[data-menu-btn]");
const nav = $("[data-nav]");
const inertTargets = $$("main, footer");
function setMenu(open) {
  if (!btn || !nav) return;
  btn.setAttribute("aria-expanded", String(open));
  nav.classList.toggle("is-open", open);
  root.classList.toggle("menu-open", open);
  inertTargets.forEach((el) => { el.inert = open; });
  root.dispatchEvent(new CustomEvent("scrolllock", { detail: open }));
}
btn?.addEventListener("click", () => setMenu(btn.getAttribute("aria-expanded") !== "true"));
nav?.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
$("[data-contact-link]")?.addEventListener("click", () => setMenu(false));
addEventListener("keydown", (e) => {
  if (e.key === "Escape" && btn?.getAttribute("aria-expanded") === "true") { setMenu(false); btn.focus(); }
});
matchMedia("(min-width: 960px)").addEventListener("change", (e) => { if (e.matches) setMenu(false); });

// Copy email, with inline feedback (no alert). Hidden in markup until JS can do it.
const copyBtn = $("[data-copy]");
if (copyBtn) {
  copyBtn.hidden = false;
  const status = $("[data-copy-status]");
  const doneLabel = copyBtn.querySelector(".btn__done");
  const okText = doneLabel.textContent;
  let timer;
  copyBtn.addEventListener("click", async () => {
    const ok = await copyText(copyBtn.dataset.copy);
    doneLabel.textContent = ok ? okText : copyBtn.dataset.failed;
    copyBtn.dataset.state = ok ? "copied" : "failed";
    if (status) status.textContent = doneLabel.textContent;
    clearTimeout(timer);
    timer = setTimeout(() => { delete copyBtn.dataset.state; if (status) status.textContent = ""; }, 2000);
  });
}

// Hero: intro + kinetic name (GSAP core only).
initHero();

// Dynamic layer: terminal line, memory, reactions, forget me, easter egg.
if (dyn) {
  try { initDynamic(dyn); } catch (e) { /* the static line stays */ }
}

// Command palette: the shortcut listens from the start; the palette itself loads on first use.
if (dyn) {
  const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  let palette;
  const load = () => (palette ??= import("./palette.js").then((m) => { m.initPalette(dyn); return m; }));
  const open = () => load().then((m) => m.openPalette()).catch(() => { palette = null; });
  // Warm it up on idle so the first Ctrl/Cmd+K is instant and no typed letters are lost.
  ("requestIdleCallback" in window ? requestIdleCallback : (fn) => setTimeout(fn, 1500))(() => load().catch(() => { palette = null; }));
  addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey && e.key.toLowerCase() === "k") {
      e.preventDefault();
      open();
    }
  });
  const trigger = $("[data-palette-open]");
  if (trigger) {
    trigger.hidden = false;
    trigger.querySelector("[data-palette-key]").textContent = isMac ? "⌘K" : "Ctrl K";
    trigger.addEventListener("click", open);
  }
}

// Scroll motion: load on idle or the first interaction, whichever comes first.
let started = false;
function startScroll() {
  if (started) return;
  started = true;
  ["pointerdown", "keydown", "wheel", "touchstart", "scroll"].forEach((ev) => removeEventListener(ev, startScroll));
  import("./scroll.js").then((m) => m.initScroll()).catch(() => { /* page works without it */ });
}
["pointerdown", "keydown", "wheel", "touchstart", "scroll"].forEach((ev) =>
  addEventListener(ev, startScroll, { passive: true, once: true }),
);
("requestIdleCallback" in window ? requestIdleCallback : (fn) => setTimeout(fn, 300))(startScroll);
setTimeout(startScroll, 2500); // safety net if idle never fires
