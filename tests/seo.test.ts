import { describe, expect, it } from "vitest";
import { getPublication, publicationSchema } from "@/lib/seo/publication";
import { routeCatalog, routeMetadata } from "@/lib/seo/routes";
import { buildSitemap, buildRobots } from "@/lib/seo/discovery";
import { serializeJsonLd, siteStructuredData } from "@/lib/seo/structured-data";
import { permitsAnalytics, sanitizePageview } from "@/lib/analytics/policy";

const settings = { origin: "https://portfolio.test", allowIndexing: true, webAnalytics: true };
const production = getPublication({ VERCEL_ENV: "production", VERCEL: "1" }, settings);
describe("SEO publication boundary", () => {
  it("requires a genuine HTTPS origin and does not infer one from deployment headers", () => {
    expect(getPublication({ VERCEL_URL: "made-up.vercel.app" }, { ...settings, origin: null }).origin).toBeNull();
    for (const origin of ["http://portfolio.test", "https://portfolio.test/path", "https://user:pass@portfolio.test", "https://portfolio.test?email=x", "https://localhost", "https://example.com"]) expect(publicationSchema.safeParse({ ...settings, origin }).success).toBe(false);
  });
  it("keeps preview and local non-indexable and analytics-free even with the release flag", () => {
    for (const env of [{}, { VERCEL_ENV: "preview", VERCEL: "1" }]) {
      const result = getPublication(env, settings);
      expect(result.indexable).toBe(false); expect(result.analyticsEnabled).toBe(false);
      expect(buildSitemap(result)).toEqual([]);
      expect(buildRobots(result).rules).toEqual({ userAgent: "*", disallow: "/" });
    }
    expect(getPublication({ VERCEL_ENV: "production", VERCEL: "1" }, { ...settings, allowIndexing: false }).indexable).toBe(false);
  });
  it("enumerates only actual published content with unique titles and exact canonicals", () => {
    expect(routeCatalog).toHaveLength(23);
    expect(new Set(routeCatalog.map((route) => route.title)).size).toBe(23);
    for (const route of routeCatalog) {
      const meta = routeMetadata(route.path, production);
      expect(meta.alternates?.canonical).toBe(new URL(route.path, settings.origin).href);
      expect(meta.openGraph).toMatchObject({ title: route.title, description: route.description, url: new URL(route.path, settings.origin).href });
    }
    expect(routeCatalog.some((route) => route.path.startsWith("/api/") || route.path.startsWith("/lab/"))).toBe(false);
  });
  it("omits absolute SEO URLs until an origin is configured", () => {
    const result = routeMetadata("/about", getPublication({}, { ...settings, origin: null }));
    expect(result.alternates).toBeUndefined();
    expect(result.metadataBase).toBeUndefined();
    expect(result.openGraph).not.toHaveProperty("url");
  });
  it("publishes only true route URLs with no fabricated modification dates", () => {
    const sitemap = buildSitemap(production);
    expect(sitemap).toHaveLength(23);
    expect(sitemap.every((entry) => entry.url.startsWith(settings.origin) && entry.lastModified === undefined)).toBe(true);
    expect(buildRobots(production)).toMatchObject({ sitemap: "https://portfolio.test/sitemap.xml" });
  });
  it("serializes safe truthful structured data without unverified credentials or metrics", () => {
    const graph = siteStructuredData(production);
    expect(JSON.stringify(graph)).not.toMatch(/founder|award|alumniOf|hasCredential|200\+|aggregateRating/);
    expect(serializeJsonLd({ text: "</script><script>alert(1)</script>" })).not.toContain("<");
    expect(JSON.parse(serializeJsonLd(graph))).toEqual(graph);
    expect(siteStructuredData(getPublication({}, { ...settings, origin: null }))).toBeNull();
  });
});

describe("analytics privacy policy", () => {
  it("respects privacy signals and excludes sensitive/unknown referring URLs", () => {
    expect(permitsAnalytics({ doNotTrack: "1" }, "", settings.origin, ["/"])).toBe(false);
    expect(permitsAnalytics({ globalPrivacyControl: true }, "", settings.origin, ["/"])).toBe(false);
    for (const referrer of ["https://portfolio.test/?email=private", "https://portfolio.test/private-path", "https://other.test/user/private", "invalid"]) expect(permitsAnalytics({}, referrer, settings.origin, ["/"])).toBe(false);
    expect(permitsAnalytics({}, "https://other.test/", settings.origin, ["/"])).toBe(true);
  });
  it("keeps only known same-origin pageviews and strips visitor query/hash data", () => {
    expect(sanitizePageview({ type: "pageview", url: "https://portfolio.test/connect?email=private#message" }, settings.origin, ["/connect"])).toEqual({ type: "pageview", url: "https://portfolio.test/connect" });
    for (const event of [{ type: "event", url: "https://portfolio.test/connect", name: "private data" }, { type: "pageview", url: "https://evil.test/" }, { type: "pageview", url: "https://portfolio.test/api/contact" }, { type: "pageview", url: "invalid" }]) expect(sanitizePageview(event, settings.origin, ["/connect"])).toBeNull();
  });
});
