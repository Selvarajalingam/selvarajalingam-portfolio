"use client";

import { useEffect, useRef, useState } from "react";
import type { RepositoryLink, RepositoryMetadata } from "@/lib/github/model";

function metadataFrom(value: unknown): RepositoryMetadata | null {
  if (!value || typeof value !== "object") return null;
  const data = value as Record<string, unknown>;
  if (!Number.isSafeInteger(data.stars) || (data.stars as number) < 0 || !Number.isSafeInteger(data.forks) || (data.forks as number) < 0 || !(data.language === null || typeof data.language === "string" && data.language.length <= 60) || typeof data.checkedAt !== "string" || !Number.isFinite(Date.parse(data.checkedAt))) return null;
  return { stars: data.stars as number, forks: data.forks as number, language: data.language as string | null, checkedAt: data.checkedAt };
}

export function GitHubRepositories({ repositories, profileUrl }: { repositories: RepositoryLink[]; profileUrl: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [metadata, setMetadata] = useState<Record<string, RepositoryMetadata>>({});
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    // The static links are the fallback when observation, JavaScript or the API is unavailable.
    if (!root.current || typeof IntersectionObserver === "undefined" || !repositories.length) return;
    const controller = new AbortController();
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      void fetch("/api/github", { signal: AbortSignal.any([controller.signal, AbortSignal.timeout(12000)]), cache: "no-store" }).then(async (response) => {
        if (!response.ok) throw new Error("unavailable");
        const body = await response.json() as { repositories?: unknown };
        if (!Array.isArray(body.repositories)) throw new Error("invalid-response");
        const next: Record<string, RepositoryMetadata> = {};
        for (const row of body.repositories) {
          if (!row || typeof row !== "object") continue;
          const item = row as Record<string, unknown>;
          const repository = repositories.find((record) => record.name === item.name && record.url === item.url);
          const value = metadataFrom(item.metadata);
          if (repository && value) next[repository.name] = value;
        }
        if (!controller.signal.aborted) setMetadata(next);
      }).catch(() => { /* Curated links remain useful; never replace unavailable counts with zero. */ }).finally(() => { if (!controller.signal.aborted) setLoaded(true); });
    }, { rootMargin: "300px" });
    observer.observe(root.current);
    return () => { controller.abort(); observer.disconnect(); };
  }, [repositories]);

  return <div className="github-repositories" ref={root}>
    <div className="repository-heading"><h3>On GitHub</h3><a className="text-link" href={profileUrl} target="_blank" rel="noopener noreferrer">View GitHub profile<span className="sr-only"> (opens in a new tab)</span></a></div>
    <p className="muted">A curated selection of public repositories. Additional metadata is a cached GitHub snapshot.</p>
    <ul className="repository-grid">{repositories.map((repository) => {
      const snapshot = metadata[repository.name];
      return <li className="repository-card" key={repository.name}><h4><a href={repository.url} target="_blank" rel="noopener noreferrer">{repository.name}<span className="sr-only"> (opens in a new tab)</span></a></h4>{snapshot && <div className="repository-metadata">{snapshot.language && <p>Main language: {snapshot.language}</p>}<dl><div><dt>Stars</dt><dd>{snapshot.stars}</dd></div><div><dt>Forks</dt><dd>{snapshot.forks}</dd></div></dl><p className="muted repository-checked">GitHub snapshot checked <time dateTime={snapshot.checkedAt}>{new Intl.DateTimeFormat("en", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(snapshot.checkedAt))}</time></p></div>}</li>;
    })}</ul>
    {loaded && Object.keys(metadata).length < repositories.length && <p className="muted repository-fallback" role="status">Some GitHub metadata is unavailable. Repository links remain available.</p>}
  </div>;
}
