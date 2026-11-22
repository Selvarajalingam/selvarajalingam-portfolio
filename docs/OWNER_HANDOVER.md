# Portfolio owner handover

## Current delivery state

The application is implemented locally through Phase 11. Phase 12 prepares CI, deployment smoke checks and this handover. There is no verified GitHub remote, hosted workflow run, Vercel project, preview URL, production deployment or approved production origin. Do not treat a local build or this document as release approval. The public repository named in the brief is a target, not an existing verified repository.

Publication remains `origin: null`, `allowIndexing: false`; effective analytics is inactive. Lab and cloud-resource collections are intentionally empty. Live contact is disabled without verified sender, firewall and exact deployment-origin configuration. Outstanding factual/assets decisions remain in `CONTENT_VERIFICATION.md` and `ASSET_MANIFEST.md`.

## Run and verify

Use Node 24 and npm. Run `npm ci`, then `npm run dev` and open `http://localhost:3000`. For a local production run use `npm run build`, then `npm run start -- --port 3000`. Avoid rebuilding `.next` underneath a running server; stop the server, build and restart when updating application code.

Local quality commands:

```sh
npm run check
npm run seo:validate
npm run artifacts:validate
npm run perf:bundles
npm audit --audit-level=low
npx playwright install chromium firefox webkit
npm run test:e2e
npm run test:audit
npm run deploy:smoke -- http://127.0.0.1:3000 preview
```

Browser suites each own port 3100; run sequentially. Smoke needs an already-running server. `npm run links:all` checks actual external destinations separately; external availability can change. See `docs/LOCAL_DEVELOPMENT.md` for Windows/Webpack and sandbox details.

The prepared `Portfolio quality / Build and browser checks` workflow uses Node 24, clean npm installation, production build, lint/types/tests, emitted-artifact/security/bundle checks and sequential browser suites. It uses read-only repository permissions and no provider secrets or deployment step. Browser artifacts are retained seven days. It has not run on GitHub yet. After its first successful hosted run, select the actual check name in branch protection and require it plus review before merging `main`. Do not assume a Vercel build alone runs the full test suite.

## Where to edit

| Change | Authoritative source |
| --- | --- |
| Brand/profile, skills, services, experience, resume, supplied socials | `src/content/site.json` |
| Homepage story and section copy | `src/content/homepage.json` |
| About/education/interests narrative | `src/content/about.json` |
| Work records and four flagship narratives | `src/content/projects/index.json`, sibling `.md` files |
| Ventures and exact website state | `src/content/ventures/index.json` |
| Real Lab entries and empty-state text | `src/content/lab/index.json`, `page.json` |
| Actual curated GitHub destinations | `src/content/github/repositories.json` |
| Real AWS/cloud links | `src/content/resources/aws-cloud.json` |
| Production origin/indexing/analytics switches | `src/content/publication.json` |
| Route metadata/discovery catalog | `src/lib/seo/routes.ts` |
| Theme/control tokens and responsive layout | `src/styles/globals.css` and page styles |
| Approved portraits, resume, project/venture assets | `public/assets/`, configured through the appropriate content record |

Follow `CONTENT_GUIDE.md` for actual field requirements and adding project, venture, Lab or resource entries. Long-form project Markdown is parsed as restricted safe text, not executable MDX. Keep a missing field absent; never copy a fixture to fill it. Resume stays null until a real approved PDF exists. Build validation checks syntax/paths, not factual truth or asset permission.

## First GitHub and Vercel preview

