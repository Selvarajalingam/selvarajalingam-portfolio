import { describe, expect, it } from "vitest";
import { content } from "@/lib/content";
import { filterProjects, getProjectNavigation, getRelatedProjects } from "@/lib/projects";
import { parseProjectMarkdown } from "@/lib/content/project-markdown";

describe("project discovery", () => {
  it("contains all ten real records and preserves the four flagship priorities", () => {
    const ordered = filterProjects(content.projects, { query: "", category: "All", technology: "All", sort: "featured" });
    expect(ordered).toHaveLength(10);
    expect(ordered.slice(0, 4).map((project) => project.title)).toEqual(["Research Hub", "Alumni Portal", "Hearth", "WaterBuddy"]);
  });
  it("composes category, technology and case-insensitive text search", () => {
    const result = filterProjects(content.projects, { query: " ALUMNI ", category: "Java Development", technology: "Spring Boot", sort: "featured" });
    expect(result.map((project) => project.slug)).toEqual(["alumni-portal"]);
  });
  it("returns an empty result for incompatible filters without changing source order", () => {
    const before = JSON.stringify(content.projects);
    expect(filterProjects(content.projects, { query: "", category: "Desktop Applications", technology: "Spring Boot", sort: "title" })).toEqual([]);
    expect(JSON.stringify(content.projects)).toBe(before);
  });
  it("does not invent recency for projects without dates", () => {
    expect(content.projects.every((project) => project.updatedAt === undefined)).toBe(true);
    expect(filterProjects(content.projects, { query: "", category: "All", technology: "All", sort: "updated" }).map((project) => project.slug)).toEqual(content.projects.map((project) => project.slug));
  });
  it("provides bounded previous/next links and related records without the current project", () => {
    expect(getProjectNavigation(content.projects, "research-hub").previous).toBeUndefined();
    expect(getProjectNavigation(content.projects, "diwali-sales-analysis").next).toBeUndefined();
    expect(getRelatedProjects(content.projects, "research-hub").some((project) => project.slug === "research-hub")).toBe(false);
    expect(getProjectNavigation(content.projects, "missing")).toEqual({});
  });
});

describe("safe narrative Markdown", () => {
  it("parses authored level-two sections and factual lists", () => {
    const sections = parseProjectMarkdown("## Overview\n\nA factual description.\n\n## Features\n\n- First feature\n- Second feature");
    expect(sections.map((section) => section.id)).toEqual(["overview", "features"]);
    expect(sections[1]?.blocks).toEqual([{ type: "list", items: ["First feature", "Second feature"] }]);
  });
  it.each(["## Test\n\n<script>alert(1)</script>", "## Test\n\n[Unsafe](javascript:alert(1))", "# Duplicate page H1\n\nText", "## Same\n\nOne\n\n## Same\n\nTwo"])("rejects unsupported or ambiguous authoring: %s", (source) => {
    expect(() => parseProjectMarkdown(source)).toThrow();
  });
});
