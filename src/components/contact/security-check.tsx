"use client";

import { useEffect, useRef, useState } from "react";

type Turnstile = { render: (container: HTMLElement, options: Record<string, unknown>) => string; remove: (id: string) => void };
declare global { interface Window { turnstile?: Turnstile } }

export function SecurityCheck({ siteKey, onToken }: { siteKey: string; onToken: (token: string) => void }) {
  const container = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    let api = window.turnstile;
    let widget: string | undefined;
    let script: HTMLScriptElement | undefined;
    const fail = () => { if (active) { onToken(""); setFailed(true); } };
    const timer = setTimeout(fail, 10000);
    const mount = () => {
      clearTimeout(timer);
      if (!active || !container.current) return;
      api = window.turnstile;
      if (!api) { fail(); return; }
      try {
        widget = api.render(container.current, { sitekey: siteKey, action: "contact", theme: "auto", size: "compact", callback: (token: string) => { if (active) { setFailed(false); onToken(token); } }, "expired-callback": fail, "error-callback": fail });
      } catch { fail(); }
    };
    if (api) mount();
    else {
      // Own the failed script so a retry performs a real load instead of reusing a rejected SDK cache entry.
      script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true; script.onload = mount; script.onerror = fail;
      document.head.append(script);
    }
    return () => {
      active = false; clearTimeout(timer); script?.remove();
      if (widget !== undefined) { try { api?.remove(widget); } catch { /* Unmount must preserve the form. */ } }
    };
  }, [siteKey, onToken, attempt]);
  return <div className="contact-security"><p>Security check</p><div ref={container} />{failed && <div role="alert"><p>The security check expired or could not load. Retry or use the email link.</p><button className="utility-button" type="button" onClick={() => { setFailed(false); onToken(""); setAttempt((value) => value + 1); }}>Retry security check</button></div>}</div>;
}
