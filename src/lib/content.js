// Single place where content/*.json is read. Components never hardcode copy.
import en from "../../content/en.json";
import pt from "../../content/pt.json";
import projects from "../../content/projects.json";

const dictionaries = { en, pt };

/** URL path of the home page for each language. */
export const paths = { en: "/", pt: "/pt/" };

export function otherLang(lang) {
  return lang === "en" ? "pt" : "en";
}

export function getContent(lang) {
  return dictionaries[lang];
}

/**
 * Open gaps are written as "[TODO] ..." in the content files. They show in dev so they stay
 * visible while writing, and are cut from production output so visitors never read them.
 * A string that is only a TODO becomes "" (callers skip the element); a TODO at the end of a
 * sentence is dropped and the sentence before it stays.
 */
export function pub(text) {
  if (import.meta.env.DEV || typeof text !== "string") return text;
  return text.replace(/\s*\[TODO[^\]]*\][\s\S]*$/, "").trim();
}

/** Published projects, with text already resolved to `lang`. */
export function getProjects(lang) {
  return projects
    .filter((p) => p.published !== false)
    .map((p) => ({
      id: p.id,
      title: p.title,
      featured: p.featured === true,
      summary: p.summary[lang],
      tags: p.tags ?? [],
      links: p.links ?? {},
      image: p.image
        ? { src: `/assets/projects/${p.image.src}`, alt: p.image.alt?.[lang] ?? "" }
        : null,
      todo: p.todo ?? [],
    }));
}
