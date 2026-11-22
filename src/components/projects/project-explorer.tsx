"use client";

import { useRef, useState } from "react";
import { projectCategories, type ProjectSort } from "@/lib/project-model";
import { filterProjects, type ProjectSummary } from "@/lib/projects";
import { ProjectCard } from "./project-card";

export function ProjectExplorer({ projects }: { projects: ProjectSummary[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [technology, setTechnology] = useState("All");
  const [sort, setSort] = useState<ProjectSort>("featured");
  const search = useRef<HTMLInputElement>(null);
  const technologies = [...new Set(projects.flatMap((project) => project.technologies))].sort((a, b) => a.localeCompare(b, "en"));
  const visible = filterProjects(projects, { query, category, technology, sort });
  const changed = query !== "" || category !== "All" || technology !== "All" || sort !== "featured";
  function reset() { setQuery(""); setCategory("All"); setTechnology("All"); setSort("featured"); search.current?.focus({ preventScroll: true }); }

  return <div className="project-explorer">
    <div className="work-filters"><label className="work-search">Find a project<input ref={search} type="search" maxLength={100} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, technology or subject" /></label>
      <label>Category<select aria-label="Category" value={category} onChange={(event) => setCategory(event.target.value)}><option value="All">All categories</option>{projectCategories.map((value) => <option key={value}>{value}</option>)}</select></label>
      <label>Technology<select aria-label="Technology" value={technology} onChange={(event) => setTechnology(event.target.value)}><option value="All">All technologies</option>{technologies.map((value) => <option key={value}>{value}</option>)}</select></label>
      <label>Sort projects<select aria-label="Sort projects" value={sort} onChange={(event) => setSort(event.target.value as ProjectSort)}><option value="featured">Featured first</option><option value="title">Title A–Z</option><option value="category">Category</option><option value="technology">Technology</option>{projects.some((project) => project.updatedAt) && <option value="updated">Recently updated</option>}</select></label>
    </div>
    <div className="work-results-status"><p className="muted" role="status" aria-live="polite" aria-atomic="true">Showing {visible.length} {visible.length === 1 ? "project" : "projects"}.</p>{changed && <button type="button" className="text-link reset-filters" onClick={reset}>Reset filters</button>}</div>
    {visible.length ? <div className="work-results-grid">{visible.map((project) => <ProjectCard key={project.slug} project={project} />)}</div> : <div className="work-empty"><h3>No projects match these filters.</h3><p className="muted">Try another category, technology or search term, or reset the filters to see all projects.</p></div>}
  </div>;
}
