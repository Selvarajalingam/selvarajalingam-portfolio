import { runInNewContext } from "node:vm";
import { describe, expect, it } from "vitest";
import { themeBootstrap } from "@/lib/theme-bootstrap";

describe("theme before first paint", () => {
  it.each([
    { saved: null, lightSystem: true, expected: "dark" },
    { saved: "light", lightSystem: false, expected: "light" },
    { saved: "system", lightSystem: true, expected: "light" },
    { saved: "system", lightSystem: false, expected: "dark" },
    { saved: "invalid", lightSystem: true, expected: "dark" },
  ])("resolves $saved with light system $lightSystem to $expected", ({ saved, lightSystem, expected }) => {
    const document = { documentElement: { dataset: { theme: "dark" } } };
    runInNewContext(themeBootstrap, { document, localStorage: { getItem: () => saved }, matchMedia: () => ({ matches: lightSystem }) });
    expect(document.documentElement.dataset.theme).toBe(expected);
  });
  it("retains dark without throwing if browser storage is blocked", () => {
    const document = { documentElement: { dataset: { theme: "dark" } } };
    expect(() => runInNewContext(themeBootstrap, { document, get localStorage() { throw new Error("Storage denied"); } })).not.toThrow();
    expect(document.documentElement.dataset.theme).toBe("dark");
  });
});
