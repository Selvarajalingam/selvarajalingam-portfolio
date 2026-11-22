import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import About from "@/app/(site)/about/page";
import Experience from "@/app/(site)/experience/page";
import { SkillExplorer } from "@/components/skills/skill-explorer";
import { ResumePreview } from "@/components/profile/resume-preview";
import { content } from "@/lib/content";

describe("About and Experience", () => {
  it("presents the supplied learning and interests without invented qualifications", () => {
    const { container } = render(<About />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Curiosity, put into practice.");
    expect(screen.getByText("Rathinam Technical Campus")).toBeInTheDocument();
    expect(screen.getByText(/Arsenal, Barcelona, Bayern Munich and AC Milan/)).toBeInTheDocument();
    expect(container.textContent).not.toMatch(/B\.Tech|B\.E\.|200\+|50\+|100\+|7 October|October 2024/);
    expect(screen.getByText("Currently pursuing")).toBeInTheDocument();
  });
  it("uses the exact confirmed Gencanyon role without guessed dates", () => {
    const { container } = render(<Experience />);
    expect(screen.getByText("Product & Technology Lead | Business & Product Development Lead")).toBeInTheDocument();
    expect(container.querySelector("time")).toBeNull();
    expect(container.textContent).not.toMatch(/founder|director|200\+|50\+|100\+/i);
  });
  it("combines skill filters and resets the empty state", () => {
    render(<SkillExplorer categories={content.skills} />);
    fireEvent.change(screen.getByRole("searchbox", { name: "Find a skill" }), { target: { value: "Spring Boot" } });
    fireEvent.click(screen.getByRole("button", { name: /^Applied$/ }));
    expect(screen.getByText("No skills match these filters.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Reset filters" }));
    expect(screen.getByRole("searchbox")).toHaveValue("");
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(7);
  });
  it("does not link a missing resume", () => {
    render(<ResumePreview resume={null} />);
    expect(screen.getByText("Resume updating")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
  it("labels a configured sample for both preview and download", () => {
    const { container } = render(<ResumePreview resume={{ src: "/assets/resume/sample.pdf", label: "Sample Resume — Updating", status: "sample" }} />);
    expect(within(container).getByText("Sample Resume — Updating")).toBeInTheDocument();
    expect(screen.getByTitle("Sample Resume — Updating preview")).toHaveAttribute("src", "/assets/resume/sample.pdf");
    expect(screen.getByRole("link", { name: "Download PDF" })).toHaveAttribute("download");
  });
});
