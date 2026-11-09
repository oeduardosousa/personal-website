// Command palette (Ctrl/Cmd+K). Loaded on first use. Uses a native modal <dialog>:
// top layer, background inert, Esc closes, Tab stays inside. Opens and closes instantly (keyboard action).
import { copyText, goTo } from "./util.js";

let dlg, input, list, status, hint;
let all = [];
let shown = [];
let active = 0;
let dyn;

const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const fill = (s, v) => s.replace(/\{(\w+)\}/g, (_, k) => v[k] ?? "");

function commands() {
  const t = dyn.dynamic.palette;
  const g = t.groups;
  const list = [];
  dyn.sections.forEach(({ id, label }) =>
    list.push({ group: g.go, label: fill(t.goTo, { name: label }), keys: label, run: () => goTo(id) }),
  );
  dyn.projects.forEach((p) =>
    list.push({ group: g.project, label: fill(t.project, { name: p.title }), keys: p.title, run: () => goTo("project-" + p.id) }),
  );
  list.push(
    { group: g.action, label: t.copyEmail, keys: "copy email e-mail copiar", stay: true, run: copyEmail },
    { group: g.action, label: t.email, keys: "write mail escrever", run: () => { location.href = dyn.mailto; } },
    { group: g.action, label: t.switchLang, keys: "language idioma lingua portugues english", run: () => document.querySelector("[data-lang-toggle]")?.click() },
    { group: g.action, label: t.theme, keys: "theme dark light tema escuro claro", run: () => document.querySelector("[data-theme-toggle]")?.click() },
    { group: g.link, label: t.linkedin, keys: "linkedin", run: () => window.open(dyn.links.linkedin, "_blank", "noopener") },
    { group: g.link, label: t.github, keys: "github code codigo", run: () => window.open(dyn.links.github, "_blank", "noopener") },
  );
  return list;
}

async function copyEmail() {
  const t = dyn.dynamic.palette;
  const ok = await copyText(dyn.links.email);
  status.textContent = ok ? t.copied : t.copyFailed;
  status.dataset.state = ok ? "ok" : "fail";
  setTimeout(() => { if (dlg.open) dlg.close(); }, 700);
}

function build() {
  const t = dyn.dynamic.palette;
  dlg = document.createElement("dialog");
  dlg.className = "palette";
  dlg.setAttribute("aria-label", t.title);
  dlg.innerHTML = `
    <input class="palette__input" type="text" role="combobox" aria-expanded="true" aria-controls="palette-list"
      aria-autocomplete="list" autocomplete="off" autocapitalize="off" spellcheck="false">
    <ul class="palette__list" id="palette-list" role="listbox"></ul>
    <p class="palette__empty" hidden></p>
    <p class="palette__foot label"><span class="palette__hint"></span><span class="palette__status" role="status"></span></p>`;
  document.body.appendChild(dlg);
  input = dlg.querySelector("input");
  list = dlg.querySelector("ul");
  status = dlg.querySelector(".palette__status");
  hint = dlg.querySelector(".palette__empty");
  input.placeholder = t.placeholder;
  input.setAttribute("aria-label", t.title);
  dlg.querySelector(".palette__hint").textContent = t.hint;
  hint.textContent = t.empty;

  input.addEventListener("input", () => render(input.value));
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); move(1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); move(-1); }
    else if (e.key === "Home") { e.preventDefault(); setActive(0); }
    else if (e.key === "End") { e.preventDefault(); setActive(shown.length - 1); }
    else if (e.key === "Enter") { e.preventDefault(); run(active); }
    else if (e.key === "Tab") e.preventDefault(); // focus stays on the input
  });
  list.addEventListener("click", (e) => {
    const li = e.target.closest("li");
    if (li) run(Number(li.dataset.i));
  });
  list.addEventListener("pointermove", (e) => {
    const li = e.target.closest("li");
    if (li && Number(li.dataset.i) !== active) setActive(Number(li.dataset.i), false);
  });
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); }); // backdrop
  dlg.addEventListener("close", unlock);
}

// Scroll is locked while the palette is open. Unlock synchronously before a command runs,
// otherwise a jump would be swallowed by the lock (the dialog "close" event fires a tick later).
function unlock() {
  document.documentElement.classList.remove("palette-open");
  document.documentElement.dispatchEvent(new CustomEvent("scrolllock", { detail: false }));
}

function render(q) {
  const terms = norm(q).split(/\s+/).filter(Boolean);
  shown = all.filter((c) => {
    const hay = norm(c.label + " " + c.keys);
    return terms.every((w) => hay.includes(w));
  });
  list.replaceChildren(
    ...shown.map((c, i) => {
      const li = document.createElement("li");
      li.id = "palette-opt-" + i;
      li.dataset.i = i;
      li.setAttribute("role", "option");
      li.innerHTML = '<span class="palette__label"></span><span class="palette__group label"></span>';
      li.firstChild.textContent = c.label;
      li.lastChild.textContent = c.group;
      return li;
    }),
  );
  hint.hidden = shown.length > 0;
  active = 0;
  setActive(0);
}

function setActive(i, scroll = true) {
  if (!shown.length) { input.removeAttribute("aria-activedescendant"); return; }
  active = Math.max(0, Math.min(shown.length - 1, i));
  [...list.children].forEach((li, n) => li.setAttribute("aria-selected", String(n === active)));
  input.setAttribute("aria-activedescendant", "palette-opt-" + active);
  if (scroll) list.children[active].scrollIntoView({ block: "nearest" });
}
const move = (d) => shown.length && setActive((active + d + shown.length) % shown.length);

function run(i) {
  const c = shown[i];
  if (!c) return;
  if (c.stay) { c.run(); return; } // keeps the palette open to show feedback
  dlg.close();
  unlock();
  c.run();
}

export function initPalette(data) { dyn = data; }

export function openPalette() {
  if (!dyn) return;
  if (!dlg) build();
  if (dlg.open) { dlg.close(); return; } // Ctrl/Cmd+K again toggles it shut
  all = commands();
  input.value = "";
  status.textContent = "";
  delete status.dataset.state;
  render("");
  document.documentElement.classList.add("palette-open");
  document.documentElement.dispatchEvent(new CustomEvent("scrolllock", { detail: true }));
  dlg.showModal();
  input.focus();
}
