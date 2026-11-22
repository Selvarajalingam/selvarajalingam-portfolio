import { content } from "@/lib/content";
import { routeCatalog } from "./routes";
import { publication, type Publication } from "./publication";

export function serializeJsonLd(value: unknown) { return JSON.stringify(value).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029"); }
export function siteStructuredData(config: Publication = publication) {
  if (!config.origin) return null;
  const home = `${config.origin}/`;
  return { "@context": "https://schema.org", "@graph": [
    { "@type": "Person", "@id": `${home}#person`, name: content.profile.name, url: home, description: content.profile.hero, sameAs: content.social.map((link) => link.url) },
    { "@type": "WebSite", "@id": `${home}#website`, name: content.profile.name, url: home, inLanguage: "en", publisher: { "@id": `${home}#person` } },
  ] };
}
export function pageStructuredData(path: string, config: Publication = publication) {
  const route = routeCatalog.find((entry) => entry.path === path);
  if (!route || !config.origin) return null;
  const url = new URL(path, config.origin).href;
  return { "@context": "https://schema.org", "@type": path === "/connect" ? "ContactPage" : path === "/about" ? "AboutPage" : ["/work", "/lab", "/ventures"].includes(path) ? "CollectionPage" : "WebPage", "@id": `${url}#webpage`, url, name: route.title, description: route.description, inLanguage: "en", isPartOf: { "@id": `${config.origin}/#website` } };
}
