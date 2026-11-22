import type { CloudResource } from "@/lib/content/schema";

export function CloudResources({ resources, emptyState }: { resources: CloudResource[]; emptyState: string }) {
  if (!resources.length) return <p className="muted empty-copy">{emptyState}</p>;
  return <ul className="cloud-resource-list">{resources.map((resource) => <li className="cloud-resource" key={resource.slug}><p className="muted">{resource.type}{resource.category ? ` · ${resource.category}` : ""}</p><h3><a href={resource.url} target="_blank" rel="noopener noreferrer">{resource.title}<span className="sr-only"> (opens in a new tab)</span></a></h3><p>{resource.summary}</p>{resource.attribution && <p className="muted">{resource.attribution}</p>}</li>)}</ul>;
}
