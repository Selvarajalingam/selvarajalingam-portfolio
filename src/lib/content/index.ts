import data from "@/content/site.json";
import projects from "@/content/projects/index.json";
import lab from "@/content/lab/index.json";
import ventures from "@/content/ventures/index.json";
import resources from "@/content/resources/aws-cloud.json";
import { portfolioSchema } from "./schema";

export const content = portfolioSchema.parse({ ...data, projects, lab, ventures, resources });
