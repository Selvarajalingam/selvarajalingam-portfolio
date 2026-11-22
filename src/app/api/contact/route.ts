import { handleContact } from "@/lib/contact/handler";
import { getContactConfig, rateLimit, sendEmail, verifyChallenge } from "@/lib/contact/providers";

export const runtime = "nodejs";
export const maxDuration = 30;
export function GET() { return Response.json({ available: Boolean(getContactConfig()) }, { headers: { "Cache-Control": "no-store" } }); }
export async function POST(request: Request) {
  return handleContact(request, { config: getContactConfig(), now: Date.now, rateLimit, verifyChallenge, sendEmail });
}
