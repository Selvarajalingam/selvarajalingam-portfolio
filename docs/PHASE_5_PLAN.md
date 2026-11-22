# Phase 5 — Work and project pages

19 November 2026. Continue the supplied roadmap locally. User said “continue” after being asked about missing approved architecture notes. This authorizes proceeding with known facts; it does not verify any inferred architecture.

## Content boundary

Ten real records in `src/content/projects/index.json`. Four featured in the supplied order, six secondary. Use only supplied names, roles, features, stack subsets and exact demo destinations. No invented dates, repositories, measurements, datasets, engineering challenges, lessons, outcomes or screenshots. Sentiment Analysis, Phishing Detection and Diwali Sales Analysis have no verified technology tags; leave those empty. Unknown dates remain absent and “recently updated” sort stays unavailable until dates exist.

Four flagship Markdown narratives contain the supplied purpose, role, features and technology/tooling facts. Markdown is server-parsed into an allowlisted text/list structure; raw HTML, JSX, scripts, arbitrary embeds and unapproved links are rejected rather than executed. Omit unknown case-study sections instead of manufacturing a story. Compact secondary pages use their limited descriptions without padding.

Architecture diagrams and screenshots are separately approval-gated; none are initially published. Provide validated adapters/components for real approved assets and graphs, with a text equivalent. Do not derive component connections from a technology list. Do not claim live availability from a supplied URL alone; use “Visit project” links and record HEAD-only availability checks separately.

## Design

Continue the existing ink/paper/violet palette and system sans. Large Work opening, compact filter controls, asymmetric featured cards and quiet secondary archive. Project openings use oversized real titles and factual summaries; no fake terminals or screenshot placeholders. Breadcrumb, in-page section index, related projects, previous/next and Back to Work are real links. No comparison feature.

## Engineering and checks

- Dedicated static `/work` and `/work/[slug]`; remove Work catch-all shell.
- One canonical project source feeds home cards, filters, detail metadata and navigation.
- Category + technology + text filters compose, featured-first stable default, alphabetical/category/technology sorting; verified-date sorting only when available. Keyboard controls, live results, reset and honest empty state; initial HTML contains all ten records without JavaScript.
- Server-only Markdown loader, schema and asset checks; keep validation/parser dependencies out of filter client bundle. Reject unknown slugs/path traversal, duplicate tags/slugs, unapproved graph/image records and invalid graph endpoints.
- Run full lint/typecheck/unit/content/build gate, production E2E (all ten routes, filters, related/adjacent links, 404, both-theme axe, no-JS, responsive), dependency audit and emitted-asset budgets. Inspect desktop/mobile screenshots.

Detailed missing case-study sections, architecture approval and genuine visuals remain explicit content/release follow-ups; no deployment or merge in this phase.
