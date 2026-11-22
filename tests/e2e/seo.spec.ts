import { expect, test } from "@playwright/test";
import { JSDOM } from "jsdom";
import projects from "../../src/content/projects/index.json" with { type: "json" };
import ventures from "../../src/content/ventures/index.json" with { type: "json" };
import publication from "../../src/content/publication.json" with { type: "json" };
const paths = ["/", "/about", "/work", "/lab", "/ventures", "/services", "/experience", "/connect", "/privacy", ...projects.map((entry) => `/work/${entry.slug}`), ...ventures.map((entry) => `/ventures/${entry.slug}`)];
const production = process.env.VERCEL_ENV === "production" && process.env.VERCEL === "1";
const indexable = Boolean(publication.origin && publication.allowIndexing && production);

test("all actual pages have unique consistent SEO without a guessed origin", async ({ request }) => {
  const titles = new Set<string>();
  for (const path of paths) {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    expect(response.headers()["x-robots-tag"]).toBe(indexable ? undefined : "noindex, nofollow");
    const dom = new JSDOM(await response.text());
    const document = dom.window.document;
    const meta = (selector: string) => document.querySelector(selector)?.getAttribute("content");
    expect(document.title).not.toBe(""); expect(titles.has(document.title)).toBe(false); titles.add(document.title);
    expect(meta('meta[property="og:title"]')).toBe(document.title);
    expect(meta('meta[name="twitter:title"]')).toBe(document.title);
    expect(meta('meta[property="og:description"]')).toBe(meta('meta[name="description"]'));
    expect(meta('meta[name="robots"]')).toBe(indexable ? "index, follow" : "noindex, nofollow");
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe(publication.origin ? new URL(path, publication.origin).href : undefined);
    if (!publication.origin) {
      expect(meta('meta[property="og:url"]')).toBeUndefined();
      expect(meta('meta[property="og:image"]')).toBeUndefined();
      expect(document.querySelectorAll('script[type="application/ld+json"]')).toHaveLength(0);
    }
    dom.window.close();
  }
});

test("unreleased discovery is blocked and unknown pages have no homepage canonical", async ({ page, request }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200); expect(await robots.text()).toContain(indexable ? "Allow: /" : "Disallow: /");
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200); expect(((await sitemap.text()).match(/<loc>/g) ?? []).length).toBe(indexable ? paths.length : 0);
  expect((await page.goto("/unknown-seo-page"))?.status()).toBe(404);
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  expect((await request.get("/api/github")).headers()["x-robots-tag"]).toBe("noindex, nofollow");
});

test("social artwork is a real correctly sized PNG and the original icon is available", async ({ request }) => {
  const response = await request.get("/assets/brand/og/portfolio.png");
  expect(response.status()).toBe(200); expect(response.headers()["content-type"]).toContain("image/png");
  const bytes = await response.body();
  expect(bytes.readUInt32BE(16)).toBe(1200); expect(bytes.readUInt32BE(20)).toBe(630);
  const icon = await request.get("/icon.svg"); expect(icon.status()).toBe(200); expect(await icon.text()).toContain("<svg");
});

test("local/preview pages emit no analytics requests or scripts", async ({ page }) => {
  const tracking: string[] = [];
  page.on("request", (request) => { if (/insights|google-analytics|googletagmanager|vercel-insights/.test(request.url())) tracking.push(request.url()); });
  await page.goto("/connect?email=test-only-sensitive#message");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Let's connect");
  await page.goto("/privacy");
  await expect(page.getByText(publication.origin && publication.webAnalytics && production ? "Vercel Web Analytics is enabled for this production deployment" : "Vercel Web Analytics is disabled in this deployment.", { exact: false })).toBeVisible();
  await expect(page.locator('script[src*="insights"], script[src*="googletagmanager"]')).toHaveCount(0);
  expect(tracking).toEqual([]);
  expect(await page.evaluate(() => typeof window.va)).toBe("undefined");
});
