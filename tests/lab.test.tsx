import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { content } from "@/lib/content";
import { labSchema, portfolioSchema } from "@/lib/content/schema";
import { filterExperiments, toLabSummary } from "@/lib/lab";
import { LabExplorer } from "@/components/lab/lab-explorer";
import { LabArticle } from "@/components/lab/lab-article";
import { labPage } from "@/lib/content/lab";

// Test-only fixtures. Never add these to the production Lab JSON.
const fixture = { slug: "test-only", title: "Test-only fixture", summary: "Fixture summary", category: "Developer Tools & Automation", status: "Building", idea: "A test-only idea", progress: { summary: "A test-only progress note" }, verification: "verified" };

describe("empty launch and future Lab discovery", () => {
  it("keeps the actual collection empty", () => expect(content.lab).toEqual([]));
  it("composes search/category/status without changing the source", () => {
    const records = [toLabSummary(labSchema.parse(fixture))];
    expect(filterExperiments(records, { query: " FIXTURE ", category: "Developer Tools & Automation", status: "Building" })).toHaveLength(1);
    expect(filterExperiments(records, { query: "", category: "AI & Machine Learning", status: "Building" })).toEqual([]);
    expect(filterExperiments(records, { query: "", category: "All", status: "Exploring" })).toEqual([]);
    expect(records).toHaveLength(1);
  });
  it("keeps empty-collection copy honest while controls reset", () => {
    render(<LabExplorer entries={[]} copy={labPage} />);
    fireEvent.change(screen.getByRole("searchbox", { name: "Find an experiment" }), { target: { value: "unknown" } });
    expect(screen.getByRole("heading", { name: "No experiments to share just yet." })).toBeInTheDocument();
    expect(screen.queryByRole("article")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Reset filters" }));
    expect(screen.getByRole("searchbox")).toHaveFocus();
    expect(screen.getByRole("searchbox")).toHaveValue("");
  });
  it("distinguishes a filtered-empty view of verified test data", () => {
    render(<LabExplorer entries={[toLabSummary(labSchema.parse(fixture))]} copy={labPage} />);
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "does-not-match" } });
    expect(screen.getByRole("heading", { name: "No experiments match these filters." })).toBeInTheDocument();
  });
});

describe("Lab publication boundary", () => {
  it("rejects a pending experiment", () => expect(labSchema.safeParse({ ...fixture, verification: "pending" }).success).toBe(false));
  it.each(["In progress", "Complete", "Planned"])("rejects unsupported status %s", (status) => expect(labSchema.safeParse({ ...fixture, status }).success).toBe(false));
  it("requires an idea and progress summary", () => expect(labSchema.safeParse({ ...fixture, idea: "", progress: { summary: "" } }).success).toBe(false));
  it("rejects duplicate slugs", () => expect(portfolioSchema.safeParse({ ...content, lab: [fixture, fixture] }).success).toBe(false));
  it("rejects invalid or backwards timeline dates", () => {
    const timeline = [{ date: "2026-02-02", title: "Test event", body: "Fixture note" }, { date: "2026-01-01", title: "Earlier test event", body: "Fixture note" }];
    expect(labSchema.safeParse({ ...fixture, timeline }).success).toBe(false);
    expect(labSchema.safeParse({ ...fixture, progress: { summary: "A note", updatedAt: "2026-13-01" } }).success).toBe(false);
  });
  it("requires approved assets in the experiment's own folder", () => {
    const image = { src: "/assets/lab/test-only/fixture.png", alt: "Test-only image", caption: "Fixture", width: 800, height: 600, approval: "approved" };
    expect(labSchema.safeParse({ ...fixture, image }).success).toBe(true);
    expect(labSchema.safeParse({ ...fixture, image: { ...image, approval: "pending" } }).success).toBe(false);
    expect(labSchema.safeParse({ ...fixture, image: { ...image, src: "/assets/lab/other/fixture.png" } }).success).toBe(false);
  });
});

describe("fixture-only detail rendering", () => {
  it("renders current progress without inventing dates, next steps or a timeline", () => {
    const { container } = render(<LabArticle entry={labSchema.parse(fixture)} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Test-only fixture");
    expect(screen.getByText("A test-only progress note")).toBeInTheDocument();
    expect(container.querySelector("time")).toBeNull();
    expect(screen.queryByRole("heading", { name: "Progress notes" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to The Lab" })).toHaveAttribute("href", "/lab");
  });
  it("renders supplied optional notes and escapes text", () => {
    const entry = labSchema.parse({ ...fixture, progress: { summary: "A note", updatedAt: "2026-02-02", nextSteps: ["Test next step"] }, timeline: [{ date: "2026-02-01", title: "Test event", body: "<script>unsafe()</script>" }], learnings: ["A test learning note"] });
    const { container } = render(<LabArticle entry={entry} />);
    expect(container.querySelectorAll("time")).toHaveLength(2);
    expect(screen.getByText("Test next step")).toBeInTheDocument();
    expect(screen.getByText("<script>unsafe()</script>")).toBeInTheDocument();
    expect(container.querySelector("script")).toBeNull();
  });
});
