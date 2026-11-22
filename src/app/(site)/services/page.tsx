import { routeMetadata } from "@/lib/seo/routes";
import { PageStructuredData } from "@/components/seo/structured-data";
import type { Metadata } from "next";
import Link from "next/link";
import { content } from "@/lib/content";

export const metadata: Metadata = routeMetadata("/services");
export default function Services() {
  return <><PageStructuredData path="/services" /><header className="service-hero shell"><p className="muted">Working together</p><h1>From an idea to something useful.</h1><p className="lead-copy">Software development, product design and technical education.</p></header><section className="service-collection shell" aria-label="Services"><div className="service-introduction"><h2>What I can help with</h2><Link className="text-link" href="/work">Explore my work</Link></div><div className="service-accordions">{content.services.map((service) => <details key={service.slug}><summary>{service.title}</summary><div className="service-content"><ul>{service.items.map((item) => <li key={item}>{item}</li>)}</ul><Link className="text-link" href="/connect">Enquire about {service.title}</Link></div></details>)}</div></section><section className="service-closing shell"><h2>Have something in mind?</h2><Link className="button button-primary" href="/connect">Let&apos;s connect</Link></section></>;
}
