// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { githubCuration, githubCurationSchema } from "@/lib/content/github";
import { fetchRepositorySnapshots } from "@/lib/github/provider";

function apiRecord(index = 0) {
  const repository = githubCuration.repositories[index]!;
  return { name: repository.name, full_name: `Selvarajalingam/${repository.name}`, owner: { login: "Selvarajalingam" }, html_url: repository.url, private: false, visibility: "public", fork: false, disabled: false, stargazers_count: 0, forks_count: 1, language: "Java", pushed_at: "2026-01-01T00:00:00Z", description: "UNREVIEWED_API_DESCRIPTION", secret: "UNEXPECTED_PRIVATE_FIELD" };
}
describe("public GitHub integration", () => {
  it("uses only the observed curated account and repository destinations", () => {
    expect(githubCuration.account).toBe("Selvarajalingam");
    expect(githubCuration.repositories).toHaveLength(4);
    for (const repository of githubCuration.repositories) expect(repository.url).toBe(`https://github.com/Selvarajalingam/${repository.name}`);
  });
  it("rejects unverified, duplicate, foreign-account and invented-destination curation", () => {
    const repository = githubCuration.repositories[0]!;
    for (const change of [{ verification: "pending" }, { url: "https://evil.test/repo" }, { name: "../private" }]) expect(githubCurationSchema.safeParse({ ...githubCuration, repositories: [{ ...repository, ...change }] }).success).toBe(false);
    expect(githubCurationSchema.safeParse({ ...githubCuration, repositories: [repository, repository] }).success).toBe(false);
    expect(githubCurationSchema.safeParse({ ...githubCuration, account: "someone-else" }).success).toBe(false);
  });
  it("fetches only allowlisted endpoints, serially, with timeout/cache headers and no unreviewed fields", async () => {
    let active = 0; let peak = 0;
    const fetcher = vi.fn<typeof fetch>(async (url) => {
      active++; peak = Math.max(active, peak);
      const index = githubCuration.repositories.findIndex((repository) => String(url).endsWith(`/${repository.name}`));
      await Promise.resolve(); active--;
      return Response.json(apiRecord(index));
    });
    const result = await fetchRepositorySnapshots(githubCuration, { fetcher, now: () => new Date("2026-11-19T00:00:00Z") });
    expect(peak).toBe(1);
    expect(fetcher).toHaveBeenCalledTimes(4);
    expect(fetcher.mock.calls[0]![0]).toBe(`https://api.github.com/repos/Selvarajalingam/${githubCuration.repositories[0]!.name}`);
    expect(fetcher.mock.calls[0]![1]).toMatchObject({ cache: "no-store", redirect: "error", headers: { Accept: "application/vnd.github+json" } });
    expect(fetcher.mock.calls[0]![1]!.signal).toBeInstanceOf(AbortSignal);
    expect(result.repositories[0]!.metadata).toMatchObject({ stars: 0, forks: 1, language: "Java" });
    expect(JSON.stringify(result)).not.toMatch(/UNREVIEWED|UNEXPECTED|description|secret/);
  });
  it.each([403, 404, 429, 500])("returns curated-only data and stops API requests on HTTP %s", async (status) => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response("provider detail", { status }));
    const result = await fetchRepositorySnapshots(githubCuration, { fetcher });
    expect(result.repositories.every((repository) => repository.metadata === null)).toBe(true);
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(result)).not.toContain("provider detail");
  });
  it("keeps fallback links on timeout, bad JSON and oversized responses", async () => {
    for (const fetcher of [vi.fn<typeof fetch>().mockRejectedValue(new Error("timeout")), vi.fn<typeof fetch>().mockResolvedValue(new Response("{")), vi.fn<typeof fetch>().mockResolvedValue(new Response("x".repeat(65000)))]) {
      const result = await fetchRepositorySnapshots(githubCuration, { fetcher });
      expect(result.repositories[0]).toMatchObject({ name: githubCuration.repositories[0]!.name, metadata: null });
    }
  });
  it.each([{ private: true, visibility: "private" }, { owner: { login: "someone-else" } }, { html_url: "https://evil.test/repo" }, { fork: true }, { disabled: true }, { stargazers_count: -1 }, { language: "x".repeat(200) }])("does not expose unexpected/private metadata %j", async (change) => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ ...apiRecord(), ...change }));
    const result = await fetchRepositorySnapshots(githubCuration, { fetcher });
    expect(result.repositories[0]!.metadata).toBeNull();
  });
  it("does not call GitHub when public metadata is disabled", async () => {
    const fetcher = vi.fn<typeof fetch>();
    const result = await fetchRepositorySnapshots(githubCuration, { enabled: false, fetcher });
    expect(fetcher).not.toHaveBeenCalled();
    expect(result.repositories.every((repository) => repository.metadata === null)).toBe(true);
  });
});
