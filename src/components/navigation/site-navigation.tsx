"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navigation } from "@/lib/navigation";
import type { PortfolioContent } from "@/lib/content/schema";

export function SiteNavigation({ resume }: { resume: PortfolioContent["resume"] }) {
  const pathname = usePathname() ?? "/";
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const previousOverflow = useRef("");
  const [open, setOpen] = useState(false);

  function close() { dialog.current?.close(); }
  function restore() {
    document.body.style.overflow = previousOverflow.current;
    setOpen(false);
    if (trigger.current?.getClientRects().length) trigger.current.focus();
  }

  useEffect(() => {
    if (dialog.current?.open) dialog.current.close();
  }, [pathname]);

  useEffect(() => {
    const modal = dialog.current;
    const desktop = window.matchMedia("(min-width: 1200px)");
    const onResize = () => { if (desktop.matches) dialog.current?.close(); };
    desktop.addEventListener("change", onResize);
    return () => {
      desktop.removeEventListener("change", onResize);
      if (modal?.open) document.body.style.overflow = previousOverflow.current;
    };
  }, []);

  function links(mobile: boolean) {
    return navigation.map((item) => <Link key={item.href} href={item.href}
      aria-current={pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`)) ? "page" : undefined}
      onClick={mobile ? close : undefined}>{item.label}</Link>);
  }

  return <>
    <nav className="desktop-navigation" aria-label="Main navigation">{links(false)}</nav>
    <button className="menu-trigger utility-button" ref={trigger} aria-label="Open menu" aria-expanded={open} aria-controls="mobile-menu" aria-haspopup="dialog" onClick={() => {
      previousOverflow.current = document.body.style.overflow;
      dialog.current?.showModal();
      document.body.style.overflow = "hidden";
      setOpen(true);
      closeButton.current?.focus();
    }}>Menu<span aria-hidden="true" className="menu-symbol">＋</span></button>
    <dialog id="mobile-menu" className="mobile-menu" ref={dialog} aria-label="Site menu" onClose={restore} onKeyDown={(event) => {
      if (event.key !== "Tab") return;
      const controls = dialog.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
      const first = controls?.[0];
      const last = controls?.[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }}>
      <div className="menu-top"><span className="wordmark" aria-hidden="true">selva.</span><button ref={closeButton} className="utility-button" aria-label="Close menu" onClick={close}>Close<span aria-hidden="true"> ×</span></button></div>
      <nav aria-label="Mobile navigation">{links(true)}</nav>
      <div className="menu-tagline"><p>{resume ? <a className="text-link" href={resume.src} onClick={close}>{resume.label}</a> : <span className="muted">Resume updating</span>}</p><p className="muted">teach. build. create. innovate.</p></div>
    </dialog>
  </>;
}