1. Establish authenticated access and the intended Vercel account/team/project. Inspect any existing `Selvarajalingam/selvarajalingam-portfolio` repository before creation or push; never overwrite another project. Review the source and internal verification documents before publishing the requested public repository. Do not add a guessed license or public-reuse permission; no first-party license has been chosen. Third-party sculpture/library attribution is in `docs/THREE_LICENSE.md`.
2. Review the exact local files for the initial commit. Include source, lockfile, instruction/docs, assets and CI; exclude local env files, `.next`, dependencies, reports and provider linkage. Commit the feature branch, push to the verified remote and inspect hosted CI. There is currently no initial commit or `main` history. Bootstrap an approved base branch deliberately before opening the first PR; do not represent an unreviewed feature commit as an approved production release.
3. Import/link the verified GitHub repository to the selected Vercel project. Framework: Next.js; repository root; Node 24.x; install `npm ci`; build `npm run build`; detected Next output. Keep the server runtime: static export would remove the two API routes. `package.json` is authoritative; no project/team IDs or guessed domain are committed.
4. Configure preview deployment protection and protect build logs/source using the available account options. `noindex` is not authentication. Prevent automatic production promotion/branch deployments until the reviewed release is ready; inspect existing project settings before changing them. Keep `CONTACT_ENABLED=false`, `CONTACT_SENDER_VERIFIED=false` and initially `GITHUB_METADATA_ENABLED=false`. No secrets are needed for this disabled preview. Keep publication JSON unchanged.
5. Deploy the feature branch as a preview. Record the actual commit/deployment URL and build log; inspect all routes/themes/mobile menu, filters, reduced-motion fallback, 404, direct email and unavailable-form copy. Run the smoke command below. The optional public GitHub cache must be verified separately if enabled.
6. Review content/approved assets and obtain publication approval before merge/production. Preserve the deferred origin until explicitly confirmed. A preview can be reviewed with indexing and live email disabled; missing assets need not be fabricated.

