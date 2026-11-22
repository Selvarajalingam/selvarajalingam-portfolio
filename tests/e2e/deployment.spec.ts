import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { expect, test } from "@playwright/test";

const run = promisify(execFile);
const cli = ["node_modules/tsx/dist/cli.mjs", "scripts/check-deployment.ts"];

test("deployment smoke validates the running production build without sending messages", async ({ baseURL }) => {
  test.setTimeout(60000);
  const result = await run(process.execPath, [...cli, baseURL!, "preview"], { timeout: 55000 });
  const report = JSON.parse(result.stdout) as { routesChecked: number; failures: unknown[] };
  expect(report.routesChecked).toBeGreaterThanOrEqual(23);
  expect(report.failures).toEqual([]);
});

test("deployment smoke rejects non-origin targets and unapproved production checks", async ({ baseURL }) => {
  test.setTimeout(60000);
  for (const [target, mode] of [[`${baseURL}/work`, "preview"], [baseURL!, "production"]]) {
    await expect(run(process.execPath, [...cli, target!, mode!], { timeout: 25000 })).rejects.toThrow("Production requires the configured origin and approved indexing flag");
  }
});
