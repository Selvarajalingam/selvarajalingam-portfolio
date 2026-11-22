import { z } from "zod";
import { skillStatuses, skillCategoryTitles } from "@/lib/skill-model";
import { projectCategories } from "@/lib/project-model";
import { labCategories, labStatuses } from "@/lib/lab-model";

const text = z.string().trim().min(1);
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const skillCategorySchema = z.strictObject({
  slug, title: z.enum(skillCategoryTitles),
  items: z.array(z.strictObject({ name: text, status: z.enum(skillStatuses), context: text })).min(1),
  verification: z.literal("verified"),
}).superRefine((category, ctx) => {
  const names = new Set<string>();
  category.items.forEach((item, index) => {
    const key = item.name.trim().toLowerCase();
    if (names.has(key)) ctx.addIssue({ code: "custom", message: "Duplicate skill in category", path: ["items", index, "name"] });
    names.add(key);
  });
});
export type SkillCategory = z.infer<typeof skillCategorySchema>;
export type SkillStatus = typeof skillStatuses[number];

export const experienceSchema = z.strictObject({
  slug, title: text, organisation: text, startDate: z.iso.date().optional(), endDate: z.iso.date().optional(), summary: text, verification: z.literal("verified"),
}).refine((record) => !record.endDate || Boolean(record.startDate && record.endDate >= record.startDate), "End date requires a start date and cannot precede it");
const httpsUrl = z.url().refine((value) => {
  const url = new URL(value);
  const placeholder = /(^|\.)(example\.(com|org|net)|placeholder\.com|localhost)$/i;
  return url.protocol === "https:" && !url.username && !url.password && !placeholder.test(url.hostname);
}, "Use a genuine, supplied HTTPS destination without embedded credentials");

export const imageSchema = z.strictObject({
  src: z.string().regex(/^\/assets\/[a-zA-Z0-9/_-]+\.(avif|webp|png|jpe?g|svg)$/),
  alt: text,
});

