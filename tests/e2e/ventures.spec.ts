import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import ventures from "../../src/content/ventures/index.json" with { type: "json" };

test("venture directory links to four factual detail pages and real enquiry destinations", async ({ page }) => {
  await page.goto("/ventures");
  await expect(page).toHaveTitle("Ventures | Selvarajalingam");
  await expect(page.locator(".venture-card")).toHaveCount(4);
  for (const venture of ventures) {
    await page.getByRole("link", { name: `Explore ${venture.title}`, exact: true }).click();
    await expect(page).toHaveURL(`/ventures/${venture.slug}`);
    await expect(page).toHaveTitle(`${venture.title} | Ventures | Selvarajalingam`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(venture.title);
    await expect(page.locator(".venture-status")).toHaveText("Live & Active");
    await expect(page.getByText("Product & Technology Lead | Business & Product Development Lead", { exact: true })).toBeVisible();
    await expect(page.locator("main img, main canvas, main time")).toHaveCount(0);
    if (venture.website.status === "available") {
      const link = page.getByRole("link", { name: `Visit ${venture.title} website (opens in a new tab)` });
      await expect(link).toHaveAttribute("href", venture.website.url!);
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", "noopener noreferrer");
    } else {
      await expect(page.getByText("Website coming soon", { exact: true })).toBeVisible();
      await expect(page.locator('main a[target="_blank"]')).toHaveCount(0);
    }
    const enquiry = page.getByRole("link", { name: `Enquire about ${venture.title}`, exact: true });
    await enquiry.focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL("/connect");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Let's connect");
    await page.goBack();
    await page.getByRole("link", { name: "Back to Ventures", exact: true }).click();
  }
});

for (const theme of ["dark", "light"]) {
  test(`venture routes are accessible and responsive in ${theme}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/ventures");
    await page.getByLabel("Color theme", { exact: true }).selectOption(theme);
    const viewport = page.viewportSize()!;
    for (const slug of ["", ...ventures.map((venture) => venture.slug)]) {
      await page.goto(`/ventures${slug ? `/${slug}` : ""}`);
      expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze()).violations).toEqual([]);
      for (const width of [320, 390, 768, 1024, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      }
      await page.setViewportSize(viewport);
      await page.screenshot({ path: test.info().outputPath(`ventures-${slug || "index"}-${theme}.png`), fullPage: true });
    }
  });
}

test("unknown ventures return 404", async ({ page }) => {
  expect((await page.goto("/ventures/not-a-supplied-venture"))?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("This page isn’t here.");
});

test("homepage and venture navigation work without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3100/");
  await page.locator('#ventures a[href="/ventures/chennai-buyers"]').click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Chennai Buyers");
  await expect(page.getByText("Website coming soon", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Back to Ventures", exact: true }).click();
  await expect(page.locator(".venture-card")).toHaveCount(4);
  await page.getByRole("link", { name: "Explore CloudApex", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("CloudApex");
  await context.close();
});
