// Shared helpers. Every storage access is wrapped: blocked storage must never break the page.

export const store = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } },
  remove(k) { try { localStorage.removeItem(k); } catch (e) { /* ignore */ } },
  /** True when localStorage actually persists (private modes and blockers fail this). */
  works() {
    try { localStorage.setItem("_t", "1"); localStorage.removeItem("_t"); return true; } catch (e) { return false; }
  },
};

export const session = {
  get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* ignore */ } },
  remove(k) { try { sessionStorage.removeItem(k); } catch (e) { /* ignore */ } },
};

export function currentTheme() {
  const set = document.documentElement.dataset.theme;
  if (set === "light" || set === "dark") return set;
  return matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

/** Clipboard with a legacy fallback. Resolves to true when the text was copied. */
export async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true; } catch (e) { /* fall through */ }
  const ta = Object.assign(document.createElement("textarea"), { value: text });
  ta.setAttribute("readonly", "");
  ta.style.cssText = "position:fixed;opacity:0;top:0;left:0";
  document.body.appendChild(ta);
  ta.select();
  let ok = false;
  try { ok = document.execCommand("copy"); } catch (e) { /* ignore */ }
  ta.remove();
  return ok;
}

/**
 * Jump to a section or project. Instant by design: it is used from the keyboard (palette),
 * and keyboard-initiated actions are never animated. Uses Lenis when it is running.
 */
export function goTo(target) {
  const el = typeof target === "string" ? document.getElementById(target) : target;
  if (!el) return;
  const lenis = window.__lenis;
  const work = el.closest("[data-work]");
  const pinEnd = work && el.matches(".project") ? work.__pinEnd?.() : null;
  if (pinEnd != null) {
    // The work section is pinned: land where every project is already revealed.
    if (lenis) lenis.scrollTo(pinEnd, { immediate: true });
    else window.scrollTo({ top: pinEnd, behavior: "instant" });
  } else if (lenis) {
    lenis.scrollTo(el, { offset: -64, immediate: true });
  } else {
    el.scrollIntoView({ behavior: "instant", block: "start" });
  }
  if (el.id) history.replaceState(null, "", "#" + el.id);
  if (el.matches("section")) {
    el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  }
}
