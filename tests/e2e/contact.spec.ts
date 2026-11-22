import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function enableForm(page: import("@playwright/test").Page) {
  await page.route("**/api/contact", async (route) => {
    if (route.request().method() === "GET") await route.fulfill({ json: { available: true } });
    else await route.fulfill({ status: 503, json: { status: "error", message: "Test-only service failure." } });
  });
}
async function fill(page: import("@playwright/test").Page) {
  await page.getByLabel("Name", { exact: true }).fill("Test Visitor");
  await page.getByLabel("Email", { exact: true }).fill("visitor@example.org");
  await page.getByLabel("Subject", { exact: true }).selectOption("Training");
  await page.getByLabel("Message", { exact: true }).fill("A test-only enquiry about technical training.");
}

test("service accordions work with keyboard and enquiry links", async ({ page }) => {
  await page.goto("/services");
  await expect(page).toHaveTitle("Services | Selvarajalingam");
  const summaries = page.locator("main summary");
  await expect(summaries).toHaveCount(3);
  for (let index = 0; index < 3; index++) {
    const summary = summaries.nth(index);
    await summary.focus(); await page.keyboard.press("Enter");
    await expect(summary.locator("..")).toHaveAttribute("open", "");
  }
  await page.getByRole("link", { name: "Enquire about Education", exact: true }).click();
  await expect(page).toHaveURL("/connect");
});

test("unconfigured form and API never report a send", async ({ page }) => {
  await page.goto("/connect");
  await expect(page.getByText("The form is not accepting messages right now. Please use the email link.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Send enquiry", exact: true })).toBeDisabled();
  const response = await page.request.post("/api/contact", { headers: { origin: "http://127.0.0.1:3100" }, data: { name: "Test Visitor", email: "visitor@example.org", phone: "", subject: "Training", message: "Test-only unconfigured send attempt.", website: "", submissionId: "18bf1ba3-1687-4c8c-9e57-e5512d487252", startedAt: Date.now() - 5000, token: "" } });
  expect(response.status()).toBe(503);
  expect((await response.json()).status).toBe("error");
});

test("form validates fields, links privacy without checkbox, preserves failure and retry IDs", async ({ page }) => {
  await enableForm(page); await page.goto("/connect");
  const submit = page.getByRole("button", { name: "Send enquiry", exact: true });
  await expect(submit).toBeEnabled(); await submit.click();
  await expect(page.getByLabel("Name", { exact: true })).toBeFocused();
  await expect(page.getByLabel("Name", { exact: true })).toHaveAttribute("aria-invalid", "true");
  await expect(page.locator('form input[type="checkbox"]')).toHaveCount(0);
  await expect(page.locator('form a[href="/privacy"]')).toHaveText("Privacy Policy");
  await fill(page);
  const payloads: Record<string, unknown>[] = [];
  await page.route("**/api/contact", async (route) => {
    if (route.request().method() === "GET") return route.fulfill({ json: { available: true } });
    payloads.push(route.request().postDataJSON());
    await new Promise((resolve) => setTimeout(resolve, 100));
    return route.fulfill({ status: 503, json: { status: "uncertain", message: "Test-only acceptance could not be confirmed." } });
  });
  await submit.click();
  await expect(page.locator("main").getByRole("alert")).toContainText("Test-only acceptance");
  await expect(page.getByLabel("Message", { exact: true })).toHaveValue("A test-only enquiry about technical training.");
  await submit.click(); await expect(page.locator("main").getByRole("alert")).toContainText("Test-only acceptance");
  expect(payloads).toHaveLength(2);
  expect(payloads[0]!.submissionId).toBe(payloads[1]!.submissionId);
  await page.getByLabel("Message", { exact: true }).fill("A changed test-only enquiry about technical training.");
  await submit.click(); await expect(page.locator("main").getByRole("alert")).toContainText("Test-only acceptance");
  expect(payloads[2]!.submissionId).not.toBe(payloads[0]!.submissionId);
  await expect(page.locator('script[src*="challenges.cloudflare.com"]')).toHaveCount(0);
});

test("provider acceptance and receipt failure have distinct accessible confirmations (mocked only)", async ({ page }) => {
  await enableForm(page);
  for (const state of ["accepted", "accepted-without-receipt"]) {
    await page.goto("/connect"); await fill(page);
    await page.route("**/api/contact", async (route) => route.fulfill({ status: route.request().method() === "GET" ? 200 : 202, json: route.request().method() === "GET" ? { available: true } : { status: state, message: `Test-only ${state} response.` } }));
    await page.getByRole("button", { name: "Send enquiry", exact: true }).click();
    await expect(page.getByRole("status")).toHaveText(`Test-only ${state} response.`);
    await expect(page.getByRole("status")).toBeFocused();
    await expect(page.getByRole("button", { name: "Write another enquiry" })).toBeVisible();
  }
});

