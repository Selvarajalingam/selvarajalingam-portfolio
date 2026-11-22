import { expect, test } from "@playwright/test";

test("cold local LCP and layout-shift samples stay within lab budgets", async ({ browser, browserName }) => {
  test.skip(browserName !== "chromium", "CDP lab measurements use Chromium only");
  const samples: { path: string; width: number; lcp: number; layoutShiftSum: number }[] = [];
  for (const width of [390, 1440]) for (const path of ["/", "/work", "/connect"]) for (let sample = 0; sample < 3; sample++) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    await cdp.send("Network.enable");
    await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 40, downloadThroughput: 1250000, uploadThroughput: 625000 });
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    await page.addInitScript(() => {
      const metrics = { lcp: 0, layoutShiftSum: 0 };
      Object.assign(window, { labMetrics: metrics });
      new PerformanceObserver((list) => { for (const entry of list.getEntries()) metrics.lcp = entry.startTime; }).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver((list) => { for (const entry of list.getEntries() as (PerformanceEntry & { hadRecentInput: boolean; value: number })[]) if (!entry.hadRecentInput) metrics.layoutShiftSum += entry.value; }).observe({ type: "layout-shift", buffered: true });
    });
    await page.goto(`http://127.0.0.1:3100${path}`);
    await page.waitForTimeout(1500);
    const metrics = await page.evaluate(() => (window as Window & { labMetrics?: { lcp: number; layoutShiftSum: number } }).labMetrics!);
    samples.push({ path, width, ...metrics });
    await context.close();
  }
  await test.info().attach("local-performance-samples", { body: JSON.stringify(samples, null, 2), contentType: "application/json" });
  for (const width of [390, 1440]) for (const path of ["/", "/work", "/connect"]) {
    const group = samples.filter((sample) => sample.width === width && sample.path === path);
    const median = group.map((sample) => sample.lcp).sort((a, b) => a - b)[1];
    expect(median, `${path} ${width}px median local LCP`).toBeGreaterThan(0);
    expect(median, `${path} ${width}px median local LCP`).toBeLessThan(2500);
    expect(Math.max(...group.map((sample) => sample.layoutShiftSum)), `${path} ${width}px observed layout shifts`).toBeLessThanOrEqual(.1);
  }
});
