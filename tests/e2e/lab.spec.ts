import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("Lab launches empty and filter controls preserve an honest empty state", async ({ page }) => {
  await page.goto("/lab");
  await expect(page).toHaveTitle("The Lab | Selvarajalingam");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Room for the next idea.");
  await expect(page.locator(".lab-card")).toHaveCount(0);
  await expect(page.locator('main a[href^="/lab/"]')).toHaveCount(0);
  await expect(page.locator('select[aria-label="Lab category"] option')).toHaveCount(7);
  await expect(page.locator('select[aria-label="Progress status"] option')).toHaveCount(4);
  const search = page.getByRole("searchbox", { name: "Find an experiment" });
  await search.fill("an unsupplied idea");
  await page.getByRole("combobox", { name: "Lab category", exact: true }).selectOption("Developer Tools & Automation");
  await page.getByRole("combobox", { name: "Progress status", exact: true }).selectOption("Building");
  await expect(page.getByRole("heading", { name: "No experiments to share just yet." })).toBeVisible();
  await expect(page.getByRole("status")).toHaveText("No experiments published.");
  await page.getByRole("button", { name: "Reset filters" }).focus();
  await page.keyboard.press("Enter");
  await expect(search).toBeFocused();
  await expect(search).toHaveValue("");
  await expect(page.getByRole("combobox", { name: "Lab category", exact: true })).toHaveValue("All");
  await expect(page.getByRole("combobox", { name: "Progress status", exact: true })).toHaveValue("All");
  await page.getByRole("link", { name: "Explore my work", exact: true }).click();
  await expect(page).toHaveURL("/work");
});

for (const theme of ["dark", "light"]) {
  test(`Lab is accessible and responsive in ${theme}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/lab");
    await page.getByLabel("Color theme", { exact: true }).selectOption(theme);
    expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze()).violations).toEqual([]);
    const viewport = page.viewportSize()!;
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
    await page.setViewportSize(viewport);
    await expect(page.locator("main img, main canvas, main time")).toHaveCount(0);
    await page.screenshot({ path: test.info().outputPath(`lab-${theme}.png`), fullPage: true });
  });
}

test("unpublished and test-only slugs return 404", async ({ page }) => {
  for (const slug of ["not-a-real-experiment", "test-only"]) {
    expect((await page.goto(`/lab/${slug}`))?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("This page isn’t here.");
  }
});

test("the Lab empty state and real Work destination function without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3100/lab");
  await expect(page.getByRole("heading", { name: "No experiments to share just yet." })).toBeVisible();
  await expect(page.locator(".lab-card")).toHaveCount(0);
  await page.getByRole("link", { name: "Explore my work", exact: true }).click();
  await expect(page.locator(".work-results-grid article")).toHaveCount(10);
  await context.close();
});
