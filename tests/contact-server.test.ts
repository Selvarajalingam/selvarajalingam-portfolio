// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { contactSchema } from "@/lib/contact/contract";
import { handleContact, type ContactDependencies } from "@/lib/contact/handler";

const submission = { name: "Test Visitor", email: "visitor@example.org", phone: "", subject: "Training", message: "A test-only enquiry about technical training.", website: "", startedAt: 1000, submissionId: "18bf1ba3-1687-4c8c-9e57-e5512d487252", token: "" };
function request(body: unknown = submission, headers: Record<string, string> = {}) { return new Request("https://portfolio.test/api/contact", { method: "POST", headers: { "content-type": "application/json", origin: "https://portfolio.test", ...headers }, body: typeof body === "string" ? body : JSON.stringify(body) }); }
function dependencies(): ContactDependencies {
  return { config: { origin: "https://portfolio.test", apiKey: "test-only-key", from: "noreply@gencanyon.com", to: "selvarajalingam.dev@gmail.com", rateLimitId: "contact", turnstileSiteKey: "test-site", turnstileSecret: "test-secret" }, now: () => 15000, rateLimit: vi.fn(async () => "allow" as const), verifyChallenge: vi.fn(async () => true), sendEmail: vi.fn(async () => "accepted" as const) };
}

