import type { Metadata } from "next";
import { rootMetadata, routeCatalog } from "@/lib/seo/routes";
import { publication } from "@/lib/seo/publication";
import { SiteStructuredData } from "@/components/seo/structured-data";
import { SiteAnalytics } from "@/components/analytics/site-analytics";
import "@/styles/globals.css";
import { themeBootstrap } from "@/lib/theme-bootstrap";
import { BrandIntro } from "@/components/layout/global-effects";

export const metadata: Metadata = rootMetadata;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-theme="dark" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: themeBootstrap }} /><SiteStructuredData /></head><body id="top">{children}<BrandIntro />{publication.analyticsEnabled && publication.origin && <SiteAnalytics origin={publication.origin} paths={routeCatalog.map((route) => route.path)} />}</body></html>;
}
