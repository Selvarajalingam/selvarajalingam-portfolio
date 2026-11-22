import { z } from "zod";
import data from "@/content/github/repositories.json";

export const githubCurationSchema = z.strictObject({
  account: z.literal("Selvarajalingam"),
  profileUrl: z.literal("https://github.com/Selvarajalingam"),
  repositories: z.array(z.strictObject({
    name: z.string().min(1).max(100).regex(/^[A-Za-z0-9_-][A-Za-z0-9_.-]*$/).refine((name) => name !== "." && name !== ".."),
    url: z.url(), verification: z.literal("verified"), checkedOn: z.iso.date(),
  })).max(6),
}).superRefine((curation, ctx) => {
  const names = new Set<string>();
  curation.repositories.forEach((repository, index) => {
    if (repository.url !== `https://github.com/${curation.account}/${repository.name}`) ctx.addIssue({ code: "custom", message: "Use the exact verified account/repository destination", path: ["repositories", index, "url"] });
    if (names.has(repository.name.toLowerCase())) ctx.addIssue({ code: "custom", message: "Duplicate curated repository", path: ["repositories", index, "name"] });
    names.add(repository.name.toLowerCase());
  });
});
export type GitHubCuration = z.infer<typeof githubCurationSchema>;
export const githubCuration = githubCurationSchema.parse(data);
