# Local development

Use Node 24 LTS and npm. From the repository root:

```sh
npm ci
npm run dev
```

Open http://localhost:3000. No environment variables or external services are required for the foundation.
The homepage includes the agreed eleven sections and adaptive hero artwork. About, Experience, Work/all ten details, the empty Lab, Ventures/four details, Services, Contact and Privacy are implemented.
Contact offers direct email and a server-backed form. Without verified deployment/provider configuration, the form remains unavailable. Email links open the visitor's mail app and never claim a message was sent.

## Phase 2 interactions

- Main route registry and interim page copy: `src/lib/navigation.ts`. Replace section shells with route-specific content in their scheduled phases.
- Theme: header Dark/Light/System select. Dark is the first-visit default. Explicit preference is stored as `selva:theme`; System follows device changes, and choices sync across tabs. Storage denial falls back to memory. A trusted static head script applies saved preference before paint.
- Mobile menu: below 1200px, native modal dialog with explicit Tab wrapping, Escape/close controls, focus restoration, body scroll locking and resize/route cleanup. No-JavaScript visitors get ordinary navigation links.
- Intro: small non-modal SVG wordmark drawing on the first eligible visit, lasting 2.2 seconds. Skip/replay controls; `selva:intro-seen` stores completion. Autoplay/replay are suppressed on reduced motion and narrow screens. It never hides the page; 3D is Phase 3.
- Footer: sitemap, supplied contact/social destinations, truthful resume state in header/menu, privacy route shell and back-to-top anchor. A real resume configuration replaces the pending state without component edits.
- Decorative scroll progress uses passive events and one scheduled animation frame per update. It does not control scrolling.

Only preference/intro browser storage is used. No contact-message persistence, tracking, cookies, analytics or new dependencies were added in Phase 2.

## Verification

```sh
npm run check
npx playwright install chromium
npm run test:e2e
npm audit --audit-level=low
npm run perf:bundles
```

`check` runs zero-warning ESLint, Next route type generation + strict TypeScript, Vitest, content validation and production build.
E2E starts the production server on port 3100 and stops it after testing. Build first.
The browser suite runs Chromium desktop and mobile, both theme token sets, reduced motion, axe, keyboard skip link, local links, security headers and 404 recovery.
Phase 2 adds theme bootstrap unit tests and browser coverage for persisted/system/cross-tab/storage-denied themes, modal keyboard/resize/navigation cleanup, intro controls, 320–1920px width overflow checks, scroll progress and no-JavaScript navigation. Browser screenshots are local ignored artifacts under `test-results/`.
Automated accessibility checks are a baseline, not a WCAG conformance certification.

## Current structure

- `src/app/layout.tsx`: root metadata, document language, dark default.
- `src/app/(site)/`: shared server shell and home page.
- `src/components/layout/`: reusable header and footer.
- `src/styles/globals.css`: semantic dark/light tokens and responsive foundation styles; Tailwind 4 utilities.
- `src/content/site.json`: confirmed identity and typed structured collections.
- `src/lib/content/schema.ts`: strict publishable schemas and inferred types.
- `scripts/validate-content.ts`: validates JSON, unique slugs, genuine HTTPS URLs and referenced asset existence before build.
- `tests/`: unit/component tests and production browser checks.

Only copy verified content into public JSON. `verification: "verified"` is an editorial assertion, not an automated fact check. Keep uncertain facts in `CONTENT_VERIFICATION.md`; do not create dummy records. Missing dates, media and resume are absent rather than guessed. Flagship narratives use the restricted server-side Markdown adapter documented below.

## Phase 3 homepage

Narrative and confirmed high-level summaries are in `src/content/homepage.json`, validated by `src/lib/content/homepage.ts` and the build-time validator. This does not mark the detailed project/venture collections as verified or fill them with fabricated records. The AWS credential is explicitly pursuing. Impact numbers, pending employment wording and formal degree details remain absent.

