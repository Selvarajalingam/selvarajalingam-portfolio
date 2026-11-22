import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import projects from "../../src/content/projects/index.json" with { type: "json" };

test("Work discovery composes filters, sorts, announces results and resets", async ({ page }) => {
  await page.goto("/work");
  const titles = page.locator(".work-results-grid article h3");
  await expect(titles).toHaveCount(10);
  expect((await titles.allTextContents()).slice(0, 4)).toEqual(["Research Hub", "Alumni Portal", "Hearth", "WaterBuddy"]);
  await page.getByRole("combobox", { name: "Category", exact: true }).selectOption("Java Development");
  await page.getByRole("combobox", { name: "Technology", exact: true }).selectOption("Spring Boot");
  await expect(titles).toHaveCount(2);
  await page.getByRole("searchbox", { name: "Find a project" }).fill(" ALUMNI ");
  await expect(titles).toHaveText(["Alumni Portal"]);
  await expect(page.getByRole("status")).toHaveText("Showing 1 project.");
  await page.getByRole("button", { name: "Reset filters" }).click();
  await expect(page.getByRole("searchbox")).toBeFocused();
  await expect(titles).toHaveCount(10);
  await page.getByRole("combobox", { name: "Sort projects", exact: true }).selectOption("title");
  expect((await titles.allTextContents())[0]).toBe("Alumni Portal");
  expect((await titles.allTextContents()).at(-1)).toBe("WaterBuddy");
  await expect(page.locator('select[aria-label="Sort projects"] option[value="updated"]')).toHaveCount(0);
  await page.getByRole("combobox", { name: "Category", exact: true }).selectOption("Desktop Applications");
  await page.getByRole("combobox", { name: "Technology", exact: true }).selectOption("Spring Boot");
  await expect(page.getByRole("heading", { name: "No projects match these filters." })).toBeVisible();
  await page.getByRole("button", { name: "Reset filters" }).focus();
  await page.keyboard.press("Enter");
  await expect(titles).toHaveCount(10);
});

test("all ten static project pages have metadata, bounded navigation and honest content", async ({ page }) => {
  test.setTimeout(60000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const [index, project] of projects.entries()) {
    const response = await page.goto(`/work/${project.slug}`);
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(`${project.title} | Selvarajalingam`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(project.title);
    await expect(page.locator(".project-detail")).toHaveAttribute("data-template", project.featured ? "flagship" : "compact");
    await expect(page.getByRole("navigation", { name: "Breadcrumb" }).getByRole("link", { name: "Work", exact: true })).toHaveAttribute("href", "/work");
    await expect(page.locator("main .architecture-diagram, main .project-gallery img, main time")).toHaveCount(0);
    await expect(page.getByRole("link", { name: /^Source code/ })).toHaveCount(0);
    const pagination = page.getByRole("navigation", { name: "Project navigation" });
    if (index > 0) await expect(pagination.locator('[rel="prev"]')).toHaveAttribute("href", `/work/${projects[index - 1]!.slug}`);
    else await expect(pagination.locator('[rel="prev"]')).toHaveCount(0);
    if (index < projects.length - 1) await expect(pagination.locator('[rel="next"]')).toHaveAttribute("href", `/work/${projects[index + 1]!.slug}`);
    else await expect(pagination.locator('[rel="next"]')).toHaveCount(0);
    if (project.slug === "waterbuddy") await expect(page.getByRole("link", { name: /^Visit project/ })).toHaveCount(0);
  }
  await page.getByRole("link", { name: "Back to Work", exact: true }).click();
  await expect(page).toHaveURL("/work");
  expect((await page.goto("/work/not-a-supplied-project"))?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("This page isn’t here.");
});

for (const route of ["/work", "/work/research-hub", "/work/sentiment-analysis"]) {
  for (const theme of ["dark", "light"]) {
    test(`${route} is accessible and responsive in ${theme}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(route);
      await page.getByLabel("Color theme", { exact: true }).selectOption(theme);
      expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze()).violations).toEqual([]);
      const viewport = page.viewportSize()!;
      for (const width of [320, 390, 768, 1024, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      }
      await page.setViewportSize(viewport);
      const internal = await page.locator('main a[href^="/"]').evaluateAll((elements) => elements.map((element) => element.getAttribute("href")!));
      for (const href of new Set(internal)) expect((await page.request.get(href)).status()).toBe(200);
      await page.screenshot({ path: test.info().outputPath("work-or-case.png"), fullPage: theme === "dark" });
    });
  }
}

test("Work and flagship narrative remain available without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3100/work");
  await expect(page.locator(".work-results-grid article")).toHaveCount(10);
  await page.getByRole("link", { name: "Research Hub", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Research Hub");
  await expect(page.getByRole("heading", { name: "Features", exact: true })).toBeVisible();
  await expect(page.getByText("Booking requests and approvals", { exact: true })).toBeVisible();
  await context.close();
});
