import type { SkillCategory, SkillStatus } from "@/lib/content/schema";

export function filterSkills(categories: readonly SkillCategory[], query: string, status: SkillStatus | "All"): SkillCategory[] {
  const search = query.trim().toLowerCase();
  return categories.map((category) => ({
    ...category,
    items: category.items.filter((item) => (status === "All" || item.status === status)
      && `${category.title} ${item.name} ${item.context}`.toLowerCase().includes(search)),
  })).filter((category) => category.items.length > 0);
}
