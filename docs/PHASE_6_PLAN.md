# Phase 6 — Lab framework, empty launch

19 November 2026. No named experiment has been confirmed. Keep the actual collection empty; never seed sample cards or generate fictional experiments, dates, progress percentages or links.

- Dedicated static `/lab` replaces its catch-all shell. `/lab/[slug]` provides a verified-entry detail template, with unknown/unpublished slugs returning 404. No demo route or fabricated entry is published to prove the template.
- Keep `src/content/lab/index.json` as `[]`. Merge it into the validated content adapter. Page copy lives separately and does not act as experimental content.
- Six agreed categories and three exact statuses are lightweight shared labels. Search, category and status filters compose with accessible empty/reset states and result announcements. Cards use text plus genuinely approved optional local images; no placeholders.
- Future entries require title/slug/summary, category/status, idea, current progress summary and verified publication flag. Optional next steps, actual update date, dated timeline, learning notes and genuine HTTPS destinations. Optional images require explicit approval, dimensions, alt/caption, correct local Lab folder and an existing file. Reject invalid statuses, duplicate slugs, invalid dates/chronology and unapproved assets.
- Server-render the listing/empty state and detail content. Isolate filter state in a small client component; keep schemas off the client. No new dependencies or APIs.
- Detail framework: breadcrumb, status text, idea, progress snapshot, optional next steps/timeline/learnings/approved visual and real links, Back to The Lab. Omit unsupported sections.
- Continue dark/light ink/paper/violet and editorial type/spacing. No 3D, graph, loader or artificial progress dashboard on the Lab route.
- Test empty production data, fixture-only populated branches, filters, publication/asset/date boundaries, detail rendering and missing-entry 404. Run lint/typecheck/unit/content/build gate, full production E2E, both-theme axe, responsive/keyboard/no-JS checks, audit and bundle budget. Inspect screenshots and record actual results.

No asset or clarification is needed for this deliberately empty launch. A first real experiment is a future content addition with source evidence and preview review.
