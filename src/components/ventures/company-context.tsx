import { ventureAssociation } from "@/lib/content/ventures";

export function CompanyContext() {
  return <section className="venture-company shell" aria-labelledby="venture-company-heading"><h2 id="venture-company-heading">{ventureAssociation.organisation}</h2><div><p className="muted">My role</p><p className="venture-company-role">{ventureAssociation.title}</p><p className="muted">{ventureAssociation.summary}</p></div></section>;
}
