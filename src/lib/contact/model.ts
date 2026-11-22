export const contactSubjects = ["Project Enquiry", "Freelance Work", "Training", "Collaboration", "Other"] as const;
export const contactFields = ["name", "email", "phone", "subject", "message"] as const;
export type ContactField = typeof contactFields[number];
export type ContactResult = {
  status: "accepted" | "accepted-without-receipt" | "uncertain" | "error" | "challenge";
  message: string;
  errors?: Partial<Record<ContactField, string>>;
  siteKey?: string;
};
