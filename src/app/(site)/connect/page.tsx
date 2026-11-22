import { routeMetadata } from "@/lib/seo/routes";
import { PageStructuredData } from "@/components/seo/structured-data";
import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/contact-form";
import { content } from "@/lib/content";
import { homepage } from "@/lib/content/homepage";

export const metadata: Metadata = routeMetadata("/connect");
export default function Connect() {
  return <><PageStructuredData path="/connect" /><header className="contact-hero shell"><h1>Let&apos;s connect</h1><p className="lead-copy">{homepage.connect.body}</p></header><section className="contact-layout shell" aria-label="Get in touch"><aside className="contact-introduction"><h2>Start a conversation.</h2><p className="muted">{homepage.connect.availability}</p><a className="text-link contact-email" href={`mailto:${content.profile.email}`}>{content.profile.email}</a></aside><ContactForm /></section></>;
}
