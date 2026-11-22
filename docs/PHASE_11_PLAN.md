# Phase 11 — hardening

Scope: preserve all verified content, the unconfigured origin, noindex/analytics gates and disabled live contact sending. No deployment, fabricated assets or approval claims. Read the installed Next production/accessibility/testing/security guidance before code changes.

Use the testing-strategy and accessibility-review skills, targeting repository WCAG 2.2 AA requirements. Automated results are evidence for tested states, not a claim of complete WCAG certification or real screen-reader validation.

1. Establish current lint/type/test/build and dependency baseline. Review contact/API error boundaries and browser failure recovery. Reproduce actual findings before fixes.
2. Fix verified request-timeout/recovery issues and add non-disruptive security headers while preserving static rendering, inline hydration, WebGL and optional external integrations.
3. Audit every actual route in both themes with axe, 320px reflow, text-spacing and keyboard/focus checks. Add cross-browser smoke coverage for Chromium, Firefox and WebKit if browser engines can be installed/run on this host. Record actual unsupported/unavailable cases rather than claiming a pass.
4. Inspect emitted internal links/fragments/assets and actual supplied external links, with bounded read-only requests. Inspect public artifacts/client chunks for secret identifiers and source maps. No private file or actual contact submission is needed.
5. Review emitted script budgets plus reproducible local LCP/CLS lab samples; do not label these field Core Web Vitals. Review screenshots of representative dark/light/mobile states.
6. Run final lint, strict typecheck, unit/integration, production build, SEO/artifact/link/security/dependency checks and complete E2E/audit suites. Update release checklist with dated evidence and explicit pending real assets, production origin/provider configuration, real assistive-technology/field tests and owner review.

Known findings to reproduce: a stalled contact body may parse an already-received valid JSON prefix after cancellation rather than rejecting the deadline; the CAPTCHA retry control may clear its message without retrying a failed script load. Keep tests focused on observable behavior.
