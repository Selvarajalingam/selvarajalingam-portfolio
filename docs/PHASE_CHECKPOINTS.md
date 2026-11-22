# Phase checkpoints

## Phase 0 — complete, 19 November 2026

Read all 16 original project documents completely, including AGENTS.md and MASTER_PROMPT.md. The initial directory had no app, Git metadata or media assets.

Completed: requirements/truth audit, platform check, foundation implementation plan, performance budgets, local Git initialisation and `feat/foundation` branch. No remote, push, merge or deployment. All supplied instruction documents retained.

Files: `docs/FOUNDATION_PLAN.md`, `.gitignore`, `.env.example`. Confirmed Node 24.13.0 and npm 11.6.2. Queried npm stable versions and consulted official Next.js/Tailwind installation guidance.

Commands actually run: `rg --files`, `Get-Content` for every original root document, `Get-ChildItem -Force`, `git status --short --branch`, `node --version`, `npm --version`, `git remote -v`, `npm view`, `git init -b main`, `git switch -c feat/foundation`.

Initial Git status/remote checks correctly reported no repository. Phase 0 app checks were not applicable because no application existed; Phase 1 introduced and ran them.

Required user inputs: none for foundation. Genuine resume, sanitised screenshots, venture logos, social/resource URLs, architecture confirmation and remaining factual checks remain tracked in `CONTENT_VERIFICATION.md`. Credentials/domain verification are needed only for later integrations and release.

Next phase: foundation implementation.

## Phase 1 — foundation implemented and gate passed, 19 November 2026

Completed:

- Next.js App Router/React server shell, strict TypeScript, Tailwind 4, semantic dark/light tokens and responsive editorial layout.
- Reusable header/footer, skip link, visible keyboard focus, minimum control sizes, reduced-motion rules, home page and custom 404.
- Confirmed identity JSON; strict Zod content schemas for projects, ventures, Lab, resources, services, skills, experience, social links and replaceable resume config. Collections intentionally empty until their roadmap phases. No fabricated records or assets.
- Build-time content validation rejects duplicate slugs, invalid statuses, pending verification, unsafe/placeholder links and missing configured assets. Editorial verification still requires evidence; schemas cannot prove factual truth.
- Vitest/component test scripts, production Playwright/axe baseline, security headers, exact dependency versions/lockfile, setup documentation and explicit release performance targets.

Routes: `/` and custom 404 handling. No placeholder links to unimplemented routes. The current contact action opens the confirmed email address; project CTA reaches an honest in-page state and supplied GitHub profile. Full homepage, navigation, theme switcher and content routes are later phases.

Main files: `src/app/`, `src/components/layout/`, `src/styles/globals.css`, `src/content/site.json`, `src/lib/content/`, `scripts/validate-content.ts`, `tests/`, framework/test configs and `docs/LOCAL_DEVELOPMENT.md`.

Verification actually run:

| Command | Result |
| --- | --- |
| `npm run check` | Passed outside Windows sandbox: zero-warning lint, route type generation/strict typecheck, 14 unit/component tests, content validation and production build |
| `npm run test:e2e` | 8 passed: Chromium desktop/mobile, keyboard skip navigation, valid local destinations, metadata title, security header, no horizontal overflow, 404 recovery, dark/light axe checks with reduced motion |
| `npm audit --audit-level=low` | Passed, zero reported vulnerabilities |
| `npm ls eslint --depth=0` | Compatible ESLint 9.39.5 installed |
| `git diff --check` | Passed; initial source files remain uncommitted |

Observed failures and resolutions: initial unit suites failed because their target modules did not yet exist; passed after implementation. Lint initially rejected anonymous PostCSS config export; fixed. ESLint 10 yielded invalid plugin peer ranges, so reverted to compatible ESLint 9. Turbopack CSS worker panicked in/outside sandbox; supported Webpack build passed. A restricted repeat Webpack build encountered generated-directory `EPERM`; identical full gate passed outside sandbox. No application workaround for filesystem permissions.

Known limits: ESLint 9 is deprecated upstream; upgrade when the bundled plugins support ESLint 10. Automated axe does not establish full WCAG conformance. Only Chromium desktop/mobile is covered at this phase; full viewport/browser/manual assistive technology/performance/SEO release reviews remain Phase 11. No field Core Web Vitals until deployment. Both token sets are tested; theme UI/persistence is Phase 2. Baseline is intentionally noindex until Phase 10/release. No active analytics, contact form, external APIs or WebGL yet.

Visual review: captured final production-browser screenshots and inspected desktop dark and mobile light compositions. Typography, spacing, contrast and responsive wrapping are appropriate for the bounded foundation. Screenshots are local ignored test artifacts in `test-results/`.

Required user inputs: none for completed scope. No credentials, invented content or production deployment were needed.

Next phase: Phase 2 brand/global interactions — full navigation, mobile overlay, persisted theme, footer expansion and reduced-motion-aware intro/scroll utilities as appropriate. Do not start later phases without preserving each verification gate.

## Phase 2 — complete locally, 19 November 2026

Completed:

- Fixed responsive header, typographic wordmark, eight agreed navigation destinations, active-page indicators, truthful resume state and Connect action.
- Native full-screen mobile dialog below 1200px. Explicit forward/reverse Tab containment, Escape/close, focus restoration, inert background, scroll locking, route/resize/unmount cleanup. Ordinary navigation fallback without JavaScript.
- Dark-default Light/Dark/System selection, pre-paint saved theme, hydration-safe UI, persistence, cross-tab updates, operating-system change handling and in-memory fallback when storage is blocked.
- Expanded footer with large wordmark, approved tagline, sitemap, confirmed email/GitHub, privacy shell, replay and back-to-top.
- Non-blocking 2.2-second first-visit SVG wordmark intro with skip, replay and stored state. Suppressed on narrow screens/reduced motion; responds if preferences change while playing. No scroll lock, hidden content, 3D or artificial loading delay.
- Decorative scroll progress with passive events, ResizeObserver and scheduled frame updates. No scroll hijacking.

Files: `src/components/navigation/{site-navigation,theme-select}.tsx`, `src/components/layout/{site-header,site-footer,global-effects}.tsx`, `src/lib/{navigation,theme-bootstrap}.ts`, `src/app/layout.tsx`, `src/app/(site)/layout.tsx`, `src/app/(site)/[section]/page.tsx`, `src/styles/globals.css`, test setup/new theme bootstrap and browser tests. Plan: `docs/PHASE_2_PLAN.md`; setup updated in `docs/LOCAL_DEVELOPMENT.md`.

Routes added: `/about`, `/work`, `/lab`, `/ventures`, `/services`, `/experience`, `/connect`, `/privacy`. These are statically generated, explicitly unfinished shells so navigation is usable; full route content remains in its scheduled phase. Unknown destinations still return 404. No invented project/venture records, social links, resume file or credentials.

Commands and results:

