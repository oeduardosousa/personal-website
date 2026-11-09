// Hero: one-time intro, then the kinetic name. GSAP core only. Transform and opacity only.
import gsap from "gsap";

/** Easter egg: the name does a quick wave. Transform only; skipped under reduced motion. */
export function wave() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const letters = document.querySelectorAll("[data-kinetic] .ch");
  if (!letters.length) return;
  gsap.to(letters, {
    keyframes: [
      { yPercent: -16, duration: 0.18, ease: "power2.out" },
      { yPercent: 0, duration: 0.5, ease: "elastic.out(1, 0.45)" },
    ],
    stagger: 0.035,
    overwrite: "auto",
  });
}

export function initHero() {
  const h1 = document.querySelector("[data-kinetic]");
  if (!h1) return;
  const root = document.documentElement;
  const letters = [...h1.querySelectorAll(".ch")];

  // --- Intro: letters rise in with a short stagger, then the rest fades up. Plays once. ---
  let introDone = Promise.resolve();
  if (root.classList.contains("intro")) {
    try { localStorage.setItem("intro", "1"); } catch (e) {}
    introDone = new Promise((resolve) => {
      const lead = document.querySelector(".hero__lead");
      const terminal = document.querySelector(".terminal");
      const tl = gsap.timeline({
        defaults: { ease: "expo.out" },
        onComplete: () => {
          root.classList.remove("intro");
          document.dispatchEvent(new CustomEvent("hero:intro-done"));
          resolve();
        },
      });
      tl.fromTo(letters, { yPercent: 70, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.7, stagger: 0.04 })
        .fromTo(lead, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "-=0.35")
        .fromTo(terminal, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "-=0.35");
    });
  }

  // --- Kinetic name: letters shift with pointer proximity. Transform only (no font-axis animation). ---
  const mm = gsap.matchMedia();
  mm.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
    const cfg = { duration: 0.9, ease: "elastic.out(1, 0.45)" };
    const q = letters.map((el) => ({
      x: gsap.quickTo(el, "x", cfg),
      y: gsap.quickTo(el, "y", cfg),
      skewX: gsap.quickTo(el, "skewX", cfg),
      scaleY: gsap.quickTo(el, "scaleY", cfg),
    }));
    let ready = false;
    let frame = 0;
    let px = 0, py = 0;
    introDone.then(() => { ready = true; });

    const smooth = (t) => t * t * (3 - 2 * t);
    const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

    function update() {
      frame = 0;
      const box = h1.getBoundingClientRect();
      const fs = parseFloat(getComputedStyle(h1).fontSize);
      const radius = fs * 1.6;
      letters.forEach((el, i) => {
        const cx = box.left + el.offsetLeft + el.offsetWidth / 2;
        const cy = box.top + el.offsetTop + el.offsetHeight / 2;
        const dx = px - cx, dy = py - cy;
        const dist = Math.hypot(dx, dy) || 1;
        const k = smooth(clamp(1 - dist / radius, 0, 1));
        q[i].x(-(dx / dist) * k * fs * 0.12);
        q[i].y(-(dy / dist) * k * fs * 0.06);
        q[i].skewX(-clamp(dx / radius, -1, 1) * k * 14);
        q[i].scaleY(1 + k * 0.14);
      });
    }
    function onMove(e) {
      if (!ready) return;
      px = e.clientX; py = e.clientY;
      if (!frame) frame = requestAnimationFrame(update);
    }
    function reset() {
      cancelAnimationFrame(frame); frame = 0;
      q.forEach((p) => { p.x(0); p.y(0); p.skewX(0); p.scaleY(1); });
    }

    const hero = document.querySelector("[data-hero]");
    hero.addEventListener("pointermove", onMove);
    hero.addEventListener("pointerleave", reset);
    return () => {
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", reset);
      cancelAnimationFrame(frame);
      gsap.set(letters, { clearProps: "x,y,skewX,scaleY" });
    };
  });
}
