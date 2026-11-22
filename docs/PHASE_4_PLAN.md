# Phase 4 — About, skills and experience

19 November 2026. Continue autonomously within the existing roadmap; no remote changes or publication.

## Content decisions

- Replace `/about` and `/experience` shells with dedicated static pages. Remove their generic route parameters to avoid competing route definitions.
- Use the supplied professional identity, philosophy, self-directed learning, teaching/software practice and personal interests. No fictional portrait.
- Education: Rathinam Technical Campus and Artificial Intelligence and Data Science field only. Formal degree title is unresolved; omit rather than infer a B.E./B.Tech. Course completion can be described as coursework, without a certificate/credential ID or guessed course title.
- AWS Certified Developer – Associate remains explicitly Currently pursuing. No earned badge or verification URL.
- Employment wording/start date, placement narrative and impact metrics remain pending in CONTENT_VERIFICATION.md. Do not invent a dated employer history. Present an undated learning/teaching/building journey, with the separately confirmed Gencanyon role and supplied contribution areas.
- Build a canonical seven-category skill collection from supplied learning/project stacks. Applied means a supplied practice/project context, not a proficiency rating; Java/Spring Boot remain Strengthening, AWS Learning. No percentages, seniority or invented framework usage.
- Resume preview/view/download reads the existing configuration. No file is supplied, so render a truthful pending state. The component supports an approved local PDF or an explicitly labelled sample later; do not generate a substitute.

## Design and implementation

Continue ink/paper/violet, system sans, left-aligned large editorial headings and generous whitespace. About opens with identity/story rather than a missing-photo block; a compact section index supports long-page navigation. Learning rows, a text-led timeline and a compact Beyond the Code close the personal story. Experience separates practice journey from the confirmed company contribution. Keep metrics and decorations out.

Reuse shared editorial sections; keep content in validated JSON and static pages as server components. Isolate searchable/filterable skill groups in a small client component, preserve all skills in server HTML and make the empty/reset state accessible. Filters compose status plus text; announce result changes politely and preserve keyboard focus. No dependencies or APIs required.

## Verification

Test skill filtering/composition/immutability, category uniqueness, optional/invalid dates, credential status, resume absence/sample labelling, factual boundaries and actual page rendering. Run lint/typecheck/tests/content validation/build, full production E2E, axe on both pages/themes, keyboard/search/filter/reset/no-JavaScript paths, responsive sizes, links/metadata and bundle review/security audit. Capture and inspect representative screenshots.

Later: detailed projects in Phase 5; final content approvals/assets and release-wide manual/cross-browser/field performance checks remain later gates.
