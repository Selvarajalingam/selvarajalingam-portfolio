import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CloudResources } from "@/components/resources/cloud-resources";
import { GitHubRepositories } from "@/components/resources/github-repositories";
import { content } from "@/lib/content";
import { resourceSchema } from "@/lib/content/schema";
import { githubCuration } from "@/lib/content/github";

describe("curated resource presentation", () => {
  it("keeps cloud resources empty until real links are supplied", () => {
    expect(content.resources).toEqual([]);
    const { container } = render(<CloudResources resources={content.resources} emptyState="No supplied links." />);
    expect(screen.getByText("No supplied links.")).toBeInTheDocument();
    expect(container.querySelector("a, iframe, img")).toBeNull();
  });
  it("renders only verified resource facts as escaped text and protected links", () => {
    const resource = resourceSchema.parse({ slug: "test-only", title: "Test-only <script> resource", summary: "A test fixture, not published content.", type: "Article", category: "Test-only", attribution: "Test attribution", url: "https://aws.amazon.com/", verification: "verified" });
    const { container } = render(<CloudResources resources={[resource]} emptyState="Empty" />);
    expect(container.querySelector("script, iframe")).toBeNull();
    expect(screen.getByRole("link")).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.getByText("Test attribution")).toBeInTheDocument();
    expect(resourceSchema.safeParse({ ...resource, verification: "pending" }).success).toBe(false);
  });
  it("renders all curated links without placeholder counts, source claims or API descriptions", () => {
    const { container } = render(<GitHubRepositories repositories={githubCuration.repositories} profileUrl={githubCuration.profileUrl} />);
    expect(container.querySelectorAll(".repository-card")).toHaveLength(4);
    expect(container.querySelectorAll(".repository-metadata")).toHaveLength(0);
    expect(container.textContent).not.toMatch(/Stars|Forks|followers|contributions|UNREVIEWED/);
  });
});
