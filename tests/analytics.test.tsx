import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
vi.mock("@vercel/analytics/next", () => ({ Analytics: () => <div data-testid="analytics-sdk-test-only" /> }));
import { SiteAnalytics } from "@/components/analytics/site-analytics";
import { getPublication } from "@/lib/seo/publication";

describe("production analytics mounting (SDK mocked)", () => {
  it("requires a configured Vercel production build and respects the disabled preference", () => {
    const env = { VERCEL_ENV: "production", VERCEL: "1" };
    const settings = { origin: "https://portfolio.test", allowIndexing: false, webAnalytics: true };
    expect(getPublication(env, settings).analyticsEnabled).toBe(true);
    expect(getPublication(env, { ...settings, origin: null }).analyticsEnabled).toBe(false);
    expect(getPublication(env, { ...settings, webAnalytics: false }).analyticsEnabled).toBe(false);
  });
  it("mounts only for an allowed current origin/path", () => {
    const origin = window.location.origin;
    const path = window.location.pathname;
    const { rerender } = render(<SiteAnalytics origin={origin} paths={[path]} />);
    expect(screen.getByTestId("analytics-sdk-test-only")).toBeInTheDocument();
    rerender(<SiteAnalytics origin="https://another.test" paths={[path]} />);
    expect(screen.queryByTestId("analytics-sdk-test-only")).not.toBeInTheDocument();
  });
  it("does not mount when the visitor sends a privacy signal", () => {
    const descriptor = Object.getOwnPropertyDescriptor(navigator, "doNotTrack");
    Object.defineProperty(navigator, "doNotTrack", { value: "1", configurable: true });
    try {
      render(<SiteAnalytics origin={window.location.origin} paths={[window.location.pathname]} />);
      expect(screen.queryByTestId("analytics-sdk-test-only")).not.toBeInTheDocument();
    } finally { if (descriptor) Object.defineProperty(navigator, "doNotTrack", descriptor); else Reflect.deleteProperty(navigator, "doNotTrack"); }
  });
});
