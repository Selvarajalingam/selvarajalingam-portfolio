export function sanitizePageview(event: { type: string; url: string }, origin: string, paths: string[]) {
  if (event.type !== "pageview") return null;
  try { const url = new URL(event.url); return url.origin === origin && paths.includes(url.pathname) ? { type: "pageview" as const, url: `${url.origin}${url.pathname}` } : null; } catch { return null; }
}
export function permitsAnalytics(navigatorState: { doNotTrack?: string | null; globalPrivacyControl?: boolean }, referrer: string, origin: string, paths: string[]) {
  if (navigatorState.doNotTrack === "1" || navigatorState.globalPrivacyControl === true) return false;
  if (!referrer) return true;
  try { const url = new URL(referrer); return !url.search && !url.hash && (url.origin === origin ? paths.includes(url.pathname) : url.pathname === "/"); } catch { return false; }
}