| Command | Actual result |
| --- | --- |
| `npm run check` | Passed: zero-warning lint, strict typecheck, 20 unit/component/bootstrap tests, content validation, production Webpack build |
| `npm run test:e2e` | Final build: 22 passed in Chromium desktop/mobile; theme persistence/system/cross-tab/storage-denied cases, modal keyboard/Escape/resize/navigation cleanup, intro skip/replay/reduced motion, no-JS navigation, 320–1920px overflow checks, active links, scroll progress/back-to-top, baseline routes/headers/404 and axe |
| `npm audit --audit-level=low` | Passed: zero reported vulnerabilities; no dependencies added |
| `git diff --check` / `git status --short --branch` | No diff whitespace errors; source remains uncommitted on `feat/foundation`, no remote changes |

Verification findings resolved: a new theme test first failed against the old build because the control did not exist. Initial implementation had a JSX parse typo, corrected before the gate. Production browser checks caught native reverse-Tab leaving the dialog's DOM and ambiguous exact label lookup; explicit Tab wrapping and a direct control label fixed both. A route-cleanup test exposed jsdom's missing close API on a closed dialog; only close an open dialog. StrictMode-friendly intro scheduling records a visit only when it actually plays.

Visual review: inspected final full-page desktop shell/footer and focused mobile-menu screenshots. Menu items, close control and resume state fit; mobile dialog scrolls when needed. Both theme token sets passed axe. Screenshots remain ignored under `test-results/`. Test-owned production server stopped automatically.

Known limits: full content and case studies, genuine resume, final privacy policy/SEO and 3D remain later phases. Intro is the wordmark portion only; sculpture integration belongs to Phase 3. No field performance data or full cross-browser/assistive-technology certification. Existing Webpack/Windows and ESLint compatibility decisions still apply. Browser-run console contains host `NO_COLOR`/`FORCE_COLOR` warnings, not application failures. Site remains noindex and unpublished.

Required user inputs: none for completed Phase 2. Missing genuine assets and factual verification remain in `CONTENT_VERIFICATION.md` for their later content/release gates.

Next phase: Phase 3 homepage/hero — adaptive original sculpture and static fallback, the agreed section order and honest empty states, followed by the next verification gate.

## Phase 3 — complete locally, 19 November 2026

Completed: split editorial hero with original procedural metallic/violet loop and immediate SVG fallback; all eleven homepage sections in the agreed order; asymmetric text-only featured previews (Research Hub, Alumni Portal, Hearth, WaterBuddy); confirmed service pillars and journey narrative; impact statements without numbers; seven keyboard-operable skill disclosures; AWS pursuit and resource empty state; Gencanyon's confirmed role/four venture names; honest Lab empty state; closing Connect CTA.

Content is separate in `src/content/homepage.json` with a strict homepage schema. Only confirmed high-level facts are used; no case-study verification flags were promoted. No invented screenshots, project outcomes, dates, degree wording, impact figures, official logos or experiments. Detailed route content remains in later phases. Existing routes unchanged; `/` is the phase's changed route.

Engineering: Three.js 0.187.0 plus matching types; native dynamic import after idle/intersection, with screen/input/power hints and reduced-motion checks. On-demand rendering, capped pixel ratio, procedural environment, no animation loop or external models/textures. Static-art control, first-successful-frame handoff, WebGL/import/shader fallback, context-loss cleanup and disposal of resources/listeners.

Main files: `src/app/(site)/page.tsx`, `src/components/hero/{sculpture-visual,sculpture-scene}`, `src/components/sections/home-section.tsx`, `src/lib/sculpture-policy.ts`, `src/lib/content/homepage.ts`, `src/content/homepage.json`, `src/styles/homepage.css`, `public/assets/hero/fallback/sculpture.svg`, content validator, bundle reporter, tests and dependency lockfile. Plan/source decisions: `docs/PHASE_3_PLAN.md`. Three.js renderer options checked against official https://threejs.org/docs/pages/WebGLRenderer and installed matching types.

| Command | Actual result |
| --- | --- |
| `npm run check` | Final code passed zero-warning lint, strict typecheck, 32 unit/component/policy/bootstrap tests, content and fallback-asset validation, production build |
| `npm run test:e2e` | 34 passed in the final run; complete previous suite plus homepage/disclosures, constrained-device no-engine-download checks, real WebGL initialization, both themes, static/3D switching, reduced-motion disposal, simulated context loss, initialization failure and fallback; desktop CTA placement and responsive overflow |
| `npm run perf:bundles` | Passed local emitted-file budgets: 9 initial script files, 181.1 KiB gzip estimate; identified Three.js engine/geometry chunks 134.5 KiB gzip; SVG 1,878 bytes. Small loader chunks may be additional; estimates are not observed network transfer or field measurements. |
| `npm audit --audit-level=low` | Zero reported vulnerabilities after dependency changes |
| `git diff --check` | Passed; files remain uncommitted on `feat/foundation`, no push or deploy |

Failures resolved: new content tests first demonstrated missing sections/records/qualification and policy module. Strict typecheck caught a protected base Curve constructor and an unsupported Testing Library matcher option; both corrected. Screenshot review caught CTAs below the desktop viewport; reduced hero spacing/art bounds and a browser assertion verify the correction. Initial full browser run passed 32/34; two desktop-scenario tests inside the mobile project inherited touch emulation. Explicit desktop context options corrected the tests, and all 34 passed. No application device gate was relaxed for testing.

Visual review: inspected desktop 3D hero in dark and light themes, revised dark hero with visible CTAs, mobile light SVG hero and text-only featured cards. Full-page screenshots are ignored test artifacts; fixed-header overlays in tall element screenshots are capture artifacts. Test-owned production servers stopped automatically. Automated axe checks passed the full homepage in both themes on desktop/mobile; this is not a WCAG conformance certification.

Known limits: GPU coverage is the available Chromium WebGL backend, not a hardware-device matrix. Field Core Web Vitals, Lighthouse, full cross-browser/manual assistive-technology testing and release SEO/privacy checks remain later hardening. Other routes remain explicit Phase 2 shells. Full About/experience content is Phase 4; case studies/screenshots/architecture Phase 5; genuine venture branding Phase 7; integrations later. Artwork awaits normal preview/design review. Existing Windows Webpack and ESLint compatibility caveats remain. Site stays noindex and unpublished.

Required user inputs: none for completed Phase 3. Remaining factual verification and genuine asset requirements remain in `CONTENT_VERIFICATION.md`.

Next phase: Phase 4 — About, skill ecosystem and experience pages, using verified facts and omitting unresolved credentials, dates and metrics until confirmed.

## Phase 4 — complete locally within verified scope, 19 November 2026

Completed:

