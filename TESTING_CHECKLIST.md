# Testing and Release Checklist

## Phase 12 local preparation — 22 November 2026

Lint/types, 148 unit tests, production build, 128 desktop/mobile E2E checks, 10 audit checks (two intentional skips), emitted SEO/assets/budgets and dependency audit passed. New read-only smoke passed all 23 routes locally and rejected unapproved targets. CI workflow, handover and release record are prepared. Hosted CI, preview/production deployment, actual provider delivery and owner release approval remain **pending**; do not tick the release items based on local evidence. See `docs/OWNER_HANDOVER.md`, `docs/RELEASE_RECORD.md` and the Phase 12 checkpoint.

## Local evidence — 22 November 2026

Phase 11 evidence and reproducible commands: `docs/PHASE_11_AUDIT.md`. The release checklist below remains separate from local automated coverage; unchecked production/owner checks must not be interpreted as completed.

- [x] Zero-warning lint and strict TypeScript.
- [x] 148 unit/component/integration tests and production build.
- [x] Complete desktop/mobile E2E regression: 124 passed.
- [x] All 23 actual routes: both themes, Chromium/Firefox/WebKit axe, 320px reflow, text spacing and control boundary contrast (138 route/theme/engine states).
- [x] Cross-browser keyboard/menu/filter/accordion smoke checks; WebKit skip-link activation checked with explicit focus because this runner defaults to form-control Tab navigation.
- [x] Emitted SEO, internal links/fragments, embedded assets and client identifier/source-map checks.
- [x] All 14 emitted external HTTPS destinations returned HTTP 200.
- [x] Local initial script budgets and 18 Chromium performance samples passed. These do not establish production field Core Web Vitals.
- [x] Dependency audit: zero reported vulnerabilities.

Real screen-reader/physical-device checks, genuine asset/content approval, origin-enabled deployed metadata/analytics and real provider/inbox verification remain release work. Publication origin stays null and noindex remains intentional.

## Automated
- [ ] lint
- [ ] strict TypeScript/typecheck
- [ ] unit/component/integration tests
- [ ] Playwright E2E
- [ ] production build
- [ ] content schema validation
- [ ] broken-link check
- [ ] dependency/security review
Only tick after running.

## Content/routes
- [ ] All sitemap routes work.
- [ ] Slugs unique; required fields present.
- [ ] External URLs verified.
- [ ] No placeholder URLs published.
- [ ] No fake metrics, testimonials, experiments, screenshots or claims.
- [ ] AWS Associate shown as pursuing.
- [ ] No founder/owner claim.
- [ ] Impact metrics verified.
- [ ] Resume sample clearly labelled if still temporary.

## Responsive
Test narrow mobile, large mobile, tablet, laptop and wide desktop: no overflow; type scales; nav works; filters usable; gallery touch support; form usable; 3D fallback; footer fits.

## Accessibility — WCAG 2.2 AA target
- [ ] Semantic landmarks/headings
- [ ] Keyboard navigation and visible focus
- [ ] Skip link
- [ ] Accessible icon names
- [ ] Contrast in both themes
- [ ] Form labels/instructions/errors
- [ ] Modal/lightbox/menu focus management and Escape
- [ ] Reduced motion
- [ ] Useful alt text and text equivalent for diagrams
- [ ] Status not conveyed by colour alone
- [ ] Touch targets
- [ ] Automated axe plus manual review

## Performance
- [ ] 3D lazy-loaded and desktop-gated
- [ ] Mobile fallback
- [ ] Images/fonts optimised
- [ ] Below-fold lazy loading
- [ ] No avoidable layout shift
- [ ] APIs cached/time-bounded
- [ ] External APIs do not block rendering
- [ ] Production Core Web Vitals measured
Set explicit budgets during foundation phase.

## SEO
- [ ] Unique title/description/canonical per route
- [ ] OG/Twitter metadata and image
- [ ] sitemap.xml and robots.txt
- [ ] Accurate structured data
- [ ] Semantic HTML and descriptive links
- [ ] No accidental production noindex

## Contact/security/privacy
- [ ] Server validation, honeypot and rate limiting
- [ ] API key absent from client bundle
- [ ] Provider failures handled safely
- [ ] Owner and visitor emails tested
- [ ] No DB persistence or sensitive logs
- [ ] Privacy policy matches actual behaviour
- [ ] Resend domain verified before live sending

## Confidentiality
- [ ] Screenshots approved/sanitised
- [ ] No student/alumni/staff personal data
- [ ] No payment data or secrets
- [ ] No private repo exposure
- [ ] Venture logos approved
- [ ] Social links verified
- [ ] Resume genuine or explicitly labelled sample

## Release
- [ ] Content verification complete
- [ ] Production deploy and smoke test
- [ ] Contact workflow verified
- [ ] Rollback documented
- [ ] Owner handover complete
