// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
vi.mock("@vercel/firewall", () => ({ checkRateLimit: vi.fn() }));
import { checkRateLimit } from "@vercel/firewall";
import { getContactConfig, rateLimit, sendEmail, verifyChallenge } from "@/lib/contact/providers";

const env = { CONTACT_ENABLED: "true", CONTACT_SENDER_VERIFIED: "true", VERCEL: "1", RESEND_API_KEY: "re_test_only", CONTACT_FROM_EMAIL: "noreply@gencanyon.com", CONTACT_TO_EMAIL: "selvarajalingam.dev@gmail.com", CONTACT_RATE_LIMIT_ID: "contact", SITE_URL: "https://portfolio.test", TURNSTILE_SITE_KEY: "site-test", TURNSTILE_SECRET_KEY: "secret-test" };
const config = getContactConfig(env)!;
const email = { from: config.from, to: [config.to], reply_to: "test@example.org", subject: "Test only", text: "Test-only message" };
describe("contact provider adapters (network mocked)", () => {
  it("requires explicit activation, verified-sender assertion, exact addresses, deployment origin and Vercel", () => {
    expect(config).not.toBeNull();
    expect(getContactConfig({})).toBeNull();
    for (const change of [{ CONTACT_ENABLED: "false" }, { CONTACT_SENDER_VERIFIED: "false" }, { VERCEL: "0" }, { SITE_URL: "https://portfolio.test/path" }, { SITE_URL: "http://portfolio.test" }, { CONTACT_FROM_EMAIL: "other@gencanyon.com" }, { TURNSTILE_SECRET_KEY: "" }, { CONTACT_RATE_LIMIT_ID: "" }]) expect(getContactConfig({ ...env, ...change })).toBeNull();
  });
  it("uses the real firewall adapter, fails closed and has a bounded check", async () => {
    const request = new Request(`${config.origin}/api/contact`);
    vi.mocked(checkRateLimit).mockResolvedValueOnce({ rateLimited: false }).mockResolvedValueOnce({ rateLimited: true }).mockResolvedValueOnce({ rateLimited: false, error: "not-found" }).mockRejectedValueOnce(new Error("timeout"));
    expect(await rateLimit(request, config)).toBe("allow");
    expect(checkRateLimit).toHaveBeenCalledWith("contact", { request, timeout: 3000 });
    expect(await rateLimit(request, config)).toBe("deny");
    expect(await rateLimit(request, config)).toBe("unavailable");
    expect(await rateLimit(request, config)).toBe("unavailable");
  });
  it("calls only Resend with server-side credentials and idempotency headers", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ id: "provider-test-id" }));
    expect(await sendEmail(email, "test/key", config, fetcher)).toBe("accepted");
    expect(fetcher.mock.calls[0]![0]).toBe("https://api.resend.com/emails");
    expect(fetcher.mock.calls[0]![1]).toMatchObject({ method: "POST", cache: "no-store", headers: { Authorization: "Bearer re_test_only", "Idempotency-Key": "test/key" } });
  });
  it("distinguishes rejection from ambiguous timeout, 5xx and malformed acceptance", async () => {
    for (const [response, expected] of [[new Response("", { status: 400 }), "failed"], [new Response("", { status: 500 }), "uncertain"], [Response.json({}), "uncertain"]] as const) expect(await sendEmail(email, "test/key", config, vi.fn(async () => response))).toBe(expected);
    expect(await sendEmail(email, "test/key", config, vi.fn(async () => { throw new Error("timeout"); }))).toBe("uncertain");
  });
  it("requires successful Turnstile validation with the exact hostname and contact action", async () => {
    for (const [data, expected] of [[{ success: true, hostname: "portfolio.test", action: "contact" }, true], [{ success: true, hostname: "evil.test", action: "contact" }, false], [{ success: true, hostname: "portfolio.test", action: "other" }, false], [{ success: false }, false]] as const) {
      const fetcher = vi.fn<typeof fetch>().mockResolvedValue(Response.json(data));
      expect(await verifyChallenge("test-token", config, fetcher)).toBe(expected);
      expect(JSON.parse(fetcher.mock.calls[0]![1]!.body as string)).toEqual({ secret: "secret-test", response: "test-token" });
    }
    expect(await verifyChallenge("token", config, vi.fn(async () => { throw new Error("offline"); }))).toBe(false);
  });
});
