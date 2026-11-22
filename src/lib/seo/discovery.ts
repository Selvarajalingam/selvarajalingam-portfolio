import type { MetadataRoute } from "next";
import { routeCatalog } from "./routes";
import { publication, type Publication } from "./publication";

export function buildSitemap(config: Publication = publication): MetadataRoute.Sitemap {
  if (!config.origin || !config.indexable) return [];
  return routeCatalog.map((route) => ({ url: new URL(route.path, config.origin!).href, ...("modified" in route && route.modified ? { lastModified: route.modified } : {}) }));
}
export function buildRobots(config: Publication = publication): MetadataRoute.Robots {
  return config.origin && config.indexable ? { rules: { userAgent: "*", allow: "/", disallow: "/api/" }, sitemap: new URL("/sitemap.xml", config.origin).href } : { rules: { userAgent: "*", disallow: "/" } };
}
