import { expect, test } from "@playwright/test";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const chunkDirectory = join(process.cwd(), ".next/static/chunks");
const webglChunks = readdirSync(chunkDirectory).filter((name) => name.endsWith(".js") && readFileSync(join(chunkDirectory, name), "utf8").includes("Error creating WebGL context"));

test("homepage sections, disclosures and fallback work on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator("main section[id]")).toHaveCount(11);
  await expect(page.locator("#selected-work article h3")).toHaveText(["Research Hub", "Alumni Portal", "Hearth", "WaterBuddy"]);
  const skill = page.locator("#skills details").filter({ hasText: "Backend Development" });
  await skill.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(skill).toHaveAttribute("open", "");
  await expect(skill.locator("p")).toContainText("actively strengthening");
  await page.getByLabel("Color theme", { exact: true }).selectOption("light");
  await expect(page.locator(".hero-art")).toHaveAttribute("data-eligible", "false");
  await expect(page.locator(".sculpture-fallback")).toBeVisible();
  await expect(page.locator(".sculpture-canvas canvas")).toHaveCount(0);
  expect(webglChunks.length).toBeGreaterThan(0);
  const requested = await page.evaluate(() => performance.getEntriesByType("resource").map((entry) => entry.name));
  expect(requested.filter((url) => webglChunks.some((file) => url.endsWith(file)))).toEqual([]);
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator("#hero").screenshot({ path: test.info().outputPath("hero-mobile-light.png") });
  await page.locator("#selected-work").screenshot({ path: test.info().outputPath("featured-mobile-light.png") });
  await page.screenshot({ path: test.info().outputPath("homepage-mobile-light.png"), fullPage: true });
});

for (const constraint of ["reduced-motion", "low-memory", "save-data"] as const) {
  test(`desktop retains lightweight fallback for ${constraint}`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, isMobile: false, hasTouch: false, reducedMotion: constraint === "reduced-motion" ? "reduce" : "no-preference" });
    await context.addInitScript((reason) => {
      Object.defineProperty(navigator, "hardwareConcurrency", { value: 8 });
      Object.defineProperty(navigator, "deviceMemory", { value: reason === "low-memory" ? 2 : 8 });
      Object.defineProperty(navigator, "connection", { value: Object.assign(new EventTarget(), { saveData: reason === "save-data", effectiveType: "4g" }) });
    }, constraint);
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:3100/");
    await page.getByLabel("Color theme", { exact: true }).selectOption("light");
    await expect(page.locator(".hero-art")).toHaveAttribute("data-eligible", "false");
    await expect(page.locator(".sculpture-fallback")).toBeVisible();
    const requested = await page.evaluate(() => performance.getEntriesByType("resource").map((entry) => entry.name));
    expect(requested.filter((url) => webglChunks.some((file) => url.endsWith(file)))).toEqual([]);
    await context.close();
  });
}

test("capable desktop renders original 3D and releases it when preferences change", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, isMobile: false, hasTouch: false, reducedMotion: "no-preference" });
  await context.addInitScript(() => {
    Object.defineProperty(navigator, "hardwareConcurrency", { value: 8 });
    Object.defineProperty(navigator, "deviceMemory", { value: 8 });
    Object.defineProperty(navigator, "connection", { value: Object.assign(new EventTarget(), { saveData: false, effectiveType: "4g" }) });
    localStorage.setItem("selva:intro-seen", "true");
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3100/");
  await expect(page.locator(".hero-art")).toHaveAttribute("data-renderer", "webgl", { timeout: 15000 });
  await expect(page.locator(".sculpture-canvas canvas")).toHaveCount(1);
  const cta = page.locator("#hero").getByRole("link", { name: "Let's connect", exact: true });
  const bounds = await cta.boundingBox();
  expect(bounds && bounds.y + bounds.height).toBeLessThan(900);
  await page.screenshot({ path: test.info().outputPath("homepage-desktop-3d.png") });
  await page.getByLabel("Color theme", { exact: true }).selectOption("light");
  await page.screenshot({ path: test.info().outputPath("homepage-desktop-light.png") });
  await page.getByRole("button", { name: "Use static artwork" }).click();
  await expect(page.locator(".sculpture-canvas canvas")).toHaveCount(0);
  await expect(page.locator(".sculpture-fallback")).toBeVisible();
  await page.getByRole("button", { name: "Use 3D artwork" }).click();
  await expect(page.locator(".sculpture-canvas canvas")).toHaveCount(1);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".sculpture-canvas canvas")).toHaveCount(0);
  await expect(page.locator(".sculpture-fallback")).toBeVisible();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator(".sculpture-canvas canvas")).toHaveCount(1);
  await page.locator(".sculpture-canvas canvas").evaluate((canvas) => canvas.dispatchEvent(new Event("webglcontextlost", { cancelable: true })));
  await expect(page.locator(".sculpture-canvas canvas")).toHaveCount(0);
  await expect(page.locator(".sculpture-fallback")).toBeVisible();
  await context.close();
});

test("WebGL initialization failure preserves content and vector artwork", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, isMobile: false, hasTouch: false, reducedMotion: "no-preference" });
  await context.addInitScript(() => {
    Object.defineProperty(navigator, "hardwareConcurrency", { value: 8 });
    Object.defineProperty(navigator, "deviceMemory", { value: 8 });
    Object.defineProperty(navigator, "connection", { value: Object.assign(new EventTarget(), { saveData: false, effectiveType: "4g" }) });
    const original = HTMLCanvasElement.prototype.getContext;
    Object.defineProperty(HTMLCanvasElement.prototype, "getContext", { value: function(this: HTMLCanvasElement, kind: string, ...args: unknown[]) {
      return kind.startsWith("webgl") ? null : Reflect.apply(original, this, [kind, ...args]);
    } });
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3100/");
  await expect.poll(() => page.evaluate(() => performance.getEntriesByType("resource").filter((entry) => entry.name.endsWith(".js")).length)).toBeGreaterThan(0);
  await page.waitForLoadState("networkidle");
  await expect.poll(() => page.evaluate((chunks) => performance.getEntriesByType("resource").some((entry) => chunks.some((file) => entry.name.endsWith(file))), webglChunks)).toBe(true);
  await expect(page.locator(".hero-art")).toHaveAttribute("data-eligible", "false", { timeout: 10000 });
  await expect(page.locator(".sculpture-fallback")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("I teach technology");
  await context.close();
});
