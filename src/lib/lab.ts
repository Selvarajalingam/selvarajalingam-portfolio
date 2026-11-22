import type { LabExperiment } from "@/lib/content/schema";

export type LabSummary = Pick<LabExperiment, "slug" | "title" | "summary" | "category" | "status" | "image"> & { progressSummary: string };
export function toLabSummary(entry: LabExperiment): LabSummary {
  return { slug: entry.slug, title: entry.title, summary: entry.summary, category: entry.category, status: entry.status, progressSummary: entry.progress.summary, ...(entry.image ? { image: entry.image } : {}) };
}
export function filterExperiments(entries: readonly LabSummary[], filters: { query: string; category: string; status: string }): LabSummary[] {
  const query = filters.query.trim().toLowerCase();
  return entries.filter((entry) => (filters.category === "All" || entry.category === filters.category)
    && (filters.status === "All" || entry.status === filters.status)
    && `${entry.title} ${entry.summary} ${entry.category} ${entry.progressSummary}`.toLowerCase().includes(query));
}
