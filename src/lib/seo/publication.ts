import { z } from "zod";
import settings from "@/content/publication.json";

export const publicationSchema = z.strictObject({
  origin: z.string().refine((value) => {
    try { const url = new URL(value); return url.protocol === "https:" && url.origin === value && !url.username && !url.password && !/(^|\.)(localhost|example\.(com|org|net)|placeholder\.com)$/i.test(url.hostname); } catch { return false; }
  }, "Use the exact approved HTTPS origin without path, credentials or trailing slash").nullable(),
  allowIndexing: z.boolean(), webAnalytics: z.boolean(),
});
export function getPublication(env: Record<string, string | undefined> = process.env, input: unknown = settings) {
  const config = publicationSchema.parse(input);
  const production = env.VERCEL_ENV === "production" && env.VERCEL === "1";
  return { ...config, indexable: Boolean(config.origin && production && config.allowIndexing), analyticsEnabled: Boolean(config.origin && production && config.webAnalytics) };
}
export type Publication = ReturnType<typeof getPublication>;
export const publication = getPublication();
