import { routeMetadata } from "@/lib/seo/routes";
import { PageStructuredData } from "@/components/seo/structured-data";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { content } from "@/lib/content";
import { loadProjectNarrative } from "@/lib/content/project-narratives";
import { getProjectNavigation, getRelatedProjects } from "@/lib/projects";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectGallery } from "@/components/projects/project-gallery";
import { ArchitectureDiagram } from "@/components/projects/architecture-diagram";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return content.projects.map(({ slug }) => ({ slug })); }
function projectFor(slug: string) { const project = content.projects.find((record) => record.slug === slug); if (!project) notFound(); return project; }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const project = projectFor((await params).slug); return routeMetadata(`/work/${project.slug}`); }

export default async function ProjectPage({ params }: Props) {
  const project = projectFor((await params).slug);
  const sections = loadProjectNarrative(project);
  const related = getRelatedProjects(content.projects, project.slug);
  const { previous, next } = getProjectNavigation(content.projects, project.slug);
  return <div className="project-detail" data-template={project.featured ? "flagship" : "compact"}><PageStructuredData path={`/work/${project.slug}`} />
    <header className="project-hero shell"><nav aria-label="Breadcrumb"><ol><li><Link href="/work">Work</Link></li><li aria-current="page">{project.title}</li></ol></nav><p className="muted project-kind">{project.featured ? "Featured project" : "Project archive"} · {project.categories.join(" · ")}</p><h1>{project.title}</h1><p className="lead-copy">{project.summary}</p>
      <dl className="project-facts"><div><dt>My role</dt><dd>{project.role}</dd></div><div><dt>Project status</dt><dd>{project.status}</dd></div></dl>
      {(project.demoUrl || project.repositoryUrl) && <div className="project-actions">{project.demoUrl && <a className="button button-primary" href={project.demoUrl} target="_blank" rel="noopener noreferrer">Visit project<span className="sr-only"> (opens in a new tab)</span></a>}{project.repositoryUrl && <a className="button button-secondary" href={project.repositoryUrl} target="_blank" rel="noopener noreferrer">Source code<span className="sr-only"> (opens in a new tab)</span></a>}</div>}
    </header>
    <div className="project-story shell">
      <nav className="case-index" aria-label="Project sections">{sections.length ? sections.map((section) => <a className="text-link" key={section.id} href={`#${section.id}`}>{section.title}</a>) : <a className="text-link" href="#overview">Overview</a>}{project.architecture && <a className="text-link" href="#architecture">Architecture</a>}{project.featured && <a className="text-link" href="#visuals">Visuals</a>}</nav>
      <div className="case-body">{sections.length ? sections.map((section) => <section className="case-section" id={section.id} key={section.id} aria-labelledby={`${section.id}-heading`}><h2 id={`${section.id}-heading`}>{section.title}</h2>{section.blocks.map((block, index) => block.type === "paragraph" ? <p key={index}>{block.text}</p> : <ul key={index}>{block.items.map((item) => <li key={item}>{item}</li>)}</ul>)}</section>) : <section className="case-section" id="overview" aria-labelledby="overview-heading"><h2 id="overview-heading">Overview</h2><p>{project.overview ?? project.summary}</p></section>}
        {project.technologies.length > 0 && <section className="case-section" aria-labelledby="technologies-heading"><h2 id="technologies-heading">Technologies at a glance</h2><ul className="technology-tags">{project.technologies.map((technology) => <li key={technology}>{technology}</li>)}</ul></section>}
        {project.architecture && <section className="case-section" id="architecture" aria-labelledby="architecture-heading"><h2 id="architecture-heading">Architecture</h2><ArchitectureDiagram graph={project.architecture} /></section>}
        {project.featured && <section className="case-section" id="visuals" aria-labelledby="visuals-heading"><h2 id="visuals-heading">Visuals</h2><ProjectGallery images={project.gallery} /></section>}
      </div>
    </div>
    <section className="related-projects shell" aria-labelledby="related-heading"><h2 id="related-heading">More to explore.</h2><div className="related-grid">{related.map((record) => <ProjectCard key={record.slug} project={record} />)}</div><Link className="text-link" href="/work">Back to Work</Link></section>
    <nav className="project-pagination shell" aria-label="Project navigation">{previous ? <Link href={`/work/${previous.slug}`} rel="prev"><span className="muted">Previous project</span><span>{previous.title}</span></Link> : <span />}{next && <Link href={`/work/${next.slug}`} rel="next"><span className="muted">Next project</span><span>{next.title}</span></Link>}</nav>
  </div>;
}
