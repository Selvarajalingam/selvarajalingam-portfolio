import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { chooseSelect } from "../helpers/select";

test("Glide Select menus support keyboard access, contrast and narrow reflow", async ({ page }) => {
  await page.goto("/work");
  for (const theme of ["dark", "light"]) {
    await chooseSelect(page, "Color theme", theme);
    const control = page.getByRole("combobox", { name: "Technology", exact: true });
    await control.focus();
    await control.press("ArrowDown");
    await control.press("End");
    const menu = page.getByRole("listbox", { name: "Technology", exact: true });
    await expect(menu.getByRole("option").last()).toBeInViewport();
    expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze()).violations).toEqual([]);
    await control.press("Escape");
    await expect(control).toHaveAttribute("data-value", "All");
    await expect(control).toBeFocused();
  }
  await page.setViewportSize({ width: 320, height: 900 });
  await page.addStyleTag({ content: "* { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } p { margin-bottom: 2em !important; }" });
  const category = page.getByRole("combobox", { name: "Category", exact: true });
  await category.click();
  const popup = page.getByRole("listbox", { name: "Category", exact: true });
  const box = await popup.boundingBox();
  expect(box && box.x >= 0 && box.y >= 0 && box.x + box.width <= 320 && box.y + box.height <= 900).toBeTruthy();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await category.press("End");
  await expect(popup.getByRole("option").last()).toBeInViewport();
  await category.press("Enter");
  await expect(category).toHaveAttribute("data-value", "Desktop Applications");
});
