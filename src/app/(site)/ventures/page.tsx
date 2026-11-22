import { routeMetadata } from "@/lib/seo/routes";
import { PageStructuredData } from "@/components/seo/structured-data";
import type { Metadata } from "next";
import { content } from "@/lib/content";
import { CompanyContext } from "@/components/ventures/company-context";
import { VentureCard } from "@/components/ventures/venture-card";

export const metadata: Metadata = routeMetadata("/ventures");

export default function Ventures() {
  return <><PageStructuredData path="/ventures" /><header className="venture-hero shell"><p className="muted">Business & ventures</p><h1>A product perspective.</h1><p className="lead-copy">Strategy, design, software and the work that brings them together.</p></header><CompanyContext /><section className="venture-directory shell" aria-labelledby="venture-directory-heading"><h2 id="venture-directory-heading">The ventures</h2><ul className="venture-grid">{content.ventures.map((venture) => <VentureCard key={venture.slug} venture={venture} />)}</ul></section></>;
}
