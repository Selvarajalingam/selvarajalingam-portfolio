# Phase 11 local hardening evidence — 22 November 2026

Scope: all 23 actual content routes, preserving verified copy and the user's unconfigured publication origin. No deployment, real message delivery, new tracking or content approval occurred.

## Fixes

- A stalled contact request could supply a complete JSON prefix without closing the stream. Cancellation previously parsed that prefix and continued processing. The five-second deadline now returns HTTP 408. A fake-clock streaming regression failed before the fix and passed afterwards; no real email was sent.
- Retrying a failed security SDK load previously reused Next Script's rejected cache entry. The widget now owns and cleans up its bounded script load, retries the actual request and preserves the enquiry. Browser fixtures simulate Cloudflare; live CAPTCHA delivery remains a release check.
- Form/filter/theme/menu control boundaries now use separate dark/light contrast tokens; decorative dividers retain their restrained appearance. Browser checks require 3:1 contrast against adjacent backgrounds.
- Screenshot review found the menu could be clipped at 320px with prescribed text spacing despite the document-width check passing. A two-row header at widths up to 380px and explicit control-bound checks address this.
- Universal CSP restricts objects, base URLs, form destinations and framing. This deliberately limited policy preserves static hydration and optional integrations; it does not restrict script sources or constitute a comprehensive XSS defense.

## Evidence

`npm run check` passed lint, strict TypeScript, 148 unit/component/integration tests in 20 files, content validation and a production Webpack build. Subsequent lint/typecheck runs passed after final audit/config adjustments.

`npm run test:e2e`: final full run 124 passed (1.3 minutes), desktop/mobile Chromium. Both mocked security-script retry cases passed. An initial run had 123 passes and an intro-test timeout: GPU startup consumed its short auto-dismiss window. The global intro check now uses About independently of WebGL startup and verifies focus/Enter skipping; the complete suite then passed without retries. Product intro timing was unchanged.

`npm run test:audit`: 10 passed, 2 intentionally skipped, no failures or retries. All 23 routes × two themes × three engines (138 route/theme/engine states) passed axe WCAG A/AA rule tags, control boundary contrast, 320px reflow, prescribed text spacing and header visibility checks. Chromium, Firefox and WebKit passed navigation/filter/accordion/menu focus/HTTP-policy smoke checks. Chromium/Firefox verify native first-Tab skip-link order. This Windows WebKit runner tabs to form controls by default; its skip-link check explicitly focuses the link then verifies keyboard activation. This is not evidence of Safari settings or physical-device testing.

`npm run seo:validate`: all 23 emitted pages passed; intentional noindex, absent origin/canonicals and 1200×630 original social PNG verified.

`npm run artifacts:validate`: 1,046 internal links, 89 fragment targets and 278 embedded asset references checked across 23 pages, no issues. Also checked duplicate IDs, safe external destinations/new-tab attributes, server-only identifiers in emitted client chunks and absence of public client source maps. Identifier scans are not an exhaustive secret audit.

`npm run links:all`: all 14 emitted HTTPS destinations returned HTTP 200 to bounded, redirect-following HEAD requests. Availability does not establish ownership, attribution or future uptime.

`npm audit --audit-level=low`: zero reported vulnerabilities. `npm run perf:bundles`: all 23 content routes below the 200 KiB initial gzip estimate, optional identified Three chunks 134.5 KiB below 500 KiB; no initial Three engine.

## Local performance

Three cold contexts per page/viewport, Chromium, reduced motion, 4× CPU slowdown, 40ms simulated latency, 10Mbps download/5Mbps upload. Samples observe initial rendering for 1.5 seconds after load. Values are milliseconds; layout shifts are the sum of observed non-input shifts, not a full-session CLS calculation.

| Page | 390px median LCP | 1440px median LCP | Largest observed shift sum |
| --- | ---: | ---: | ---: |
| Home | 828 | 716 | 0 |
| Work | 544 | 604 | 0 |
| Connect | 504 | 492 | 0.00336 |

All tested medians are below the 2,500ms lab budget and shift sums below 0.1. These are local samples, not field Core Web Vitals or INP evidence. Reduced-motion sampling does not measure active WebGL performance; existing E2E checks cover WebGL gating/fallback behavior.

## Reproduction and limits

Run `npm run check`, `npm run test:e2e`, `npm run test:audit`, `npm run seo:validate`, `npm run artifacts:validate`, `npm run links:all`, `npm run perf:bundles` and `npm audit --audit-level=low`. Install engines with `npx playwright install chromium firefox webkit`. The suites use their own production server on port 3100; run them sequentially. On this Windows Codex host, browser/build/network verification required execution outside the restricted sandbox. E2E and audit output directories are separate under ignored `test-results/`.

Representative light/dark screenshots were reviewed, including narrow contact and homepage text-spacing states; E2E screenshots also support responsive review. Automated checks do not certify full WCAG conformance. Real screen-reader/physical-device testing, full-session field performance, origin-enabled deployed SEO/analytics, live sender/Turnstile/firewall configuration and actual inbox delivery remain release verification. Genuine portraits, resume, project screenshots/diagrams, approved venture assets and outstanding facts remain governed by `CONTENT_VERIFICATION.md`. No fabricated replacements were added.

Next: Phase 12 deployment/handover, subject to concrete production configuration, content review and deployment authorization. Keep `origin: null` and indexing/analytics inactive until explicitly changed.
