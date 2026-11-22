import { z } from "zod";
import { contactSubjects } from "./model";

const singleLine = z.string().trim().refine((text) => !/[\u0000-\u001f\u007f]/.test(text), "Use a single line of text.");
export const contactSchema = z.strictObject({
  name: singleLine.pipe(z.string().min(1, "Enter your name.").max(100, "Use 100 characters or fewer.")),
  email: singleLine.pipe(z.email("Enter a valid email address.").max(254)),
  phone: z.string().trim().max(30).regex(/^[+\d ().-]*$/, "Enter a valid phone number or leave it blank."),
  subject: z.enum(contactSubjects, { error: "Choose a subject." }),
  message: z.string().trim().min(20, "Use at least 20 characters so I can understand your enquiry.").max(5000, "Use 5,000 characters or fewer.").refine((text) => !/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(text), "Remove unsupported control characters."),
  website: z.string().max(200),
  startedAt: z.number().int().nonnegative(),
  submissionId: z.uuid(),
  token: z.string().max(2048),
});
export type ContactInput = z.infer<typeof contactSchema>;
