import type { NextConfig } from "next";
import publication from "./src/content/publication.json";
const indexable = Boolean(publication.origin && publication.allowIndexing && process.env.VERCEL_ENV === "production" && process.env.VERCEL === "1");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      { key: "Content-Security-Policy", value: "object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'" },
      ...(!indexable ? [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] : []),
    ] }, ...(indexable ? [{ source: "/api/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }] : [])];
  },
};

export default nextConfig;