- Dedicated statically generated `/about` and `/experience` pages, route-specific metadata and section navigation. Removed their catch-all shell records; remaining later-phase shells and 404 behavior still work.
- About story/philosophy, supplied broad institution/field, coursework completion, explicitly pursuing AWS credential, personal interests and truthful resume state. No portrait substitute or invented formal qualification.
- Canonical seven-category skill catalogue with supplied learning/project contexts. Search and Applied/Strengthening/Learning filters compose; screen-reader result announcements, keyboard controls, empty/reset state and focus restoration. No proficiency percentages or fabricated ratings. Validation labels remain separate from the client UI to avoid bundling Zod there.
- Undated learning/teaching/building timeline, practice contributions and exact confirmed Gencanyon role. No invented employment dates, organisation history, current-duration label, placement details or impact metrics.
- Resume preview/view/download component reads the shared configuration; actual resume remains null and unavailable. A labelled sample fixture is tested without publishing a fake PDF.
- Validation extended for profile copy, unique skill names, all seven distinct categories, fixed AWS pursuit and optional consistent role dates. Existing duplicate-slug test strengthened to assert the duplicate issue with a valid destination, rather than passing because of an unrelated invalid URL.

Files/routes: `src/app/(site)/{about,experience}/page.tsx`, `src/components/skills/skill-explorer.tsx`, `src/components/profile/{journey-timeline,resume-preview}.tsx`, `src/content/{about,site}.json`, `src/lib/content/{about,schema}.ts`, `src/lib/{skills,skill-model,navigation}.ts`, `src/styles/profile.css`, validator, route bundle reporter and profile/filter/schema/browser tests. Plan: `docs/PHASE_4_PLAN.md`.

| Command | Actual result |
| --- | --- |
| `npm run check` | Passed: zero-warning lint, strict typecheck, 49 unit/component/schema tests, content validation and production Webpack build; `/about` and `/experience` prerendered statically |
| `npm run test:e2e` | 46 passed: all previous checks plus both new routes in dark/light on desktop/mobile, axe, responsive overflow at 320–1440px, headings/metadata/local links, keyboard filter composition, result announcements/reset focus, and complete content without JavaScript |
| `npm run lint` / `npm run typecheck` | Passed again after adding final browser tests and extending the route bundle reporter |
| `npm run perf:bundles` | Passed: initial gzip estimates `/` 181.1 KiB, `/about` 175.6 KiB, `/experience` 174.7 KiB; no Three.js engine in initial scripts. Identified optional Three chunks remain 134.5 KiB. These are local file estimates, not field vitals. |
| `npm audit --audit-level=low` | Zero reported vulnerabilities; no dependencies added |
| `git diff --check` / `git status --short --branch` | No diff whitespace errors; source remains uncommitted on `feat/foundation`; nothing pushed, merged or deployed |

Verification findings: initial new tests failed because the dedicated pages/filter modules did not yet exist. Implemented them and reached a green suite. No phase browser failures remained in the first full run. Inspected desktop full-page About/Experience screenshots, mobile light About and mobile focused skill controls. Text wrapping, focus rings, category layout and light/dark contrast are coherent with the existing design. Test-owned servers stopped automatically.

Known limits/content still needed: formal degree wording, employer/title/start-date wording, placement story and user-reported impact figures still require approval before publication. Education is broad, company history is undated and those details are omitted. No genuine resume is available, so actual PDF preview/download verification awaits that file. No avatar, metrics, certificate, project result or URL was invented to fill gaps. Full manual assistive-technology/cross-browser testing, field performance and release SEO/privacy remain later gates. Existing Windows Webpack and ESLint compatibility caveats remain. Site is noindex and unpublished.

Required user inputs: none to implement/test this phase's verified subset. The remaining factual confirmations and genuine resume are recorded for their content/release gates rather than blocking the working pages.

Next phase: Phase 5 — accurate project records, Work discovery, four flagship and six compact detail pages; architecture diagrams only from validated architecture, with honest handling of missing genuine screenshots and technical facts.

## Phase 5 — implementation tested; content follow-ups remain, 19 November 2026

The user asked to continue after being asked for approved flagship architecture notes. Continued with the supplied facts and omitted diagrams until review. This did not approve an inferred architecture or fabricate a missing screenshot.

Implemented:

- Canonical ten-project JSON index, four featured in the required order, six secondary; homepage featured cards now reference it and link directly to their detail routes.
- Dedicated static `/work`, plus `/work/research-hub`, `/work/alumni-portal`, `/work/hearth`, `/work/waterbuddy`, `/work/career-crafter`, `/work/full-stack-todo`, `/work/duo-chat`, `/work/sentiment-analysis`, `/work/phishing-detection`, `/work/diwali-sales-analysis`.
- Work search, composable category/technology filters, stable featured-first ordering and title/category/technology sorting; keyboard-operable reset, focus restoration, live results and empty state. No guessed dates; recency option appears only if real dates are added. All ten records render without JavaScript.
- Four server-rendered Markdown narratives from supplied purpose, role, features and tooling, plus six compact overviews. Breadcrumbs, section index, more-project links, bounded previous/next and Back to Work. Unique titles/descriptions and unknown-slug 404s.
- Restricted Markdown adapter (unified 11.0.5 / remark-parse 11.0.0) emits safe text/list blocks. Raw HTML/embeds/links and unsupported structures fail validation; no MDX execution or raw HTML rendering. Parser stays on the server.
- Separate approval-gated architecture and gallery schemas/renderers, text connection equivalents and approved local image/dimension checks. No graph or image record is populated. Unknown secondary technologies, repository URLs and WaterBuddy demo remain absent. No accuracy, dataset, engineering challenge, measured result or lesson was invented.

Files: `src/content/projects/index.json` and four flagship `.md` files; `src/lib/{projects,project-model}.ts`; `src/lib/content/{schema,index,homepage,project-markdown,project-narratives}.ts`; `src/app/(site)/work/`; `src/components/projects/`; `src/styles/work.css`; homepage references/links; content validator; HEAD-only link checker; route bundle reporter; project/schema/browser tests and dependency lockfile. Plan/source boundaries: `docs/PHASE_5_PLAN.md`.

| Command | Actual result |
| --- | --- |
| `npm run check` | Passed lint, strict typecheck, 65 tests, content/narrative/reference/asset validation and production Webpack build; 21 static outputs including all ten details |
| `npm test` | Final expanded suite passed 66 tests, including narrative traversal rejection before filesystem access |
| `npm run test:e2e` | Final run: 64 passed. All prior behavior plus all ten detail routes, ordering/filter/sort/reset, metadata, breadcrumbs/adjacent links, unknown-slug 404, no fabricated images/graphs/source links/dates, no-JS listing/narrative, representative Work/flagship/compact axe in both themes and responsive overflow checks |
| `npm run lint` / `npm run typecheck` | Passed after the final test-runner and bundle-report changes |
| `npm run perf:bundles` | All 14 measured routes below 200 KiB initial gzip estimate. Home 181.2 KiB, About 175.6, Experience 174.7, Work 182.8, each project detail 180.1. No Three engine in initial scripts; optional identified Three chunks remain 134.5 KiB. Local estimates, not field performance. |
| `npm audit --audit-level=low` | Zero reported vulnerabilities after parser dependencies |
| `npx tsx scripts/check-project-links.ts` | Exact supplied Research Hub, Alumni Portal and Hearth URLs each returned HTTP 200 for HEAD. No response content or personal data captured. The repeatable command is now `npm run links:projects`. |
| `git diff --check` / `git status --short --branch` | No diff whitespace errors; local source remains uncommitted on `feat/foundation`, with no push/merge/deployment |

