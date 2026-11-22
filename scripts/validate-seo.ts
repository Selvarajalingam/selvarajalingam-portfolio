import { readFileSync, existsSync } from "node:fs";
import { JSDOM } from "jsdom";
import { routeCatalog, socialImage } from "../src/lib/seo/routes";
import { publication } from "../src/lib/seo/publication";

function requireCondition(condition: unknown, message: string) { if (!condition) throw new Error(message); }
const titles = new Set<string>();
for (const route of routeCatalog) {
  const filename = `.next/server/app/${route.path === "/" ? "index" : route.path.slice(1)}.html`;
  const dom = new JSDOM(readFileSync(filename, "utf8"));
  const document = dom.window.document;
  const value = (selector: string) => document.querySelector(selector)?.getAttribute("content");
  requireCondition(document.title === route.title && !titles.has(document.title), `Missing/duplicate title: ${route.path}`);
  titles.add(document.title);
  requireCondition(document.querySelectorAll("h1").length === 1, `Expected one h1: ${route.path}`);
  requireCondition(value('meta[name="description"]') === route.description, `Incorrect description: ${route.path}`);
  requireCondition(value('meta[property="og:title"]') === route.title && value('meta[property="og:description"]') === route.description, `Incorrect Open Graph data: ${route.path}`);
  requireCondition(value('meta[name="twitter:title"]') === route.title && value('meta[name="twitter:card"]') === "summary_large_image", `Incorrect Twitter metadata: ${route.path}`);
  const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute("href");
  requireCondition(canonical === (publication.origin ? new URL(route.path, publication.origin).href : undefined), `Incorrect canonical: ${route.path}`);
  requireCondition(value('meta[property="og:url"]') === canonical, `OG URL differs from canonical: ${route.path}`);
  const jsonLd = Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map((script) => JSON.parse(script.textContent ?? ""));
  requireCondition(jsonLd.length === (publication.origin ? 2 : 0), `Unexpected structured data: ${route.path}`);
  if (publication.origin) requireCondition(value('meta[property="og:image"]') === new URL(socialImage.path, publication.origin).href, `Missing shared social image: ${route.path}`);
  else requireCondition(!value('meta[property="og:image"]'), `Guessed social image origin: ${route.path}`);
  if (!publication.indexable) requireCondition(value('meta[name="robots"]')?.includes("noindex"), `Preview is indexable: ${route.path}`);
  dom.window.close();
}
const png = readFileSync(`public${socialImage.path}`);
requireCondition(png.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) && png.readUInt32BE(16) === 1200 && png.readUInt32BE(20) === 630, "Social image must be a real 1200x630 PNG");
requireCondition(existsSync("src/app/icon.svg"), "Missing original site icon");
console.log(`SEO artifacts valid: ${routeCatalog.length} unique actual routes; publication ${publication.indexable ? "indexable" : "noindex"}; origin ${publication.origin ?? "unconfigured"}; 1200x630 PNG verified.`);
