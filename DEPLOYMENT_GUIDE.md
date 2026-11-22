# Deployment and Ownership Guide

## Target

Phase 12 status: the user pushed the source and deployed successfully at `https://selvarajalingam.vercel.app`; all 23 GET-only smoke checks passed before the origin update. The confirmed origin is configured locally for the next deployment. Indexing remains disabled and analytics is explicitly off. Exact hosted commit/deployment IDs, final content approval, provider delivery and the new SEO deployment still need verification. See `docs/RELEASE_RECORD.md` and `docs/OWNER_HANDOVER.md`.
- GitHub: `Selvarajalingam/selvarajalingam-portfolio` (public)
- Branch: `main`
- Vercel free tier, subject to current limits
- Target URL: `https://selvarajalingam.vercel.app` (check availability)
- Resend for contact email
- Vercel Web Analytics initially
No always-on VPS required.

## Setup
1. Create GitHub repo.
2. Add source and instruction pack.
3. Open in Codex and follow roadmap.
4. Push working code.
5. Import repo into Vercel.
6. Use framework detection unless override required.
7. Deploy preview and verify before production.

## Publishing
Feature branch → pull request → Vercel preview → review → merge to `main` → production. Keep `main` production-ready. Roll back by reverting commit or redeploying last known-good Vercel deployment.

## Environment variables
Required for live contact:
- `RESEND_API_KEY`
- `CONTACT_FROM_EMAIL=noreply@gencanyon.com`
- `CONTACT_TO_EMAIL=selvarajalingam.dev@gmail.com`
- `SITE_URL`: exact confirmed HTTPS origin, no trailing slash/path; configure per deployment
- `CONTACT_RATE_LIMIT_ID`: published Vercel Firewall SDK rule ID
- `CONTACT_SENDER_VERIFIED=true`: operator assertion only after Resend domain verification
- `CONTACT_ENABLED=true`: final activation switch after the checks below
- Optional paired `TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` for risk-triggered CAPTCHA
Optional public metadata: server-only `GITHUB_TOKEN`, and `GITHUB_METADATA_ENABLED` (set false for the first deterministic preview). GA4 and YouTube API integrations are not implemented; do not add credentials for them. Vercel supplies its own system environment variables; do not spoof them locally.
Add real values in Vercel settings only. Never commit `.env.local` or secrets. Maintain `.env.example` with placeholders.

## Resend
Before production:
1. Create/verify Resend account.
2. Add `gencanyon.com` as sending domain.
3. Add the exact DNS records Resend provides.
4. Wait for verification.
5. Create API key.
6. Add it to Vercel environment variables.
7. Test owner notification and visitor acknowledgement.
Do not assume Google Workspace MX records verify Resend. Do not delete existing mail records; follow current provider instructions.

## Contact activation and verification

No live credentials, sender verification, Vercel firewall rule or actual inbox test has been supplied/run. Tests use network mocks. Missing/invalid settings keep sending disabled; `/api/contact` GET reports only availability. The handler requires Vercel's system `VERCEL=1`; do not fake it locally to bypass deployment checks. The browser receives no Resend key or Turnstile secret.

1. Keep `CONTACT_ENABLED=false` while configuring a protected preview. Set `SITE_URL` to its exact HTTPS origin without a trailing slash/path. Configure each preview/production deployment independently.
2. Complete Resend sender-domain verification, then add a sending-only key for that domain and the exact From/To addresses above. Set `CONTACT_SENDER_VERIFIED=true` only after verification. This flag is an operator assertion, not an API check.
3. In Vercel Firewall, create/publish an SDK rate-limit rule matching `CONTACT_RATE_LIMIT_ID`. Use the default client-IP key, a 600-second window and 5 attempts per window, with rate-limit/deny behavior rather than log-only/bypass. Leave it unfiltered or scope to POST `/api/contact`; do not scope it to visitor-controlled custom headers. Verify account options before activation. Counters are per region, not a strict global limit. The app returns 429 with a 600-second retry hint. A missing rule, timeout or firewall error blocks sending.
4. If using CAPTCHA, register Turnstile for the actual hostname and add both keys. Action is `contact`; validation checks success, hostname and action. No script loads on ordinary visits. Very fast or link-heavy submissions trigger a challenge. These are heuristics, not proof of human identity; rate limiting remains necessary. Without challenge configuration, flagged submissions fail closed and offer email.
5. Enable `CONTACT_ENABLED=true` on the configured preview. Obtain authorization before sending actual test messages. Verify owner notification, Reply-To, acknowledgement and actual mailbox arrival. Check 422 validation, honeypot rejection, 429 enforcement, missing-rule/provider failures and required/expired/invalid challenge tokens. Automated mocked tests do not replace these deployed checks.
6. Review privacy wording and provider retention/settings. Use preview → review → approve/merge for production, configure its origin/keys/rule and repeat authorized smoke tests. Disable using `CONTACT_ENABLED=false` if any check fails; direct email remains available.

Owner and visitor emails have separate Resend idempotency keys derived from a random submission UUID. Unedited retries reuse the ID; editing fields or writing another enquiry creates a new one. Keys last 24 hours at Resend, so this is not permanent duplicate protection. Timeout/ambiguous owner responses report unconfirmed acceptance. If the owner email is accepted but acknowledgement fails, the UI says not to resubmit. Provider acceptance never guarantees inbox delivery. Contact bodies are not saved in an app database, browser storage or app logs; providers and inboxes retain their own records.