`src/components/hero/sculpture-visual.tsx` always server-renders the 1,878-byte local SVG. Only eligible >=1024px fine-pointer/hover devices dynamically import `sculpture-scene.ts`, after intersection and idle scheduling. Reduced motion, save-data, <=2G, reported <4 CPU cores or <4GB memory retain the SVG. Actual renderer creation also rejects major performance caveats. Unsupported contexts/imports/errors retain or restore the artwork. A desktop control can explicitly select static art for the current visit.

The original mathematical loop is rendered with Three.js and local procedural studio lighting. No textures, models, external environment maps, postprocessing, animation loop or pointer tracking. GPU pixel ratio is capped at 1.5. Rendering occurs for initialization, resize, theme and visibility changes; first-frame success is required before hiding the fallback. Resources/listeners are disposed on static selection, constraint changes, context loss and unmount. Both themes are handled without reloading the page.

`npm run perf:bundles` reports emitted initial-script gzip estimates and identified Three.js engine chunks against the foundation budgets. It does not measure field Core Web Vitals or replace the Phase 11 performance/browser review. Tests verify that fallback paths do not download the identified engine chunks and exercise WebGL success, initialization failure and context-loss recovery.

## Phase 4 profile pages

`/about` includes story, learning, skill discovery, interests and resume state. `/experience` includes an undated learning/teaching/building journey, practice contributions and the exact confirmed Gencanyon role. Source boundaries and editing steps are in `CONTENT_GUIDE.md`; unresolved facts remain in `CONTENT_VERIFICATION.md`.

Both routes are statically generated server pages. Only `SkillExplorer` is interactive: search composes with All/Applied/Strengthening/Learning filters, results use a polite live region, reset returns focus to the input, and all seven categories remain in initial HTML without JavaScript. Lightweight shared labels live in `src/lib/skill-model.ts`; validation dependencies stay on the server.

The current resume state is intentionally unavailable. The local-PDF preview/view/download component is tested with a clearly labelled fixture but no PDF is published. The experience schema supports absent dates and rejects inconsistent dates. No employment duration, placement dates, impact metrics, formal degree title or earned AWS credential were invented.

`npm run perf:bundles` now reports `/`, `/about` and `/experience`, enforces the 200 KiB initial gzip estimate budget on each, and rejects Three.js engine chunks in initial scripts. Browser checks cover both profile routes/themes, 320–1440px overflow, keyboard/filter/reset behavior, metadata/links, no-JavaScript content and axe.

## Phase 5 Work

Project records live in `src/content/projects/index.json`, merged by the content adapter. Four local `.md` files provide available flagship facts; compact secondary overviews stay in the index. The Markdown parser uses unified/remark-parse on the server and produces only safe text/list sections. It never evaluates raw HTML/MDX. Missing files, unsupported authoring and duplicate heading IDs fail content validation.

`/work` and `/work/[slug]` are static. Only the listing explorer is interactive, receiving listing fields rather than narratives or gallery/architecture data. Category, technology and search filters compose; sorting is stable; reset restores search focus; all entries and narratives remain readable without JavaScript. The homepage references the same four canonical flagship records.

No architecture graph or project image is published because no approved source was supplied. Typed renderers are available for later approved data, with local image paths/dimensions and graph endpoint checks. Unknown frameworks, outcomes, dates and repository URLs remain absent. No external API is needed for page rendering.

`npm run links:projects` performs timed HEAD-only checks of supplied destinations. It does not capture page content and is not part of the build. `npm run perf:bundles` now checks Work and all ten project routes in addition to prior routes, decoding Next's URL-encoded chunk filenames before filesystem measurement.

## Phase 6 Lab

`/lab` is a dedicated static page. `src/content/lab/index.json` is deliberately empty and authoritative; `page.json` holds presentation copy. The content adapter merges the index with the other collections. Shared category/status labels are in `src/lib/lab-model.ts`; validation remains on the server.

`LabExplorer` composes text/category/status filters, provides reset/focus restoration and live results, and distinguishes a globally empty collection from a filtered empty result. `LabCard` supports genuine optional images. `LabArticle` renders only provided idea/progress/next steps/timeline/learnings/links and approved visual metadata. It does not create dates or progress percentages.

