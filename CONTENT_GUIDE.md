# Content Editing Guide

GitHub-first content management; no admin dashboard in initial release. Use JSON for structured collections and MDX/Markdown for long-form case studies. Validate content before build. Preview every change before merging.

## Current homepage

Edit `src/content/homepage.json` for homepage narrative, featured project references, service pillars, journey statements, skills summaries, AWS pursuit, Lab empty state and contact copy. The homepage schema validates this separately from `src/content/site.json` and its detailed collections. This separation does not override factual verification: do not add unsupported descriptions, metrics, credentials or links. Full case studies and route-specific content arrive in their scheduled phases. Run `npm run check` and `npm run test:e2e` after edits; `npm run perf:bundles` checks local bundle estimates after build.

Phase 5 update: homepage featured entries now contain only a project `slug` and editorial `context`; titles, summaries and detail destinations come from the canonical project index. Their order must match the four featured index records. Do not maintain a second copy of project facts in homepage JSON.

## Current Work collection and narratives

- `src/content/projects/index.json` is the canonical source for all ten project records. `src/lib/content/index.ts` merges it with `site.json` before portfolio validation. Do not put another `projects` collection into `site.json`.
- Four flagship narratives are `research-hub.md`, `alumni-portal.md`, `hearth.md` and `waterbuddy.md`. Secondary records use compact `overview` text in the index. Keep their limited facts compact; never infer a dataset, framework, feature, accuracy, user count or result from a project name.
- Supported narrative Markdown: level-two headings, text paragraphs and plain lists. Inline emphasis/code is reduced to safe text. Headings must be nonempty and unique; content must start with a populated level-two section. HTML, JSX, executable blocks, embeds, Markdown links/images and nested complex lists are rejected. Add approved external destinations through the schema-checked JSON link fields. Nothing is evaluated as MDX or raw HTML.
- `verification: "verified"` attests only to the fields actually included, using evidence or user approval. It does not approve an architecture inferred from the stack, screenshots that have not been supplied, or unpublished engineering/usage claims. Those have separate gates.
- Keep `updatedAt`, `repositoryUrl`, `demoUrl`, `gallery` and `architecture` absent when unknown. The current collection has no dates or repository links; WaterBuddy has no demo. Recently updated sorting appears only once actual dates exist. Do not guess secondary technology tags.
- Approved gallery entries require `src`, informative `alt`, `caption`, positive integer `width`/`height` and `approval: "approved"`. Images must live under `/assets/projects/<project-slug>/`; validation requires the referenced file. Approve/sanitise the actual asset before adding the flag. No screenshot substitutes are generated.
- Architecture data requires explicit `approval: "approved"`, summary, uniquely identified nodes and labelled directed edges whose endpoints exist. This is an editorial assertion, not automated factual proof. Get actual component/data-flow review first. The renderer includes a visible textual connection list; no diagrams are currently populated or published.
- `/work` provides category, technology and search composition, stable featured-first, title/category/technology sorting, reset/empty states and live result announcements. All ten projects appear in server HTML without JavaScript. All detail pages are statically generated, with breadcrumbs, section index, more-project links and bounded previous/next navigation.
- Verify: `npm run check`, `npm run test:e2e`, `npm run perf:bundles`, `npm audit --audit-level=low`. Use `npm run links:projects` for an optional HEAD-only availability check of supplied demo/repository URLs; it is deliberately separate from the build and never fetches application data.

## About, skills and experience

