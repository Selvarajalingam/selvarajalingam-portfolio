import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export default function NotFound() {
  return <><SiteHeader /><main id="main-content" className="shell not-found" tabIndex={-1}><p className="muted">Page not found</p><h1>This page isn’t here.</h1><p>Return home to explore Selvarajalingam&apos;s portfolio.</p><Link className="button button-primary" href="/">Back to home</Link></main><SiteFooter /></>;
}
