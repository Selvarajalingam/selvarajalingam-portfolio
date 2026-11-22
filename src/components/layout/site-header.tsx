import Link from "next/link";
import { content } from "@/lib/content";
import { SiteNavigation } from "@/components/navigation/site-navigation";
import { ThemeSelect } from "@/components/navigation/theme-select";
import { ScrollProgress } from "./global-effects";
import { navigation } from "@/lib/navigation";

export function SiteHeader() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="header-frame"><div className="site-header shell">
        <Link className="wordmark" href="/" aria-label="Selvarajalingam home">{content.profile.wordmark}</Link>
        <SiteNavigation resume={content.resume} />
        <div className="header-utilities">
          {content.resume ? <a className="text-link resume-link" href={content.resume.src}>{content.resume.label}</a> : <span className="resume-pending">Resume <span className="muted">updating</span></span>}
          <ThemeSelect />
          <Link className="button button-primary header-connect" href="/connect">Let&apos;s connect</Link>
        </div>
        </div><ScrollProgress />
        <noscript><nav className="no-script-nav shell" aria-label="Site navigation">{navigation.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}</nav></noscript>
      </header>
    </>
  );
}
