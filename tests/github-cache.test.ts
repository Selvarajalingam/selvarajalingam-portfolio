// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
vi.mock("next/cache", () => ({ unstable_cache: vi.fn((callback: () => unknown) => callback) }));
vi.mock("@/lib/github/provider", () => ({ fetchRepositorySnapshots: vi.fn() }));
import { unstable_cache } from "next/cache";
import { fetchRepositorySnapshots } from "@/lib/github/provider";
import { getGitHubSnapshot } from "@/lib/github/cached";
import { GET } from "@/app/api/github/route";
import { githubCuration } from "@/lib/content/github";

describe("GitHub server cache and API boundary", () => {
  it("uses a 15-minute server cache with a content-sensitive key and keeps token server-side", async () => {
    vi.stubEnv("GITHUB_TOKEN", "test-only-token");
    vi.mocked(fetchRepositorySnapshots).mockResolvedValueOnce({ repositories: [] });
    try {
      await getGitHubSnapshot();
      expect(unstable_cache).toHaveBeenCalledWith(expect.any(Function), expect.arrayContaining([JSON.stringify(githubCuration)]), { revalidate: 900, tags: ["github-public-metadata"] });
      expect(JSON.stringify(vi.mocked(unstable_cache).mock.calls[0]![1])).not.toContain("test-only-token");
      expect(fetchRepositorySnapshots).toHaveBeenCalledWith(githubCuration, expect.objectContaining({ token: "test-only-token" }));
    } finally { vi.unstubAllEnvs(); }
  });
  it("returns curated links even if the cache infrastructure throws", async () => {
    vi.mocked(fetchRepositorySnapshots).mockRejectedValueOnce(new Error("INTERNAL_PROVIDER_DETAIL"));
    const response = await GET();
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.repositories).toHaveLength(4);
    expect(body.repositories.every((repository: { metadata: unknown }) => repository.metadata === null)).toBe(true);
    expect(JSON.stringify(body)).not.toContain("INTERNAL_PROVIDER_DETAIL");
  });
});
