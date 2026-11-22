import { describe, expect, it } from "vitest";
import { filterSkills } from "@/lib/skills";
import { content } from "@/lib/content";

describe("skill discovery", () => {
  it("returns all seven categories by default", () => {
    expect(filterSkills(content.skills, "", "All")).toHaveLength(7);
  });
  it("finds skills without case or surrounding whitespace sensitivity", () => {
    const result = filterSkills(content.skills, "  spring BOOT ", "All");
    expect(result.flatMap((category) => category.items.map((item) => item.name))).toEqual(["Spring Boot"]);
  });
  it("composes search with strengthening status", () => {
    expect(filterSkills(content.skills, "Spring", "Applied")).toEqual([]);
    expect(filterSkills(content.skills, "Spring", "Strengthening")).toHaveLength(1);
  });
  it("keeps source content intact while filtering", () => {
    const before = JSON.stringify(content.skills);
    filterSkills(content.skills, "AWS", "Learning");
    expect(JSON.stringify(content.skills)).toBe(before);
  });
  it("provides an honest empty result", () => {
    expect(filterSkills(content.skills, "not-a-supplied-skill", "All")).toEqual([]);
  });
});