Provider references checked during preparation: [Vercel project settings](https://vercel.com/docs/project-configuration/project-settings), [Node runtime](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions), [Git deployment controls](https://vercel.com/docs/project-configuration/git-configuration), [deployment protection](https://vercel.com/docs/deployment-protection), [GitHub Actions checkout](https://github.com/actions/checkout), [Node setup](https://github.com/actions/setup-node), [artifact retention](https://github.com/actions/upload-artifact). Hosted account availability and billing limits must be checked in the actual account; no paid plan or resource was selected here.

## Environment scopes

| Setting | Preview baseline | Production activation |
| --- | --- | --- |
| `CONTACT_ENABLED` | `false` | `true` only after deployed provider/rate-limit/inbox verification |
| `CONTACT_SENDER_VERIFIED` | `false` | `true` only after actual Resend sender verification |
| `SITE_URL` | Leave unset while contact is off | Exact actual HTTPS submission origin; separate per environment |
| `RESEND_API_KEY` | Unset for disabled contact | Sending-only server secret entered in Vercel settings |
| `CONTACT_FROM_EMAIL` / `CONTACT_TO_EMAIL` | Unset for disabled contact | `noreply@gencanyon.com` / `selvarajalingam.dev@gmail.com` |
| `CONTACT_RATE_LIMIT_ID` | Unset while disabled | Actual published Firewall SDK rule ID |
| `TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | Unset while disabled | Optional pair for the actual hostname/action `contact` |
| `GITHUB_METADATA_ENABLED` | `false` initially | Deliberately enable after deployed cache/fallback review |
| `GITHUB_TOKEN` | Not required | Optional server-only read-only public metadata access |
| `VERCEL`, `VERCEL_ENV` | Platform supplied | Platform supplied; never spoof to bypass gates |

Never prefix secrets with `NEXT_PUBLIC_`, commit real env files or paste keys into chat/docs. There is no GA4/YouTube implementation, so do not create credentials for them. `.env.example` lists only implemented application settings. Vercel project settings affect deployments; redeploy/rebuild after environment changes rather than assuming an existing artifact changes in place.

`DEPLOYMENT_GUIDE.md` contains the exact Resend/domain, published firewall rule and optional risk-based CAPTCHA checks. Test with actual inboxes only when authorized; a GET-only smoke does not verify email delivery or rate limiting. Keep messages and provider credentials out of app logs and browser storage. No database migration or message-storage backup is required because the app has no database.

## Read-only smoke command

```sh
npm run deploy:smoke -- <actual-preview-origin> preview
```

Replace the angle-bracket argument with the exact real HTTPS origin, with no trailing slash/path/query/credentials. HTTP is accepted only for loopback local checks. Run from the same source revision as the deployed build. It checks all actual routes/titles/descriptions/canonicals, noindex state, main/h1, security headers, robots/sitemap, original PNG dimensions, icon, unknown-route 404 and GET contact availability. Redirects are failures so protection credentials cannot be forwarded to another host. It sends no enquiry and does not probe Resend, bypass rate limits, or verify analytics intake.

For a protected preview, an authorized Vercel protection-bypass secret can be supplied through `SMOKE_PROTECTION_BYPASS` in the local process environment. The script sends it only as a header to the explicit target, never a query parameter or log entry. Leave deployment protection enabled. A 401/403/login page is a failed/unverified smoke, not evidence of a working app.

Contact is expected unavailable by default. Set `SMOKE_EXPECT_CONTACT=enabled` only when deliberately checking configured availability after provider verification; no email is sent. Production smoke uses `production` instead of `preview`, and refuses to run until the target exactly matches publication origin and `allowIndexing` is true. Neither option changes publication settings. Preview mode expects noindex even when a future approved canonical origin exists.

## Production release and evidence

Before release, complete the owner review and remaining items in `CONTENT_VERIFICATION.md` / `TESTING_CHECKLIST.md`, actual screen-reader/device checks and protected preview review. When the user confirms the real origin, set publication JSON deliberately; keep indexing false until approved. Review provider configuration and privacy wording. Analytics activation is gated separately by origin and Vercel production environment. Do not promote an artifact built as a preview and assume its generated SEO becomes production-ready; build the reviewed revision for the correct production environment, then inspect emitted and hosted metadata.

Record the actual commit, hosted CI run, reviewed preview, production deployment ID/URL, environment review, approved origin and prior known-good deployment. After approved merge/release run production smoke, verify crawler/social-image access and analytics behavior, and perform separately authorized contact inbox tests. Observe actual Vercel build/runtime errors and essential flows after release; do not claim field metrics before data exists. Keep an incident/release record free of secrets and visitor data.

## Rollback and recovery

- Roll back immediately if a required page/asset is broken, confidential data is visible, indexing/canonical targets are wrong, contact can send without its guards, or the approved primary flow fails. For contact failure, set `CONTACT_ENABLED=false` and redeploy; direct email remains the fallback.
- In Vercel, select the recorded known-good deployment using the account's rollback/redeploy controls; verify its environment and domain before switching. Repeat read-only smoke and manual essential flows. If this is the first deployment there may be no known-good deployment: keep production unpromoted until the candidate is verified.
- Revert the offending Git commit through a reviewed revert PR, rebuild and redeploy so Git and hosted state agree. Do not force-push shared history or assume a Vercel rollback reverts source, env vars, DNS, provider keys or external cache state.
- For a leaked secret, revoke/rotate it at the provider, replace scoped environment values, redeploy and review exposure/history. Never paste the compromised value into an issue. Restore known-good source/assets from Git or the owner's independent backup; local uncommitted files are not a hosted backup.
- Domain changes require reviewing DNS without deleting existing mail records, updating approved publication/contact origins and checking canonical/discovery/contact/analytics behavior again. Roll back DNS only using the recorded previous records and authorized account access.

## Maintenance and ownership

Keep the repository, Vercel project, DNS and provider accounts controlled by the owner; do not transfer ownership or invent a team member. Record account access privately through the owner's password manager, not this repository. No account transfer, key handover or mailbox delivery has occurred here. Review provider errors, actual performance, dependency advisories and link availability after releases. Update compatible dependencies through reviewed branches, rerun quality gates, inspect the installed Next docs and preview before merging. Keep real content/asset approvals alongside the editorial process.
