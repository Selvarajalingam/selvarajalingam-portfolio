import type { Project } from "@/lib/content/schema";
import type { ProjectSort } from "./project-model";

export type ProjectFilters = { query: string; category: string; technology: string; sort: ProjectSort };
export type ProjectSummary = Pick<Project, "slug" | "title" | "summary" | "categories" | "technologies" | "featured" | "updatedAt">;

export function filterProjects<T extends ProjectSummary>(projects: readonly T[], filters: ProjectFilters): T[] {
  const query = filters.query.trim().toLowerCase();
  const indexed = projects.map((project, index) => ({ project, index })).filter(({ project }) =>
    (filters.category === "All" || project.categories.includes(filters.category as Project["categories"][number]))
    && (filters.technology === "All" || project.technologies.includes(filters.technology))
    && `${project.title} ${project.summary} ${project.categories.join(" ")} ${project.technologies.join(" ")}`.toLowerCase().includes(query));
  indexed.sort((a, b) => {
    let order = 0;
    if (filters.sort === "featured") order = Number(b.project.featured) - Number(a.project.featured);
    if (filters.sort === "title") order = a.project.title.localeCompare(b.project.title, "en");
    if (filters.sort === "category") order = (a.project.categories[0] ?? "").localeCompare(b.project.categories[0] ?? "", "en");
    if (filters.sort === "technology") order = (a.project.technologies[0] ?? "\uffff").localeCompare(b.project.technologies[0] ?? "\uffff", "en");
    if (filters.sort === "updated") order = (b.project.updatedAt ?? "").localeCompare(a.project.updatedAt ?? "");
    return order || a.index - b.index;
  });
  return indexed.map(({ project }) => project);
}

export function getProjectNavigation(projects: readonly Project[], slug: string): { previous?: Project; next?: Project } {
  const index = projects.findIndex((project) => project.slug === slug);
  return index < 0 ? {} : { previous: projects[index - 1], next: projects[index + 1] };
}

export function getRelatedProjects(projects: readonly Project[], slug: string): Project[] {
  const current = projects.find((project) => project.slug === slug);
  if (!current) return [];
  return projects.filter((project) => project.slug !== slug).map((project, index) => ({ project, index, score: project.categories.filter((category) => current.categories.includes(category)).length * 10 + project.technologies.filter((technology) => current.technologies.includes(technology)).length })).sort((a, b) => b.score - a.score || a.index - b.index).slice(0, 2).map(({ project }) => project);
}
