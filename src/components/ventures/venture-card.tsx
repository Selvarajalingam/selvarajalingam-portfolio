import Link from "next/link";
import type { Venture } from "@/lib/content/schema";
import { VentureIdentity } from "./venture-identity";

export function VentureCard({ venture }: { venture: Venture }) {
  return <li className="venture-card"><VentureIdentity venture={venture} /><p className="venture-status">{venture.status}</p><h2><Link href={`/ventures/${venture.slug}`}>{venture.title}</Link></h2><p className="muted">{venture.website.status === "available" ? new URL(venture.website.url).hostname : "Website coming soon"}</p><Link className="text-link" href={`/ventures/${venture.slug}`}>Explore {venture.title}</Link></li>;
}
