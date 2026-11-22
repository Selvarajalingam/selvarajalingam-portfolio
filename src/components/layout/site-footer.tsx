import { content } from "@/lib/content";
import Link from "next/link";
import { navigation } from "@/lib/navigation";
import { ReplayIntro } from "./global-effects";

export function SiteFooter() {
  return (
    <footer className="site-footer shell">
      <div className="footer-brand"><Link href="/" className="footer-wordmark" aria-label="Selvarajalingam home">{content.profile.wordmark}</Link><p className="footer-name">{content.profile.name}</p><p className="muted">Teach. Build. Create. Innovate. Repeat.</p></div>
      <div className="footer-links"><nav className="footer-sitemap" aria-label="Footer navigation">{navigation.map((item) => <Link className="text-link" key={item.href} href={item.href}>{item.label}</Link>)}</nav>
      <div className="footer-contact"><a className="text-link footer-email" href={`mailto:${content.profile.email}`}>{content.profile.email}</a><nav aria-label="Social links">{content.social.map((link) => <a className="text-link" key={link.label} href={link.url}>{link.label}</a>)}</nav></div></div>
      <div className="footer-bottom"><Link className="text-link" href="/privacy">Privacy</Link><ReplayIntro /><a className="text-link" href="#top">Back to top</a></div>
    </footer>
  );
}
