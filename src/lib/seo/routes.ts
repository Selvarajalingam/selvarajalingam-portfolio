import type { Metadata } from "next";
import { content } from "@/lib/content";
import { homepage } from "@/lib/content/homepage";
import { publication, type Publication } from "./publication";

export const siteTitle = "Selvarajalingam | Technology Educator, Software Developer & Product Builder";
export const socialImage = { path: "/assets/brand/og/portfolio.png", width: 1200, height: 630, alt: "selva. — Selvarajalingam. Technology Educator, Software Developer and Product Builder. teach. build. create. innovate." };
export const routeCatalog = [
  { path: "/", title: siteTitle, description: content.profile.description },
  { path: "/about", title: "About | Selvarajalingam", description: "Get to know Selvarajalingam: technology education, independent software development, product thinking, learning and interests beyond the code." },
  { path: "/work", title: "Work | Selvarajalingam", description: "Explore Selvarajalingam's full-stack applications, Java projects, desktop software, AI and data projects, with project summaries and technical notes." },
  { path: "/lab", title: "The Lab | Selvarajalingam", description: content.lab.length ? "Explore Selvarajalingam's technology explorations, product prototypes and learning notes." : "A space for Selvarajalingam's future technology explorations, product prototypes and learning notes. No experiments have been published yet." },
  { path: "/ventures", title: "Ventures | Selvarajalingam", description: "Explore CloudApex, BigIntellects, CanyonInk and Chennai Buyers, and Selvarajalingam's product and technology role at Gencanyon Technologies (OPC) Pvt. Ltd." },
  { path: "/services", title: "Services | Selvarajalingam", description: "Website and full-stack development, product design and prototyping, technical training and mentoring with Selvarajalingam." },
  { path: "/experience", title: "Experience | Selvarajalingam", description: "Explore Selvarajalingam's journey in self-directed learning, technical education, independent software development and product and technology contributions." },
  { path: "/connect", title: "Let's connect | Selvarajalingam", description: homepage.connect.body },
  { path: "/privacy", title: "Privacy Policy | Selvarajalingam", description: "How contact enquiries, security checks and website preferences are handled on Selvarajalingam's portfolio." },
  ...content.projects.map((entry) => ({ path: `/work/${entry.slug}`, title: `${entry.title} | Selvarajalingam`, description: entry.summary, ...(entry.updatedAt ? { modified: entry.updatedAt } : {}) })),
  ...content.ventures.map((entry) => ({ path: `/ventures/${entry.slug}`, title: `${entry.title} | Ventures | Selvarajalingam`, description: entry.summary })),
  ...content.lab.map((entry) => ({ path: `/lab/${entry.slug}`, title: `${entry.title} | The Lab | Selvarajalingam`, description: entry.summary, ...(entry.progress.updatedAt ? { modified: entry.progress.updatedAt } : {}) })),
];

export function routeMetadata(path: string, config: Publication = publication): Metadata {
  const route = routeCatalog.find((record) => record.path === path);
  if (!route) throw new Error("SEO metadata requires an actual content route");
  const url = config.origin ? new URL(path, config.origin).href : undefined;
  const images = config.origin ? [{ url: new URL(socialImage.path, config.origin).href, width: socialImage.width, height: socialImage.height, alt: socialImage.alt }] : undefined;
  return { title: route.title, description: route.description,
    ...(config.origin ? { metadataBase: new URL(config.origin), alternates: { canonical: url } } : {}),
    robots: { index: config.indexable, follow: config.indexable },
    openGraph: { title: route.title, description: route.description, siteName: content.profile.name, type: "website", ...(url ? { url } : {}), ...(images ? { images } : {}) },
    twitter: { card: "summary_large_image", title: route.title, description: route.description, ...(images ? { images } : {}) },
  };
}
export const rootMetadata: Metadata = { title: siteTitle, description: content.profile.description, ...(publication.origin ? { metadataBase: new URL(publication.origin) } : {}), robots: { index: publication.indexable, follow: publication.indexable }, applicationName: "selva.", category: "technology" };
