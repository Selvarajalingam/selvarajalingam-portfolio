# Technical Architecture

## Stack
Next.js App Router, strict TypeScript, Tailwind CSS, Vercel. React Server Components by default; client components only for interactivity. JSON for structured content; MDX/Markdown for long-form case studies. Resend for email. Vercel Web Analytics initially. Optional React Three Fiber/Three.js hero sculpture.

Use current compatible stable versions at build time; do not blindly pin versions from this brief.

## Suggested structure
```text
src/
  app/
    (site)/{page.tsx,about/,work/,lab/,ventures/,services/,experience/,connect/,privacy/}
    api/contact/route.ts
  components/{layout,navigation,sections,projects,ventures,lab,contact,ui}/
  content/{projects,ventures,lab,services,experience,resources}/
  lib/{content,email,github,seo,validation,analytics}/
  styles/
public/assets/{brand,portrait,hero,projects,ventures,lab,resources,resume,icons}/
```
Adapt to current Next.js conventions while preserving separation of routes, components, content and utilities.

## Rendering
Static generation for content pages where practical. Server components for content. Client components for filters, theme, lightbox, nav, motion and form interaction. Dynamically import 3D. Lazy-load galleries and below-fold media. Optimise images and reserve dimensions to prevent layout shift.

## Content models
Structured JSON: projects, ventures, Lab, services, skills, experience, social links, resource index.
MDX: flagship case studies, Lab details and richer venture stories.
Validate with Zod or equivalent. Detect missing fields, duplicate slugs, invalid URLs, missing images and invalid statuses.

## Work filtering
Client-side filtering is fine for ten projects. Category and technology filters compose. Default featured-first. Recently updated uses real `updatedAt`, never guessed dates. Keyboard-operable filters and reset/empty state required.

## Contact route
`POST /api/contact`:
1. Parse request.
2. Validate server-side.
3. Reject honeypot submissions.
4. Apply rate limit compatible with Vercel deployment.
5. Use risk-based CAPTCHA only if required.
6. Send owner notification through Resend.
7. Send visitor acknowledgement.
8. Return safe status.
No DB. Do not log full message bodies or personal data. Do not claim success until provider accepts request.

Phase 8 implementation: static `/connect` with runtime `/api/contact` GET availability and JSON POST handling. Native service accordions and an implementation-specific privacy notice are static. Server modules use `server-only`; the client receives lightweight labels/result types. The body reader is bounded to 24 KB and five seconds, with exact configured-Origin enforcement. Strict field limits, honeypot rejection, Vercel Firewall SDK rate limiting and conditional Turnstile verification precede email requests. Provider timeouts are bounded; missing configuration/security checks fail closed.

No process-local counter or application database is used. Vercel's published rate rule is external configuration and its counters are per region. Resend owner/acknowledgement requests have separate stable retry keys and distinguish accepted, receipt failure and uncertain owner acceptance. Plain-text email avoids evaluating visitor HTML. No live integration has been exercised with actual keys; see `DEPLOYMENT_GUIDE.md` for activation and verification requirements.

Implemented contact environment names: `CONTACT_ENABLED`, `CONTACT_SENDER_VERIFIED`, `SITE_URL`, `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL`, `CONTACT_RATE_LIMIT_ID`, optional paired `TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY`. Public GitHub metadata uses `GITHUB_METADATA_ENABLED` and optional server-only `GITHUB_TOKEN`. Vercel supplies `VERCEL` / `VERCEL_ENV`. GA4 and YouTube have no implemented credential hooks. Never commit secret values; see `.env.example` and `docs/OWNER_HANDOVER.md` for scopes and activation.

## GitHub
Curated repository cards plus selected public metadata, server-side where practical, with caching, timeout and curated fallback. No fake counts. Contribution heatmap only if data is reliable.

Phase 9: canonical curation is separate JSON; homepage links are static. A viewport-triggered client enhancement calls `/api/github`, whose server-only adapter requests only curated public endpoints. It projects validated language/counts/check timestamps, caches results for 900 seconds and returns curated fallback on upstream/cache errors. Requests are serial, time-bounded and response-size-bounded. Unknown request query parameters cannot select an account or URL. Optional GitHub token never reaches the browser. No repository contents, inferred project associations or API-authored descriptions are published. Tests disable external fetching; actual read-only verification is a separate command.

## YouTube/resources
Manual curation is authoritative. Optional official API metadata retrieval only when configured and practical. No scraping/brittle undocumented endpoints. No public card without a real resource URL.

Phase 9 uses `src/content/resources/aws-cloud.json`, currently empty, with safe text cards for future verified URLs and optional category/attribution. No YouTube API or iframe is implemented because no content links were supplied. The empty state and pursuing-only AWS credential remain truthful.

## Analytics/privacy
Vercel Web Analytics first. GA4 optional and disabled by default. If enabled, implement consent handling appropriate to the deployment. Privacy policy must reflect actual behaviour.

Phase 10: publication JSON separates the approved production origin/indexing switch from contact's per-deployment submission origin. One route catalog supplies metadata, sitemap and page JSON-LD for actual content. Unconfigured origins produce no guessed absolute URLs; local/preview builds remain noindex. The shared OG PNG is generated locally from actual profile copy and original abstract artwork. Root metadata does not assign a homepage canonical to unknown routes.

The Vercel Analytics component is gated by configured origin and actual Vercel production environment, then checks current origin, known paths, visitor privacy signals and referrer safety. Its beforeSend policy accepts only sanitized pageviews; no custom contact events are emitted. GA4 has no activation code. Current origin is null by explicit user choice, so analytics/production SEO activation remains pending. See the deployment guide for release validation.

## Performance
3D only on capable desktop, lazy-loaded after critical content; CSS/SVG/static fallback. WebGL failure must not break hero. Avoid heavy 3D assets on mobile. Measure actual bundle and Core Web Vitals.

## Security
Validate untrusted inputs, render content safely, keep secrets server-side, update dependencies, use secure headers where appropriate, use safe external-link attributes, avoid internal error leakage, protect API route. Do not allow arbitrary raw HTML in MDX.

## Future CMS
No admin dashboard now. Keep content schemas and adapters modular so a Git-backed CMS or admin tool can be added later without rewriting pages.
