import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "@/app/(site)/page";

describe("homepage content boundary", () => {
  it("renders the eleven agreed sections in order", () => {
    const { container } = render(<Home />);
    expect(Array.from(container.querySelectorAll("section[id]")).map((el) => el.id)).toEqual([
      "hero", "introduction", "selected-work", "what-i-do", "journey", "impact", "skills", "cloud", "ventures", "lab", "connect",
    ]);
  });
  it("uses the confirmed flagship order without fake screenshots", () => {
    render(<Home />);
    expect(screen.getAllByRole("article").map((el) => el.querySelector("h3")?.textContent)).toEqual(["Research Hub", "Alumni Portal", "Hearth", "WaterBuddy"]);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
  it("qualifies the AWS pursuit and leaves resources/experiments honest", () => {
    render(<Home />);
    expect(screen.getByText(/AWS Certified Developer – Associate/)).toHaveTextContent(/currently pursuing/i);
    expect(screen.getByText(/No experiments to share/)).toBeInTheDocument();
    expect(screen.queryByText(/200\+|50\+|100\+|founder|director|certified AWS developer/i)).not.toBeInTheDocument();
  });
});
