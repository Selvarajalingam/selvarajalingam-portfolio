import { describe, expect, it } from "vitest";
import { portfolioSchema } from "@/lib/content/schema";
import { content } from "@/lib/content";

describe("publication boundary", () => {
  it("keeps confirmed identity available without fabricated collection records", () => {
    expect(content.profile.name).toBe("Selvarajalingam");
    expect(content.lab).toEqual([]);
    expect(content.resources).toEqual([]);
  });

  it("rejects unverified records rather than publishing them", () => {
    expect(portfolioSchema.safeParse({ ...content, projects: [{ ...content.projects[0], verification: "pending" }] }).success).toBe(false);
  });

  it("rejects duplicate slugs in a collection", () => {
    const resource = { slug: "resource", title: "Resource", summary: "A supplied resource", type: "Article", url: "https://github.com/Selvarajalingam", verification: "verified" };
    const result = portfolioSchema.safeParse({ ...content, resources: [resource, resource] });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues.some((issue) => issue.message === "Duplicate slug")).toBe(true);
  });

  it("accepts a verified resource with a genuine HTTPS destination", () => {
    expect(portfolioSchema.safeParse({ ...content, resources: [{ slug: "github", title: "GitHub", summary: "Public profile", type: "Resource", url: "https://github.com/Selvarajalingam", verification: "verified" }] }).success).toBe(true);
  });

  it("requires the explicit sample resume label", () => {
    expect(portfolioSchema.safeParse({ ...content, resume: { src: "/assets/resume/sample.pdf", label: "Resume", status: "sample" } }).success).toBe(false);
  });

  it.each(["javascript:alert(1)", "http://example.org", "https://example.org", "https://example.com", "https://placeholder.com/item"])("rejects unsafe or placeholder published URLs: %s", (url) => {
    expect(portfolioSchema.safeParse({ ...content, resources: [{ slug: "resource", title: "Resource", summary: "A resource", type: "Article", url, verification: "verified" }] }).success).toBe(false);
  });

  it("requires alternative text and blocks traversal in supplied image paths", () => {
    const resource = { slug: "resource", title: "Resource", summary: "A resource", type: "Article", url: "https://github.com/Selvarajalingam", verification: "verified" };
    expect(portfolioSchema.safeParse({ ...content, resources: [{ ...resource, image: { src: "/assets/../private.png", alt: "" } }] }).success).toBe(false);
  });
});
