import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { content } from "@/lib/content";
import { portfolioSchema, ventureSchema } from "@/lib/content/schema";
import { VentureArticle } from "@/components/ventures/venture-article";
import Ventures from "@/app/(site)/ventures/page";
import { generateStaticParams } from "@/app/(site)/ventures/[slug]/page";

describe("verified venture directory", () => {
  it("publishes exactly the four supplied ventures and static paths", () => {
    expect(content.ventures.map((entry) => entry.title)).toEqual(["CloudApex", "BigIntellects", "CanyonInk", "Chennai Buyers"]);
    expect(generateStaticParams()).toEqual(content.ventures.map(({ slug }) => ({ slug })));
    expect(content.ventures.every((entry) => entry.status === "Live & Active")).toBe(true);
  });
  it("keeps exact supplied website destinations and the explicit coming-soon state", () => {
    expect(content.ventures.map((entry) => entry.website)).toEqual([
      { status: "available", url: "https://cloudapex.in/" },
      { status: "available", url: "https://bigintellects.com/" },
      { status: "available", url: "https://canyonink.in/" },
      { status: "coming-soon" },
    ]);
  });
  it("renders the shared confirmed role without ownership claims or invented images", () => {
    const { container } = render(<Ventures />);
    expect(screen.getByText("Product & Technology Lead | Business & Product Development Lead")).toBeInTheDocument();
    expect(container.querySelectorAll(".venture-card")).toHaveLength(4);
    expect(container.querySelector("img")).toBeNull();
    expect(container.textContent).not.toMatch(/founder|owner|director|revenue|customers|\d+\+/i);
  });
  it("keeps Chennai Buyers active while its website is coming soon", () => {
    const { container } = render(<VentureArticle venture={content.ventures[3]!} />);
    expect(screen.getByText("Live & Active")).toBeInTheDocument();
    expect(screen.getByText("Website coming soon")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Enquire about Chennai Buyers" })).toHaveAttribute("href", "/connect");
    expect(container.querySelector('a[target="_blank"]')).toBeNull();
  });
  it.each([0, 1, 2])("uses protected external website links on detail %s", (index) => {
    const venture = content.ventures[index]!;
    render(<VentureArticle venture={venture} />);
    const link = screen.getByRole("link", { name: `Visit ${venture.title} website (opens in a new tab)` });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.getByRole("link", { name: "Back to Ventures" })).toHaveAttribute("href", "/ventures");
  });
  it("rejects unverified/duplicate entries and fabricated website states", () => {
    const venture = content.ventures[0]!;
    expect(ventureSchema.safeParse({ ...venture, verification: "pending" }).success).toBe(false);
    expect(portfolioSchema.safeParse({ ...content, ventures: [venture, venture] }).success).toBe(false);
    expect(ventureSchema.safeParse({ ...venture, website: { status: "coming-soon", url: "https://cloudapex.in/" } }).success).toBe(false);
    expect(ventureSchema.safeParse({ ...venture, website: { status: "available", url: "javascript:alert(1)" } }).success).toBe(false);
  });
  it("requires logo approval, dimensions and the matching venture asset folder", () => {
    const venture = content.ventures[0]!;
    const logo = { src: "/assets/ventures/cloudapex/logo.svg", alt: "CloudApex", width: 200, height: 60, approval: "approved" };
    expect(ventureSchema.safeParse({ ...venture, logo }).success).toBe(true);
    expect(ventureSchema.safeParse({ ...venture, logo: { ...logo, approval: "pending" } }).success).toBe(false);
    expect(ventureSchema.safeParse({ ...venture, logo: { ...logo, width: 0 } }).success).toBe(false);
    expect(ventureSchema.safeParse({ ...venture, logo: { ...logo, src: "/assets/ventures/canyonink/logo.svg" } }).success).toBe(false);
    expect(ventureSchema.safeParse({ ...venture, image: { src: "/assets/ventures/cloudapex/logo.svg", alt: "Unapproved" } }).success).toBe(false);
  });
});
