"use client";

import { Analytics } from "@vercel/analytics/next";
import { useSyncExternalStore } from "react";
import { permitsAnalytics, sanitizePageview } from "@/lib/analytics/policy";
const subscribe = () => () => {};
export function SiteAnalytics({ origin, paths }: { origin: string; paths: string[] }) {
  const allowed = useSyncExternalStore(subscribe, () => window.location.origin === origin && paths.includes(window.location.pathname) && permitsAnalytics(navigator, document.referrer, origin, paths), () => false);
  return allowed ? <Analytics mode="production" debug={false} beforeSend={(event) => permitsAnalytics(navigator, document.referrer, origin, paths) ? sanitizePageview(event, origin, paths) : null} /> : null;
}
