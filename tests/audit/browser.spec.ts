import { chooseSelect } from "../helpers/select";
import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import projects from "../../src/content/projects/index.json" with { type: "json" };
import ventures from "../../src/content/ventures/index.json" with { type: "json" };

const paths = ["/", "/about", "/work", "/lab", "/ventures", "/services", "/experience", "/connect", "/privacy", ...projects.map((entry) => `/work/${entry.slug}`), ...ventures.map((entry) => `/ventures/${entry.slug}`)];
for (const theme of ["dark", "light"]) {
  test(`all actual routes pass accessibility and reflow in ${theme}`, async ({ page }) => {
    await page.goto("/"); await chooseSelect(page, "Color theme", theme);
    for (const path of paths) {
      await page.setViewportSize({ width: 1440, height: 1000 });
      expect([200, 304], path).toContain((await page.goto(path))?.status());
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      const controlContrasts = await page.locator('input:not([type="hidden"]), .glide-select__trigger, textarea, .utility-button, .button-secondary, .skill-status-filters button').evaluateAll((elements) => {
        function luminance(color: string) {
          const rgb = color.match(/[\d.]+/g)!.slice(0, 3).map(Number).map((value) => { const channel = value / 255; return channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4; });
          return rgb[0]! * .2126 + rgb[1]! * .7152 + rgb[2]! * .0722;
        }
        return elements.filter((element) => element.getClientRects().length && getComputedStyle(element).borderTopStyle !== "none").map((element) => {
          const style = getComputedStyle(element);
          let parent = element.parentElement;
          let background = parent ? getComputedStyle(parent).backgroundColor : style.backgroundColor;
          while (background === "rgba(0, 0, 0, 0)" && parent) { background = getComputedStyle(parent).backgroundColor; parent = parent.parentElement; }
          const a = luminance(style.borderTopColor), b = luminance(background);
          return { control: element.tagName, ratio: (Math.max(a, b) + .05) / (Math.min(a, b) + .05) };
        });
      });
      for (const contrast of controlContrasts) expect(contrast.ratio, `${path}: ${contrast.control} boundary contrast`).toBeGreaterThanOrEqual(3);
      await page.locator("main details").evaluateAll((elements) => elements.forEach((element) => element.setAttribute("open", "")));
      const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
      expect(result.violations, path).toEqual([]);
      await page.setViewportSize({ width: 320, height: 900 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${path}: 320px reflow`).toBe(true);
      await page.addStyleTag({ content: "* { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } p { margin-bottom: 2em !important; }" });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${path}: text spacing at 320px`).toBe(true);
      for (const control of await page.locator(".site-header a, .site-header button").all()) {
        if (!await control.isVisible()) continue;
        const box = await control.boundingBox();
        expect(box && box.x >= 0 && box.x + box.width <= 320, `${path}: header control remains in viewport`).toBe(true);
      }
      if (["/", "/connect", "/work/research-hub"].includes(path)) await page.screenshot({ path: test.info().outputPath(`${path === "/" ? "home" : path.slice(1).replaceAll("/", "-")}-${theme}-spacing.png`), fullPage: true });
    }
  });
}

test("keyboard navigation, filtering, focus and safe HTTP behavior work across engines", async ({ page, request, browserName }) => {
  await page.goto("/work");
  await expect(page.locator("main")).toBeVisible();
  // This Windows WebKit runner tabs only to form controls by default. Verify skip-link
  // activation there; Chromium/Firefox also verify its position in the native Tab order.
  if (browserName === "webkit") await page.getByRole("link", { name: "Skip to content" }).focus();
  else await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter"); await expect(page.locator("main")).toBeFocused();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  await expect(page.getByRole("button", { name: "Close menu", exact: true })).toBeFocused();
  await page.keyboard.press("Escape"); await expect(page.getByRole("button", { name: "Open menu", exact: true })).toBeFocused();
  const search = page.getByRole("searchbox", { name: "Find a project" });
  await search.fill("Research Hub"); await expect(page.locator(".work-results-grid article")).toHaveCount(1);
  await page.goto("/services"); await page.locator("main summary").first().focus(); await page.keyboard.press("Enter");
  await expect(page.locator("main details").first()).toHaveAttribute("open", "");
  await page.goto("/connect"); await expect(page.getByRole("button", { name: "Send enquiry", exact: true })).toBeDisabled();
  const response = await request.get("/");
  expect(response.headers()["content-security-policy"]).toBe("object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'");
  expect((await request.post("/api/github")).status()).toBe(405);
  expect((await request.post("/api/contact", { data: {}, headers: { origin: "https://invalid.test" } })).status()).toBeGreaterThanOrEqual(400);
  await page.evaluate(() => { const base = document.createElement("base"); base.href = "https://invalid.test/"; document.head.append(base); });
  expect(await page.evaluate(() => document.baseURI)).not.toContain("invalid.test");
});
