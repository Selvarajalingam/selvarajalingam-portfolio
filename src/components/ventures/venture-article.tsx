import Link from "next/link";
import { content } from "@/lib/content";
import type { Venture } from "@/lib/content/schema";
import { CompanyContext } from "./company-context";
import { VentureIdentity } from "./venture-identity";

export function VentureArticle({ venture }: { venture: Venture }) {
  return <><header className="venture-hero shell"><nav aria-label="Breadcrumb"><Link className="text-link" href="/ventures">Ventures</Link></nav><VentureIdentity venture={venture} /><h1>{venture.title}</h1><p className="venture-status">{venture.status}</p><p className="lead-copy">{venture.summary}</p><div className="venture-actions">{venture.website.status === "available" ? <a className="button button-primary" href={venture.website.url} target="_blank" rel="noopener noreferrer">Visit {venture.title} website{" "}<span className="sr-only">(opens in a new tab)</span></a> : <p className="venture-website-pending">Website coming soon</p>}<Link className={venture.website.status === "coming-soon" ? "button button-primary" : "text-link"} href="/connect">Enquire about {venture.title}</Link></div></header><CompanyContext /><nav className="venture-related shell" aria-label="More ventures"><h2>More ventures</h2><ul>{content.ventures.filter((record) => record.slug !== venture.slug).map((record) => <li key={record.slug}><Link className="text-link" href={`/ventures/${record.slug}`}>{record.title}</Link></li>)}</ul><Link className="text-link" href="/ventures">Back to Ventures</Link></nav></>;
}
