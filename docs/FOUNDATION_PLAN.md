# Phase 0 and Phase 1 implementation plan

Date: 19 November 2026. Scope: local foundation only; no deployment or remote creation.

## Authority and audit

Read all 16 root instruction documents in full. AGENTS.md truth rules take priority.
Initial checkout contains documentation only, no Git history, application, assets or credentials.
Local runtime: Node 24.13.0, npm 11.6.2, Windows PowerShell. Use npm lockfile and Node 24 LTS.
Registry verified Next.js 16.4.6, React 19.3.1, Tailwind 4.3.5. Use compatible stable tooling.
Next.js 16 requires separate ESLint CLI; build does not replace lint. Tailwind uses its PostCSS plugin.
Sources: https://nextjs.org/docs/app/getting-started/installation and https://tailwindcss.com/docs/installation/framework-guides/nextjs.

## Phase 0

- Audit instructions, facts, assets, tooling, Git and platform constraints.
- Record this bounded implementation plan, architecture decisions and performance budgets.
- Initialise local Git on a foundation branch. Do not push, merge or deploy.
- Gate: documentation review and platform checks; application lint/typecheck/tests/build are inapplicable until Phase 1 creates an app.

## Phase 1

1. Configure Next.js App Router, strict TypeScript, Tailwind 4, ESLint, Vitest and Playwright.
2. Add semantic dark/light tokens: ink #090909, paper #F4F2EE, silver #92929A, violet #A78BFA; darker violet for light-theme contrast.
3. Use a system sans-serif stack without remote font requests. Oversized left-aligned identity copy, spacious asymmetric composition, quiet rules and generous spacing. Original sculpture belongs to Phase 3.
4. Add reusable server-rendered shell, skip link, footer, home and not-found page. Only link implemented routes or real supplied destinations. Full navigation/theme controls remain Phase 2.
5. Validate JSON content with strict Zod schemas, unique slugs, real HTTPS destinations, safe local asset paths and verification-gated publication. Seed only confirmed identity; empty projects, ventures, Lab and resources until their planned phases.
6. Run content validation, lint, strict typecheck, unit/component tests, production build, production-browser smoke/accessibility checks and dependency audit. Document actual results and limits.

## Decisions

- Existing roadmap and detailed visual brief settle design; user explicitly requests autonomous execution, so no extra design approval round.
- Stay in the supplied checkout. No worktree is possible before Git history exists; no destructive operations.
- No mock portrait, sample project record, mock screenshot, fabricated Lab entry or guessed deployment URL.
- Contact CTA uses supplied mailto until the Phase 8 form exists; work CTA targets a truthful in-page empty state until Phase 5.
- Light tokens are implemented/tested in Phase 1; persistent theme switcher is Phase 2.
- Do not install 3D, email, analytics or MDX packages before their phases require them.
- Keep baseline preview noindex until release review. Canonical/deployment origin remains unset until verified (Phase 10).

## Budgets (release targets, not claimed measurements)

- LCP <= 2.5s, INP <= 200ms, CLS <= 0.1 at mobile p75.
- Lighthouse mobile performance >= 90 and accessibility 100 on representative release routes.
- Foundation has no remote fonts, client application components, media or third-party requests.
- Initial compressed JavaScript target <= 200 KiB; lazy desktop 3D separately <= 500 KiB compressed, no mobile WebGL download.
- First-viewport images <= 250 KiB total; reserve image dimensions. No external API required to render a page.
- Measure production field vitals after deployment; local lab results cannot establish field performance.

## Later phases

Phase 2 navigation, mobile overlay, theme persistence and brand interactions; Phase 3 full homepage/hero; Phases 4–9 content routes/integrations; Phase 10 SEO/privacy/analytics; Phase 11 complete hardening; Phase 12 approved deployment/handover.
