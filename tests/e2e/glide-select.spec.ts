import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { chooseSelect } from "../helpers/select";

test("all dropdowns use Glide Select with keyboard, touch and scrollable menus", async ({ page }) => {
  await page.goto("/work");
  await expect(page.locator("select")).toHaveCount(0);
  const category = page.getByRole("combobox", { name: "Category", exact: true });
  await category.focus();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("End");
  await page.keyboard.press("Enter");
  await expect(category).toHaveAttribute("data-value", "Desktop Applications");
  await expect(category).toBeFocused();
  await page.keyboard.press("ArrowUp");
  await page.keyboard.press("Home");
  await page.keyboard.press("Escape");
  await expect(category).toHaveAttribute("data-value", "Desktop Applications");
  await page.getByRole("button", { name: "Reset filters" }).click();
  const technology = page.getByRole("combobox", { name: "Technology", exact: true });
  await technology.click();
  const menu = page.getByRole("listbox", { name: "Technology", exact: true });
  const bounds = await menu.boundingBox();
  expect(bounds && bounds.x >= 0 && bounds.y >= 0 && bounds.x + bounds.width <= page.viewportSize()!.width && bounds.y + bounds.height <= page.viewportSize()!.height).toBeTruthy();
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze()).violations).toEqual([]);
  await technology.press("End");
  const last = menu.getByRole("option").last();
  await expect(last).toBeInViewport();
  const lastValue = await last.getAttribute("data-value");
  await technology.press("Enter");
  await expect(technology).toHaveAttribute("data-value", lastValue!);
  await technology.click();
  await technology.press("Tab");
  await expect(menu).toHaveCount(0);
  await chooseSelect(page, "Color theme", "light");
  await page.getByRole("combobox", { name: "Color theme", exact: true }).click();
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze()).violations).toEqual([]);
  await page.getByRole("heading", { level: 1 }).click();
  await expect(page.getByRole("listbox")).toHaveCount(0);
  for (const path of ["/lab", "/connect"]) { await page.goto(path); await expect(page.locator("select")).toHaveCount(0); }
});

test("touch selection leaves long menus scrollable", async ({ browser }) => {
  const context = await browser.newContext({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3100/work");
  const control = page.getByRole("combobox", { name: "Technology", exact: true });
  await control.tap();
  const list = page.getByRole("listbox", { name: "Technology", exact: true });
  await list.getByRole("option", { name: "TypeScript", exact: true }).scrollIntoViewIfNeeded();
  await list.getByRole("option", { name: "TypeScript", exact: true }).tap();
  await expect(control).toHaveAttribute("data-value", "TypeScript");
  await expect(list).toHaveCount(0);
  await context.close();
});

test("contact subject is required and preserves its error association", async ({ page }) => {
  await page.route("**/api/contact", (route) => route.fulfill({ json: { available: true } }));
  await page.goto("/connect");
  await page.getByLabel("Name", { exact: true }).fill("Test visitor");
  await page.getByLabel("Email", { exact: true }).fill("visitor@example.com");
  await page.getByLabel("Message", { exact: true }).fill("This is a local validation test message.");
  await page.getByRole("button", { name: "Send enquiry", exact: true }).click();
  const subject = page.getByRole("combobox", { name: "Subject", exact: true });
  await expect(subject).toBeFocused();
  await expect(subject).toHaveAttribute("aria-invalid", "true");
  await expect(subject).toHaveAttribute("aria-describedby", "subject-error");
  await chooseSelect(page, "Subject", "Training");
  await expect(page.locator('input[type="hidden"][name="subject"]')).toHaveValue("Training");
});