References: [Vercel rate-limit SDK](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting-sdk), [Resend idempotency](https://resend.com/docs/dashboard/emails/idempotency-keys), [Turnstile validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/). The pinned `@vercel/firewall` 1.2.6 package marks its SDK API experimental; recheck compatibility when upgrading.

## Public GitHub metadata

No token is required for curated repository links. Public metadata fetching defaults on and uses a 15-minute server cache; set `GITHUB_METADATA_ENABLED=false` to keep static links without upstream requests. Optional `GITHUB_TOKEN` is server-only and should have read-only public metadata access, with no private scopes. Never use a `NEXT_PUBLIC_` token variable. Only the four curated endpoints are requested; the API accepts no caller-controlled account/URL. No new provider account, database or YouTube credential is required.

In preview, check `/api/github` and the homepage's On GitHub block, cached checked-at timestamps, timeout/rate-limit fallback and the disabled switch. Run `npm run github:verify` separately when an actual public metadata check is wanted. Browser tests intentionally disable upstream calls; unit/provider/browser mocks do not prove deployed cache behavior. Do not hammer a rate-limited GitHub API; the integration makes no immediate retries and caches its fallback. CDN/platform cache lifecycle and limits still need preview verification. The snapshot API uses no-store response headers while the validated server result is cached.

Cloud resources remain manually curated and empty until real links are supplied. No YouTube fetch/embed is active. Review public repository availability, desired selection and all resource attribution before release.

## Analytics/domain

Publication settings are `src/content/publication.json`, not contact's `SITE_URL`. After initially deferring the origin in Phase 10, the user confirmed `https://selvarajalingam.vercel.app` and requested SEO setup. That exact origin now supplies canonical/social/structured-data URLs locally. `allowIndexing: false` keeps the sitemap empty, robots disallowing crawling and HTTP/meta noindex active. `webAnalytics: false` explicitly prevents collection after deployment. The source change must be pushed/redeployed before it is live. No additional Vercel environment variable is needed for this SEO step.

When the real production origin is confirmed and the site is ready:

1. Verify deployment/domain ownership and the exact HTTPS origin; record it in publication JSON without path/trailing slash. A configured URL is an operator assertion, not proof of availability. Keep `allowIndexing: false` during content/quality review. Contact `SITE_URL` separately specifies the actual submission origin for that deployment.
2. Current `webAnalytics` is explicitly false; activate it separately after review. Effective collection additionally requires a configured origin, Vercel's production environment (`VERCEL=1`, `VERCEL_ENV=production`), the visitor's origin matching and an allowlisted actual route. Preview/local/unconfigured builds do not mount the SDK. Enable Web Analytics in the Vercel project dashboard before checking real production intake; no analytics dashboard action was performed here.
3. The implementation filters to known-route pageviews, strips query/hash, sends no custom events/form fields and respects DNT/GPC. Potentially sensitive referring URLs suppress the integration. Verify actual deployed requests and provider settings, including redaction, before release. SDK intake paths can vary in version 2; do not rely only on a fixed `/insights` URL when inspecting network traffic. Privacy copy uses the same production gate. No unnecessary cookie banner is added.
4. GA4 has no script, configuration hook or consent manager in this implementation; an environment variable alone does not activate it. Any future GA4 work requires deliberate consent-aware implementation and privacy review. Do not assume Vercel analytics setup covers another tracker.
5. Only after content approval, actual origin verification and release authorization, set `allowIndexing: true` in the reviewed release. Production-only gates then enable index/follow, the actual sitemap and crawler allow rules. Preview remains noindex even if the flag is true. APIs stay noindex. There are no guessed last-modified dates.
6. Rebuild and run `npm run check`, `npm run seo:validate`, `npm run test:e2e` and `npm run perf:bundles` using the same environment as the build. Inspect canonical/OG URLs, JSON-LD, robots, sitemap, social sharing image and unknown-route noindex on the deployed host. Check no localhost/preview canonical, duplicate title, empty Lab route or API URL enters discovery. Verify social crawler access/image rendering and analytics behavior. The origin-enabled production branches are unit-tested with fixtures; actual deployed crawler/intake checks remain pending.

For a future domain change, update publication JSON, verify contact-origin settings, rebuild/redeploy and review canonical/sitemap/social URLs before indexing the new host. Keep the normal preview → review → approve/merge workflow. The local PNG is regenerated with `npm run assets:og` from actual profile copy and original repository artwork; inspect its layout after changes.

Official implementation references: [Next metadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata), [Next sitemap](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap), [Vercel analytics privacy](https://vercel.com/docs/analytics/privacy-policy), [Vercel analytics configuration](https://vercel.com/docs/analytics/package). They describe provider behavior; deployment settings still require verification.

## Recovery
GitHub is source of truth. Keep assets backed up. Revert bad content commits. Inspect Vercel build logs for failed deployments. Rotate leaked secrets immediately and review history. Never store secrets in public docs or issues.

## Complete handover
Deliver local setup, content editing, asset replacement, project/venture/Lab addition, env var reference, GitHub/preview workflow, Vercel deploy/rollback, Resend, analytics/privacy, troubleshooting, architecture and known limitations.

Prepared owner guide: `docs/OWNER_HANDOVER.md`. `.github/workflows/quality.yml` defines read-only Node 24 quality checks and browser evidence; it has not run on GitHub yet. `.vercelignore` excludes local env files, build/dependency directories and test reports from CLI upload. Framework/runtime/build settings are derived from `package.json`; no guessed project IDs or production domains are added.

After an actual preview exists, run `npm run deploy:smoke -- <actual-HTTPS-origin> preview` from its exact source revision. It makes GET requests only and expects contact disabled unless explicitly checking enabled availability. For protection access, use the private process environment described in the owner guide, never a secret in the URL. Production mode is rejected until origin/indexing configuration is deliberately approved. Smoke does not send email or prove provider delivery, analytics intake or field performance.
