import "server-only";
import { z } from "zod";
import type { GitHubCuration } from "@/lib/content/github";
import type { GitHubSnapshot, RepositoryMetadata } from "./model";

const publicRepositorySchema = z.object({
  name: z.string(), full_name: z.string(), owner: z.object({ login: z.string() }), html_url: z.url(),
  private: z.literal(false), visibility: z.literal("public"), fork: z.literal(false), disabled: z.literal(false),
  stargazers_count: z.number().int().nonnegative(), forks_count: z.number().int().nonnegative(), language: z.string().min(1).max(60).nullable(),
});
async function boundedJson(response: Response) {
  const limit = 60000;
  if (Number(response.headers.get("content-length")) > limit || !response.body) throw new Error("invalid-response");
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = []; let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) { await reader.cancel(); throw new Error("oversized-response"); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size); let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)) as unknown;
  } finally { reader.releaseLock(); }
}

export async function fetchRepositorySnapshots(curation: GitHubCuration, options: { fetcher?: typeof fetch; now?: () => Date; enabled?: boolean; token?: string } = {}): Promise<GitHubSnapshot> {
  const repositories = curation.repositories.map(({ name, url }) => ({ name, url, metadata: null as RepositoryMetadata | null }));
  if (options.enabled === false) return { repositories };
  const fetcher = options.fetcher ?? fetch;
  for (const repository of repositories) {
    try {
      const response = await fetcher(`https://api.github.com/repos/${curation.account}/${repository.name}`, {
        cache: "no-store", redirect: "error", signal: AbortSignal.timeout(2500),
        headers: { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2026-03-10", "User-Agent": "selvarajalingam-portfolio", ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}) },
      });
      // Stop on rate limits/errors rather than retrying or continuing a burst.
      if (!response.ok) break;
      const parsed = publicRepositorySchema.safeParse(await boundedJson(response));
      if (!parsed.success) break;
      const data = parsed.data;
      if (data.owner.login.toLowerCase() !== curation.account.toLowerCase() || data.name !== repository.name || data.full_name !== `${curation.account}/${repository.name}` || data.html_url !== repository.url) break;
      repository.metadata = { stars: data.stargazers_count, forks: data.forks_count, language: data.language, checkedAt: (options.now ?? (() => new Date()))().toISOString() };
    } catch { break; }
  }
  return { repositories };
}
