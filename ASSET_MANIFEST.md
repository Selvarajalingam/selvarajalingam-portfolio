# Asset Manifest

## Suggested folders
```text
public/assets/
  brand/{wordmark,symbols,og}/
  portrait/
  hero/{sculpture,fallback}/
  projects/{research-hub,alumni-portal,hearth,waterbuddy,career-crafter,full-stack-todo,duo-chat,sentiment-analysis,phishing-detection,diwali-sales-analysis}/
  ventures/{cloudapex,bigintellects,canyonink,chennai-buyers}/
  lab/ experience/ resources/ resume/ icons/
```

## Rules
- Prefer user-supplied originals.
- Generated art only for supporting visuals or temporary placeholders.
- No unlicensed stock or replacement logos when authentic logos exist.
- Temporary generated portrait must be fictional and never represented as Selvarajalingam.
- Product mockups are illustrative, not actual screenshots.
- Never include confidential university, student, alumni, staff, customer, payment or credential data.
- Optimise images, specify dimensions and alt text, keep source/export organised.

## Manifest fields
Path; purpose/page; source/owner; status (`approved`, `temporary`, `needs replacement`); dimensions/aspect ratio; alt text; replacement instructions; licensing/permission notes.

## Initial status
- `selva.` wordmark: create original vector/typographic treatment.
- Brand symbol: create.
- Hero sculpture: original 3D plus SVG/CSS fallback.
- Portrait: missing; temporary fictional visual only if needed.
- Project screenshots: missing/partial; request approved genuine images.
- Architecture diagrams: create only from verified architecture.
- Venture logos: user says existing logos are available; await files.
- Resume: temporary “Sample Resume — Updating” only.
- OG image: create black/violet branded composition.
- Social icons: licensed icon set or inline SVG.

Decorative visuals use empty alt text. Informative screenshots describe the actual screen. Diagrams need a text equivalent.

## Phase 3 implemented artwork

| Path | Purpose/source | Status | Dimensions/alt | Replacement/licensing |
| --- | --- | --- | --- | --- |
| `public/assets/hero/fallback/sculpture.svg` | Original decorative silver/violet loop, created in this repository | Temporary pending visual preview review | 560×560 viewBox; empty alt | Edit the SVG at the same path; keep it decorative and lightweight. No external asset or stock model. |
| `src/components/hero/sculpture-scene.ts` | Original procedural curve geometry with local studio lighting | Temporary pending visual preview review | Responsive square canvas, capped DPR 1.5; aria-hidden | Update geometry/palette in the scene; preserve fallback and device gate. Uses MIT-licensed Three.js; see `docs/THREE_LICENSE.md`. |

No portrait, genuine project screenshot, venture logo or resume PDF has been supplied or generated as a substitute. The 3D/vector form is abstract supporting artwork, not a product screenshot or identity portrait.

## Phase 7 venture assets

No authentic logo files are present. The four pages use plain text venture names within the portfolio theme, without invented brand colours or logo substitutes. Supply approved originals under `public/assets/ventures/{cloudapex,bigintellects,canyonink,chennai-buyers}/`, confirm source/permission, then configure the optional `logo` metadata in the venture index. Preserve official colours and review light/dark readability; an approved background or theme variant may need a deliberate follow-up once the real asset is known. The build rejects missing files and metadata for another venture's folder.

## Phase 10 social and icon artwork

| Path | Purpose/source | Status | Dimensions/description | Replacement |
| --- | --- | --- | --- | --- |
| `public/assets/brand/og/portfolio.png` | Original black/silver/violet typographic composition using verified profile copy and the repository's abstract sculpture SVG; rendered with Next ImageResponse | Ready for preview review; no production origin configured | Actual 1200×630 PNG, 121,418 bytes. Wordmark, full name, three-role identity and tagline. Decorative abstract artwork, not a portrait/product screenshot. | Edit `scripts/generate-og.tsx` / profile source and run `npm run assets:og`; inspect output and run SEO validation. No external stock or new portrait asset. |
| `src/app/icon.svg` | Original compact s-and-dot site icon | Ready for preview review | 64×64 SVG, ink/paper/violet | Edit vector source; do not replace venture logos with this mark. |