- `src/content/about.json`: story, broad education field/institution, coursework, AWS pursuit, undated journey, practice contributions and interests. `src/lib/content/about.ts` validates it. Keep the formal qualification and employer details out until their pending checks are resolved.
- `src/content/site.json` → `skills`: canonical seven-category catalogue. Each item needs `name`, `context` and `status` (`Applied`, `Strengthening`, `Learning`). Applied describes supplied learning/project context, not a percentage or confidence rating. Java/Spring Boot remain Strengthening and AWS Learning. All seven category titles must be distinct, with unique slugs and no duplicate item names within a category.
- `src/content/site.json` → `experience`: confirmed organisation/role/contribution records. Dates are optional so unknown values can stay absent. Add dates only after evidence or approval; an end date requires a start date and cannot precede it. The current Gencanyon entry deliberately has no guessed date or “Present” label. Do not add pending employer wording or unverified metrics.
- `src/content/site.json` → `resume`: keep `null` while no file exists. Once a genuine approved PDF is supplied, configure its safe `/assets/resume/…pdf` path, label and approved status. A sample must retain `Sample Resume — Updating`. The About component then provides preview, view and download without component changes. Build-time asset existence checks still apply; test fixtures are not actual PDF assets.

Dedicated routes are `src/app/(site)/about/page.tsx` and `src/app/(site)/experience/page.tsx`; their former catch-all entries were removed from `src/lib/navigation.ts`. Do not reintroduce competing shell definitions. The homepage keeps a compact skills summary; update it consistently when the canonical catalogue changes.

## Suggested folders
```text
src/content/
  projects/index.json + [slug].md
  ventures/index.json + [slug].mdx
  lab/index.json
  resources/aws-cloud.json
  services/services.json
  experience/timeline.json
  skills/skills.json
  social/links.json
```
Codex may adjust but must document final structure.

## Add a project
1. Add record to index.
2. Use unique lowercase slug.
3. Assign valid categories and verified tags.
4. Set featured only if approved.
5. Add case study file.
6. Add approved images to `public/assets/projects/<slug>/`.
7. Add real demo/GitHub/video links only.
8. Run schema validation, lint, typecheck, tests, build.
9. Review Vercel preview.
Required metadata includes title, slug, summary, categories, technologies (empty if unknown), role, status, featured flag and verification. Include dates only when real and verified; include image metadata only with a genuine approved asset. Do not invent a date or image to satisfy a field.

## Add a Lab experiment
The current production source is `src/content/lab/index.json`, intentionally `[]`. It is merged into the content adapter; do not put a second `lab` array into `site.json`. Page/empty-state copy is separate in `src/content/lab/page.json`, validated by `src/lib/content/lab.ts`.

1. Confirm the entry is real and approved for sharing. Never copy the test-only fixtures into production.
2. Add unique lowercase `slug`, `title`, `summary`, one of the six agreed `category` values and exact `status`: Exploring, Building or Experiment Complete.
3. Supply factual `idea` and `progress.summary`, plus `verification: "verified"` only after reviewing the actual facts. This flag is an editorial assertion, not proof generated by a schema.
4. Optional: `progress.updatedAt` (actual ISO date), `progress.nextSteps` (real next steps), `timeline` (chronological dated title/body notes) and `learnings` (actual findings). Omit missing fields. No guessed dates, progress percentages, artificial milestones or invented lessons. An update date cannot precede its latest timeline note.
5. Optional image: genuine approved `/assets/lab/<slug>/…` asset, with `alt`, `caption`, positive integer `width`/`height` and `approval: "approved"`. Sanitize/approve the real asset before setting that flag; validation checks the file exists. No generated screenshot substitutes.
6. Optional `demoUrl`/`repositoryUrl`: exact genuine HTTPS destinations only. Do not guess handles or repositories.
7. Run `npm run check`, `npm run test:e2e`, `npm run perf:bundles` and inspect preview. The detail route is statically generated from the verified index. Unknown or unpublished slugs return 404. The homepage teaser and Lab metadata adapt to whether real entries exist.

Empty-launch assertions intentionally enforce the current agreed state. When the first real entry is approved, update those tests to check its real content and retain publication/asset/date safety checks. Do not make tests pass by publishing a fixture. The detail template is unit-tested with explicitly test-only data; real-image and populated-route browser checks must be added with genuine content.

