import { describe, expect, it } from "vitest";
import { canEnhanceSculpture } from "@/lib/sculpture-policy";

const capable = { desktop: true, reducedMotion: false, saveData: false, cores: 8, memory: 8, effectiveType: "4g" };
describe("sculpture eligibility", () => {
  it("permits capable desktops", () => expect(canEnhanceSculpture(capable)).toBe(true));
  it.each([
    { desktop: false }, { reducedMotion: true }, { saveData: true }, { cores: 2 }, { memory: 2 }, { effectiveType: "2g" }, { effectiveType: "slow-2g" },
  ])("retains vector artwork for constrained devices: %o", (constraint) => {
    expect(canEnhanceSculpture({ ...capable, ...constraint })).toBe(false);
  });
  it("works when optional hardware hints are absent", () => {
    expect(canEnhanceSculpture({ desktop: true, reducedMotion: false, saveData: false })).toBe(true);
  });
});
