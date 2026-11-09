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
