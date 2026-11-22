import { getGitHubSnapshot } from "@/lib/github/cached";
import { githubCuration } from "@/lib/content/github";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 15;
export async function GET() {
  try { return Response.json(await getGitHubSnapshot(), { headers: { "Cache-Control": "no-store" } }); }
  catch { return Response.json({ repositories: githubCuration.repositories.map(({ name, url }) => ({ name, url, metadata: null })) }, { headers: { "Cache-Control": "no-store" } }); }
}
