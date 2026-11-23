import { routeMetadata } from "@/lib/seo/routes";
import { PageStructuredData } from "@/components/seo/structured-data";
import Link from "next/link";
import { content } from "@/lib/content";
import { homepage as home } from "@/lib/content/homepage";
import { ventureAssociation } from "@/lib/content/ventures";
import { SculptureVisual } from "@/components/hero/sculpture-visual";
import { HomeSection } from "@/components/sections/home-section";
import { githubCuration } from "@/lib/content/github";
import { GitHubRepositories } from "@/components/resources/github-repositories";
import { CloudResources } from "@/components/resources/cloud-resources";
import { ProjectCover } from "@/components/projects/project-cover";

export const metadata = routeMetadata("/");

export default function Home() {
  const { profile } = content;
  return <><PageStructuredData path="/" />
    <section id="hero" className="hero shell" aria-labelledby="hero-heading">
      <div className="hero-introduction"><p>{profile.name}</p><p className="muted identity">{profile.identity}</p></div>
      <div className="hero-stage"><h1 id="hero-heading">{profile.hero}</h1><SculptureVisual /></div>
      <div className="hero-bottom"><p className="tagline">{profile.tagline}</p><div className="flex flex-wrap gap-3">
        <Link className="button button-primary" href="/connect">Let&apos;s connect</Link>
        <a className="button button-secondary" href="#selected-work">Explore my work</a>
      </div></div>
    </section>
    <HomeSection id="introduction" label="A little introduction" heading={home.introduction.heading}>
      <p className="lead-copy">{home.introduction.body}</p><Link className="text-link" href="/about">More about me</Link>
    </HomeSection>
    <HomeSection id="selected-work" label="Featured work" heading="Ideas, put into practice." className="featured-section">
      <div className="section-lead"><p className="muted">A selection of independently developed software projects.</p><Link className="text-link" href="/work">Explore all work</Link></div>
      <div className="featured-grid">{home.featured.map((reference) => { const project = content.projects.find((record) => record.slug === reference.slug)!; return <article className="featured-project" key={project.slug}>
        <ProjectCover project={project} /><div className="featured-project-copy"><p className="project-context">{reference.context}</p><h3><Link href={`/work/${project.slug}`}>{project.title}</Link></h3><p className="muted">{project.summary}</p><Link className="text-link project-story-link" href={`/work/${project.slug}`}>Explore project<span className="sr-only">: {project.title}</span></Link></div>
      </article>; })}</div>
      <GitHubRepositories repositories={githubCuration.repositories.map(({ name, url }) => ({ name, url }))} profileUrl={githubCuration.profileUrl} />
    </HomeSection>
    <HomeSection id="what-i-do" label="What I do" heading="From a question to something useful.">
      <div className="service-pillars">{home.services.map((service) => <div key={service.title}><h3>{service.title}</h3><p className="muted">{service.body}</p></div>)}</div>
      <Link className="text-link" href="/services">Ways to work together</Link>
    </HomeSection>
    <HomeSection id="journey" label="My journey" heading="Learn. Share. Build. Repeat.">
      <ol className="journey-list">{home.journey.map((step) => <li key={step.title}><h3>{step.title}</h3><p className="muted">{step.body}</p></li>)}</ol>
      <Link className="text-link" href="/experience">Explore my journey</Link>
    </HomeSection>
    <HomeSection id="impact" label="Impact & experience" heading={home.impact.heading}>
      <p className="lead-copy">{home.impact.body}</p><blockquote>{home.introduction.philosophy}</blockquote>
    </HomeSection>
    <HomeSection id="skills" label="Technical skills" heading="A toolkit that keeps growing.">
      <div className="skills-list">{home.skills.map((skill) => <details key={skill.title}><summary>{skill.title}<span aria-hidden="true" className="disclosure-symbol" /></summary><p className="muted">{skill.body}</p></details>)}</div>
      <p className="section-note muted">Java and Spring Boot are areas I&apos;m actively strengthening.</p>
    </HomeSection>
    <HomeSection id="cloud" label="AWS & cloud" heading={home.cloud.heading}>
      <p className="learning-status">{home.cloud.credential}</p><CloudResources resources={content.resources} emptyState={home.cloud.emptyState} />
    </HomeSection>
    <HomeSection id="ventures" label="Business & ventures" heading="Building with a product perspective.">
      <div className="venture-introduction"><p className="lead-copy">{ventureAssociation.organisation}</p><p className="venture-role">{ventureAssociation.title}</p><p className="muted">{ventureAssociation.summary}</p></div>
      <ul className="venture-names">{content.ventures.map((venture) => <li key={venture.slug}><Link className="text-link" href={`/ventures/${venture.slug}`}>{venture.title}</Link>{venture.website.status === "coming-soon" && <span className="muted">Website coming soon</span>}</li>)}</ul>
      <Link className="text-link" href="/ventures">Explore the ventures</Link>
    </HomeSection>
    <HomeSection id="lab" label="The Lab" heading={home.lab.heading}>
      <p className="muted empty-copy">{content.lab.length ? home.lab.publishedIntro : home.lab.emptyState}</p><Link className="text-link" href="/lab">Visit The Lab</Link>
    </HomeSection>
    <HomeSection id="connect" label="Let's connect" heading={home.connect.heading} className="connect-section">
      <p className="lead-copy">{home.connect.body}</p><p className="muted empty-copy">{home.connect.availability}</p><Link className="button button-primary" href="/connect">Let&apos;s connect</Link>
    </HomeSection>
  </>;
}
