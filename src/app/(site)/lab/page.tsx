import { routeMetadata } from "@/lib/seo/routes";
import { PageStructuredData } from "@/components/seo/structured-data";
import type { Metadata } from "next";
import { content } from "@/lib/content";
import { labPage } from "@/lib/content/lab";
import { labStatuses } from "@/lib/lab-model";
import { toLabSummary } from "@/lib/lab";
import { LabExplorer } from "@/components/lab/lab-explorer";
import { StatusBadge } from "@/components/lab/status-badge";

export const metadata: Metadata = routeMetadata("/lab");

export default function Lab() {
  return <><PageStructuredData path="/lab" /><header className="lab-hero shell"><p className="muted">The Lab</p><h1>{labPage.heading}</h1><p className="lead-copy">{labPage.introduction}</p></header><section className="lab-collection shell" aria-label="Experiment collection"><LabExplorer entries={content.lab.map(toLabSummary)} copy={labPage} /></section><section className="lab-legend shell" aria-labelledby="progress-labels-heading"><h2 id="progress-labels-heading">{labPage.legendHeading}</h2><dl>{labStatuses.map((status) => <div key={status}><dt><StatusBadge status={status} /></dt><dd className="muted">{labPage.statusDescriptions[status]}</dd></div>)}</dl></section></>;
}