const base = {
  slug, title: text, summary: text,
  verification: z.literal("verified"),
  image: imageSchema.optional(),
};
export const architectureSchema = z.strictObject({
  approval: z.literal("approved"), summary: text,
  nodes: z.array(z.strictObject({ id: slug, label: text })).min(2).max(8),
  edges: z.array(z.strictObject({ from: slug, to: slug, label: text })).min(1),
}).superRefine((graph, ctx) => {
  const ids = new Set(graph.nodes.map((node) => node.id));
  if (ids.size !== graph.nodes.length) ctx.addIssue({ code: "custom", message: "Duplicate architecture node" });
  graph.edges.forEach((edge, index) => {
    if (!ids.has(edge.from) || !ids.has(edge.to) || edge.from === edge.to) ctx.addIssue({ code: "custom", message: "Invalid architecture connection", path: ["edges", index] });
  });
});
export const projectImageSchema = imageSchema.extend({ width: z.number().int().positive(), height: z.number().int().positive(), caption: text, approval: z.literal("approved") });
export const projectSchema = z.strictObject({
  ...base,
  categories: z.array(z.enum(projectCategories)).min(1),
  technologies: z.array(text),
  role: text,
  status: z.enum(["Live", "Completed", "In progress"]),
  featured: z.boolean(),
  updatedAt: z.iso.date().optional(),
  demoUrl: httpsUrl.optional(),
  repositoryUrl: httpsUrl.optional(),
  overview: text.optional(),
  gallery: z.array(projectImageSchema).min(1).optional(),
  architecture: architectureSchema.optional(),
}).superRefine((project, ctx) => {
  for (const field of ["categories", "technologies"] as const) {
    const values = project[field].map((value) => value.toLowerCase());
    if (new Set(values).size !== values.length) ctx.addIssue({ code: "custom", message: `Duplicate ${field}`, path: [field] });
  }
  project.gallery?.forEach((image, index) => {
    if (!image.src.startsWith(`/assets/projects/${project.slug}/`)) ctx.addIssue({ code: "custom", message: "Project image must belong to its project folder", path: ["gallery", index, "src"] });
  });
});
export type Project = z.infer<typeof projectSchema>;
export type Architecture = z.infer<typeof architectureSchema>;
export const ventureSchema = z.strictObject({
  slug, title: text, summary: text, verification: z.literal("verified"),
  status: z.literal("Live & Active"),
  logo: imageSchema.extend({ width: z.number().int().positive(), height: z.number().int().positive(), approval: z.literal("approved") }).optional(),
  website: z.discriminatedUnion("status", [
    z.strictObject({ status: z.literal("available"), url: httpsUrl }),
    z.strictObject({ status: z.literal("coming-soon") }),
  ]),
}).superRefine((venture, ctx) => {
  if (venture.logo && !venture.logo.src.startsWith(`/assets/ventures/${venture.slug}/`)) ctx.addIssue({ code: "custom", message: "Venture logo must belong to its venture folder", path: ["logo", "src"] });
});
export type Venture = z.infer<typeof ventureSchema>;
export const labSchema = z.strictObject({
  ...base,
  category: z.enum(labCategories), status: z.enum(labStatuses), idea: text,
  progress: z.strictObject({ summary: text, updatedAt: z.iso.date().optional(), nextSteps: z.array(text).min(1).optional() }),
  timeline: z.array(z.strictObject({ date: z.iso.date(), title: text, body: text })).min(1).optional(),
  learnings: z.array(text).min(1).optional(),
  demoUrl: httpsUrl.optional(), repositoryUrl: httpsUrl.optional(),
  image: projectImageSchema.optional(),
}).superRefine((entry, ctx) => {
  if (entry.image && !entry.image.src.startsWith(`/assets/lab/${entry.slug}/`)) ctx.addIssue({ code: "custom", message: "Lab image must belong to its experiment folder", path: ["image", "src"] });
  entry.timeline?.forEach((note, index, notes) => {
    if (index && note.date < notes[index - 1]!.date) ctx.addIssue({ code: "custom", message: "Lab timeline must be chronological", path: ["timeline", index, "date"] });
  });
  const lastNote = entry.timeline?.at(-1);
  if (lastNote && entry.progress.updatedAt && entry.progress.updatedAt < lastNote.date) ctx.addIssue({ code: "custom", message: "Progress update cannot precede the latest timeline note", path: ["progress", "updatedAt"] });
});
export type LabExperiment = z.infer<typeof labSchema>;
export const resourceSchema = z.strictObject({
  ...base, type: z.enum(["Video", "Article", "Tutorial", "Resource"]), url: httpsUrl,
  category: text.optional(), attribution: text.optional(),
});
export type CloudResource = z.infer<typeof resourceSchema>;

function collection<T extends z.ZodType<{ slug: string }>>(schema: T) {
  return z.array(schema).superRefine((records, ctx) => {
    const seen = new Set<string>();
    records.forEach((record, index) => {
      if (seen.has(record.slug)) ctx.addIssue({ code: "custom", message: "Duplicate slug", path: [index, "slug"] });
      seen.add(record.slug);
    });
  });
}

export const portfolioSchema = z.strictObject({
  profile: z.strictObject({ name: text, wordmark: text, tagline: text, identity: text, hero: text, email: z.email(), description: text }),
  projects: collection(projectSchema),
  ventures: collection(ventureSchema),
  lab: collection(labSchema),
  resources: collection(resourceSchema),
  services: collection(z.strictObject({ slug, title: text, items: z.array(text).min(1), verification: z.literal("verified") })),
  skills: collection(skillCategorySchema).superRefine((categories, ctx) => {
    if (categories.length && (categories.length !== 7 || new Set(categories.map((category) => category.title)).size !== 7)) ctx.addIssue({ code: "custom", message: "Published skills require all seven distinct categories" });
  }),
  experience: collection(experienceSchema),
  social: z.array(z.strictObject({ label: text, url: httpsUrl })),
  resume: z.strictObject({ src: z.string().regex(/^\/assets\/resume\/[a-zA-Z0-9_-]+\.pdf$/), label: text, status: z.enum(["sample", "approved"]) }).refine((resume) => resume.status !== "sample" || resume.label === "Sample Resume — Updating", "Sample resumes must retain their explicit label").nullable(),
});

export type PortfolioContent = z.infer<typeof portfolioSchema>;
