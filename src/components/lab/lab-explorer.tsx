"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { labCategories, labStatuses } from "@/lib/lab-model";
import { filterExperiments, type LabSummary } from "@/lib/lab";
import type { LabPageCopy } from "@/lib/content/lab";
import { LabCard } from "./lab-card";

export function LabExplorer({ entries, copy }: { entries: LabSummary[]; copy: LabPageCopy }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const search = useRef<HTMLInputElement>(null);
  const visible = filterExperiments(entries, { query, category, status });
  const changed = query !== "" || category !== "All" || status !== "All";
  function reset() { setQuery(""); setCategory("All"); setStatus("All"); search.current?.focus({ preventScroll: true }); }
  return <div className="lab-explorer"><div className="lab-filters">
    <label>Find an experiment<input ref={search} type="search" value={query} maxLength={100} onChange={(event) => setQuery(event.target.value)} placeholder="Search ideas and progress notes" /></label>
    <label>Category<select aria-label="Lab category" value={category} onChange={(event) => setCategory(event.target.value)}><option value="All">All categories</option>{labCategories.map((value) => <option key={value}>{value}</option>)}</select></label>
    <label>Progress status<select aria-label="Progress status" value={status} onChange={(event) => setStatus(event.target.value)}><option value="All">All statuses</option>{labStatuses.map((value) => <option key={value}>{value}</option>)}</select></label>
  </div><div className="lab-results-status"><p className="muted" role="status" aria-live="polite" aria-atomic="true">{entries.length ? `Showing ${visible.length} ${visible.length === 1 ? "experiment" : "experiments"}.` : "No experiments published."}</p>{changed && <button className="text-link reset-filters" type="button" onClick={reset}>Reset filters</button>}</div>
    {visible.length ? <div className="lab-grid">{visible.map((entry) => <LabCard key={entry.slug} entry={entry} />)}</div> : <div className="lab-empty"><h2>{entries.length ? copy.unmatchedHeading : copy.emptyHeading}</h2><p className="muted">{entries.length ? copy.unmatchedBody : copy.emptyBody}</p>{!entries.length && <Link className="button button-secondary" href="/work">Explore my work</Link>}</div>}
  </div>;
}