Findings resolved: initial tests demonstrated missing discovery/parser modules. First browser invocation failed before tests because Node ESM needed a JSON import attribute; corrected the test import. The new bundle reporter initially attempted URL-encoded `[slug]` chunk paths as filesystem names; decoded them and re-ran successfully. No production browser failures remained in the complete 64-test run. Inspected desktop Work and Research Hub full-page images and mobile light compact-project rendering; layout/reading width/controls and theme contrast match the design. Test-owned servers stopped automatically.

Remaining content gates: architecture diagrams require actual approved component/data-flow notes. Genuine sanitised screenshots/videos are still absent, so galleries show an honest absence state. More detailed problem context, goals, UX decisions, engineering challenges, testing/deployment evidence, outcomes and lessons must come from real source material; their unsupported sections are omitted. Three secondary records intentionally have no technology tags or datasets. Included metadata verification does not approve these missing areas. Actual gallery/graph accessibility needs rechecking when genuine assets/approved graphs arrive. The website remains noindex and unpublished; full manual assistive-technology/cross-browser/field-vitals/release checks remain later phases.

Required user inputs: none to continue the supplied-facts implementation, as requested. Approved architecture and genuine visual/technical materials remain needed to complete the fuller content before release. No deployment approval requested in this phase.

Next phase: Phase 6 — Lab categories/status/detail framework with a truthful empty launch state; do not invent experiment entries.

## Phase 6 — complete locally, empty launch, 19 November 2026

Completed:

- Dedicated static `/lab` with editorial opening, six agreed categories, exact Exploring/Building/Experiment Complete statuses, text/category/status discovery controls, accessible reset/results and a truthful empty state leading to the real Work collection. Progress labels are definitions, not claims of existing activity.
- Authoritative `src/content/lab/index.json` remains `[]`. Page copy is separate. No placeholder experiment cards, named prototype, fabricated dates/progress, model, screenshot, link or repository.
- Verified-entry card and detail framework for `/lab/[slug]`: idea, current progress summary/status, optional real next steps/update date/timeline/learnings, approved image and genuine destinations. Unknown/unpublished slugs return 404; no named detail route is generated at launch.
- Schema enforces exact categories/statuses, verified publication, required idea/progress, chronological dates and approved own-folder local assets with dimensions/alt/caption. Existing collection validation handles duplicate slugs and referenced asset existence.
- Listing client receives safe summary fields; shared labels are lightweight and schema imports are type-only. Server-rendered content works without JavaScript; no dependency or API added. Homepage empty/published teaser and Lab metadata adapt to actual collection contents.

Files/routes: `src/app/(site)/lab/{page.tsx,[slug]/page.tsx}`, `src/components/lab/{lab-explorer,lab-card,lab-article,status-badge}.tsx`, `src/content/lab/{index,page}.json`, `src/lib/{lab,lab-model}.ts`, `src/lib/content/{schema,index,lab,homepage}.ts`, `src/styles/lab.css`, homepage conditional, content validator, bundle reporter and `tests/{lab.test.tsx,e2e/lab.spec.ts}`. Removed the Lab catch-all shell. Plan: `docs/PHASE_6_PLAN.md`.

| Command | Actual result |
| --- | --- |
| `npm run check` | Final code passed zero-warning lint, strict typecheck, 80 unit/component/schema tests, content validation and production build; Lab listing static, no named experiment outputs |
| `npm run test:e2e` | 74 passed in the full final suite. Lab additions cover empty data/no cards or fabricated links, category/status/search/reset keyboard behavior, exact taxonomy, both-theme axe, responsive overflow at 320–1440px, no-JavaScript Work destination and 404s for unknown/test-only slugs |
| `npm audit --audit-level=low` | Zero reported vulnerabilities; no new dependencies |
| `npm run perf:bundles` | All 15 current measured routes within 200 KiB initial gzip estimate; `/lab` 182.8 KiB. No initial Three engine; identified optional Three chunks 134.5 KiB. Local emitted-file estimates, not field Core Web Vitals. |
| `git diff --check` / `git status --short --branch` | No diff whitespace errors; source remains uncommitted on `feat/foundation`, no push/merge/deploy |

Initial new tests correctly failed against the missing Lab modules; implementation made the full suite green. Both full implementation gates passed, and the final 74-browser-check run had no failures. Inspected desktop dark and mobile light full-page screenshots: controls, text/empty-state wrapping and status legend work with both token sets. Test-owned production server stopped automatically.

Known limits: real populated-detail browser/media review awaits the first genuine approved experiment; populated component branches are covered only with test-only fixtures. No such fixture is published, and its slug returns 404. Empty-launch tests should change deliberately with the first approved real entry. Existing Phase 5 content approvals, tooling caveats and later manual assistive-technology/cross-browser/field-performance/release SEO/privacy gates remain. Site is still noindex and unpublished.

Required user inputs: none for this deliberately empty launch. Do not invent an entry to make the Lab appear active.

Next phase: Phase 7 — Gencanyon and the four venture pages, exact confirmed role, authentic supplied branding and Chennai Buyers' website-coming-soon state; no invented business metrics or ownership claims.

## Phase 7 — implemented/tested within supplied facts, 19 November 2026

Completed:

- Static `/ventures` directory and `/ventures/{cloudapex,bigintellects,canyonink,chennai-buyers}` detail pages. All four display the supplied Live & Active status. Each detail has metadata, breadcrumb, related ventures, Back to Ventures and an internal enquiry CTA.
- Exact supplied external websites for CloudApex, BigIntellects and CanyonInk, with safe new-tab attributes. Chennai Buyers explicitly says “Website coming soon”, has no guessed domain or external site action, and routes enquiries to `/connect`.
- Shared Gencanyon company, exact Product & Technology Lead | Business & Product Development Lead role and confirmed contribution areas read from the existing verified experience record. No ownership language, metrics or invented per-venture responsibilities.
- Canonical `src/content/ventures/index.json` feeds directory/details/homepage. Removed empty site collection, duplicated homepage venture facts and competing catch-all shell. Server components and local content; no new dependencies, client components or network dependency for rendering.
- Approved-logo support with local own-venture paths, alt text, positive dimensions, explicit approval and file-existence validation. No authentic assets exist yet, so ordinary text names appear without invented logos or palettes. Fuller narratives stay omitted.

Files/routes: `src/app/(site)/ventures/{page.tsx,[slug]/page.tsx}`, `src/components/ventures/{company-context,venture-card,venture-identity,venture-article}.tsx`, `src/content/ventures/index.json`, `src/lib/content/{ventures,index,schema,homepage}.ts`, homepage data/rendering, `src/styles/{ventures,globals,homepage}.css`, navigation, content validator, bundle reporter, `scripts/check-venture-links.ts`, `package.json`, tests and content/asset/development guides. Plan and content ruling: `docs/PHASE_7_PLAN.md`.

