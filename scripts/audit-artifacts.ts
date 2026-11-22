import { readFileSync, existsSync, readdirSync } from "node:fs";
import { resolve, join } from "node:path";
import { JSDOM } from "jsdom";
import { routeCatalog } from "../src/lib/seo/routes";

export function inspectArtifacts() {
  const documents = new Map(routeCatalog.map((route) => [route.path, new JSDOM(readFileSync(`.next/server/app/${route.path === "/" ? "index" : route.path.slice(1)}.html`, "utf8"))]));
  const external = new Set<string>(); let internalCount = 0; let fragmentCount = 0; let assetCount = 0;
  const issues: string[] = [];
  const base = "https://artifact-audit.invalid";
  for (const [path, dom] of documents) {
    const ids = new Set<string>();
    for (const element of dom.window.document.querySelectorAll("[id]")) { if (ids.has(element.id)) issues.push(`${path}: duplicate ID ${element.id}`); ids.add(element.id); }
    for (const anchor of dom.window.document.querySelectorAll<HTMLAnchorElement>("a[href]")) {
      const href = anchor.getAttribute("href")!;
      if (href.startsWith("mailto:")) continue;
      const url = new URL(href, `${base}${path}`);
      if (url.origin === base) {
        internalCount++;
        const destination = documents.get(url.pathname);
        if (!destination) {
          const asset = resolve("public", `.${decodeURIComponent(url.pathname)}`);
          const publicRoot = resolve("public");
          if (!asset.startsWith(publicRoot + "/") && !asset.startsWith(publicRoot + "\\")) issues.push(`${path}: unsafe asset path`);
          else if (!existsSync(asset)) issues.push(`${path}: missing internal destination ${href}`);
        } else if (url.hash) { fragmentCount++; if (!destination.window.document.getElementById(decodeURIComponent(url.hash.slice(1)))) issues.push(`${path}: missing fragment ${href}`); }
      } else {
        if (url.protocol !== "https:" || url.username || url.password) issues.push(`${path}: unsafe external destination`);
        external.add(url.href);
        if (anchor.getAttribute("target") === "_blank" && (!anchor.relList.contains("noopener") || !anchor.relList.contains("noreferrer"))) issues.push(`${path}: unprotected external new-tab link`);
      }
    }
    for (const element of dom.window.document.querySelectorAll("script[src], img[src], source[src], link[href]")) {
      const url = new URL(element.getAttribute("src") ?? element.getAttribute("href")!, `${base}${path}`);
      if (url.origin !== base || documents.has(url.pathname)) continue;
      const isChunk = url.pathname.startsWith("/_next/static/");
      const root = resolve(isChunk ? ".next/static" : "public");
      const asset = resolve(root, `.${decodeURIComponent(isChunk ? url.pathname.slice("/_next/static".length) : url.pathname)}`);
      assetCount++;
      if (!asset.startsWith(root + "/") && !asset.startsWith(root + "\\")) issues.push(`${path}: unsafe embedded asset path`);
      else if (!existsSync(asset) && !(url.pathname === "/icon.svg" && existsSync(".next/server/app/icon.svg.body"))) issues.push(`${path}: missing embedded asset ${url.pathname}`);
    }
  }
  const chunks = readdirSync(".next/static/chunks", { recursive: true }).map(String);
  const forbidden = /RESEND_API_KEY|TURNSTILE_SECRET_KEY|GITHUB_TOKEN|api\.resend\.com/;
  for (const chunk of chunks.filter((name) => name.endsWith(".js"))) if (forbidden.test(readFileSync(join(".next/static/chunks", chunk), "utf8"))) issues.push(`Server-only identifier in client chunk: ${chunk}`);
  if (chunks.some((name) => name.endsWith(".map"))) issues.push("Public client source maps emitted");
  for (const dom of documents.values()) dom.window.close();
  return { routes: routeCatalog.length, internalLinksChecked: internalCount, fragmentsChecked: fragmentCount, embeddedAssetsChecked: assetCount, externalDestinations: [...external].sort(), issues };
}
