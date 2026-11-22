import { pageStructuredData, serializeJsonLd, siteStructuredData } from "@/lib/seo/structured-data";

export function SiteStructuredData() { const data = siteStructuredData(); return data ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} /> : null; }
export function PageStructuredData({ path }: { path: string }) { const data = pageStructuredData(path); return data ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} /> : null; }