| Command | Actual result |
| --- | --- |
| `npm test -- tests/ventures.test.tsx` | Initial red run confirmed missing venture module; implementation suite caught an accessible-name spacing issue, corrected with an explicit text separator. All nine venture tests passed in the full gate. |
| `npm run check` | Passed zero-warning lint, strict typecheck, 89 unit/component/schema tests across 12 files, content validation and production Webpack build; 25 static outputs including the four venture details |
| `npm run lint` / `npm run typecheck` | Passed after adding the standalone link checker; final repeat includes the browser-test JSON import correction |
| `npm run test:e2e` | Final full run: 84 passed (56.1 seconds). New checks cover all venture details/metadata/exact destinations, protected links, Chennai Buyers state, keyboard enquiry activation, unknown-slug 404, both-theme axe on all five routes, 320–1440px overflow and homepage/detail navigation without JavaScript |
| `npm run perf:bundles` | All 20 measured routes under 200 KiB initial gzip estimate. Each of the five venture routes: 180.1 KiB; no initial Three engine. Home 181.2 KiB; identified optional Three chunks 134.5 KiB. Emitted-file estimates, not field vitals. |
| `npm run links:ventures` | Three exact supplied URLs each returned HTTP 200 for timed HEAD requests. No website content read or captured. Availability at check time only. |
| `npm audit --audit-level=low` | Zero reported vulnerabilities; no new dependencies |
| `git diff --check` / `git status --short --branch` | No diff whitespace errors; local source remains uncommitted on `feat/foundation`, no push/merge/deployment |

The first browser invocation stopped before test execution because the Node JSON import required an import attribute. Corrected the test-only import and reran the entire suite successfully. Inspected full desktop dark directory and mobile light Chennai Buyers screenshots; text, roles, status, CTA wrapping, spacing and theme treatment are readable. Test-owned production server stopped automatically.

Known limits: authentic logos/colours require actual supplied originals and permission/preview review. Optional logo rendering has no real-asset browser review yet. Venture-specific purpose, product features, technical details and outcomes have not been supplied, so pages are deliberately compact. These missing facts/assets remain release follow-ups rather than fabricated content. Enquiry destinations currently reach the existing email-based Contact shell; form delivery is Phase 8. Prior Phase 5 content approvals and future manual assistive-technology/cross-browser/field-performance/SEO/privacy/release gates remain; site stays noindex and unpublished.

Required user inputs: none to complete the supplied-facts implementation. Approved original logos and any desired verified venture narratives are needed for fuller brand presentation before release.

Next phase: Phase 8 — service accordions, contact form/server-side Resend integration, validation/spam protection, owner/visitor emails and privacy acknowledgement. Live delivery requires genuine credentials and verified sender domain; never report an unconfigured send as successful.

## Phase 8 — implemented/tested locally; live activation pending, 19 November 2026

Completed:

- Static `/services` with the three supplied service groups, native keyboard/no-JavaScript accordions, Work/enquiry links and no pricing or invented promises.
- Static `/connect` with supplied invitation/availability copy and direct email fallback. Exact fields/subjects, optional phone, stable labels, validation errors/descriptions, first-error focus, pending disabled controls, retained input/retry IDs and accessible confirmations. The exact privacy acknowledgement links to `/privacy` without a checkbox.
- Node `/api/contact` GET availability and POST handler. Strict schema, 24 KB/five-second bounded body reading, configured-Origin checks, honeypot rejection and official Vercel Firewall rate-limit integration. No application database or personal-data logging. Missing configuration/security services fail closed.
- Server-side Resend owner notification to the supplied inbox, visitor Reply-To, then automatic acknowledgement. Bounded provider calls and separate UUID-based idempotency keys. Accepted enquiry, acknowledgement failure, rejected request and ambiguous acceptance have distinct states; provider acceptance is never presented as guaranteed inbox delivery.
- Risk-based Turnstile with exact hostname/action validation, single-use token refresh, error/expiry handling, compact widget and no challenge script on ordinary visits. No CAPTCHA keys are configured; flagged requests cannot bypass the check.
- Static `/privacy` describes implemented processing, providers/inbox retention, local preferences and disabled analytics. No retention schedule or privacy guarantee was invented. Removed the last catch-all route shells; deployment/content guides now document actual behavior and activation checks.

Files/routes: `src/app/(site)/{services,connect,privacy}/page.tsx`, `src/app/api/contact/route.ts`, `src/components/contact/{contact-form,security-check}.tsx`, `src/lib/contact/{model,contract,handler,providers}.ts`, `src/styles/contact.css`, service content in `site.json`, navigation/global styles, `.env.example`, dependency manifest/lock, bundle reporter, Vitest server-only resolver, `tests/{contact-server,contact-providers,services}.test.*` and `tests/e2e/contact.spec.ts`. Plan: `docs/PHASE_8_PLAN.md`. Added pinned official `@vercel/firewall` 1.2.6 and `server-only` 0.0.1; native fetch handles Resend/Turnstile.

| Command | Actual result |
| --- | --- |
| `npm test -- tests/contact-server.test.ts` | Initial red run confirmed missing contract/handler. Implemented handler passed 19 validation/abuse/provider-flow tests. |
| `npm test -- tests/contact-server.test.ts tests/contact-providers.test.ts` | 24 passed; external providers mocked, no real messages sent |
| `npm run check` | Final run passed zero-warning lint, strict TypeScript, 115 tests across 15 files, content validation and production Webpack build. Services/Connect/Privacy static; contact API dynamic. |
| `npm run test:e2e` | Complete suite passed 102 tests (1.1 minutes), including prior phase regressions and all new flows. Success/CAPTCHA/provider responses are test-only mocks; the real unconfigured API returns 503 and the UI offers email. |
| `npx playwright test tests/e2e/contact.spec.ts --grep 'pending submission'` | Both desktop/mobile focus-regression checks passed after correcting pending-state focus timing |
| `npx playwright test tests/e2e/contact.spec.ts` | Final compact-widget build: all 18 Phase 8 browser checks passed (15.0 seconds). Keyboard accordions, native/server errors, privacy/no checkbox, retry IDs, pending prevention, mocked accepted/partial/challenge states, both-theme axe, 320–1440px overflow and no-JavaScript fallback. |
| `npm run perf:bundles` | Final build: all 23 measured routes below the 200 KiB initial gzip estimate. Services 174.7, Connect 185.6, Privacy 181.2 KiB. No initial Three engine; optional identified Three chunks remain 134.5 KiB. Third-party challenge transfer and field vitals are not measured here. |
| `npm audit --audit-level=low` | Zero reported vulnerabilities after both added packages |
| Client emitted-chunk identifier/endpoint scan | Zero chunks containing `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY` or `api.resend.com`; Next also enforces the server-only import boundary |
| `git diff --check` / `git status --short --branch` | No diff whitespace errors; all work remains local/uncommitted on `feat/foundation`, no push/merge/deploy |