test("risk challenge loads only when requested and sends the returned token (mocked only)", async ({ page }) => {
  await enableForm(page); let attempts = 0;
  await page.route("https://challenges.cloudflare.com/**", (route) => route.fulfill({ contentType: "application/javascript", body: `window.turnstile = { render(container, options) { const button = document.createElement('button'); button.type='button'; button.textContent='Complete test security check'; button.onclick=()=>options.callback('test-only-token'); container.appendChild(button); return 'test-widget'; }, remove() { document.querySelectorAll('button').forEach(button=>{if(button.textContent==='Complete test security check')button.remove();}); } };` }));
  await page.route("**/api/contact", async (route) => {
    if (route.request().method() === "GET") return route.fulfill({ json: { available: true } });
    attempts++;
    if (attempts === 1) return route.fulfill({ status: 403, json: { status: "challenge", message: "Complete the test security check.", siteKey: "test-only-sitekey" } });
    expect(route.request().postDataJSON().token).toBe("test-only-token");
    return route.fulfill({ status: 202, json: { status: "accepted", message: "Test-only accepted after challenge." } });
  });
  await page.goto("/connect"); await fill(page);
  const submit = page.getByRole("button", { name: "Send enquiry", exact: true });
  await submit.click();
  await page.getByRole("button", { name: "Complete test security check" }).click();
  await submit.click();
  await expect(page.getByRole("status")).toHaveText("Test-only accepted after challenge.");
});

test("pending submission prevents duplicates and server validation focuses a stable field label", async ({ page }) => {
  await enableForm(page); await page.goto("/connect"); await fill(page);
  let release: (() => void) | undefined;
  let calls = 0;
  await page.route("**/api/contact", async (route) => {
    if (route.request().method() === "GET") return route.fulfill({ json: { available: true } });
    calls++;
    await new Promise<void>((resolve) => { release = resolve; });
    return route.fulfill({ status: 422, json: { status: "error", message: "Please check the highlighted fields.", errors: { email: "Test-only email validation error." } } });
  });
  await page.getByRole("button", { name: "Send enquiry", exact: true }).click();
  await expect(page.getByRole("button", { name: "Sending…", exact: true })).toBeDisabled();
  await expect(page.getByLabel("Message", { exact: true })).toBeDisabled();
  await expect.poll(() => calls).toBe(1);
  release!();
  await expect(page.getByLabel("Email", { exact: true })).toBeFocused();
  await expect(page.getByLabel("Email", { exact: true })).toHaveAttribute("aria-describedby", "email-error");
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze()).violations).toEqual([]);
});

test("a failed security script can be retried without losing the enquiry (mocked)", async ({ page }) => {
  await enableForm(page); let loads = 0;
  await page.route("https://challenges.cloudflare.com/**", async (route) => {
    loads++;
    if (loads === 1) return route.abort("failed");
    return route.fulfill({ contentType: "application/javascript", body: `window.turnstile={render(container,options){const button=document.createElement('button');button.type='button';button.textContent='Complete retried test check';button.onclick=()=>options.callback('test-retry-token');container.appendChild(button);return 'retry-widget';},remove(){document.querySelectorAll('button').forEach(button=>{if(button.textContent==='Complete retried test check')button.remove();});}};` });
  });
  await page.route("**/api/contact", (route) => {
    if (route.request().method() === "GET") return route.fulfill({ json: { available: true } });
    return route.fulfill({ status: 403, json: { status: "challenge", message: "Complete the test check.", siteKey: "test-only-key" } });
  });
  await page.goto("/connect"); await fill(page);
  await page.getByRole("button", { name: "Send enquiry", exact: true }).click();
  await page.getByRole("button", { name: "Retry security check", exact: true }).click();
  await expect(page.getByRole("button", { name: "Complete retried test check" })).toBeVisible();
  expect(loads).toBe(2);
  await expect(page.getByLabel("Message", { exact: true })).toHaveValue("A test-only enquiry about technical training.");
});

for (const theme of ["dark", "light"]) {
  test(`services, contact and privacy are accessible and responsive in ${theme}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/services"); await page.getByLabel("Color theme", { exact: true }).selectOption(theme);
    const viewport = page.viewportSize()!;
    for (const route of ["services", "connect", "privacy"]) {
      await page.goto(`/${route}`);
      if (route === "services") await page.locator("main details").evaluateAll((elements) => elements.forEach((element) => element.setAttribute("open", "")));
      expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze()).violations).toEqual([]);
      for (const width of [320, 390, 768, 1024, 1440]) { await page.setViewportSize({ width, height: 900 }); expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true); }
      await page.setViewportSize(viewport);
      await page.screenshot({ path: test.info().outputPath(`${route}-${theme}.png`), fullPage: true });
    }
  });
}

test("services, email and privacy work without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage(); await page.goto("http://127.0.0.1:3100/services");
  await page.locator("main summary").first().click();
  await expect(page.getByText("Website development", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Enquire about Development", exact: true }).click();
  await expect(page.getByText("The form needs JavaScript to validate and submit. Please use the email link to get in touch.")).toBeVisible();
  await expect(page.locator('main a[href="mailto:selvarajalingam.dev@gmail.com"]')).toBeVisible();
  await page.locator('form a[href="/privacy"]').click();
  await expect(page.getByRole("heading", { name: "Privacy Policy", exact: true })).toBeVisible();
  await context.close();
});
