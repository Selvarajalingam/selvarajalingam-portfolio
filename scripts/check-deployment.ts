import { JSDOM } from "jsdom";
import { routeCatalog, socialImage } from "../src/lib/seo/routes";
import { publication } from "../src/lib/seo/publication";

// Explicit target only; never infer the approved production origin from this command.
const target = process.argv[2];
const mode = process.argv[3] ?? "preview";
let base: URL;
try {
  base = new URL(target ?? "");
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(base.hostname);
  if (base.origin !== target || base.username || base.password || !(base.protocol === "https:" || (local && base.protocol === "http:"))) throw new Error();
  if (!["preview", "production"].includes(mode)) throw new Error();
  if (mode === "production" && (publication.origin !== target || !publication.allowIndexing)) throw new Error();
} catch { throw new Error("Use npm run deploy:smoke -- <exact HTTPS origin or HTTP loopback origin> [preview|production]. Production requires the configured origin and approved indexing flag."); }

const indexable = mode === "production";
const headers: Record<string, string> = {};
if (process.env.SMOKE_PROTECTION_BYPASS) headers["x-vercel-protection-bypass"] = process.env.SMOKE_PROTECTION_BYPASS;
const failures: string[] = [];
function check(condition: unknown, message: string) { if (!condition) failures.push(message); }
async function get(path: string) {
  try {
    // Never forward bypass credentials to a redirect destination.
    return await fetch(new URL(path, base), { headers, redirect: "manual", signal: AbortSignal.timeout(8000) });
  } catch { failures.push(`${path}: request failed or timed out`); return null; }
}
for (const route of routeCatalog) {
  const response = await get(route.path);
  if (!response) continue;
  check(response.status === 200, `${route.path}: expected 200, received ${response.status}`);
  check(response.headers.get("content-type")?.includes("text/html"), `${route.path}: expected HTML`);
  check(response.headers.get("x-content-type-options") === "nosniff", `${route.path}: missing nosniff`);
  check(response.headers.get("x-frame-options") === "DENY", `${route.path}: missing framing protection`);
  check(response.headers.get("content-security-policy")?.includes("base-uri 'self'"), `${route.path}: missing base restriction`);
  check(indexable ? !response.headers.get("x-robots-tag")?.includes("noindex") : response.headers.get("x-robots-tag")?.includes("noindex"), `${route.path}: incorrect HTTP indexing state`);
  try {
    const dom = new JSDOM(await response.text());
    const document = dom.window.document;
    check(document.title === route.title, `${route.path}: title mismatch`);
    check(document.querySelectorAll("main").length === 1 && document.querySelectorAll("h1").length === 1, `${route.path}: missing/duplicate main or h1`);
    check(document.querySelector('meta[name="description"]')?.getAttribute("content") === route.description, `${route.path}: description mismatch`);
    check(document.querySelector('meta[property="og:title"]')?.getAttribute("content") === route.title && document.querySelector('meta[name="twitter:title"]')?.getAttribute("content") === route.title, `${route.path}: social title mismatch`);
    check(document.querySelector('meta[property="og:image"]')?.getAttribute("content") === (publication.origin ? new URL(socialImage.path, publication.origin).href : undefined), `${route.path}: social image origin mismatch`);
    const robots = document.querySelector('meta[name="robots"]')?.getAttribute("content") ?? "";
    check(indexable ? /\bindex\b/.test(robots) && !robots.includes("noindex") : robots.includes("noindex"), `${route.path}: incorrect meta indexing state`);
    const rawCanonical = document.querySelector('link[rel="canonical"]')?.getAttribute("href");
    check((rawCanonical ? new URL(rawCanonical).href : undefined) === (publication.origin ? new URL(route.path, publication.origin).href : undefined), `${route.path}: canonical mismatch`);
    dom.window.close();
  } catch { failures.push(`${route.path}: HTML could not be read`); }
}
const robots = await get("/robots.txt");
if (robots) { const text = await robots.text(); check(robots.ok && (indexable ? text.includes("Allow: /") && text.includes("Disallow: /api/") : /Disallow: \/\s*(?:\n|$)/.test(text)), "robots.txt: incorrect discovery state"); }
const sitemap = await get("/sitemap.xml");
if (sitemap) {
  const dom = new JSDOM(await sitemap.text(), { contentType: "application/xml" });
  const urls = [...dom.window.document.querySelectorAll("loc")].map((entry) => entry.textContent);
  check(sitemap.ok && JSON.stringify(urls.sort()) === JSON.stringify(indexable ? routeCatalog.map((route) => new URL(route.path, publication.origin!).href).sort() : []), "sitemap.xml: unexpected destinations");
  dom.window.close();
}
const image = await get(socialImage.path);
if (image) { const png = Buffer.from(await image.arrayBuffer()); check(image.ok && png.length >= 24 && png.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) && png.readUInt32BE(16) === 1200 && png.readUInt32BE(20) === 630, "Social image: invalid PNG/dimensions"); }
const icon = await get("/icon.svg");
if (icon) check(icon.ok && (await icon.text()).includes("<svg"), "Icon unavailable");
const missing = await get("/phase12-unpublished-route-check");
if (missing) check(missing.status === 404 && (await missing.text()).includes("noindex"), "Unknown route: expected noindex 404");
const contact = await get("/api/contact");
if (contact) {
  check(contact.ok && contact.headers.get("cache-control")?.includes("no-store"), "Contact availability: unavailable or cacheable");
  const data = await contact.json() as { available?: unknown };
  check(typeof data.available === "boolean", "Contact availability: invalid response");
  if (process.env.SMOKE_EXPECT_CONTACT !== "enabled") check(data.available === false, "Contact unexpectedly enabled; explicitly opt in to checking enabled availability after provider verification");
  else check(data.available === true, "Contact was expected to be enabled");
}
console.log(JSON.stringify({ mode, routesChecked: routeCatalog.length, failures, note: "Read-only HTTP smoke check; no email sent, browser UX, provider delivery or analytics intake verified." }, null, 2));
if (failures.length) process.exitCode = 1;
