import "server-only";
import { unstable_cache } from "next/cache";
import { githubCuration } from "@/lib/content/github";
import { fetchRepositorySnapshots } from "./provider";

export function getGitHubSnapshot() {
  const enabled = process.env.GITHUB_METADATA_ENABLED !== "false";
  const cached = unstable_cache(
    () => fetchRepositorySnapshots(githubCuration, { enabled, token: process.env.GITHUB_TOKEN }),
    ["github-public-snapshot-v1", JSON.stringify(githubCuration), enabled ? "on" : "off"],
    { revalidate: 900, tags: ["github-public-metadata"] },
  );
  return cached();
}