`/lab/[slug]` is ready for actual verified records but generates no named experiment pages now. Unknown/unpublished/test-only slugs return 404. The template's populated branches are tested with test-only fixtures, never by seeding production data. The homepage teaser/metadata switch automatically when verified entries are added. See `CONTENT_GUIDE.md` for the first-entry workflow and required test updates.

No dependencies or external APIs were added. Bundle reporting includes `/lab` and any real future Lab detail pages. Current browser checks cover the honest empty launch, filters/reset, both-theme axe, responsive layout, no-JavaScript access and unpublished 404s. A genuine populated detail route/image needs browser verification when it exists.

## Phase 7 Ventures

`src/content/ventures/index.json` feeds the static `/ventures` directory, four static detail pages and homepage venture names. Gencanyon company/role/contributions are shared from the existing verified experience record through `src/lib/content/ventures.ts`. No new runtime dependencies or client components were added.

`VentureCard`, `VentureIdentity`, `VentureArticle` and `CompanyContext` separate layout from content. The image component renders only an explicitly approved, dimensioned, correctly scoped local logo; none is configured now. External website links use safe new-tab attributes; Chennai Buyers has only the honest website-coming-soon state and internal enquiry. Unknown venture slugs return 404. All content/navigation works without JavaScript.

`npm run links:ventures` is a separate timed HEAD-only availability check of the three supplied URLs. It never supplies page content or blocks rendering. Bundle reporting includes all five venture routes. Browser checks exercise navigation, both themes with axe, 320–1440px overflow, keyboard enquiry activation, no-JavaScript navigation and unknown slugs. Actual logo visual review awaits genuine approved assets.

## Phase 8 Services and contact

Services uses the three verified `site.json` groups in native details/summary accordions. `/connect`, `/services` and `/privacy` are static pages; the former catch-all shell is removed. Contact's client component handles field errors, stable labels, pending/duplicate prevention, retained input/retry IDs, optional challenge and accessible acceptance/error focus. The initial server-rendered state explains the JavaScript/email fallback.

`/api/contact` is a Node route. The strict server schema, bounded JSON body reader and handler are separate from provider adapters. It requires exact configured Origin, rejects honeypot submissions, checks the official Vercel Firewall rule and verifies risk-triggered Turnstile tokens before Resend. No contact data is persisted in the app or intentionally logged. Provider acceptance, partial receipt failure and uncertain acceptance are distinct states. Server-only markers keep credentials/provider code outside client bundles.

`@vercel/firewall` 1.2.6 and `server-only` 0.0.1 were added; Resend/Turnstile use bounded native fetch. No contact database or process-local rate counter is used. CAPTCHA loads only on demand. Tests use test-only addresses and mocked providers; no real email was sent. Browser tests include real disabled API behavior, mocked provider/challenge flows, retries, pending state, keyboard accordions, no-JavaScript fallback and both-theme axe/responsive checks. Production activation still needs the configuration and authorized smoke tests in `DEPLOYMENT_GUIDE.md`.

## Phase 9 GitHub and cloud resources

`src/content/github/repositories.json` is a small canonical editorial selection from observed public API metadata. The Featured Work section renders its names/destinations statically and keeps the eleven-section homepage order. `GitHubRepositories` requests an internal snapshot only when near the viewport; unavailable APIs, no JavaScript or unsupported observation leave the actual curated links intact, without fake counts. `CloudResources` renders manually verified JSON records or the existing honest empty state. The cloud index remains `[]`; no YouTube API/embed is added.

Server-only `src/lib/github/provider.ts` validates the public flag, visibility, owner/name/URL, fork/disabled state and small scalar metadata. It fetches only allowlisted endpoints serially with 2.5-second timeouts/60 KB response limits, stops on failure and never returns raw descriptions/private fields. `cached.ts` caches projected results for 900 seconds through Next's data cache. `/api/github` is dynamic and returns no-store responses; cache errors still return curated-only records. Partial/fallback results are cached too, so there is no immediate retry loop.