describe("contact publication and abuse boundary", () => {
  it("accepts optional phone and the five exact subject choices", () => {
    for (const subject of ["Project Enquiry", "Freelance Work", "Training", "Collaboration", "Other"]) expect(contactSchema.safeParse({ ...submission, subject }).success).toBe(true);
    expect(contactSchema.safeParse({ ...submission, phone: "+91 12345 67890" }).success).toBe(true);
  });
  it.each([{ name: "" }, { email: "a\r\nb@example.org" }, { name: "Name\nBcc: someone" }, { message: "short" }, { subject: "Spam" }, { phone: "<script>" }, { message: "x".repeat(5001) }, { submissionId: "bad" }, { extra: "unexpected" }])("rejects invalid input %j", (change) => {
    expect(contactSchema.safeParse({ ...submission, ...change }).success).toBe(false);
  });
  it("rejects cross-origin, missing-origin, wrong content type and malformed input before providers", async () => {
    const deps = dependencies();
    expect((await handleContact(request(submission, { origin: "https://evil.test" }), deps)).status).toBe(403);
    const noOrigin = request(); noOrigin.headers.delete("origin");
    expect((await handleContact(noOrigin, deps)).status).toBe(403);
    expect((await handleContact(request(submission, { "content-type": "text/plain" }), deps)).status).toBe(415);
    expect((await handleContact(request("{"), deps)).status).toBe(400);
    expect(deps.sendEmail).not.toHaveBeenCalled();
  });
  it("enforces actual streaming body size even without a content-length header", async () => {
    expect((await handleContact(request(JSON.stringify({ ...submission, message: "x".repeat(25000) })), dependencies())).status).toBe(413);
  });
  it("rejects a stalled body at its deadline even when the received prefix is valid JSON", async () => {
    vi.useFakeTimers();
    const deps = dependencies();
    let cancelled = false;
    const stream = new ReadableStream<Uint8Array>({ start(controller) { controller.enqueue(new TextEncoder().encode(JSON.stringify(submission))); }, cancel() { cancelled = true; } });
    const init: RequestInit & { duplex: string } = { method: "POST", headers: { origin: "https://portfolio.test", "content-type": "application/json" }, body: stream, duplex: "half" };
    try {
      const pending = handleContact(new Request("https://portfolio.test/api/contact", init), deps);
      await vi.advanceTimersByTimeAsync(5001);
      const response = await pending;
      expect(response.status).toBe(408);
      expect(cancelled).toBe(true);
      expect(deps.rateLimit).not.toHaveBeenCalled();
      expect(deps.sendEmail).not.toHaveBeenCalled();
    } finally { vi.useRealTimers(); }
  });
  it("rejects honeypot and invalid fields without fake sent responses", async () => {
    const deps = dependencies();
    expect((await handleContact(request({ ...submission, website: "bot" }), deps)).status).toBe(400);
    const result = await handleContact(request({ ...submission, email: "invalid" }), deps);
    expect(result.status).toBe(422);
    expect((await result.json()).errors.email).toBeTruthy();
    expect(deps.sendEmail).not.toHaveBeenCalled();
  });
  it("fails closed when disabled or rate limiting is unavailable", async () => {
    const deps = dependencies(); deps.config = null;
    expect((await handleContact(request(), deps)).status).toBe(503);
    deps.config = dependencies().config;
    for (const result of ["unavailable", "deny"] as const) {
      deps.rateLimit = vi.fn(async () => result);
      expect((await handleContact(request(), deps)).status).toBe(result === "deny" ? 429 : 503);
    }
    expect(deps.sendEmail).not.toHaveBeenCalled();
  });
  it("challenges fast or link-heavy submissions and validates token server-side", async () => {
    const deps = dependencies();
    const fast = { ...submission, startedAt: 14500 };
    const response = await handleContact(request(fast), deps);
    expect(response.status).toBe(403);
    expect((await response.json()).status).toBe("challenge");
    expect(deps.sendEmail).not.toHaveBeenCalled();
    expect((await handleContact(request({ ...fast, token: "genuine-test-token" }), deps)).status).toBe(202);
    expect(deps.verifyChallenge).toHaveBeenCalledWith("genuine-test-token", deps.config);
  });
  it("fails closed if a required challenge is unavailable or invalid", async () => {
    const deps = dependencies();
    deps.config = { ...deps.config!, turnstileSiteKey: "", turnstileSecret: "" };
    expect((await handleContact(request({ ...submission, startedAt: 14500 }), deps)).status).toBe(503);
    deps.config = dependencies().config;
    deps.verifyChallenge = vi.fn(async () => false);
    expect((await handleContact(request({ ...submission, token: "invalid" }), deps)).status).toBe(403);
    expect(deps.sendEmail).not.toHaveBeenCalled();
  });
  it("sends owner then acknowledgement with exact addresses, reply-to and distinct stable keys", async () => {
    const deps = dependencies();
    const response = await handleContact(request(), deps);
    expect(response.status).toBe(202);
    expect((await response.json()).status).toBe("accepted");
    const send = vi.mocked(deps.sendEmail);
    expect(send).toHaveBeenCalledTimes(2);
    expect(send.mock.calls[0]![0]).toMatchObject({ from: "noreply@gencanyon.com", to: ["selvarajalingam.dev@gmail.com"], reply_to: "visitor@example.org" });
    expect(send.mock.calls[1]![0]).toMatchObject({ to: ["visitor@example.org"], reply_to: "selvarajalingam.dev@gmail.com" });
    expect(send.mock.calls[0]![1]).toBe(`contact/${submission.submissionId}/owner`);
    expect(send.mock.calls[1]![1]).toBe(`contact/${submission.submissionId}/receipt`);
    expect(send.mock.calls[0]![0]).not.toHaveProperty("html");
  });
  it("does not send acknowledgement or claim acceptance if owner send fails or is uncertain", async () => {
    for (const state of ["failed", "uncertain"] as const) {
      const deps = dependencies(); deps.sendEmail = vi.fn(async () => state);
      const response = await handleContact(request(), deps);
      expect(response.status).toBe(503);
      expect((await response.json()).status).toBe(state === "uncertain" ? "uncertain" : "error");
      expect(deps.sendEmail).toHaveBeenCalledTimes(1);
    }
  });
  it("reports owner acceptance separately when acknowledgement fails", async () => {
    const deps = dependencies(); deps.sendEmail = vi.fn().mockResolvedValueOnce("accepted").mockResolvedValueOnce("failed");
    const response = await handleContact(request(), deps);
    expect(response.status).toBe(202);
    expect((await response.json()).status).toBe("accepted-without-receipt");
  });
});
