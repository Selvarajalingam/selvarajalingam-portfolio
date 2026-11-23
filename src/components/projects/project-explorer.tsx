"use client";

import { useRef, useSyncExternalStore } from "react";
import { projectCategories, type ProjectSort } from "@/lib/project-model";
import { filterProjects, type ProjectSummary } from "@/lib/projects";
import { ProjectCard } from "./project-card";
import { defaultProjectFilters, readProjectFilters, writeProjectFilters } from "@/lib/project-filter-url";
import type { ProjectFilters } from "@/lib/projects";
import GlideSelect from "@/components/ui/glide-select";

const filterEvent = "portfolio-project-filters";
function subscribe(listener: () => void) {
  window.addEventListener("popstate", listener);
  window.addEventListener(filterEvent, listener);
  return () => { window.removeEventListener("popstate", listener); window.removeEventListener(filterEvent, listener); };
}
function getSearch() { return window.location.search; }
function getServerSearch() { return ""; }

export function ProjectExplorer({ projects }: { projects: ProjectSummary[] }) {
  const locationSearch = useSyncExternalStore(subscribe, getSearch, getServerSearch);
  const { query, category, technology, sort } = readProjectFilters(locationSearch, projects);
  const search = useRef<HTMLInputElement>(null);
  const technologies = [...new Set(projects.flatMap((project) => project.technologies))].sort((a, b) => a.localeCompare(b, "en"));
  const visible = filterProjects(projects, { query, category, technology, sort });
  const changed = query !== "" || category !== "All" || technology !== "All" || sort !== "featured";
  function update(patch: Partial<ProjectFilters>, replace = false) {
    const filters = { query, category, technology, sort, ...patch };
    const url = `${window.location.pathname}${writeProjectFilters(window.location.search, filters)}${window.location.hash}`;
    if (replace) window.history.replaceState(null, "", url);
    else window.history.pushState(null, "", url);
    window.dispatchEvent(new Event(filterEvent));
  }
  function reset() { update(defaultProjectFilters); search.current?.focus({ preventScroll: true }); }

  return <div className="project-explorer">
    <div className="work-filters"><label className="work-search">Find a project<input ref={search} type="search" maxLength={100} value={query} onChange={(event) => update({ query: event.target.value }, true)} placeholder="Search by name, technology or subject" /></label>
      <label>Category<GlideSelect ariaLabel="Category" options={[{ value: "All", label: "All categories" }, ...projectCategories]} value={category} onChange={(value) => update({ category: value })} /></label>
      <label>Technology<GlideSelect ariaLabel="Technology" options={[{ value: "All", label: "All technologies" }, ...technologies]} value={technology} onChange={(value) => update({ technology: value })} /></label>
      <label>Sort projects<GlideSelect ariaLabel="Sort projects" options={[{ value: "featured", label: "Featured first" }, { value: "title", label: "Title A–Z" }, { value: "category", label: "Category" }, { value: "technology", label: "Technology" }, ...(projects.some((project) => project.updatedAt) ? [{ value: "updated", label: "Recently updated" }] : [])]} value={sort} onChange={(value) => update({ sort: value as ProjectSort })} /></label>
    </div>
    <div className="work-results-status"><p className="muted" role="status" aria-live="polite" aria-atomic="true">Showing {visible.length} {visible.length === 1 ? "project" : "projects"}.</p>{changed && <button type="button" className="text-link reset-filters" onClick={reset}>Reset filters</button>}</div>
    {visible.length ? <div className="work-results-grid">{visible.map((project) => <ProjectCard key={project.slug} project={project} />)}</div> : <div className="work-empty"><h3>No projects match these filters.</h3><p className="muted">Try another category, technology or search term, or reset the filters to see all projects.</p></div>}
  </div>;
}
