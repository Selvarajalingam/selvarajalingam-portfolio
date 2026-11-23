import type { ProjectSummary } from "@/lib/projects";

/** Decorative editorial cover, deliberately not a product screenshot or logo. */
export function ProjectCover({ project }: { project: ProjectSummary }) {
  return <div className="project-cover" data-project={project.slug} aria-hidden="true">
    <span className="project-cover-discipline">{project.categories[0]}</span>
    <span className="project-cover-title">{project.title}</span>
    <span className="project-cover-line" />
    <span className="project-cover-caption">Independent software project</span>
  </div>;
}
