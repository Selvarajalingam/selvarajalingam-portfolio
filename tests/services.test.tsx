import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Services from "@/app/(site)/services/page";
import Privacy from "@/app/(site)/privacy/page";
import { content } from "@/lib/content";

describe("service and privacy content", () => {
  it("renders the three confirmed service groups as native accordions without pricing", () => {
    const { container } = render(<Services />);
    expect(content.services.map((service) => service.title)).toEqual(["Development", "Product & Design", "Education"]);
    expect(container.querySelectorAll("details > summary")).toHaveLength(3);
    expect(container.textContent).toContain("MVP and startup prototypes (Vibe Coding)");
    expect(container.textContent).not.toMatch(/₹|\$|pricing|guarantee|founder/i);
    const enquiries = Array.from(container.querySelectorAll('a[href="/connect"]')).map((link) => link.textContent);
    for (const service of content.services) expect(enquiries).toContain(`Enquire about ${service.title}`);
  });
  it("describes actual implemented processing without promising deletion periods or delivery", () => {
    const { container } = render(<Privacy />);
    expect(screen.getByRole("heading", { name: "Privacy Policy", level: 1 })).toBeInTheDocument();
    expect(container.textContent).toContain("does not save contact submissions in an application database");
    expect(container.textContent).toContain("No fixed deletion period has been set");
    expect(container.textContent).toContain("Google Analytics are not enabled");
  });
});
