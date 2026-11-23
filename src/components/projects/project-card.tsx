import Link from "next/link";
import type { ProjectSummary } from "@/lib/projects";
import { ProjectCover } from "./project-cover";

export function ProjectCard({ project }: { project: ProjectSummary }) {
  return <article className="work-project-card" data-featured={project.featured}>
    {project.featured && <ProjectCover project={project} />}
    <div className="work-card-main"><p className="muted project-type">{project.categories.join(" · ")}</p><h3><Link href={`/work/${project.slug}`}>{project.title}</Link></h3><p className="muted work-card-summary">{project.summary}</p></div>
    <div className="work-card-meta">{project.featured && <p className="featured-label">Featured project</p>}{project.technologies.length ? <ul className="technology-tags" aria-label="Technologies">{project.technologies.slice(0, 4).map((technology) => <li key={technology}>{technology}</li>)}{project.technologies.length > 4 && <li>+{project.technologies.length - 4} more</li>}</ul> : <p className="muted technology-pending">Technology details not published</p>}<Link className="text-link project-story-link" href={`/work/${project.slug}`}>Explore project<span className="sr-only">: {project.title}</span></Link></div>
  </article>;
}
