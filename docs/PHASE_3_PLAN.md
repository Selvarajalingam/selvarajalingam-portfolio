# Phase 3 — homepage and adaptive hero

19 November 2026. Follow the supplied creative direction, source facts and autonomous roadmap. No deployment.

## Design

Retain ink #090909, paper #F4F2EE, violet #A78BFA and the darker light-mode accent. System sans typography remains self-host independent. Split desktop hero: editorial statement left, original silver/violet loop right, quiet identity and CTA baseline. Mobile prioritises text and a compact vector form. Spend visual emphasis on this sculpture; no fake product UI or portrait.

Homepage order: hero; introduction; featured work; services; journey; impact/experience; skills; AWS/cloud; ventures; Lab; connect. Use asymmetric text-led project cards and varied editorial sections instead of repeated identical cards. Native disclosure elements keep seven skill categories keyboard usable.

## Content boundary

Use only confirmed high-level project descriptions from CONTENT_INVENTORY.md, in the supplied flagship order. Do not imply screenshots, architecture approval, outcomes or detailed case studies exist. Confirmed service offerings and Gencanyon role can appear. Do not publish pending employment wording/start date, formal degree, impact numbers or course credentials. AWS remains currently pursuing. Resources and experiments remain empty. Narrative JSON is validated separately; it does not upgrade project case-study verification.

## Engineering

- Server-render all sections and original local SVG fallback. No APIs required to render.
- Add only Three.js plus matching types. Use a procedural local geometry and procedural studio lighting; no models/textures/CDN fetches.
- Dynamic import after critical content, idle time and hero intersection. Require >=1024px, fine pointer/hover, no reduced motion, no save-data/slow connection, and adequate reported CPU/memory. Unknown hardware values do not alone prevent enhancement.
- Render on demand for sizing/theme updates. No continuous rendering, pointer effects or postprocessing. Cap device pixel ratio at 1.5. Dispose GPU resources and listeners on eligibility changes, context loss, explicit static-art selection and unmount. Keep SVG until successful first render; catch unsupported WebGL/import errors.
- Test eligibility, section order/content boundary, fallback/no-JS/mobile/reduced-motion/low-power behavior, WebGL success/failure, theme changes and lifecycle. Run the whole prior gate, production browser suite, axe, audit and inspect screenshots.

## Limits and next phase

Static JSON summaries do not replace detailed projects (Phase 5) or venture pages/assets (Phase 7). Full About/skills/experience routes are Phase 4. No fake resource URL, Lab record, repository, logo or screenshot. Performance measurements are local lab evidence, not field Core Web Vitals. Record actual bundles/results at checkpoint.
