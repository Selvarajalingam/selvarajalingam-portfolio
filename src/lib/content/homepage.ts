import { z } from "zod";
import data from "@/content/homepage.json";

const text = z.string().trim().min(1);
const paragraph = z.strictObject({ title: text, body: text });
export const homepageSchema = z.strictObject({
  introduction: z.strictObject({ heading: text, body: text, philosophy: text }),
  featured: z.array(z.strictObject({ slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), context: text })).length(4),
  services: z.array(paragraph).length(3),
  journey: z.array(paragraph),
  impact: z.strictObject({ heading: text, body: text }),
  skills: z.array(paragraph).length(7),
  cloud: z.strictObject({ heading: text, credential: text, emptyState: text }),
  lab: z.strictObject({ heading: text, emptyState: text, publishedIntro: text }),
  connect: z.strictObject({ heading: text, body: text, availability: text }),
});

export const homepage = homepageSchema.parse(data);
