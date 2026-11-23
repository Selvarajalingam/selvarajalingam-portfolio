import { describe, expect, it } from "vitest";
import { content } from "@/lib/content";
import { defaultProjectFilters, readProjectFilters, writeProjectFilters } from "@/lib/project-filter-url";

describe("shareable work filters", () => {
  it("round-trips combined filters and preserves unrelated query parameters", () => {
    const filters = { query: "Alumni & community", category: "Java Development", technology: "Spring Boot", sort: "title" as const };
    const search = writeProjectFilters("?ref=portfolio", filters);
    expect(new URLSearchParams(search).get("ref")).toBe("portfolio");
    expect(readProjectFilters(search, content.projects)).toEqual(filters);
    expect(writeProjectFilters(search, defaultProjectFilters)).toBe("?ref=portfolio");
  });
  it("rejects unknown filters, unpublished recency and unbounded search input", () => {
    expect(readProjectFilters("?category=Fake&technology=Fake&sort=updated", content.projects)).toEqual(defaultProjectFilters);
    expect(readProjectFilters(`?q=${"x".repeat(150)}&sort=invalid`, content.projects).query).toHaveLength(100);
  });
});
