// Scroll motion, loaded on idle or first interaction. Lenis + ScrollTrigger + SplitText.
// gsap.matchMedia gives phones simpler effects and reduced-motion users opacity-only fades.
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, SplitText);

export function initScroll() {
  const mm = gsap.matchMedia();

  // Smooth scroll: off under reduced motion. Never traps scroll (menu can pause it).
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    const lenis = new Lenis({ anchors: { offset: -64 } });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    const lock = (e) => (e.detail ? lenis.stop() : lenis.start());
    document.documentElement.addEventListener("scrolllock", lock);
    return () => {
      document.documentElement.removeEventListener("scrolllock", lock);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  });

  mm.add(
    {
      full: "(min-width: 960px) and (prefers-reduced-motion: no-preference)",
      simple: "(max-width: 959px) and (prefers-reduced-motion: no-preference)",
      reduced: "(prefers-reduced-motion: reduce)",
    },
    (ctx) => {
      const { full, reduced } = ctx.conditions;
      const ease = "expo.out";
      const belowFold = (el) => el.getBoundingClientRect().top > innerHeight * 0.9;

      // Create in document order so ScrollTrigger measures pin spacing correctly.
      const targets = document.querySelectorAll("[data-split], [data-reveal], [data-work]");
      targets.forEach((el) => {
        if (el.matches("[data-split]")) {
          // Headings: split by line (not character), each line rises from a mask.
          let played = false;
          SplitText.create(el, {
            type: "lines",
            mask: "lines",
            autoSplit: true,
            onSplit(self) {
              // Masks clip: give descenders (g, y) room so the tight headline leading doesn't cut them.
              self.masks?.forEach((m) => { m.style.paddingBottom = "0.14em"; m.style.marginBottom = "-0.14em"; });
              if (played) return;
              return gsap.from(
                self.lines,
                reduced
                  ? { opacity: 0, duration: 0.4, stagger: 0.06, scrollTrigger: { trigger: el, start: "top 88%", once: true }, onComplete: () => (played = true) }
                  : { yPercent: 110, duration: 0.7, stagger: 0.06, ease, scrollTrigger: { trigger: el, start: "top 88%", once: true }, onComplete: () => (played = true) },
              );
            },
          });
          return;
        }

        if (el.matches("[data-work]")) {
          setupWork(el, { full, reduced, ease, belowFold });
          return;
        }

        // Plain blocks: fade up (opacity only under reduced motion).
        if (!belowFold(el)) return;
        gsap.set(el, reduced ? { opacity: 0 } : { opacity: 0, y: 24 });
        ScrollTrigger.create({
          trigger: el,
          start: "top 90%",
          once: true,
          onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: reduced ? 0.4 : 0.6, ease, overwrite: true }),
        });
      });
    },
  );

  // Fonts change line breaks and heights: measure again once they are in.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

// Work: on desktop the section pins and reveals projects one by one, but only if it fits the viewport.
// Otherwise (phones, many projects, reduced motion) each project fades in as it arrives.
function setupWork(work, { full, reduced, ease, belowFold }) {
  const items = [...work.querySelectorAll(".project")];
  if (!items.length) return;

  const fits = work.offsetHeight <= innerHeight;
  if (full && items.length > 1 && fits) {
    const rest = items.slice(1);
    gsap.set(rest, { opacity: 0, y: 40 });
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: work,
        start: "top top",
        end: () => "+=" + rest.length * innerHeight * 0.5,
        pin: true,
        scrub: 0.5,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });
    rest.forEach((el, i) => tl.to(el, { opacity: 1, y: 0, duration: 1 }, i));
    return;
  }

  items.forEach((el) => {
    if (!belowFold(el)) return;
    gsap.set(el, reduced ? { opacity: 0 } : { opacity: 0, y: 24 });
    ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      once: true,
      onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: reduced ? 0.4 : 0.6, ease, overwrite: true }),
    });
  });
}
