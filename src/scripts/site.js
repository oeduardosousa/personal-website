// Tiny client script: remember a manual language choice and keep the footer year current.

// Manual language toggle: the link already points at the other language (works without JS).
// Here we only remember the choice and keep the current section hash.
document.querySelectorAll("[data-lang-toggle]").forEach((link) => {
  link.addEventListener("click", () => {
    try {
      localStorage.setItem("lang", link.dataset.langToggle);
    } catch (e) {
      /* storage blocked: the link still navigates */
    }
    if (location.hash) link.setAttribute("href", link.getAttribute("href") + location.hash);
  });
});

// Footer year is computed, never hardcoded. (The build-time value is only the no-JS fallback.)
document.querySelectorAll("[data-year]").forEach((el) => {
  el.textContent = String(new Date().getFullYear());
});
