import { projectCategories, projectSorts, type ProjectSort } from "./project-model";
import type { ProjectFilters, ProjectSummary } from "./projects";

export const defaultProjectFilters: ProjectFilters = { query: "", category: "All", technology: "All", sort: "featured" };

export function readProjectFilters(search: string, projects: readonly ProjectSummary[]): ProjectFilters {
  const params = new URLSearchParams(search);
  const category = params.get("category") ?? "All";
  const technology = params.get("technology") ?? "All";
  const sort = params.get("sort") ?? "featured";
  return {
    query: (params.get("q") ?? "").slice(0, 100),
    category: projectCategories.some((value) => value === category) ? category : "All",
    technology: projects.some((project) => project.technologies.includes(technology)) ? technology : "All",
    sort: projectSorts.some((value) => value === sort) && (sort !== "updated" || projects.some((project) => project.updatedAt)) ? sort as ProjectSort : "featured",
  };
}

export function writeProjectFilters(search: string, filters: ProjectFilters): string {
  const params = new URLSearchParams(search);
  for (const [key, value, fallback] of [["q", filters.query, ""], ["category", filters.category, "All"], ["technology", filters.technology, "All"], ["sort", filters.sort, "featured"]]) {
    if (value === fallback) params.delete(key!);
    else params.set(key!, value!);
  }
  const query = params.toString();
  return query ? `?${query}` : "";
}
