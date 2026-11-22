"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    let frame = 0;
    function update() {
      frame = 0;
      const range = document.documentElement.scrollHeight - window.innerHeight;
      const fraction = range > 0 ? Math.max(0, Math.min(1, window.scrollY / range)) : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${fraction})`;
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(update); }
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [pathname]);
  return <div className="scroll-progress" aria-hidden="true"><div className="scroll-progress-fill" ref={bar} /></div>;
}

export function BrandIntro() {
  const panel = useRef<HTMLElement>(null);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 768px)");
    let timer: ReturnType<typeof setTimeout>;
    let initialFrame = 0;
    function hide() {
      clearTimeout(timer);
      if (panel.current) {
        if (panel.current.contains(document.activeElement)) document.getElementById("main-content")?.focus({ preventScroll: true });
        panel.current.hidden = true;
      }
    }
    function show() {
      if (reduced.matches || !desktop.matches || !panel.current) return;
      hide();
      panel.current.hidden = false;
      try { localStorage.setItem("selva:intro-seen", "true"); } catch { /* Animation does not depend on storage. */ }
      timer = setTimeout(hide, 2200);
    }
    function pause() { clearTimeout(timer); }
    function adapt() { if (reduced.matches || !desktop.matches) hide(); }
    let seen = false;
    try { seen = localStorage.getItem("selva:intro-seen") === "true"; } catch { /* Intro is optional when browser storage is unavailable. */ }
    if (!seen) initialFrame = requestAnimationFrame(show);
    const element = panel.current;
    element?.addEventListener("focusin", pause);
    window.addEventListener("selva:replay-intro", show);
    window.addEventListener("selva:skip-intro", hide);
    reduced.addEventListener("change", adapt);
    desktop.addEventListener("change", adapt);
    return () => {
      cancelAnimationFrame(initialFrame);
      hide();
      element?.removeEventListener("focusin", pause);
      window.removeEventListener("selva:replay-intro", show);
      window.removeEventListener("selva:skip-intro", hide);
      reduced.removeEventListener("change", adapt);
      desktop.removeEventListener("change", adapt);
    };
  }, []);
  return <aside ref={panel} hidden className="brand-intro" aria-label="Brand introduction">
    <svg viewBox="0 0 240 100" aria-hidden="true" className="intro-wordmark"><text x="8" y="76">selva.</text></svg>
    <button className="utility-button" onClick={() => window.dispatchEvent(new Event("selva:skip-intro"))}>Skip intro</button>
  </aside>;
}

export function ReplayIntro() {
  return <button className="text-link intro-replay" onClick={() => window.dispatchEvent(new Event("selva:replay-intro"))}>Replay intro</button>;
}