Findings resolved: strict lint/type errors in new tests; stale generated types for the removed catch-all route; field labels incorrectly including error/help text; an invisible no-JavaScript instruction; an unscoped test assertion matching Next's route announcer; and a real error-focus race before disabled controls were re-enabled. Regression checks demonstrated the focus failure before the effect-based fix and passed afterward. One earlier intro test timed out under suite load; the complete passing run exercised it in both profiles without changing intro behavior. Inspected actual desktop dark contact and mobile light expanded service screenshots: layout, reading width, labels, controls and themes match the existing design. Test servers stopped automatically.

Known limits/user inputs: no Resend API key/domain verification, Vercel deployment origin/published firewall rule, optional Turnstile credentials or authorized real inbox tests are available. Live sending stays disabled. `CONTACT_SENDER_VERIFIED` is an operator assertion, not automated proof; the external rate rule must actually be configured/tested. Firewall counters are per region; risk signals are heuristics; Resend deduplication is limited to 24 hours. Real provider/challenge iframe behavior, actual inbox delivery, provider retention settings and privacy review must be checked in an approved preview before activation. The compact widget is configured for narrow layouts but the browser challenge itself is mocked in automated tests. No actual email was sent. See `DEPLOYMENT_GUIDE.md` for concrete activation steps; never share secrets in chat/content files.

Prior missing genuine project/venture assets and factual approvals remain. Full manual assistive-technology/cross-browser/field-performance/SEO/privacy release checks are later gates. The site remains noindex, uncommitted and unpublished.

Next phase: Phase 9 — curated GitHub work and resilient cached API data, plus manually curated AWS/cloud resources. Do not invent repository selections, statistics, video/article links or content.

## Phase 9 — implemented/tested within verified public metadata, 19 November 2026

Completed:

- Four actual public GitHub repository links, curated from the supplied account's observed API records: DuoChat_Chatting-App, Twitter_Sentimental_Analysis, React_Info_Site and Movie_Listing_site. Exact names/URLs and actual check date are canonical JSON. No repository content, inferred features/authorship or case-study mapping was added.
- Static repository cards inside Featured Work preserve the eleven-section homepage. No-JavaScript and failed/disabled API states retain genuine curated links without placeholder counts. A viewport-triggered internal request optionally adds validated main language, stars/forks and checked-at timestamps labelled as cached GitHub snapshots.
- Server-only `/api/github` adapter: allowlisted public endpoints, strict identity/public/non-fork checks, safe projection, serial requests, 2.5-second per-request timeout, 60 KB body limit, stop-on-error behavior and a 900-second Next server cache. Cache/upstream failure returns curated fallback; caller query parameters cannot select arbitrary URLs/accounts. Optional token stays server-only. No new dependencies.
- Canonical `src/content/resources/aws-cloud.json` remains `[]`, with safe text-card support for future real manually verified URLs/category/attribution. No invented resources, channels, thumbnails, YouTube scraping/API/embed or earned AWS credential. Pursuing-only credential and honest empty copy remain.
- Content/deployment/development guidance, verification boundary and privacy notice updated for public GitHub requests. Browser tests explicitly disable external fetching and use test-only mocks for enhancement states; a separate real public API check verifies the adapter.

Files/routes: `src/content/github/repositories.json`, `src/content/resources/aws-cloud.json`, `src/lib/content/{github,index,schema}.ts`, `src/lib/github/{model,provider,cached}.ts`, `src/components/resources/{github-repositories,cloud-resources}.tsx`, homepage/privacy updates, `/api/github`, `src/styles/resources.css`, content validator, `scripts/check-github.ts`, optional env examples, Playwright environment and `tests/{github,github-cache,resources}.test.*` / `tests/e2e/resources.spec.ts`. Plan: `docs/PHASE_9_PLAN.md`.

| Command | Actual result |
| --- | --- |
| `npm test -- tests/github.test.ts` | Initial red run confirmed missing modules; implementation then passed all 16 adapter/curation tests |
| `npm run check` | Final run passed zero-warning lint, strict typecheck, 136 tests across 18 files, content validation and production Webpack build; content pages remain static, GitHub API dynamic |
| `npm run github:verify` | Real read-only adapter check succeeded for all four selected public repositories. Returned only validated names/destinations/language/counts/check timestamps; no repository files or private records fetched. Separate from builds/tests. |
| `npm run test:e2e` | Full suite: 114 passed (1.1 minutes). New tests cover failed API/static links, rejected unapproved or malformed metadata, actual disabled API/query isolation, no browser-to-GitHub/YouTube requests, no-JavaScript fallback, honest cloud state and both-theme axe/responsive checks at 320–1440px. |
| `npx playwright test tests/e2e/resources.spec.ts tests/e2e/contact.spec.ts` | Final privacy-notice build: 30 passed (21.4 seconds), rechecking resources plus contact/privacy accessibility and prior form behavior |
| `npm run perf:bundles` | All 23 measured routes below 200 KiB initial gzip estimate. Home 182.2, Work/Lab 183.8, Connect 186.6, Privacy 182.2 KiB; no initial Three engine. Optional identified Three chunks remain 134.5 KiB. Local emitted-file estimates, not field performance. |
| `npm audit --audit-level=low` | Zero reported vulnerabilities; no dependencies added |
| Emitted client chunk scan | Zero chunks containing `GITHUB_TOKEN`, `api.github.com`, `RESEND_API_KEY` or `TURNSTILE_SECRET_KEY`; server-only provider boundary enforced by Next |
| `git diff --check` / repository status | No diff whitespace errors; source remains local/uncommitted on `feat/foundation`, no push/merge/deployment |

Inspected desktop dark and mobile light repository-block screenshots. Browser metadata screenshots use explicitly mocked snapshots and are test evidence, not screenshots of live GitHub data. Layout, long repository names, dates and real-zero rendering fit the existing design. All phase browser runs completed without failures; test servers stopped automatically.

Known limits/inputs: actual desired AWS/cloud video/article links and attribution have not been supplied, so no resource entries are published. Populated resource cards are component-tested with an explicit test-only fixture; real destination/visual review is required when the first genuine resource arrives. GitHub selection is editorial curation from observed public metadata, not owner approval of repository contents or confirmation of any Work mapping. Review selection/public availability at release. Deployed cache persistence/revalidation and upstream limits need preview verification; snapshots can be stale and failures intentionally omit counts. Redirected/renamed repos require manual curation review. No contribution heatmap or live follower totals are claimed. A GitHub token is optional, not required to keep the app usable.

Prior project/venture factual and asset approvals, disabled live contact activation and future manual accessibility/cross-browser/field-performance/release checks remain. The site is still noindex, uncommitted and unpublished.

Next phase: Phase 10 — accurate per-route metadata/canonical, sitemap/robots, branded Open Graph, structured data, privacy/analytics integration and deployment-origin verification. Do not infer an approved origin from the proposed Vercel target or enable GA4 without appropriate configuration/consent handling.

## Phase 10 — implemented/tested locally; origin deliberately unconfigured, 19 November 2026

Completed:

