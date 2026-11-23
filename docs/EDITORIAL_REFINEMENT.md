# Editorial refinement — 22 November 2026

The user approved the recommendation following the Nikola Radeski reference review. Refine the existing Next.js site with confident typography, generous whitespace, framed featured work, a compact secondary archive, clear filtering and a deliberate static footer. Keep the sculpture-led hero, violet/silver palette, both themes and all verified content.

Use the existing system font stack with a stronger display treatment rather than introducing an unverified font dependency. Missing authentic screenshots mean project covers are typographic compositions, not product mockups or logos. Keep descriptions and case-study links visible.

Implementation:
1. Share a decorative typographic cover between homepage and featured work cards; retain the compact archive.
2. Refine hero scale, section rhythm, service pillars, desktop navigation and footer with responsive CSS. Keep native navigation and avoid a second floating dock over content.
3. Store search/category/technology/sort in one validated URL query state; support direct links, history, reset and all viewport sizes.
4. Verify lint, strict types, unit/integration tests, production build, desktop/mobile E2E and accessibility/reflow. Review screenshots in both themes; record actual results.

No new dependencies, invented assets, content claims, deployment or publication are included. Real project screenshots remain a content follow-up.

## Files and routes

- `/`: `src/app/(site)/page.tsx`, `src/styles/homepage.css` — stronger display headline, balanced sculpture layout, spacious featured compositions and three service pillars.
- `/work`: `src/components/projects/project-explorer.tsx`, `src/lib/project-filter-url.ts` — validated query-state discovery with history/reload/resizing support; visible native filter labels and live result announcements.
- Shared project presentation: `src/components/projects/project-cover.tsx`, `project-card.tsx`, `src/styles/work.css` — decorative title/category covers for flagships, factual summaries, explicit detail links, compact secondary archive. Related projects remain compact.
- All routes: `src/components/layout/site-footer.tsx`, `src/styles/globals.css` — inset desktop navigation pill, rounded CTA buttons, static footer invitation, oversized responsive wordmark and both theme palettes.
- `DESIGN_SYSTEM.md`, `CONTENT_VERIFICATION.md` record the design and asset boundary. `.gitignore` excludes browser inspection output.

## Verification

- `npm run lint`: passed, zero warnings.
- `npm run typecheck`: passed.
- `npm test`: 150 tests passed across 21 files, including URL encoding, defaults, invalid parameters and bounded input.
- `npm run build`: passed after final CSS correction; static content routes remain prerendered.
- `npm run test:e2e -- --workers=2`: 130 passed across desktop/mobile, including shareable filters, reload, back/forward, resets, responsive layouts, both themes, keyboard navigation, reduced motion, WebGL fallback and automated accessibility. A first run caught the hero CTA below 900px; tightened stage margins and verified the full rerun.
- `npm run seo:validate`: passed for 23 actual routes; noindex remains active.
- `npm run perf:bundles`: passed configured budgets; homepage 182.3 KiB and Work 184.4 KiB initial gzip estimates, with Three excluded from initial scripts. These are local estimates, not field measurements.
- `git diff --check`: passed.

`npm run test:audit`: final run passed 10 checks; 2 intentionally skipped because CDP performance measurement runs only on Chromium. Chromium, Firefox and WebKit each passed all 23 routes in dark/light themes with automated WCAG checks, control-boundary contrast, 320px reflow and increased text spacing, plus keyboard/security behavior. Chromium local performance samples passed median LCP below 2500ms and observed layout-shift sum at or below 0.1. These are lab checks, not assistive-technology or field certification. Its first run caught enlarged wordmark overflow under increased text spacing at 320px; reduced the minimum wordmark size instead of hiding overflow. Final production build and this audit include that correction; the 130-test E2E run preceded this last footer-only size change.

Reviewed local screenshots of the dark desktop hero, light mobile featured work, light Work page and dark/light footer. Element captures can include the fixed header depending on scroll position; this is a screenshot artifact, not duplicate navigation.

## Remaining release work

No blocking factual input for this refinement. Authentic, approved and sanitised screenshots can replace the decorative covers later. Existing contact-provider configuration, release content review and publication gates remain as documented in the owner handover. Next step: review this local draft in a Vercel preview through the established approval workflow. This change does not push, merge or deploy.
