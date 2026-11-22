# Project Requirements

## Audiences
- Recruiters: story, skills, experience, projects, resume, GitHub.
- Clients: services, production work, contribution, contact.
- Collaborators: ventures, experiments, interests.
- Students/educators: teaching, workshops, mentoring, resources.
- Technical visitors: stack, architecture, demos, repositories.

## Goals
1. Communicate the three-role identity.
2. Present four flagship case studies and six secondary projects.
3. Showcase four Gencanyon-associated ventures accurately.
4. Explain services, experience, education and skills.
5. Provide working contact workflow.
6. Integrate GitHub and AWS/cloud content honestly.
7. Provide Lab framework with truthful empty state.
8. Be responsive, accessible, fast, searchable and maintainable.

## Non-goals
No admin dashboard, no database for contact submissions, no public pricing, no fake testimonials/metrics/screenshots/experiments, no confidential data, no audio, no project comparison, no always-on VPS.

## Functional requirements
- Fixed desktop nav, accessible mobile overlay, dark/light theme, resume action, Let's Connect CTA.
- Optional skippable first-visit intro; replay control; reduced-motion support.
- Homepage follows order in `SITEMAP.md`.
- Work: ten projects, hybrid category/technology filters, featured-first default, sorting, detail pages, related projects and architecture diagrams.
- Lab: categories/status filters/detail template/progress timeline support; launch empty.
- Ventures: listing and four pages; authentic brand assets; Chennai Buyers website-coming-soon state.
- Services: three accordion groups, no pricing.
- About/Experience: story, education, skills, timeline; impact metrics only after verification.
- Resume preview and download, temporary label if final resume missing.
- Contact: Resend server route, owner email, visitor acknowledgement, validation/spam controls, no DB.
- GitHub data cached with fallback; YouTube resources manually curated, optional metadata retrieval.
- Privacy page and Vercel Analytics; GA4 optional.

## Non-functional
WCAG 2.2 AA target; mobile-first; adaptive performance; strict TypeScript; reusable architecture; SEO; secure secrets; graceful external API failure; content/assets replaceable without component edits; complete handover.

## Acceptance
- All routes work.
- Ten project pages accurate; filters/sorting work.
- Lab empty state honest.
- Four venture pages accurate.
- Contact never falsely reports sent if provider fails or is unconfigured.
- Themes persist.
- Mobile menu, keyboard and reduced motion work.
- No fabricated content.
- Lint, typecheck, tests and production build pass.
- Accessibility, SEO, security and performance checks documented.
- Deployment and content guides complete.
