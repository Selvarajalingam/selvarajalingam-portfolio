# Selvarajalingam Portfolio — Codex Pack

A complete product, design, engineering, content and deployment brief for the `selva.` portfolio.

## Application status

Phase 12 is in progress: GitHub Actions quality workflow, read-only deployment smoke CLI and [owner handover](docs/OWNER_HANDOVER.md) are prepared locally. GitHub/Vercel account/project access is still required for the first preview. The [release record](docs/RELEASE_RECORD.md) tracks actual hosted evidence; no production release is claimed.

Phases 0–11 are implemented and tested locally within supplied facts, including content pages, resilient GitHub metadata, contact flow, origin-safe SEO/analytics and responsive/accessibility/security hardening. The user chose to keep the production origin unconfigured: noindex remains active and analytics is inactive. Lab/cloud resources remain empty. Live email, genuine project/venture assets and fuller verified stories remain release follow-ups. See [local development](docs/LOCAL_DEVELOPMENT.md), [hardening evidence](docs/PHASE_11_AUDIT.md) and [phase checkpoints](docs/PHASE_CHECKPOINTS.md). Phase 12 is deployment/handover; nothing has been deployed.

Use Node 24 LTS, then `npm ci` and `npm run dev`. Run `npm run check`, `npm run seo:validate`, `npm run artifacts:validate`, `npm run perf:bundles`, `npm run links:all` and `npm audit --audit-level=low` for artifact/security checks. Run `npm run test:e2e` and `npm run test:audit` sequentially for browser coverage. Publication/analytics activation is documented in `DEPLOYMENT_GUIDE.md`.

## Start
1. Create public GitHub repository `Selvarajalingam/selvarajalingam-portfolio`.
2. Copy this pack into its root.
3. Open the repo in OpenAI Codex.
4. Ask Codex to read `AGENTS.md` and `MASTER_PROMPT.md` before implementation.
5. Follow `IMPLEMENTATION_ROADMAP.md` and do not skip verification gates.

## Documents
- `AGENTS.md` — persistent Codex rules
- `MASTER_PROMPT.md` — complete build brief
- `PROJECT_REQUIREMENTS.md` — product scope and acceptance criteria
- `DESIGN_SYSTEM.md` — visual tokens and components
- `CREATIVE_DIRECTION.md` — page-by-page visual blueprint
- `SITEMAP.md` — routes and navigation
- `CONTENT_INVENTORY.md` — known facts and content inventory
- `TECHNICAL_ARCHITECTURE.md` — stack and integrations
- `IMPLEMENTATION_ROADMAP.md` — phased execution
- `TESTING_CHECKLIST.md` — quality and release checks
- `DEPLOYMENT_GUIDE.md` — GitHub, Vercel, Resend and recovery
- `CONTENT_GUIDE.md` — how to update content
- `ASSET_MANIFEST.md` — asset folders and replacement rules
- `CONTENT_VERIFICATION.md` — internal factual verification gate

## Launch principle
Do not publish unverified claims or fabricated content. Missing portraits, screenshots, resume, social URLs, testimonials, Lab experiments and credentials must be handled honestly.
