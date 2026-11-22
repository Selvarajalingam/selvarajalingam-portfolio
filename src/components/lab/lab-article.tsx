import Image from "next/image";
import Link from "next/link";
import type { LabExperiment } from "@/lib/content/schema";
import { HomeSection } from "@/components/sections/home-section";
import { StatusBadge } from "./status-badge";

function dateLabel(date: string) { return new Intl.DateTimeFormat("en", { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`)); }

export function LabArticle({ entry }: { entry: LabExperiment }) {
  return <div className="lab-detail"><header className="lab-hero shell"><nav aria-label="Breadcrumb"><Link className="text-link" href="/lab">The Lab</Link></nav><p className="muted">{entry.category}</p><h1>{entry.title}</h1><StatusBadge status={entry.status} /><p className="lead-copy">{entry.summary}</p>{entry.image && <figure className="lab-detail-image"><Image src={entry.image.src} alt={entry.image.alt} width={entry.image.width} height={entry.image.height} sizes="(max-width: 700px) 100vw, 80vw" /><figcaption className="muted">{entry.image.caption}</figcaption></figure>}</header>
    <HomeSection id="idea" label="The idea" heading="Idea & intent"><p className="lead-copy">{entry.idea}</p></HomeSection>
    <HomeSection id="progress" label="Current progress" heading="Progress snapshot"><StatusBadge status={entry.status} /><p className="lead-copy">{entry.progress.summary}</p>{entry.progress.updatedAt && <p className="muted">Updated <time dateTime={entry.progress.updatedAt}>{dateLabel(entry.progress.updatedAt)}</time></p>}{entry.progress.nextSteps && <div className="lab-next-steps"><h3>Next steps</h3><ul>{entry.progress.nextSteps.map((step) => <li key={step}>{step}</li>)}</ul></div>}</HomeSection>
    {entry.timeline && <HomeSection id="progress-notes" label="Along the way" heading="Progress notes"><ol className="lab-timeline">{entry.timeline.map((note, index) => <li key={`${note.date}-${index}`}><time className="muted" dateTime={note.date}>{dateLabel(note.date)}</time><h3>{note.title}</h3><p>{note.body}</p></li>)}</ol></HomeSection>}
    {entry.learnings && <HomeSection id="learnings" label="Learning" heading="What I learned"><ul className="lab-learnings">{entry.learnings.map((note) => <li key={note}>{note}</li>)}</ul></HomeSection>}
    <div className="lab-detail-links shell">{entry.demoUrl && <a className="button button-primary" href={entry.demoUrl} target="_blank" rel="noopener noreferrer">View experiment<span className="sr-only"> (opens in a new tab)</span></a>}{entry.repositoryUrl && <a className="text-link" href={entry.repositoryUrl} target="_blank" rel="noopener noreferrer">Source code<span className="sr-only"> (opens in a new tab)</span></a>}<Link className="text-link" href="/lab">Back to The Lab</Link></div>
  </div>;
}
