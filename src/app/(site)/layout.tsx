import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <><SiteHeader /><main id="main-content" tabIndex={-1}>{children}</main><SiteFooter /></>;
}