- Central route catalog and shared metadata for all 23 actual content pages, preserving existing unique titles/descriptions and adding matching Open Graph/Twitter data. Canonicals/social URLs use only an explicitly configured origin; no localhost, preview-host or target-domain guess. Root metadata cannot give unknown routes a homepage canonical.
- Static robots/sitemap routes, production-only indexing switch and matching HTTP/meta noindex behavior. Sitemap derives actual content routes and only real supplied modification dates; APIs, 404s and unpublished Lab details are excluded.
- Safe minimal Person/WebSite/page JSON-LD framework, without invented credentials, employment dates, degree wording, ratings, ownership or outcomes. URL graphs remain absent while origin is unknown.
- Original 1200×630 PNG social artwork (121,418 bytes), profile-driven brand copy and existing abstract sculpture, plus an original 64×64 SVG icon. Inspected the rendered PNG: readable name/roles/tagline, restrained black/silver/violet composition, no portrait or product screenshot substitute.
- Official Vercel Web Analytics integration with production/origin/path gates, pageview-only filtering, query/hash removal, DNT/GPC and sensitive-referrer exclusion. No local/preview collection. GA4 remains unimplemented/disabled; privacy copy reflects the effective configuration.
- Actual emitted-HTML SEO validator plus unit/browser checks, content/deployment/asset documentation and release activation steps. Added pinned `@vercel/analytics` 2.0.1 and dev-only `@types/jsdom` 30.0.0 for the existing HTML parser.

User decision: when asked for the production URL, the user answered **“Keep the origin unconfigured for now.”** `src/content/publication.json` therefore retains `origin: null`, `allowIndexing: false`. Absolute canonicals/social-image URLs and URL-based graphs are omitted, the sitemap has no entries, robots disallows crawling, and indexing/analytics remain inactive. This is the requested publication state, not an inferred approval to deploy.

Files/routes: `src/lib/seo/{publication,routes,discovery,structured-data}.ts`, publication JSON, metadata/JSON-LD wiring across all content routes/root layout, `src/app/{robots,sitemap}.ts`, `src/app/icon.svg`, `src/components/{seo/structured-data,analytics/site-analytics}.tsx`, analytics policy, updated privacy/HTTP headers, social PNG, `scripts/{generate-og.tsx,validate-seo.ts}`, content validator, dependency manifest/lock and `tests/{seo,analytics}.test.*` / `tests/e2e/seo.spec.ts`. Plan: `docs/PHASE_10_PLAN.md`.

| Command | Actual result |
| --- | --- |
| `npm test -- tests/seo.test.ts` | Initial red run confirmed missing SEO modules; implemented metadata/discovery/safety tests then passed |
| `npm run assets:og` | Generated a real 1200×630 PNG, 121,418 bytes; final generation uses canonical profile copy and original repository SVG |
| `npm run check` | Final implementation passed zero-warning lint, strict typecheck, 147 unit/component tests across 20 files, content validation and production Webpack build. Content/discovery/icon routes static; existing APIs dynamic. |
| `npm run seo:validate` | All 23 emitted pages validated: unique exact titles, one h1, matching description/social metadata, correct absent canonicals/URL graphs in the unconfigured state, noindex and actual PNG dimensions |
| `npm run test:e2e` | Full suite: 122 passed (1.5 minutes). New checks cover all real routes' metadata/headers, blocked discovery, no fabricated origin, unknown-page canonical absence, real PNG/icon serving and no local analytics; prior accessibility/responsive/form/resource behavior also passes. |
| `npm run lint` / `npm run typecheck` | Final repeat passed after making browser assertions release-aware |
| `npx playwright test tests/e2e/seo.spec.ts` | Final eight SEO browser checks passed (8.8 seconds), including no SDK queue, tracking script or request in the unconfigured deployment |
| `npm run perf:bundles` | All 23 measured content routes remain below the 200 KiB initial gzip estimate: Home/Privacy 182.3, Work 183.9, Lab 183.8, Connect 186.6 KiB. No initial Three engine. Optional identified Three chunks 134.5 KiB. Local emitted-file estimates, not field vitals. |
| `npm audit --audit-level=low` | Zero reported vulnerabilities after analytics/type additions |

Findings resolved: initially unused structured-data imports in two profile wrappers; missing strict JSDOM declarations; unsupported z-index in the image renderer removed. The image was regenerated and inspected. A final verification invocation was temporarily prevented because automatic approval review could not complete due to a usage limit (not an unsafe-action determination). After the user said continue, the same approved verification commands ran successfully. No unresolved check failures remain.

Limits/inputs: no origin or production activation is requested now. Origin-enabled canonicals, populated sitemap, JSON-LD graphs and analytics mounting are covered with isolated configuration fixtures/SDK mocks; actual deployed domain, crawler/social-preview and analytics-intake/dashboard checks remain release work. Keep content/asset verification and live email activation gates from prior phases. No new production tracking, publication or deployment occurred. Source remains uncommitted on `feat/foundation`.

Next phase: Phase 11 — responsive/accessibility hardening, complete regression and performance/security/link review, final content validation and production-build verification. Keep the user's deferred origin and all missing factual/assets inputs explicit; do not invent content to pass a release checklist.

## Phase 11 checkpoint — 22 November 2026

Completed local hardening: rejected timed-out streamed contact bodies (HTTP 408), restored CAPTCHA script retry while preserving enquiries, strengthened interactive control borders in both themes, fixed narrow-header clipping with increased text spacing, added limited CSP and reproducible cross-browser/artifact/performance audits. No factual portfolio content was invented or expanded.

Files/routes: `src/lib/contact/handler.ts`, `src/components/contact/security-check.tsx`, `src/styles/{globals,contact,lab,profile,work}.css`, `next.config.ts`, contact/intro regressions, Playwright configs, `tests/audit/{browser,performance}.spec.ts`, `scripts/{audit-artifacts,check-artifacts,check-external-links}.ts`, package scripts and documentation. The shared shell/controls and `/api/contact` changed; all 23 content pages remain statically generated. Full evidence, performance values, reproduction commands and limitations: `docs/PHASE_11_AUDIT.md`. Plan: `docs/PHASE_11_PLAN.md`.

| Command | Actual result |
| --- | --- |
| Contact timeout regression | Confirmed red (unterminated valid JSON incorrectly returned 202), then all 20 contact-server tests passed. |
| CAPTCHA retry regression | Confirmed red before fix; final desktop/mobile mocked retry cases passed without real provider messages. |
| `npm run check` | Lint, strict types, 148 tests in 20 files, content validation and production Webpack build passed. |
| `npm run test:e2e` | Final full run: 124 passed (1.3 minutes). Initial intro-test timeout isolated from GPU startup; product timing unchanged. |
| `npm run test:audit` | 10 passed, 2 intentional non-Chromium instrumentation skips, zero failures/flakes. 138 route/theme/engine states: axe, control contrast, reflow, text spacing and header bounds. Keyboard/HTTP smoke passed in all three engines; WebKit skip activation uses explicit focus, native first-Tab order checked in Chromium/Firefox. |
| `npm run seo:validate` | All 23 pages passed in intentional noindex/unconfigured-origin state. |
| `npm run artifacts:validate` | 1,046 internal links, 89 fragments, 278 embedded references; no issues, scanned server-only client identifiers or emitted public maps. |
| `npm run links:all` | All 14 emitted external HTTPS destinations returned 200. |
| `npm run perf:bundles` | All initial estimates below 200 KiB; optional identified Three chunks 134.5 KiB below 500 KiB, no initial Three engine. |
| Local performance audit | 18 Chromium samples; six group median LCPs 492–828ms, maximum observed shift sum 0.00336. Lab evidence, not field vitals/full-session CLS/INP. |
| `npm audit --audit-level=low` | Zero reported vulnerabilities. |
| Final `npm run lint` / `npm run typecheck` | Passed after final audit/config/test edits. |
| Local production server | Port 3000 started and verified HTTP 200. |

