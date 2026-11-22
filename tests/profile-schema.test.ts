import { describe, expect, it } from "vitest";
import { content } from "@/lib/content";
import { about, aboutSchema } from "@/lib/content/about";
import { experienceSchema, portfolioSchema, skillCategorySchema } from "@/lib/content/schema";

describe("profile publication rules", () => {
  it("allows a confirmed role without inventing dates", () => {
    const result = experienceSchema.parse(content.experience[0]);
    expect(result.startDate).toBeUndefined();
    expect(result.endDate).toBeUndefined();
  });
  it.each([
    { endDate: "2024-10-07" },
    { startDate: "2025-01-01", endDate: "2024-01-01" },
    { startDate: "2024-13-01" },
  ])("rejects inconsistent or invalid dates: %o", (dates) => {
    expect(experienceSchema.safeParse({ ...content.experience[0], ...dates }).success).toBe(false);
  });
  it("does not allow the AWS pursuit to be relabelled as earned", () => {
    expect(aboutSchema.safeParse({ ...about, cloudLearning: { ...about.cloudLearning, status: "Earned" } }).success).toBe(false);
  });
  it("rejects duplicate skill names in a category", () => {
    const category = content.skills[0]!;
    const result = skillCategorySchema.safeParse({ ...category, items: [...category.items, category.items[0]] });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues.some((issue) => issue.message === "Duplicate skill in category")).toBe(true);
  });
  it("requires all seven different category titles", () => {
    expect(portfolioSchema.safeParse({ ...content, skills: content.skills.map((category, index) => ({ ...category, title: index === 1 ? content.skills[0]!.title : category.title })) }).success).toBe(false);
  });
});
