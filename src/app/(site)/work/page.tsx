import { routeMetadata } from "@/lib/seo/routes";
import { PageStructuredData } from "@/components/seo/structured-data";
import type { Metadata } from "next";
import { content } from "@/lib/content";
import { ProjectExplorer } from "@/components/projects/project-explorer";

export const metadata: Metadata = routeMetadata("/work");

export default function Work() {
  const projects = content.projects.map(({ slug, title, summary, categories, technologies, featured, updatedAt }) => ({ slug, title, summary, categories, technologies, featured, ...(updatedAt ? { updatedAt } : {}) }));
  return <><PageStructuredData path="/work" />
    <header className="work-hero shell"><p className="muted">Selected work & project archive</p><h1>Software, with a purpose.</h1><p className="lead-copy">Full-stack applications, Java projects, desktop software and work in AI and data. Independently developed by Selvarajalingam.</p></header>
    <section className="work-collection shell" aria-labelledby="project-collection-heading"><h2 id="project-collection-heading" className="sr-only">Project collection</h2><ProjectExplorer projects={projects} /></section>
  </>;
}
