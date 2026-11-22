import { describe, expect, it } from "vitest";
import { content } from "@/lib/content";
import { architectureSchema, projectSchema, portfolioSchema } from "@/lib/content/schema";
import { loadProjectNarrative } from "@/lib/content/project-narratives";

const testGraph = { approval: "approved", summary: "Test-only approved graph fixture", nodes: [{ id: "first", label: "First test node" }, { id: "second", label: "Second test node" }], edges: [{ from: "first", to: "second", label: "Test connection" }] };
describe("project editorial boundaries", () => {
  it("does not publish unapproved architecture or invented screenshots", () => {
    expect(content.projects.every((project) => !project.architecture && !project.gallery && !project.image)).toBe(true);
    expect(architectureSchema.safeParse({ ...testGraph, approval: "pending" }).success).toBe(false);
  });
  it("accepts a structurally approved test graph and rejects invalid endpoints", () => {
    expect(architectureSchema.safeParse(testGraph).success).toBe(true);
    expect(architectureSchema.safeParse({ ...testGraph, edges: [{ from: "first", to: "missing", label: "Invalid" }] }).success).toBe(false);
    expect(architectureSchema.safeParse({ ...testGraph, nodes: [testGraph.nodes[0], testGraph.nodes[0]] }).success).toBe(false);
  });
  it("requires reviewed local project images with dimensions and alternative text", () => {
    const project = content.projects[0]!;
    const image = { src: "/assets/projects/research-hub/test.png", alt: "Test-only image fixture", caption: "Test caption", width: 1200, height: 800, approval: "approved" };
    expect(projectSchema.safeParse({ ...project, gallery: [image] }).success).toBe(true);
    expect(projectSchema.safeParse({ ...project, gallery: [{ ...image, approval: "pending" }] }).success).toBe(false);
    expect(projectSchema.safeParse({ ...project, gallery: [{ ...image, src: "/assets/projects/other/test.png" }] }).success).toBe(false);
    expect(projectSchema.safeParse({ ...project, gallery: [{ ...image, alt: "", width: 0 }] }).success).toBe(false);
  });
  it("rejects duplicate project slugs and technology tags", () => {
    const project = content.projects[0]!;
    expect(portfolioSchema.safeParse({ ...content, projects: [project, project] }).success).toBe(false);
    expect(projectSchema.safeParse({ ...project, technologies: ["React", "react"] }).success).toBe(false);
  });
  it("builds the four actual narratives and keeps limited secondary records compact", () => {
    expect(content.projects.filter((project) => project.featured).map((project) => loadProjectNarrative(project).length).every((length) => length >= 5)).toBe(true);
    expect(content.projects.filter((project) => !project.featured).every((project) => loadProjectNarrative(project).length === 0)).toBe(true);
  });
  it("keeps unknown secondary technologies and missing links absent", () => {
    for (const slug of ["sentiment-analysis", "phishing-detection", "diwali-sales-analysis"]) expect(content.projects.find((project) => project.slug === slug)?.technologies).toEqual([]);
    expect(content.projects.every((project) => project.repositoryUrl === undefined)).toBe(true);
    expect(content.projects.find((project) => project.slug === "waterbuddy")?.demoUrl).toBeUndefined();
  });
  it("rejects narrative path traversal before reading a file", () => {
    expect(() => loadProjectNarrative({ ...content.projects[0]!, slug: "../private" })).toThrow("Invalid narrative slug");
  });
});
