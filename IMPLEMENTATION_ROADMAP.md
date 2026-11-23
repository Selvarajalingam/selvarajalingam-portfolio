# Implementation Roadmap

Keep the app runnable and buildable after every phase.

Current checkpoint (22 November 2026): **Phases 0–11 implemented/tested locally within supplied facts**. Phase 11 passed 148 unit/component/integration tests, 124 desktop/mobile E2E checks, cross-browser accessibility/reflow checks, local performance budgets, emitted SEO/link/asset validation, dependency audit and production build. Evidence and limits: `docs/PHASE_11_AUDIT.md`. The user confirmed https://selvarajalingam.vercel.app; its origin is now configured locally for the next SEO deployment, with noindex active and analytics explicitly off. Missing genuine assets, fuller verified stories, real assistive-technology/field checks and live contact configuration remain release follow-ups. Next is Phase 12 deployment/handover; no deployment or publication approval is implied.

0. **Repository/planning:** inspect repo, add instruction pack, plan, verify current platform constraints.
1. **Foundation:** Next.js, TypeScript, Tailwind, lint/typecheck/test scripts, design tokens, content schemas, global shell.
2. **Brand/global interactions:** wordmark, nav, mobile menu, footer, theme, intro, scroll progress.
3. **Homepage/hero:** 3D with fallback, agreed sections, honest empty states.
4. **About/skills/experience:** story, education, credentials, skill ecosystem, timeline and verified contributions.
5. **Work:** ten records, filters/sorting, four detailed flagship pages, six compact pages, verified architecture diagrams.
6. **Lab:** categories/status/detail template; launch empty.
7. **Ventures:** Gencanyon and four pages; authentic assets; Chennai Buyers coming-soon.
8. **Services/contact:** accordions, Resend route, validation, spam protection, emails, privacy acknowledgement.
9. **GitHub/AWS resources:** curated repo cards, resilient API integration, manually curated cloud content.
10. **SEO/privacy/analytics:** per-route metadata, sitemap, robots, canonical, OG, structured data, analytics/privacy.
11. **Hardening:** responsive, WCAG 2.2 AA, Playwright, performance, security, broken links, content validation, production build.
12. **Deploy/handover:** GitHub→Vercel, env vars, domain, production smoke test, complete ownership docs.

Phase 12 preparation is in progress locally: CI workflow, read-only smoke command, owner handover and release record. The user pushed the source and deployed successfully; GET-only live smoke passed all 23 routes. Confirmed-origin SEO is prepared locally for push/redeployment. Hosted CI, exact deployment IDs, final content/indexing review and provider verification remain pending. See `docs/OWNER_HANDOVER.md` and `docs/RELEASE_RECORD.md`; do not mark deployment complete until hosted evidence exists.

Each phase gate: run relevant lint, typecheck, tests and build; fix failures before continuing. Report actual commands/results, known issues and user inputs.

22 November 2026 editorial refinement: implemented the user-approved reference recommendations locally for the homepage, featured Work cards, shared navigation/footer and shareable Work filters. Lint/typecheck, 150 unit/component/integration tests, production build, 130 desktop/mobile E2E checks, SEO/bundle validation and final cross-browser accessibility/reflow/performance audit passed (10 checks, 2 intentional non-Chromium performance skips). The full E2E run preceded the final footer-only minimum font-size correction, which the final build and all-route three-engine audit verified. See `docs/EDITORIAL_REFINEMENT.md` for files, evidence and limitations. No push, merge or deployment performed; Phase 12 release follow-ups remain open.

22 November 2026 Glide Select checkpoint: replaced all seven dropdowns with a strict TypeScript adaptation of the user-supplied React Bits component. Theme, Work/Lab filtering, URL history and contact validation remain functional. Lint, typecheck, 153 unit/component/integration tests, production build, 136 desktop/mobile E2E checks, SEO/bundle validation and three-engine audit passed (13 checks, 2 intentional performance skips). Details: `docs/GLIDE_SELECT.md`. Local development server remains on port 3000; no deployment performed.
