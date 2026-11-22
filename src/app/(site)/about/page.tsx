import { routeMetadata } from "@/lib/seo/routes";
import { PageStructuredData } from "@/components/seo/structured-data";
import type { Metadata } from "next";
import Link from "next/link";
import { about } from "@/lib/content/about";
import { content } from "@/lib/content";
import { homepage } from "@/lib/content/homepage";
import { HomeSection } from "@/components/sections/home-section";
import { SkillExplorer } from "@/components/skills/skill-explorer";
import { ResumePreview } from "@/components/profile/resume-preview";

export const metadata: Metadata = routeMetadata("/about");

export default function About() {
  return <div className="profile-page"><PageStructuredData path="/about" />
    <header className="profile-hero shell"><p className="muted">About Selvarajalingam</p><h1>{about.headline}</h1><div className="profile-hero-bottom"><p className="lead-copy">{about.introduction}</p><p className="muted profile-identity">{content.profile.identity}</p></div>
      <nav className="profile-index" aria-label="About sections"><a className="text-link" href="#story">My story</a><a className="text-link" href="#learning">Learning</a><a className="text-link" href="#skills">Skills</a><a className="text-link" href="#beyond-code">Beyond the code</a><a className="text-link" href="#resume">Resume</a></nav>
    </header>
    <HomeSection id="story" label="My story" heading="Learning by doing. Sharing by teaching.">
      <div className="profile-prose">{about.story.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div><blockquote>{homepage.introduction.philosophy}</blockquote><Link className="text-link" href="/experience">Explore my experience</Link>
    </HomeSection>
    <HomeSection id="learning" label="Education & learning" heading="Always a student of technology.">
      <div className="learning-records"><div><h3>{about.education.institution}</h3><p className="muted">{about.education.field}</p></div><div><p className="learning-record-status">{about.coursework.status}</p><h3>{about.coursework.subject}</h3><p className="muted">{about.coursework.platform} coursework</p></div><div><p className="learning-record-status">{about.cloudLearning.status}</p><h3>{about.cloudLearning.title}</h3><p className="muted">{about.cloudLearning.body}</p></div></div>
    </HomeSection>
    <HomeSection id="skills" label="Skills & practice" heading="A toolkit with room to grow." className="profile-skills-section"><SkillExplorer categories={content.skills} /></HomeSection>
    <HomeSection id="beyond-code" label="Beyond the code" heading="Other things that keep me curious."><div className="interests-list">{about.interests.map((interest) => <div key={interest.title}><h3>{interest.title}</h3><p className="muted">{interest.body}</p></div>)}</div></HomeSection>
    <HomeSection id="resume" label="Resume" heading="The professional overview."><ResumePreview resume={content.resume} /><div className="resume-context-links"><Link className="text-link" href="/experience">Read my experience</Link><Link className="text-link" href="/connect">Let&apos;s connect</Link></div></HomeSection>
  </div>;
}
