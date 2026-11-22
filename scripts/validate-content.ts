import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { portfolioSchema } from "../src/lib/content/schema";
import { homepageSchema } from "../src/lib/content/homepage";
import { aboutSchema } from "../src/lib/content/about";
import { loadProjectNarrative } from "../src/lib/content/project-narratives";
import { labPageSchema } from "../src/lib/content/lab";
import { githubCurationSchema } from "../src/lib/content/github";
import { publicationSchema } from "../src/lib/seo/publication";

const content = portfolioSchema.parse({ ...JSON.parse(readFileSync(resolve("src/content/site.json"), "utf8")), projects: JSON.parse(readFileSync(resolve("src/content/projects/index.json"), "utf8")), lab: JSON.parse(readFileSync(resolve("src/content/lab/index.json"), "utf8")), ventures: JSON.parse(readFileSync(resolve("src/content/ventures/index.json"), "utf8")), resources: JSON.parse(readFileSync(resolve("src/content/resources/aws-cloud.json"), "utf8")) });
githubCurationSchema.parse(JSON.parse(readFileSync(resolve("src/content/github/repositories.json"), "utf8")));
publicationSchema.parse(JSON.parse(readFileSync(resolve("src/content/publication.json"), "utf8")));
if (!content.experience.some((record) => record.slug === "gencanyon")) throw new Error("Missing verified Gencanyon association");
labPageSchema.parse(JSON.parse(readFileSync(resolve("src/content/lab/page.json"), "utf8")));
const homepage = homepageSchema.parse(JSON.parse(readFileSync(resolve("src/content/homepage.json"), "utf8")));
const featuredSlugs = content.projects.filter((project) => project.featured).map((project) => project.slug);
if (JSON.stringify(homepage.featured.map((project) => project.slug)) !== JSON.stringify(featuredSlugs)) throw new Error("Homepage must reference the canonical featured project order");
aboutSchema.parse(JSON.parse(readFileSync(resolve("src/content/about.json"), "utf8")));
if (!existsSync(resolve("public/assets/hero/fallback/sculpture.svg"))) throw new Error("Missing hero fallback artwork");
for (const record of [...content.projects, ...content.ventures, ...content.lab, ...content.resources]) {
  if ("image" in record && record.image && !existsSync(resolve("public", record.image.src.slice(1)))) {
    throw new Error(`Missing approved asset: ${record.image.src}`);
  }
}
for (const venture of content.ventures) {
  if (venture.logo && !existsSync(resolve("public", venture.logo.src.slice(1)))) throw new Error(`Missing approved venture logo: ${venture.logo.src}`);
}
if (content.resume && !existsSync(resolve("public", content.resume.src.slice(1)))) {
  throw new Error("Configured resume PDF does not exist");
}
for (const project of content.projects) {
  loadProjectNarrative(project);
  for (const image of project.gallery ?? []) if (!existsSync(resolve("public", image.src.slice(1)))) throw new Error(`Missing approved project image: ${image.src}`);
}
console.log("Content valid: identity and collections checked; referenced assets exist.");
