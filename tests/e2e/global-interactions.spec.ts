import { chooseSelect } from "../helpers/select";
import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("theme persists and follows the system only when requested", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await chooseSelect(page, "Color theme", "light");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await chooseSelect(page, "Color theme", "system");
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("storage denial leaves theme controls and content usable", async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(window, "localStorage", { get() { throw new DOMException("Blocked", "SecurityError"); } }));
  await page.goto("/");
  await chooseSelect(page, "Color theme", "light");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("theme choice synchronizes across tabs", async ({ page, context }) => {
  await page.goto("/");
  const second = await context.newPage();
  await second.goto("/");
  await chooseSelect(second, "Color theme", "light");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await second.close();
});

test("mobile menu contains focus, closes on Escape and restores scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Open menu" });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Site menu" });
  await expect(dialog).toBeVisible();
  await expect(page.getByRole("button", { name: "Close menu" })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  expect(await dialog.evaluate((el) => el.contains(document.activeElement))).toBe(true);
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze()).violations).toEqual([]);
  await page.screenshot({ path: test.info().outputPath("mobile-menu.png") });
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  await trigger.click();
  await dialog.getByRole("link", { name: "About", exact: true }).click();
  await expect(page).toHaveURL("/about");
  await expect(dialog).not.toBeVisible();
  await trigger.click();
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(dialog).not.toBeVisible();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});

test("intro is skippable, replayable, first-visit only and reduced-motion aware", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  // Exercise the global intro independently of headless WebGL startup work.
  await page.goto("/about");
  const intro = page.getByRole("complementary", { name: "Brand introduction" });
  await expect(intro).toBeVisible();
  await page.getByRole("button", { name: "Skip intro" }).focus();
  await page.keyboard.press("Enter");
  await expect(intro).not.toBeVisible();
  await page.reload();
  await expect(intro).not.toBeVisible();
  await page.getByRole("button", { name: "Replay intro" }).click();
  await expect(intro).toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(intro).not.toBeVisible();
});

test("global shell fits supported viewports and marks the current page", async ({ page }) => {
  await page.goto("/about");
  for (const width of [320, 390, 768, 1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
  await expect(page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "About", exact: true })).toHaveAttribute("aria-current", "page");
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect(page.locator(".scroll-progress-fill")).toHaveAttribute("style", /scaleX\(1\)/);
  await page.getByRole("link", { name: "Back to top" }).click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await page.screenshot({ path: test.info().outputPath("shell-full.png"), fullPage: true });
});

test("navigation remains available without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3100/");
  await expect(page.locator(".sculpture-fallback")).toBeVisible();
  await expect(page.locator(".sculpture-canvas canvas")).toHaveCount(0);
  await page.getByRole("navigation", { name: "Site navigation" }).getByRole("link", { name: "About", exact: true }).click();
  await expect(page).toHaveURL(/\/about$/);
  await context.close();
});
