import { readFileSync } from "node:fs";
import { ventureSchema } from "../src/lib/content/schema";

const ventures = ventureSchema.array().parse(JSON.parse(readFileSync("src/content/ventures/index.json", "utf8")));
const urls = [...new Set(ventures.flatMap((venture) => venture.website.status === "available" ? [venture.website.url] : []))];
const results = await Promise.allSettled(urls.map(async (url) => {
  const response = await fetch(url, { method: "HEAD", redirect: "follow", signal: AbortSignal.timeout(10000) });
  return { url, status: response.status, ok: response.ok };
}));
const report = results.map((result, index) => result.status === "fulfilled" ? result.value : { url: urls[index], ok: false, error: "HEAD request failed or timed out; availability not established" });
console.log(JSON.stringify(report, null, 2));
if (report.some((result) => !result.ok)) process.exitCode = 1;