`GITHUB_METADATA_ENABLED=false` disables upstream calls. Optional `GITHUB_TOKEN` stays on the server. Browser tests explicitly disable external requests and mock successful enhancement; `npm run github:verify` separately checks actual public API responses through the same adapter. No new dependencies or repository files are fetched. Deployed cache persistence/revalidation still needs preview verification. The privacy notice now describes the first-party snapshot request and public server-to-GitHub requests.

## Phase 10 SEO, privacy and analytics

`src/content/publication.json` is the publication authority. The user initially deferred the origin, then confirmed `https://selvarajalingam.vercel.app` and requested SEO setup. Current source uses that origin for absolute canonical/OG and JSON-LD URLs, with `allowIndexing: false` and `webAnalytics: false`. Noindex and empty sitemap remain intentional until final release approval. Contact's `SITE_URL` is separate security configuration. Push/redeploy is required for the updated SEO to reach the hosted site.

`src/lib/seo/routes.ts` centralizes unique metadata for all actual content pages. Pages call the same metadata and safe structured-data helpers. Root metadata has no homepage canonical to leak into 404s. `robots.ts`, `sitemap.ts` and HTTP headers use the publication gates. The catalog includes only real project/venture/Lab entries and uses real update dates only when supplied.

`npm run assets:og` renders original profile-driven 1200×630 artwork from the existing sculpture SVG through Next ImageResponse. `npm run seo:validate` inspects all emitted content HTML and the actual PNG. `src/app/icon.svg` is an original compact brand icon. No portrait/product screenshot substitute is generated.

Pinned `@vercel/analytics` 2.0.1 integrates production-only pageviews with origin/path checks, query/hash filtering, DNT/GPC and sensitive-referrer exclusion. Local/preview builds do not mount it; GA4 is not implemented. Privacy text uses the same effective gate. Tests exercise configured release logic with isolated fixtures and the SDK mock, while browser checks verify the configured-origin/no-tracking state. `@types/jsdom` 30.0.0 supplies strict types for the existing JSDOM parser used by emitted-HTML checks. No actual analytics intake/dashboard or public crawler verification has occurred.

## Tooling decisions

Next.js 16.4.6's Turbopack CSS subprocess exits before connecting on this Windows host, both in and outside the sandbox. The supported `--webpack` path passes the production build and is used consistently for dev/build. Re-evaluate Turbopack after a framework update.

On this Codex Windows host, a later restricted-sandbox build also hit `EPERM` while creating a generated `.next` segment directory. The identical `npm run check` passed outside the sandbox. Do not change application code to work around host filesystem permissions.

ESLint 9.39.5 is deprecated upstream but currently required by the bundled React, import and accessibility plugin peer ranges. ESLint 10 was tried and produced an invalid dependency tree. Keep the compatible version until all bundled plugins support ESLint 10; audit separately for advisories.

The site is intentionally `noindex` while content review remains open. The confirmed production origin is configured locally; content approval and release authorization precede indexing activation. Analytics is explicitly off. Public GitHub metadata is optional and server-cached; contact email remains disabled without verified deployment configuration. Adaptive homepage WebGL artwork is active on eligible devices.

## Hardening checks

`npm run test:audit` starts a production server on 3100 and checks all real routes in both themes across Chromium, Firefox and WebKit. Install those engines with `npx playwright install chromium firefox webkit`. Run it separately from `npm run test:e2e`, which also owns 3100. Audit/E2E artifacts are isolated in `test-results/hardening` and `test-results/e2e`.

`npm run artifacts:validate` checks emitted links/fragments/assets and client chunk identifiers after a build. `npm run links:all` makes bounded HEAD requests to every emitted external destination; an unverified or broken response fails the check and requires investigation rather than fabricated replacement links. Local performance sampling is Chromium-only, reduced-motion and explicitly separate from production field metrics. See `docs/PHASE_11_AUDIT.md` for evidence and limits.
