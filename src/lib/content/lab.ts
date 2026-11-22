import { z } from "zod";
import data from "@/content/lab/page.json";
import { labStatuses } from "@/lib/lab-model";

const text = z.string().trim().min(1);
export const labPageSchema = z.strictObject({
  heading: text, introduction: text, emptyHeading: text, emptyBody: text, unmatchedHeading: text, unmatchedBody: text,
  legendHeading: text, statusDescriptions: z.record(z.enum(labStatuses), text),
});
export const labPage = labPageSchema.parse(data);
export type LabPageCopy = z.infer<typeof labPageSchema>;
