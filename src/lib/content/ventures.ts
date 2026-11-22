import { content } from "@/lib/content";

const association = content.experience.find((record) => record.slug === "gencanyon");
if (!association) throw new Error("Ventures require the verified Gencanyon association");
export const ventureAssociation = association;
