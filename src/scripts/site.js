// Always-on behavior: language/theme toggles, menu, copy email, header hairline, year.
// Heavy motion (ScrollTrigger, SplitText, Lenis) loads later from scroll.js on idle or first interaction.
import { initHero } from "./hero.js";

const root = document.documentElement;
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];
const store = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* blocked: fine */ } },
};

// Language toggle: the link already points at the other language (works without JS).
$$("[data-lang-toggle]").forEach((link) => {
  link.addEventListener("click", () => {
    store.set("lang", link.dataset.langToggle);
    if (location.hash) link.setAttribute("href", link.getAttribute("href") + location.hash);
  });
});

// Theme toggle: flips whatever is currently showing and remembers it.
$("[data-theme-toggle]")?.addEventListener("click", () => {
  const dark = root.dataset.theme
    ? root.dataset.theme === "dark"
    : !matchMedia("(prefers-color-scheme: light)").matches;
  const next = dark ? "light" : "dark";
  root.dataset.theme = next;
  store.set("theme", next);
});

// Footer year is computed, never hardcoded. (The build-time value is only the no-JS fallback.)
$$("[data-year]").forEach((el) => { el.textContent = String(new Date().getFullYear()); });

// Header gets a hairline once the page has scrolled.
const header = $("[data-header]");
const onScroll = () => header?.classList.toggle("is-scrolled", window.scrollY > 8);
addEventListener("scroll", onScroll, { passive: true });
onScroll();

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
  const legacyCopy = (text) => {
    const ta = Object.assign(document.createElement("textarea"), { value: text });
    ta.setAttribute("readonly", "");
    ta.style.cssText = "position:fixed;opacity:0;top:0;left:0";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch (e) {}
    ta.remove();
    return ok;
  };
  copyBtn.addEventListener("click", async () => {
    const text = copyBtn.dataset.copy;
    let ok = false;
    try { await navigator.clipboard.writeText(text); ok = true; } catch (e) { ok = legacyCopy(text); }
    doneLabel.textContent = ok ? okText : copyBtn.dataset.failed;
    copyBtn.dataset.state = ok ? "copied" : "failed";
    if (status) status.textContent = doneLabel.textContent;
    clearTimeout(timer);
    timer = setTimeout(() => { delete copyBtn.dataset.state; if (status) status.textContent = ""; }, 2000);
  });
}

// Hero: intro + kinetic name (GSAP core only).
initHero();

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
