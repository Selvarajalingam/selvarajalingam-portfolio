import "server-only";
import { checkRateLimit } from "@vercel/firewall";
import type { ContactConfig, ContactDependencies, Email, SendState } from "./handler";

export function getContactConfig(env: Record<string, string | undefined> = process.env): ContactConfig | null {
  if (env.CONTACT_ENABLED !== "true" || env.CONTACT_SENDER_VERIFIED !== "true" || env.VERCEL !== "1") return null;
  if (!env.RESEND_API_KEY?.startsWith("re_") || env.CONTACT_FROM_EMAIL !== "noreply@gencanyon.com" || env.CONTACT_TO_EMAIL !== "selvarajalingam.dev@gmail.com" || !env.CONTACT_RATE_LIMIT_ID?.match(/^[a-zA-Z0-9_-]{1,100}$/)) return null;
  let url: URL;
  try { url = new URL(env.SITE_URL ?? ""); } catch { return null; }
  if (url.protocol !== "https:" || url.origin !== env.SITE_URL || url.username || url.password) return null;
  const siteKey = env.TURNSTILE_SITE_KEY ?? "";
  const secret = env.TURNSTILE_SECRET_KEY ?? "";
  if (Boolean(siteKey) !== Boolean(secret)) return null;
  return { origin: url.origin, apiKey: env.RESEND_API_KEY, from: env.CONTACT_FROM_EMAIL, to: env.CONTACT_TO_EMAIL, rateLimitId: env.CONTACT_RATE_LIMIT_ID, turnstileSiteKey: siteKey, turnstileSecret: secret };
}

export async function sendEmail(email: Email, key: string, config: ContactConfig, fetcher: typeof fetch = fetch): Promise<SendState> {
  try {
    const response = await fetcher("https://api.resend.com/emails", {
      method: "POST", cache: "no-store", signal: AbortSignal.timeout(8000),
      headers: { Authorization: `Bearer ${config.apiKey}`, "Content-Type": "application/json", "Idempotency-Key": key },
      body: JSON.stringify(email),
    });
    if (!response.ok) return response.status >= 500 ? "uncertain" : "failed";
    const data = await response.json() as { id?: unknown };
    return typeof data.id === "string" && data.id.length > 0 ? "accepted" : "uncertain";
  } catch { return "uncertain"; }
}

export async function verifyChallenge(token: string, config: ContactConfig, fetcher: typeof fetch = fetch): Promise<boolean> {
  try {
    const response = await fetcher("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", cache: "no-store", signal: AbortSignal.timeout(5000), headers: { "Content-Type": "application/json" }, body: JSON.stringify({ secret: config.turnstileSecret, response: token }) });
    if (!response.ok) return false;
    const data = await response.json() as { success?: unknown; hostname?: unknown; action?: unknown };
    return data.success === true && data.hostname === new URL(config.origin).hostname && data.action === "contact";
  } catch { return false; }
}

export const rateLimit: ContactDependencies["rateLimit"] = async (request, config) => {
  try {
    const result = await checkRateLimit(config.rateLimitId, { request, timeout: 3000 });
    if (result.error === "not-found") return "unavailable";
    return result.rateLimited || result.error === "blocked" ? "deny" : "allow";
  } catch { return "unavailable"; }
};
