import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";
import { projectSchema, labSchema, ventureSchema } from "../src/lib/content/schema";

function estimateRoute(route: string, filename: string) {
  const html = readFileSync(join(".next/server/app", filename), "utf8");
  const paths = [...new Set([...html.matchAll(/<script[^>]*src="([^"?]+)(?:[^\"]*)"/g)].map((match) => match[1]!).filter((path) => path.startsWith("/_next/") && path.endsWith(".js")))];
  const bytes = paths.reduce((total, path) => total + gzipSync(readFileSync(join(".next", decodeURIComponent(path.replace("/_next/", ""))))).length, 0);
  return { route, paths, bytes };
}
const projects = projectSchema.array().parse(JSON.parse(readFileSync("src/content/projects/index.json", "utf8")));
const experiments = labSchema.array().parse(JSON.parse(readFileSync("src/content/lab/index.json", "utf8")));
const ventures = ventureSchema.array().parse(JSON.parse(readFileSync("src/content/ventures/index.json", "utf8")));
const routes = [estimateRoute("/", "index.html"), estimateRoute("/about", "about.html"), estimateRoute("/experience", "experience.html"), estimateRoute("/work", "work.html"), estimateRoute("/lab", "lab.html"), ...projects.map((project) => estimateRoute(`/work/${project.slug}`, `work/${project.slug}.html`)), ...experiments.map((entry) => estimateRoute(`/lab/${entry.slug}`, `lab/${entry.slug}.html`))];
routes.push(estimateRoute("/ventures", "ventures.html"), ...ventures.map((venture) => estimateRoute(`/ventures/${venture.slug}`, `ventures/${venture.slug}.html`)));
routes.push(estimateRoute("/services", "services.html"), estimateRoute("/connect", "connect.html"), estimateRoute("/privacy", "privacy.html"));
const home = routes[0]!;
const allChunks = readdirSync(".next/static/chunks").filter((name) => name.endsWith(".js"));
const sceneChunks = allChunks.filter((name) => /Error creating WebGL context|isWebGLRenderer|isTubeGeometry/.test(readFileSync(join(".next/static/chunks", name), "utf8")));
const sceneBytes = sceneChunks.reduce((total, name) => total + gzipSync(readFileSync(join(".next/static/chunks", name))).length, 0);
const vector = readFileSync("public/assets/hero/fallback/sculpture.svg");
const report = {
  initialScriptFiles: home.paths.length,
  initialJavaScriptGzipKiB: +(home.bytes / 1024).toFixed(1),
  routes: routes.map(({ route, paths, bytes }) => ({ route, initialScriptFiles: paths.length, javaScriptGzipKiB: +(bytes / 1024).toFixed(1), includesThreeEngineInInitialScripts: paths.some((path) => sceneChunks.some((chunk) => path.endsWith(chunk))) })),
  identifiedThreeChunkFiles: sceneChunks,
  identifiedThreeJavaScriptGzipKiB: +(sceneBytes / 1024).toFixed(1),
  fallbackSvgBytes: vector.length,
  initialBudgetKiB: 200,
  optionalThreeBudgetKiB: 500,
  note: "Local gzip estimates of emitted assets, not measured transfer sizes or field performance. The Three estimate identifies engine/geometry chunks; smaller loader chunks may be additional.",
};
console.log(JSON.stringify(report, null, 2));
if (routes.some(({ bytes }) => bytes > 200 * 1024) || sceneBytes > 500 * 1024 || report.routes.some((route) => route.includesThreeEngineInInitialScripts)) process.exitCode = 1;