Representative dark/light narrow text-spacing screenshots and desktop contact were inspected. No unresolved local check failures remain. Automated WCAG checks do not certify conformance. Physical-device/screen-reader checks, field performance, deployed provider/cache behavior, live inbox delivery, authentic asset approval and outstanding factual verification remain release gates. Origin remains null, noindex active, analytics inactive and contact disabled without real configuration. No commits, push, preview or production deployment occurred.

Next: Phase 12 deployment/handover. A real deployment needs the selected GitHub/Vercel destination, required environment configuration and publication approval. Do not guess the origin or populate missing content to bypass those gates.

## Phase 12 preparation checkpoint — 22 November 2026

Status: **local release preparation/handover completed; actual preview and production deployment pending access, project selection and review**. Phase 12 is not fully complete. Initial inspection found an unborn `feat/foundation`, no commits/remote, no GitHub/Vercel CLI, no linked project and neither integration installed. An access/project question was raised while independent work continued. A final integration check still reported both uninstalled. No account, remote, commit, CI run, deployment, domain or approval was fabricated.

Prepared files: `.github/workflows/quality.yml` (Node 24, read-only permissions, no provider secrets/deploy step), `.github/pull_request_template.md`, `.vercelignore`, `scripts/check-deployment.ts`, `tests/e2e/deployment.spec.ts`, package script, CI worker/forbidOnly settings, `docs/PHASE_12_PLAN.md`, `docs/OWNER_HANDOVER.md`, `docs/RELEASE_RECORD.md` and updated deployment/architecture/status documents. No application route or factual portfolio content changed. Existing GA4/YouTube credential suggestions were corrected to match implemented integrations.

| Command/check | Actual result |
| --- | --- |
| `npm run check` | Zero-warning lint, strict types, 148 tests in 20 files, content validation and production Webpack build passed. |
| Final `npm run lint` / `npm run typecheck` | Passed after smoke command, integration tests and CI configuration changes. |
| `npm run test:e2e` | Final complete run: 128 passed (1.5 minutes), desktop/mobile. New smoke cases validate all live local routes and reject path-bearing/unapproved production targets. Earlier existing-suite run: 124 passed before smoke tests were added. |
| `npm run test:audit` | 10 passed, 2 intentional non-Chromium instrumentation skips (2.5 minutes). No failures. All 138 route/theme/engine accessibility/reflow/contrast/header states plus keyboard/HTTP smoke and Chromium lab budgets passed. Same assistive-technology and field-metric limits as Phase 11. |
| `npm run deploy:smoke -- http://127.0.0.1:3000 preview` | 23 routes passed with no failures; GET-only metadata/discovery/headers/assets/404/contact availability checks, no message sent. New E2E invokes the final smoke implementation against its own fresh production server on 3100. |
| Manual smoke negative cases | Unconfigured production target and path-bearing preview target exited nonzero as expected, before network requests. |
| `npm run seo:validate` | All 23 emitted pages passed; null origin/noindex preserved. |
| `npm run artifacts:validate` | 1,046 internal links, 89 fragments and 278 embedded references; no issues. |
| `npm run perf:bundles` | All 23 content routes below initial 200 KiB estimate, optional identified Three 134.5 KiB below 500 KiB, no initial engine. |
| `npm audit --audit-level=low` | Zero reported vulnerabilities. |
| Workflow YAML parse/review | Parsed locally; read-only permissions, no provider secrets or deployment step. This is not hosted GitHub Actions execution or Linux-runner verification. Official action usage/runtime docs were checked before writing the workflow. |
| Local server | Existing portfolio on port 3000 retained and smoke verified. Attempting a second server correctly reported EADDRINUSE; the existing process was not killed. |

Handover covers local operation, actual source/config map, content/assets, environment scopes, first preview/review/bootstrap, approved production activation, GET-only smoke, provider verification, maintenance, rollback/recovery and account ownership. `docs/RELEASE_RECORD.md` explicitly leaves hosted fields pending.

Required input to continue actual deployment: install/sign in to GitHub and Vercel integrations (or provide an authenticated deployment setup), identify the Vercel account/team and whether an existing project should be reused. Inspect the actual target before creating or publishing. Keep the user-chosen origin null; domain/indexing activation and production publication remain separate reviewed steps. Real provider keys belong in provider settings, never chat. No real email testing was authorized or sent.

Remaining Phase 12 work: verified remote/initial reviewed history, hosted CI, actual protected Vercel preview and smoke, owner content/assets review, approved production configuration/release, production/provider smoke and recorded rollback target. No commit/push/merge/deployment/account transfer occurred. The app remains locally available on port 3000 with inactive analytics/noindex and disabled live contact. Do not mark Phase 12 complete or advance to an invented phase while these hosted requirements remain pending.

## Phase 12 install failure repair — 22 November 2026

User pushed initial `main` commit `b79fcd2`; local remote now matches `https://github.com/Selvarajalingam/selvarajalingam-portfolio.git`. Their first Vercel import failed during `npm ci`, before the application build, with two missing `@emnapi` lock records. Local npm 11 accepted the old lock; npm 12.2.3 on Node 24.15.0 reproduced the exact missing runtime/core error. Repair adds those two records and normalizes npm peer metadata without changing any existing dependency version or the application manifest. CI now uses npm 12.2.3 to retain the stricter clean-install gate.

Actual checks: isolated real npm 12 clean install passed; fresh exported source with repaired lock passed npm 12 install, lint, strict types, all 148 tests in 20 files, content validation and production build. Working-copy `npm run check` also passed. npm 12 Linux x64/glibc selection dry run passed (not a real Linux build). Dependency audit reported zero vulnerabilities; `git diff --check` passed. No UI code changed and browser suites were not repeated for lock metadata only. Full detail: `docs/DEPLOYMENT_INSTALL_FIX.md`.

Updated files: `package-lock.json`, `.github/workflows/quality.yml`, install-fix documentation, owner handover and release record. No push, merge or hosted retry performed by the agent. Next: reviewed GitHub update and Vercel deployment of the new main revision, retaining `npm ci`, `npm run build`, disabled contact/GitHub switches and null publication origin; then record actual hosted result and smoke. Deployment is still unverified.
