import "server-only";
import { contactSchema, type ContactInput } from "./contract";
import { contactFields, type ContactResult } from "./model";

export type ContactConfig = { origin: string; apiKey: string; from: string; to: string; rateLimitId: string; turnstileSiteKey: string; turnstileSecret: string };
export type Email = { from: string; to: string[]; reply_to: string; subject: string; text: string };
export type SendState = "accepted" | "failed" | "uncertain";
export type ContactDependencies = {
  config: ContactConfig | null;
  now: () => number;
  rateLimit: (request: Request, config: ContactConfig) => Promise<"allow" | "deny" | "unavailable">;
  verifyChallenge: (token: string, config: ContactConfig) => Promise<boolean>;
  sendEmail: (email: Email, key: string, config: ContactConfig) => Promise<SendState>;
};
function reply(status: number, result: ContactResult) {
  return Response.json(result, { status, headers: { "Cache-Control": "no-store", ...(status === 429 ? { "Retry-After": "600" } : {}) } });
}
const unavailable = () => reply(503, { status: "error", message: "The contact form is temporarily unavailable. Please email me directly." });

async function readBody(request: Request) {
  const limit = 24000;
  const length = request.headers.get("content-length");
  if (length && (!/^\d+$/.test(length) || Number(length) > limit)) throw new Error("too-large");
  if (!request.body) throw new Error("invalid");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  let timedOut = false;
  const timer = setTimeout(() => { timedOut = true; void reader.cancel().catch(() => {}); }, 5000);
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) { await reader.cancel(); throw new Error("too-large"); }
      chunks.push(value);
    }
    if (timedOut) throw new Error("timeout");
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)) as unknown;
  } finally { clearTimeout(timer); reader.releaseLock(); }
}

function emails(input: ContactInput, config: ContactConfig): [Email, Email] {
  return [{
    from: config.from, to: [config.to], reply_to: input.email,
    subject: `Portfolio enquiry: ${input.subject}`,
    text: `Name: ${input.name}\nEmail: ${input.email}\nPhone: ${input.phone || "Not supplied"}\nSubject: ${input.subject}\n\n${input.message}`,
  }, {
    from: config.from, to: [input.email], reply_to: config.to,
    subject: "Your enquiry to Selvarajalingam",
    text: "Thank you for getting in touch. Your enquiry has been accepted by the email service for forwarding to Selvarajalingam.\n\nThis is an automatic acknowledgement, not a personal reply. You can reply to this email to continue the conversation.\n\nSelvarajalingam\nteach. build. create. innovate.",
  }];
}

export async function handleContact(request: Request, deps: ContactDependencies): Promise<Response> {
  const origin = request.headers.get("origin");
  // Exact origin is configured; never infer trust from a forwarded Host header.
  if (!origin || origin === "null" || (deps.config && origin !== deps.config.origin) || request.headers.get("sec-fetch-site") === "cross-site") return reply(403, { status: "error", message: "Please submit this form from the website." });
  if (request.headers.get("content-type")?.split(";")[0]?.trim() !== "application/json") return reply(415, { status: "error", message: "Please use the contact form to submit your enquiry." });
  let raw: unknown;
  try { raw = await readBody(request); }
  catch (error) {
    const reason = error instanceof Error ? error.message : "invalid";
    return reply(reason === "too-large" ? 413 : reason === "timeout" ? 408 : 400, { status: "error", message: reason === "timeout" ? "The request took too long. Please try again." : "The request could not be read. Keep your message within 5,000 characters." });
  }
  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: ContactResult["errors"] = {};
    for (const issue of parsed.error.issues) { const field = issue.path[0]; if (contactFields.includes(field as typeof contactFields[number])) errors[field as typeof contactFields[number]] ??= issue.message; }
    return reply(422, { status: "error", message: "Please check the highlighted fields.", errors });
  }
  const input = parsed.data;
  if (input.website) return reply(400, { status: "error", message: "This submission could not be accepted. Please email me directly." });
  const config = deps.config;
  if (!config) return unavailable();
  try {
    const limit = await deps.rateLimit(request, config);
    if (limit === "deny") return reply(429, { status: "error", message: "Too many attempts. Please wait 10 minutes before trying again." });
    if (limit !== "allow") return unavailable();
    const age = deps.now() - input.startedAt;
    const needsChallenge = age < 3000 || (input.message.match(/https?:\/\//gi)?.length ?? 0) >= 3;
    if (needsChallenge || input.token) {
      if (!config.turnstileSiteKey || !config.turnstileSecret) return unavailable();
      if (!input.token || !await deps.verifyChallenge(input.token, config)) return reply(403, { status: "challenge", message: "Please complete the security check, then send your enquiry again.", siteKey: config.turnstileSiteKey });
    }
    const [owner, receipt] = emails(input, config);
    const ownerState = await deps.sendEmail(owner, `contact/${input.submissionId}/owner`, config);
    if (ownerState === "uncertain") return reply(503, { status: "uncertain", message: "The email service has not confirmed acceptance. Your enquiry may have been accepted. Retry without changing the form to reduce duplicate emails, or email me directly." });
    if (ownerState !== "accepted") return unavailable();
    let receiptState: SendState = "failed";
    try { receiptState = await deps.sendEmail(receipt, `contact/${input.submissionId}/receipt`, config); } catch { /* Owner accepted; do not invite another original send. */ }
    return reply(202, receiptState === "accepted" ? { status: "accepted", message: "The email service has accepted your enquiry and acknowledgement email. Thank you for getting in touch." } : { status: "accepted-without-receipt", message: "The email service has accepted your enquiry, but an acknowledgement email could not be confirmed. You do not need to submit again." });
  } catch { return unavailable(); }
}
