import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/audit", timeout: 180000, fullyParallel: true, workers: 2,
  forbidOnly: Boolean(process.env.CI),
  retries: 0, reporter: [["list"], ["json", { outputFile: "test-results/hardening/results.json" }]],
  outputDir: "test-results/hardening/artifacts",
  use: { baseURL: "http://127.0.0.1:3100", viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce", trace: "retain-on-failure", screenshot: "only-on-failure" },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }, { name: "firefox", use: { browserName: "firefox" } }, { name: "webkit", use: { browserName: "webkit" } }],
  webServer: { command: "npm run start -- --hostname 127.0.0.1 --port 3100", url: "http://127.0.0.1:3100", reuseExistingServer: false, env: { GITHUB_METADATA_ENABLED: "false" } },
});