## Add venture

`src/content/ventures/index.json` is canonical for the four ventures. Do not restore a second collection in `site.json`. The homepage now reads these same names, detail paths and website states, plus the shared Gencanyon record from `site.json` → `experience`. The former venture copy in homepage JSON has been removed. Keep the exact confirmed company role there; do not imply ownership or assign a contribution to a particular venture without evidence.

Each record needs unique `slug`, `title`, factual `summary`, `status: "Live & Active"`, `verification: "verified"` and a `website` object. Verification approves only supplied fields, not missing features, sectors, outcomes, dates or brand assets. The pages stay compact because venture-specific narratives have not been supplied.

- Available website: `{ "status": "available", "url": "https://…" }`, using an exact verified destination. The three current URLs are supplied by the owner.
- Missing website: `{ "status": "coming-soon" }`, without a URL. Chennai Buyers remains “Website coming soon” and has an enquiry CTA to `/connect`. Its venture status is still Live & Active. Do not guess a domain.
- Optional `logo`: authentic approved local file under `/assets/ventures/<slug>/`, with `src`, `alt`, positive integer `width`/`height` and `approval: "approved"`. Build validation checks the file exists. Approval is a human assertion after source/permission review; the schema cannot prove authenticity. Use the actual brand export and preserve colours. No logos or brand palettes are configured now. Review the real asset against both themes before publishing, including an approved background treatment if needed.

`/ventures` and four `/ventures/[slug]` pages are statically generated server pages. No external website is fetched while rendering/building. Unknown slugs return 404. Breadcrumbs, related venture links, homepage names and enquiry links work without JavaScript. Enquiries reach the existing Contact page; the form is Phase 8.

Run `npm run check`, `npm run test:e2e`, `npm run perf:bundles` and review the preview. `npm run links:ventures` optionally checks exact supplied websites using timed HEAD requests; it reads no page content and is separate from the build. Recheck actual status/content before release. Never add performance metrics or replacement logos to fill gaps.

## Add AWS/cloud resource

`src/content/resources/aws-cloud.json` is authoritative and currently `[]`; do not restore a `resources` array in `site.json`. Add only actual reviewed video/article/tutorial/resource links, with unique `slug`, title, factual summary, `type` (Video/Article/Tutorial/Resource), exact genuine HTTPS `url` and `verification: "verified"`. Optional `category` and `attribution` are supplied text. Clarify whose material it is; do not imply authorship or an earned AWS credential from a curated link.

The homepage cloud section renders safe text cards when real records exist, otherwise its honest empty copy. No YouTube iframe, thumbnail, scraping or metadata API is used; API results never override manual curation. No cloud URLs have been supplied, so do not fill this collection with examples or test fixtures. Run the normal content/check/browser gates and preview the first genuine card, including its attribution and destination.

## Curated GitHub repositories

`src/content/github/repositories.json` contains the known account/profile and up to six deliberately selected repository names/destinations. The initial four were observed through the public GitHub API on 19 November 2026, not inferred from portfolio project titles. `verification` and `checkedOn` attest to public destination checks, not authorship, business outcomes or approval of repository contents. No Work `repositoryUrl` has been auto-filled from a similar name.

To edit selection, verify the exact public non-fork/non-disabled repository under the supplied account, use its actual name/API `html_url`, set the actual check date and review the preview. Duplicate names/foreign destinations/traversal/unverified records fail validation. Do not add private repos, screenshots, unreviewed API descriptions or guessed language/metric values. The hardcoded account/profile boundary must be changed deliberately if identity changes.

Static curated links render in the Featured Work section without JavaScript/API availability. A viewport-triggered client request to `/api/github` optionally adds public main-language, star/fork counts and a checked-at timestamp. Counts are a cached snapshot, not activity or proficiency scores. Null metadata renders no counts, never fabricated zeros; actual zero values from GitHub are displayed. No follower total, contribution heatmap or auto-selected recent repositories.

