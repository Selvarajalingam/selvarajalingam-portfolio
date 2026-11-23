"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { labCategories, labStatuses } from "@/lib/lab-model";
import { filterExperiments, type LabSummary } from "@/lib/lab";
import type { LabPageCopy } from "@/lib/content/lab";
import { LabCard } from "./lab-card";
import GlideSelect from "@/components/ui/glide-select";

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
    <label>Category<GlideSelect ariaLabel="Lab category" options={[{ value: "All", label: "All categories" }, ...labCategories]} value={category} onChange={setCategory} /></label>
    <label>Progress status<GlideSelect ariaLabel="Progress status" options={[{ value: "All", label: "All statuses" }, ...labStatuses]} value={status} onChange={setStatus} /></label>
  </div><div className="lab-results-status"><p className="muted" role="status" aria-live="polite" aria-atomic="true">{entries.length ? `Showing ${visible.length} ${visible.length === 1 ? "experiment" : "experiments"}.` : "No experiments published."}</p>{changed && <button className="text-link reset-filters" type="button" onClick={reset}>Reset filters</button>}</div>
    {visible.length ? <div className="lab-grid">{visible.map((entry) => <LabCard key={entry.slug} entry={entry} />)}</div> : <div className="lab-empty"><h2>{entries.length ? copy.unmatchedHeading : copy.emptyHeading}</h2><p className="muted">{entries.length ? copy.unmatchedBody : copy.emptyBody}</p>{!entries.length && <Link className="button button-secondary" href="/work">Explore my work</Link>}</div>}
  </div>;
}
