import { chooseSelect } from "../helpers/select";
import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import curation from "../../src/content/github/repositories.json" with { type: "json" };

test("curated repository links survive a failed API without fake counts", async ({ page }) => {
  const upstreamRequests: string[] = [];
  page.on("request", (request) => { if (/api\.github\.com|youtube\.com|googleapis\.com/.test(request.url())) upstreamRequests.push(request.url()); });
  await page.route("**/api/github", (route) => route.fulfill({ status: 503, json: { error: "test-only outage" } }));
  await page.goto("/");
  await page.locator(".github-repositories").scrollIntoViewIfNeeded();
  await expect(page.locator(".repository-card")).toHaveCount(4);
  await expect(page.locator(".repository-fallback")).toBeVisible();
  await expect(page.locator(".repository-metadata")).toHaveCount(0);
  for (const repository of curation.repositories) await expect(page.locator(`.repository-card a[href="${repository.url}"]`)).toBeVisible();
  await expect(page.locator("#cloud .cloud-resource")).toHaveCount(0);
  await expect(page.locator("#cloud .learning-status")).toContainText("Currently pursuing");
  await expect(page.locator("#cloud iframe, #cloud img")).toHaveCount(0);
  expect(upstreamRequests).toEqual([]);
});

test("only matching validated snapshot fields enhance curated repositories (mocked)", async ({ page }) => {
  await page.route("**/api/github", (route) => route.fulfill({ json: { repositories: [
    { ...curation.repositories[0], metadata: { stars: 0, forks: 2, language: "Java", checkedAt: "2026-11-19T00:00:00Z" }, description: "UNREVIEWED_DESCRIPTION" },
    { ...curation.repositories[1], metadata: { stars: -1, forks: 2, language: "Python", checkedAt: "invalid" } },
    { name: "unapproved-repository", url: "https://evil.test/", metadata: { stars: 1000, forks: 5, language: "Unknown", checkedAt: "2026-11-19T00:00:00Z" } },
  ] } }));
  await page.goto("/"); await page.locator(".github-repositories").scrollIntoViewIfNeeded();
  await expect(page.locator(".repository-metadata")).toHaveCount(1);
  await expect(page.locator(".repository-metadata").first()).toContainText("Main language: Java");
  await expect(page.locator(".repository-metadata dd")).toHaveText(["0", "2"]);
  await expect(page.locator(".repository-checked time")).toHaveAttribute("datetime", "2026-11-19T00:00:00Z");
  await expect(page.getByText("UNREVIEWED_DESCRIPTION")).toHaveCount(0);
  await expect(page.locator('main a[href="https://evil.test/"]')).toHaveCount(0);
  await expect(page.locator(".repository-fallback")).toBeVisible();
});

test("the actual disabled snapshot API is safe and independent of arbitrary query input", async ({ request }) => {
  const response = await request.get("/api/github?owner=someone-else&url=https://evil.test");
  expect(response.status()).toBe(200);
  expect(response.headers()["cache-control"]).toBe("no-store");
  const body = await response.json();
  expect(body.repositories).toHaveLength(4);
  expect(body.repositories.every((repository: { metadata: unknown }) => repository.metadata === null)).toBe(true);
  expect(JSON.stringify(body)).not.toMatch(/someone-else|evil|token|Authorization|description/);
});

for (const theme of ["dark", "light"]) {
  test(`repository snapshots are accessible and responsive in ${theme}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.route("**/api/github", (route) => route.fulfill({ json: { repositories: curation.repositories.map((repository) => ({ name: repository.name, url: repository.url, metadata: { stars: 0, forks: 0, language: null, checkedAt: "2026-11-19T00:00:00Z" } })) } }));
    await page.goto("/"); await chooseSelect(page, "Color theme", theme);
    await page.locator(".github-repositories").scrollIntoViewIfNeeded();
    await expect(page.locator(".repository-metadata")).toHaveCount(4);
    expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze()).violations).toEqual([]);
    const viewport = page.viewportSize()!;
    for (const width of [320, 390, 768, 1024, 1440]) { await page.setViewportSize({ width, height: 900 }); expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true); }
    await page.setViewportSize(viewport);
    await page.locator(".github-repositories").screenshot({ path: test.info().outputPath(`github-${theme}-mocked-metadata.png`) });
  });
}

test("curated GitHub and honest cloud content remain readable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage(); await page.goto("http://127.0.0.1:3100/");
  await expect(page.locator(".repository-card")).toHaveCount(4);
  await expect(page.locator(".repository-metadata")).toHaveCount(0);
  const link = page.locator(".repository-card a").first();
  await expect(link).toHaveAttribute("href", curation.repositories[0]!.url);
  await expect(link).toHaveAttribute("rel", "noopener noreferrer");
  await expect(page.locator("#cloud .empty-copy")).toContainText("when the links are ready");
  await expect(page.locator("#cloud .learning-status")).toContainText("Currently pursuing");
  await context.close();
});