The server uses a 15-minute Next data cache, 2.5-second per-repo timeout, serial requests and a 60 KB response limit. It stops at the first failure/rate limit/malformed/private/mismatched response, preserving curated fallback links. Partial snapshots are possible and clearly leave missing metadata absent. Redirects fail closed; review/update renamed destinations manually. Cache availability and revalidation in the deployed environment still need preview review. `GITHUB_METADATA_ENABLED=false` disables fetching. An optional read-only `GITHUB_TOKEN` stays server-only; no private scopes are needed.

`npm run github:verify` performs a real bounded read-only metadata check through the same adapter (no repo files). It reports only the safe projected public fields and exits nonzero if any metadata cannot be established. It is separate from builds/tests. Browser tests disable external fetching and use explicitly mocked snapshots for enhancement states; real public verification was run separately. Run `npm run check`, `npm run test:e2e`, `npm run perf:bundles` and `npm audit --audit-level=low` after changes.

## Services, contact and privacy

The canonical accordions are `site.json` → `services`: Development, Product & Design, Education. Edit only supplied offerings; keep pricing and promised outcomes absent. Native details/summary controls work without JavaScript. Keep homepage service summaries consistent with these records.

Contact invitation/availability is shared with homepage `connect` copy. Subjects are in `src/lib/contact/model.ts`; validation is in `contract.ts`. Keep UI and server limits aligned. Never rename provider acceptance as guaranteed delivery or turn an error into success. The exact privacy acknowledgement links to `/privacy` without a checkbox.

Review privacy text against the real deployment/providers and whenever tracking changes. No retention schedule is invented. Never add contact messages or credentials to content files. Live activation requirements and authorized smoke tests are in `DEPLOYMENT_GUIDE.md`; do not paste secrets into JSON or chat.

## Resume and assets
Replace configured sample PDF with approved final PDF; keep component path/config stable. Remove “Sample Resume — Updating” only after genuine resume supplied. Replace portrait/screenshots through asset path/config, add alt text and verify crops. Generated mockups are never actual screenshots.

## Social links
Only add exact profile URLs supplied by user. Never guess handles.

## SEO and publication settings

`src/lib/seo/routes.ts` is the route/title/description catalog. It references actual project/venture/Lab content, preserving supplied titles and facts. Use the shared helper on every content page; do not add separate conflicting canonical/social strings. Future verified content routes must remain in the catalog and sitemap tests. Do not invent lastmod dates to make the sitemap look current. Only real project/Lab update dates are used when supplied.

`src/content/publication.json` now uses the user-confirmed `https://selvarajalingam.vercel.app` origin for canonical, social and structured-data URLs. `allowIndexing` remains false until final content/release approval, so robots still blocks crawling and the sitemap is empty. `webAnalytics` is explicitly false; activate tracking separately after review. This source change needs push/redeployment before it is live. `SITE_URL` is separate contact security configuration. See `DEPLOYMENT_GUIDE.md` for activation checks.

Minimal Person/WebSite/page JSON-LD uses only included verified identity/social/page facts and safe serialization. No credentials, employer dates, degree, ratings, products' business outcomes or ownership are inferred. Absolute graphs/URLs are omitted while origin is absent. The shared social image and original icon do not depict a real person or product screenshot. Regenerate/inspect `public/assets/brand/og/portfolio.png` using `npm run assets:og` after changing identity copy; keep 1200×630 dimensions and genuine alt text.

After build run `npm run seo:validate`: it checks all emitted content pages, unique titles, one h1, matching description/OG/Twitter, origin-safe canonicals, structured-data presence, noindex state and real PNG dimensions. This does not prove indexing, rich-result eligibility or external crawler behavior; preview/production smoke tests remain part of release.

## Publishing
Feature branch → push → inspect Vercel preview → review → merge to `main`. Revert or redeploy if a problem reaches production.
