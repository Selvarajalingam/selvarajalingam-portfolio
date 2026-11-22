# AGENTS.md — Persistent Repository Rules

## Product
Build a premium, distinctive portfolio for **Selvarajalingam**. Visual wordmark: `selva.`. Never write “Selvarajalingam (Selva)”. Use the full name in SEO and professional copy. Identity: **Technology Educator · Software Developer · Product Builder**. Tagline: **teach. build. create. innovate.** Hero: “I teach technology, build software, and turn ideas into digital products.” Primary CTA: “Let's connect”; secondary: “Explore my work”.

## Truth rules — mandatory
- Never invent employment, education, credentials, testimonials, metrics, customers, revenue, project outcomes, product features, technology usage or ownership.
- AWS Certified Developer – Associate is currently being pursued, not earned.
- Do not call the user founder, owner or director. Confirmed Gencanyon role: **Product & Technology Lead | Business & Product Development Lead**.
- User-reported impact figures (200+ students, 50+ workshops/sessions, 20+ events, 100+ student projects) require final verification before production.
- Do not fabricate screenshots, repositories, URLs, video links or Lab experiments.
- Generated mockups are illustrative, not genuine screenshots. A generated portrait is fictional and temporary, never the user.
- Do not expose university, student, alumni, staff, payment or credential data.
- Put uncertain facts in `CONTENT_VERIFICATION.md`; omit from production until verified.

## Execution
- Work autonomously through `IMPLEMENTATION_ROADMAP.md`.
- Ask only for genuinely blocking assets, credentials, approvals or factual clarifications.
- Keep the app working after each phase.
- Run relevant lint, typecheck, tests and production build at every phase gate. Never claim a check passed unless run.
- Use compatible stable dependencies at implementation time. Avoid unnecessary libraries.

## Design
- Follow `DESIGN_SYSTEM.md` and `CREATIVE_DIRECTION.md`.
- Premium editorial minimalism, dark default and fully designed light theme.
- Restrained violet/silver accents, expressive sans-serif typography, generous whitespace.
- 3D sculpture on capable desktop only; CSS/SVG/static fallback on mobile or low-power devices.
- Motion must be purposeful, skippable and reduced-motion aware. No forced scroll snapping or audio.
- Do not overuse gradients, glow, glassmorphism, particles or cursor effects.

## Engineering
- Next.js App Router, TypeScript strict mode, Tailwind CSS.
- Reusable components; content separate from presentation.
- Prefer static generation for content pages.
- Secrets only in environment variables; never commit credentials.
- Contact form server-side with validation, spam protection and rate limiting. No DB storage.
- Resend API key must never reach browser code.
- Vercel Web Analytics initially; GA4 optional and disabled until configured with suitable consent handling.
- GitHub and YouTube integrations need caching, timeouts and curated fallback. External APIs must not break page rendering.
- No admin dashboard in initial release; use GitHub JSON/MDX and keep architecture CMS-ready.

## Quality
Target WCAG 2.2 AA. Include strict TypeScript, lint, unit/component/integration tests, Playwright E2E, accessibility checks, performance review, SEO validation, security/dependency checks and production build verification.

## Content workflow
Draft → Vercel preview → review → approve/merge → production. Keep `main` production-ready. Document rollback and recovery.

## Reporting
At each checkpoint report completed work, files/routes, commands actually run/results, known issues, required user inputs and next phase.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
