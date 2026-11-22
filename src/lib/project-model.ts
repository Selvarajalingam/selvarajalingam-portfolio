export const projectCategories = ["Full-stack Development", "Java Development", "AI & Machine Learning", "Data Analytics", "Desktop Applications"] as const;
export const projectSorts = ["featured", "title", "category", "technology", "updated"] as const;
export type ProjectSort = typeof projectSorts[number];
