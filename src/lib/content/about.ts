import { z } from "zod";
import data from "@/content/about.json";

const text = z.string().trim().min(1);
const paragraph = z.strictObject({ title: text, body: text });
export const aboutSchema = z.strictObject({
  headline: text, introduction: text, story: z.array(text).min(1),
  education: z.strictObject({ institution: text, field: text }),
  coursework: z.strictObject({ subject: text, platform: text, status: z.literal("Course completed") }),
  cloudLearning: z.strictObject({ title: z.literal("AWS Certified Developer – Associate"), status: z.literal("Currently pursuing"), body: text }),
  journey: z.array(paragraph.extend({ slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/) })).min(1).superRefine((items, ctx) => {
    if (new Set(items.map((item) => item.slug)).size !== items.length) ctx.addIssue({ code: "custom", message: "Journey slugs must be unique" });
  }),
  contributions: z.array(paragraph).min(1), interests: z.array(paragraph).min(1),
});

export const about = aboutSchema.parse(data);
