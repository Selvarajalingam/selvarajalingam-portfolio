import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Project } from "./schema";
import { parseProjectMarkdown } from "./project-markdown";

export function loadProjectNarrative(project: Project) {
  if (!project.featured) return [];
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.slug)) throw new Error("Invalid narrative slug");
  return parseProjectMarkdown(readFileSync(resolve("src/content/projects", `${project.slug}.md`), "utf8"));
}
