import { routeMetadata } from "@/lib/seo/routes";
import { PageStructuredData } from "@/components/seo/structured-data";
import type { Metadata } from "next";
import Link from "next/link";
import { content } from "@/lib/content";
import { about } from "@/lib/content/about";
import { HomeSection } from "@/components/sections/home-section";
import { JourneyTimeline } from "@/components/profile/journey-timeline";

export const metadata: Metadata = routeMetadata("/experience");

export default function Experience() {
  return <div className="profile-page"><PageStructuredData path="/experience" />
    <header className="profile-hero shell"><p className="muted">Experience</p><h1>Learning, teaching and building.</h1><div className="profile-hero-bottom"><p className="lead-copy">An ongoing practice of developing software, sharing technical knowledge and contributing to products.</p><p className="muted profile-identity">Selvarajalingam<br />{content.profile.identity}</p></div><nav className="profile-index" aria-label="Experience sections"><a className="text-link" href="#practice-journey">Journey</a><a className="text-link" href="#contributions">Contributions</a><a className="text-link" href="#product-role">Product & technology</a><Link className="text-link" href="/about#skills">Skills</Link></nav></header>
    <HomeSection id="practice-journey" label="My journey" heading="A connected practice."><JourneyTimeline entries={about.journey} /></HomeSection>
    <HomeSection id="contributions" label="Experience in practice" heading="Teaching and software, side by side."><div className="contributions-list">{about.contributions.map((contribution) => <div key={contribution.title}><h3>{contribution.title}</h3><p className="muted">{contribution.body}</p></div>)}</div><Link className="text-link" href="/work">Explore my work</Link></HomeSection>
    <HomeSection id="product-role" label="Product & technology" heading="Bringing a product perspective."><div className="role-list">{content.experience.map((record) => <div className="experience-role" key={record.slug}><p className="role-organisation">{record.organisation}</p><h3>{record.title}</h3><p className="muted">{record.summary}</p>{record.startDate && <p className="muted"><time dateTime={record.startDate}>{new Intl.DateTimeFormat("en", { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${record.startDate}T00:00:00Z`))}</time>{record.endDate && <> to <time dateTime={record.endDate}>{new Intl.DateTimeFormat("en", { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${record.endDate}T00:00:00Z`))}</time></>}</p>}</div>)}</div><Link className="text-link" href="/ventures">Explore the ventures</Link></HomeSection>
    <HomeSection id="experience-connect" label="Let's connect" heading="Bring learning and building to your next idea."><p className="lead-copy">{content.profile.name} · Technology Educator, Software Developer & Product Builder</p><Link className="button button-primary" href="/connect">Let&apos;s connect</Link></HomeSection>
  </div>;
}
