import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "@/app/(site)/page";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

describe("foundation shell", () => {
  it("provides a skip link to the main content", () => {
    render(<SiteHeader />);
    expect(screen.getByRole("link", { name: "Skip to content" })).toHaveAttribute("href", "#main-content");
  });
  it("renders the supplied hero and usable foundation destinations", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("I teach technology, build software, and turn ideas into digital products.");
    expect(screen.getByRole("link", { name: "Explore my work" })).toHaveAttribute("href", "#selected-work");
    for (const link of screen.getAllByRole("link", { name: /^Let's connect$/ })) expect(link).toHaveAttribute("href", "/connect");
    expect(screen.queryByText(/200\+|50\+|100\+/)).not.toBeInTheDocument();
  });
  it("exposes only the supplied social destination", () => {
    render(<SiteFooter />);
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute("href", "https://github.com/Selvarajalingam");
    expect(screen.queryByRole("link", { name: "LinkedIn" })).not.toBeInTheDocument();
  });
});
