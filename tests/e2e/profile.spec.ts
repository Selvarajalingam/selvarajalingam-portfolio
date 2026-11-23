import { chooseSelect } from "../helpers/select";
import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const route of ["about", "experience"] as const) {
  for (const theme of ["dark", "light"] as const) {
    test(`${route} is accessible and responsive in ${theme}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      const response = await page.goto(`/${route}`);
      expect(response?.status()).toBe(200);
      await chooseSelect(page, "Color theme", theme);
      await expect(page).toHaveTitle(`${route === "about" ? "About" : "Experience"} | Selvarajalingam`);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(route === "about" ? "Curiosity, put into practice." : "Learning, teaching and building.");
      expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze()).violations).toEqual([]);
      const initial = page.viewportSize()!;
      for (const width of [320, 390, 768, 1024, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      }
      await page.setViewportSize(initial);
      await page.getByRole("link", { name: "Skip to content" }).focus();
      await page.keyboard.press("Enter");
      await expect(page.locator("main")).toBeFocused();
      const links = await page.locator('a[href^="/"]').evaluateAll((elements) => elements.map((element) => element.getAttribute("href")!));
      for (const href of new Set(links)) expect((await page.request.get(href)).status()).toBe(200);
      await expect(page.locator("iframe")).toHaveCount(0);
      await expect(page.locator(".sculpture-canvas")).toHaveCount(0);
      await page.screenshot({ path: test.info().outputPath(`${route}-${theme}.png`), fullPage: theme === "dark" });
    });
  }
}

test("skill search and practice filters compose, announce and reset with keyboard focus", async ({ page }) => {
  await page.goto("/about#skills");
  const search = page.getByRole("searchbox", { name: "Find a skill" });
  await search.fill("  Spring Boot  ");
  await page.getByRole("button", { name: "Strengthening", exact: true }).focus();
  await page.keyboard.press("Space");
  await expect(page.locator(".skill-category li")).toHaveCount(1);
  await expect(page.getByRole("status")).toHaveText("Showing 1 skill across 1 category.");
  await page.getByRole("button", { name: "Applied", exact: true }).focus();
  await page.keyboard.press("Space");
  await expect(page.getByText("No skills match these filters.")).toBeVisible();
  await page.getByRole("button", { name: "Reset filters" }).click();
  await expect(search).toBeFocused();
  await expect(search).toHaveValue("");
  await expect(page.locator(".skill-category")).toHaveCount(7);
  await search.fill("AWS");
  await page.getByRole("button", { name: "Learning", exact: true }).click();
  await expect(page.locator(".skill-category li")).toHaveCount(1);
  await expect(page.locator(".skill-category li")).toContainText("currently being pursued");
  await search.fill("<script>alert(1)</script>");
  await expect(page.getByText("No skills match these filters.")).toBeVisible();
  await page.getByRole("button", { name: "Reset filters" }).click();
  await page.screenshot({ path: test.info().outputPath("skills-desktop-or-mobile.png"), fullPage: false });
});

test("profile content remains complete without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3100/about");
  await expect(page.locator(".skill-category")).toHaveCount(7);
  await expect(page.getByText("Currently pursuing")).toBeVisible();
  await expect(page.locator("#resume").getByText("Resume updating", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Explore my experience" }).click();
  await expect(page).toHaveURL(/\/experience$/);
  await expect(page.locator(".profile-timeline li")).toHaveCount(3);
  await expect(page.getByText("Product & Technology Lead | Business & Product Development Lead")).toBeVisible();
  await context.close();
});
