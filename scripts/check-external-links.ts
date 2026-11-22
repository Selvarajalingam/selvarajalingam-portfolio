import { inspectArtifacts } from "./audit-artifacts";
const { externalDestinations } = inspectArtifacts();
const results: { url: string; status?: number; result: string }[] = [];
for (const url of externalDestinations) {
  try {
    const response = await fetch(url, { method: "HEAD", redirect: "follow", signal: AbortSignal.timeout(8000) });
    results.push({ url, status: response.status, result: response.ok ? "available" : [404, 410].includes(response.status) ? "broken" : "unverified" });
  } catch { results.push({ url, result: "unverified" }); }
}
console.log(JSON.stringify(results, null, 2));
if (results.some((result) => result.result !== "available")) process.exitCode = 1;
