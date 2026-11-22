import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("foundation is readable, keyboard accessible and has valid destinations", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Selvarajalingam | Technology Educator, Software Developer & Product Builder");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("I teach technology");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  await page.getByRole("link", { name: "Explore my work" }).click();
  await expect(page).toHaveURL(/#selected-work$/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  const localLinks = await page.locator('a[href^="/"]').evaluateAll((links) => links.map((link) => link.getAttribute("href")!));
  for (const href of new Set(localLinks)) expect((await page.request.get(href)).status()).toBe(200);
  const response = await page.request.get("/");
  expect(response.headers()["x-content-type-options"]).toBe("nosniff");
});

for (const theme of ["dark", "light"] as const) {
  test(`${theme} tokens pass automated accessibility with reduced motion`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.locator("html").evaluate((element, value) => element.setAttribute("data-theme", value), theme);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    expect(results.violations).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
}

test("unknown routes return a useful 404", async ({ page }) => {
  const response = await page.goto("/not-a-real-page");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("This page isn’t here.");
  await page.getByRole("link", { name: "Back to home" }).click();
  await expect(page).toHaveURL("/");
});
