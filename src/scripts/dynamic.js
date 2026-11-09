// The "he knows" layer. Client-side only, no network, no tracking.
// Terminal line: local time vs Belo Horizonte, returning-visitor memory, tab return, idle, easter egg.
import { store, session, currentTheme } from "./util.js";
import { wave } from "./hero.js";

const BH_ZONE = "America/Sao_Paulo"; // Belo Horizonte, GMT-3
const KEYS = ["visits", "lastSection", "intro", "lang", "theme"];
const SECTIONS = ["what-i-do", "work", "about", "contact"];

export function initDynamic(dyn) {
  const el = document.querySelector("[data-terminal]");
  if (!el) return;

  const root = document.documentElement;
  const t = dyn.dynamic;
  let forgotten = false;

  // ---------- Memory (localStorage only) ----------
  let visits = parseInt(store.get("visits") || "0", 10) || 0;
  if (!session.get("counted")) {
    visits += 1;
    store.set("visits", String(visits));
    session.set("counted", "1");
  }
  const lastSection = store.get("lastSection");

  let current = null; // section currently in view
  let saveTimer = 0;
  const save = () => { if (!forgotten && current) store.set("lastSection", current); };
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) current = e.target.id; });
        clearTimeout(saveTimer);
        saveTimer = setTimeout(save, 1000);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    SECTIONS.forEach((id) => { const s = document.getElementById(id); if (s) io.observe(s); });
  }
  addEventListener("pagehide", save);

  // ---------- Building the line ----------
  const fill = (str, vars) => {
    const frag = document.createDocumentFragment();
    str.split(/(\{\w+\})/).forEach((part) => {
      const m = part.match(/^\{(\w+)\}$/);
      if (!m) { if (part) frag.append(part); return; }
      const v = vars[m[1]];
      frag.append(v instanceof Node ? v : String(v ?? ""));
    });
    return frag;
  };
  const join = (...frags) => {
    const out = document.createDocumentFragment();
    frags.forEach((f, i) => { if (i) out.append(" "); out.append(f); });
    return out;
  };

  function baseLine() {
    const now = new Date();
    const you = new Intl.DateTimeFormat(t.locale, { hour: "numeric", minute: "2-digit" }).format(now);
    const me = new Intl.DateTimeFormat(t.locale, { hour: "numeric", minute: "2-digit", timeZone: BH_ZONE }).format(now);
    const hour = parseInt(new Intl.DateTimeFormat("en-US", { hour: "numeric", hourCycle: "h23" }).format(now), 10);
    const weekdayName = new Intl.DateTimeFormat(t.locale, { weekday: "long" }).format(now);
    const day = now.getDay();

    let greet;
    if (hour < 5) greet = t.greet.night;
    else if (day === 0 || day === 6) greet = t.greet.weekend;
    else if (hour < 12) greet = t.greet.morning;
    else if (hour < 18) greet = t.greet.afternoon;
    else greet = t.greet.evening;

    // Returning visitors get their own opener (the time of day still shows in the clock).
    if (visits > 1 && hour >= 5) {
      const label = lastSection && dyn.sectionLabels[lastSection];
      if (visits >= 4) greet = t.returning.many;
      else if (label) greet = t.returning.seen;
      else greet = t.returning.plain;
    }

    const section = lastSection && dyn.sectionLabels[lastSection]
      ? Object.assign(document.createElement("a"), { href: "#" + lastSection, textContent: dyn.sectionLabels[lastSection] })
      : "";
    const clock = you === me ? t.clock.same : t.clock.diff;
    const parts = [fill(greet, { weekday: weekdayName, n: visits, section }), fill(clock, { you, me })];
    if (visits <= 1) parts.push(fill(t.theme[currentTheme()], {})); // first visit only
    return join(...parts);
  }

  // ---------- Rendering ----------
  let eventTimer = 0;
  let eventActive = false;
  let lastPlain = "";
  const plain = (frag) => frag.textContent;

  function setLine(frag) {
    lastPlain = plain(frag);
    el.replaceChildren(frag);
  }
  function renderBase() {
    if (eventActive) return;
    try {
      const frag = baseLine();
      if (plain(frag) !== lastPlain) setLine(frag); // skip identical text: no churn every tick
    } catch (e) { /* Intl missing: keep the static fallback */ }
  }
  function showEvent(text, ms) {
    clearTimeout(eventTimer);
    eventActive = true;
    setLine(fill(text, {}));
    if (ms) eventTimer = setTimeout(endEvent, ms);
  }
  function endEvent() {
    clearTimeout(eventTimer);
    if (!eventActive) return;
    eventActive = false;
    renderBase();
  }

  // First paint of the line. When the hero intro runs, type it in once after the intro.
  function typeIn() {
    let frag;
    try { frag = baseLine(); } catch (e) { return; }
    const text = plain(frag);
    el.textContent = "";
    const step = Math.max(8, Math.min(28, 1100 / text.length));
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      el.textContent = text.slice(0, i);
      if (i >= text.length) { clearInterval(id); setLine(baseLine()); }
    }, step);
  }
  if (root.classList.contains("intro")) {
    el.textContent = "";
    let started = false;
    const go = () => { if (!started) { started = true; typeIn(); } };
    document.addEventListener("hero:intro-done", go, { once: true });
    setTimeout(go, 4000); // never leave the line empty
  } else {
    renderBase();
  }

  // Keep the clock honest without churn.
  setInterval(() => { if (!document.hidden) renderBase(); }, 20000);

  // ---------- Reactions ----------
  // Theme: toggled by hand or changed by the OS.
  const themeNote = () => showEvent(t.theme[currentTheme()], 4500);
  document.addEventListener("themechange", themeNote);
  matchMedia("(prefers-color-scheme: light)").addEventListener("change", () => {
    if (!root.dataset.theme) themeNote();
  });

  // Tab return.
  let hiddenAt = 0;
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { hiddenAt = Date.now(); return; }
    const away = hiddenAt ? Date.now() - hiddenAt : 0;
    hiddenAt = 0;
    if (away < 2000) return; // a blink, not a return
    renderBase();
    showEvent(away < 30000 ? t.events.back : t.events.backLong, 4500);
  });

  // Cursor / input idle: one gentle nudge per page view, gone on the next move.
  let lastActive = Date.now();
  let idleShown = false;
  const active = () => {
    lastActive = Date.now();
    if (idleShown && eventActive) { idleShown = false; endEvent(); }
  };
  ["pointermove", "pointerdown", "keydown", "wheel", "scroll", "touchstart"].forEach((ev) =>
    addEventListener(ev, active, { passive: true }),
  );
  const idleCheck = setInterval(() => {
    if (document.hidden || eventActive || idleShown) return;
    if (Date.now() - lastActive > 45000) {
      idleShown = true;
      showEvent(t.events.idle, 0);
      clearInterval(idleCheck);
    }
  }, 5000);

  // ---------- Forget me ----------
  const forgetBtn = document.querySelector("[data-forget]");
  if (forgetBtn && store.works()) {
    forgetBtn.hidden = false;
    const note = document.querySelector("[data-forget-note]");
    if (note) note.hidden = false;
    forgetBtn.addEventListener("click", () => {
      KEYS.forEach((k) => store.remove(k));
      session.remove("counted");
      forgotten = true;
      visits = 0;
      root.removeAttribute("data-theme");
      showEvent(t.events.forgot, 5000);
    });
  }

  // ---------- Easter egg: soccer (a real thing about me; no clubs named) ----------
  const word = t.egg.trigger.toLowerCase();
  let buf = "";
  addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey || e.key.length !== 1) return;
    const tag = e.target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || e.target.isContentEditable) return;
    if (document.querySelector("dialog[open]")) return;
    buf = (buf + e.key.toLowerCase()).slice(-word.length);
    if (buf === word) {
      buf = "";
      showEvent(t.events.goal, 6000);
      wave();
    }
  });
}
