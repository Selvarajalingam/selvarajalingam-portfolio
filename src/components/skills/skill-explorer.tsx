"use client";

import { useRef, useState } from "react";
import type { SkillCategory, SkillStatus } from "@/lib/content/schema";
import { skillStatuses } from "@/lib/skill-model";
import { filterSkills } from "@/lib/skills";

export function SkillExplorer({ categories }: { categories: SkillCategory[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<SkillStatus | "All">("All");
  const searchInput = useRef<HTMLInputElement>(null);
  const visible = filterSkills(categories, query, status);
  const count = visible.reduce((total, category) => total + category.items.length, 0);
  const filtered = query !== "" || status !== "All";
  function reset() { setQuery(""); setStatus("All"); searchInput.current?.focus({ preventScroll: true }); }

  return <div className="skill-explorer">
    <p className="muted skill-explanation">Applied means a learning or project context, rather than a proficiency rating. Java and Spring Boot are areas I&apos;m actively strengthening.</p>
    <div className="skill-controls"><label className="skill-search">Find a skill<input ref={searchInput} type="search" value={query} maxLength={100} onChange={(event) => setQuery(event.target.value)} placeholder="Try React, cloud or a project name" /></label>
      <div className="skill-status-filters" role="group" aria-label="Filter by practice"><button type="button" aria-pressed={status === "All"} onClick={() => setStatus("All")}>All</button>{skillStatuses.map((value) => <button key={value} type="button" aria-pressed={status === value} onClick={() => setStatus(value)}>{value}</button>)}</div>
    </div>
    <div className="skill-results-row"><p className="muted" role="status" aria-live="polite" aria-atomic="true">Showing {count} {count === 1 ? "skill" : "skills"} across {visible.length} {visible.length === 1 ? "category" : "categories"}.</p>{filtered && <button className="text-link reset-filters" type="button" onClick={reset}>Reset filters</button>}</div>
    {visible.length ? <div className="skill-category-list">{visible.map((category) => <section className="skill-category" key={category.slug} aria-labelledby={`skill-${category.slug}`}><h3 id={`skill-${category.slug}`}>{category.title}</h3><ul>{category.items.map((item) => <li key={item.name}><div className="skill-title-row"><p className="skill-name">{item.name}</p><span className="skill-practice" data-status={item.status}>{item.status}</span></div><p className="muted">{item.context}</p></li>)}</ul></section>)}</div> : <p className="skills-empty">No skills match these filters.</p>}
  </div>;
}
