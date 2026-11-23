import { expect, type Page } from "@playwright/test";

/** Interact with the visible Glide Select rather than a native select API. */
export async function chooseSelect(page: Page, label: string, value: string) {
  const trigger = page.getByRole("combobox", { name: label, exact: true });
  await trigger.click();
  const options = page.getByRole("listbox", { name: label, exact: true }).getByRole("option");
  const values = await options.evaluateAll((elements) => elements.map((element) => element.getAttribute("data-value")));
  const index = values.indexOf(value);
  expect(index, `Option ${value} exists in ${label}`).toBeGreaterThanOrEqual(0);
  await options.nth(index).click();
  await expect(trigger).toHaveAttribute("data-value", value);
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
}
